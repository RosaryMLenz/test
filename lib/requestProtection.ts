import crypto from "crypto";
import { Prisma } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";

const CLIENT_IP_HEADERS = [
    "cf-connecting-ip",
    "x-forwarded-for",
    "x-real-ip",
    "fly-client-ip",
    "x-client-ip",
];

const MAX_FORM_AGE_MS = 1000 * 60 * 60 * 12;

interface HumanSubmissionInput {
    website?: string | null;
    formStartedAt?: string | number | null;
}

interface HumanSubmissionOptions {
    minFillMs: number;
}

interface RateLimitRule {
    scope: string;
    bucket: string;
    identifier: string;
    limit: number;
    windowMs: number;
    blockMs?: number;
}

interface RateLimitResult {
    allowed: boolean;
    retryAfterSeconds: number;
}

function buildThrottleKey(scope: string, bucket: string, identifier: string) {
    const hashedIdentifier = crypto
        .createHash("sha256")
        .update(identifier)
        .digest("hex");

    return `${scope}:${bucket}:${hashedIdentifier}`;
}

function retryAfterSeconds(target: Date, now: Date) {
    return Math.max(1, Math.ceil((target.getTime() - now.getTime()) / 1000));
}

function isSerializableTransactionError(error: unknown) {
    return (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2034"
    );
}

async function runSerializable<T>(task: () => Promise<T>, retries = 3): Promise<T> {
    let attempt = 0;

    while (true) {
        try {
            return await task();
        } catch (error) {
            attempt += 1;

            if (attempt >= retries || !isSerializableTransactionError(error)) {
                throw error;
            }
        }
    }
}

export function getClientIp(request: Request) {
    for (const headerName of CLIENT_IP_HEADERS) {
        const rawValue = request.headers.get(headerName);
        if (!rawValue) {
            continue;
        }

        if (headerName === "x-forwarded-for") {
            const forwardedIp = rawValue.split(",")[0]?.trim();
            if (forwardedIp) {
                return forwardedIp;
            }
        }

        const value = rawValue.trim();
        if (value) {
            return value;
        }
    }

    return "unknown";
}

export function normalizeEmailIdentifier(email: string) {
    return email.trim().toLowerCase();
}

export function validateHumanSubmission(
    input: HumanSubmissionInput,
    options: HumanSubmissionOptions,
) {
    if ((input.website ?? "").trim().length > 0) {
        return {
            ok: false,
            status: 400,
            message: "We could not verify your submission. Please try again.",
        };
    }

    if (input.formStartedAt === undefined || input.formStartedAt === null) {
        return {
            ok: false,
            status: 400,
            message: "We could not verify your submission. Please refresh and try again.",
        };
    }

    const startedAt = Number(input.formStartedAt);
    if (!Number.isFinite(startedAt)) {
        return {
            ok: false,
            status: 400,
            message: "We could not verify your submission. Please refresh and try again.",
        };
    }

    const elapsedMs = Date.now() - startedAt;
    if (elapsedMs < options.minFillMs) {
        return {
            ok: false,
            status: 400,
            message: "Please wait a moment and try again.",
        };
    }

    if (elapsedMs > MAX_FORM_AGE_MS) {
        return {
            ok: false,
            status: 400,
            message: "This form expired. Please refresh and try again.",
        };
    }

    return { ok: true as const };
}

export async function enforceRateLimits(rules: RateLimitRule[]) {
    for (const rule of rules) {
        const result = await consumeRateLimit(rule);
        if (!result.allowed) {
            return result;
        }
    }

    return null;
}

async function consumeRateLimit(rule: RateLimitRule): Promise<RateLimitResult> {
    const now = new Date();
    const blockMs = rule.blockMs ?? rule.windowMs;
    const key = buildThrottleKey(rule.scope, rule.bucket, rule.identifier);

    return runSerializable(() =>
        prisma.$transaction(
            async (tx) => {
                const current = await tx.requestThrottle.findUnique({
                    where: { key },
                });

                const shouldResetWindow =
                    !current ||
                    current.windowStart.getTime() <= now.getTime() - rule.windowMs ||
                    (current.blockedUntil !== null && current.blockedUntil <= now);

                if (shouldResetWindow) {
                    await tx.requestThrottle.upsert({
                        where: { key },
                        create: {
                            key,
                            count: 1,
                            windowStart: now,
                            blockedUntil: null,
                        },
                        update: {
                            count: 1,
                            windowStart: now,
                            blockedUntil: null,
                        },
                    });

                    return {
                        allowed: true,
                        retryAfterSeconds: 0,
                    };
                }

                if (current.blockedUntil && current.blockedUntil > now) {
                    return {
                        allowed: false,
                        retryAfterSeconds: retryAfterSeconds(current.blockedUntil, now),
                    };
                }

                const nextCount = current.count + 1;
                if (nextCount > rule.limit) {
                    const blockedUntil = new Date(now.getTime() + blockMs);

                    await tx.requestThrottle.update({
                        where: { key },
                        data: {
                            count: nextCount,
                            blockedUntil,
                        },
                    });

                    return {
                        allowed: false,
                        retryAfterSeconds: retryAfterSeconds(blockedUntil, now),
                    };
                }

                await tx.requestThrottle.update({
                    where: { key },
                    data: {
                        count: nextCount,
                    },
                });

                return {
                    allowed: true,
                    retryAfterSeconds: 0,
                };
            },
            {
                isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
            },
        ),
    );
}

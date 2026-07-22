import Link from "next/link";

interface BrandLogoProps {
    inverted?: boolean;
    className?: string;
}

export default function BrandLogo({ inverted = false, className = "" }: BrandLogoProps) {
    return (
        <Link
            href="/"
            aria-label="Rainforest21 Automotive home"
            className={`group inline-flex shrink-0 items-center ${inverted ? "text-[#f7f4ec]" : "text-[#17643f]"} ${className}`}
        >
            <span
                className="block h-14 w-[7.15rem] bg-current transition-opacity duration-200 group-hover:opacity-80 sm:h-16 sm:w-[8.2rem]"
                style={{
                    WebkitMaskImage: "url('/redesign/rainforest21-logo-transparent.png')",
                    maskImage: "url('/redesign/rainforest21-logo-transparent.png')",
                    WebkitMaskPosition: "center",
                    maskPosition: "center",
                    WebkitMaskRepeat: "no-repeat",
                    maskRepeat: "no-repeat",
                    WebkitMaskSize: "contain",
                    maskSize: "contain",
                }}
                aria-hidden="true"
            />
        </Link>
    );
}

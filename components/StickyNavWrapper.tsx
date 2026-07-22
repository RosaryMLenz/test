import NavBar from "@/components/NavBar";

export default function StickyNavWrapper() {
    return (
        <div className="fixed inset-x-0 top-0 z-50">
            <NavBar />
        </div>
    );
}

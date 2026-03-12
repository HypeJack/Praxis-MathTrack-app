import { TopNavBar } from "./TopNavBar";

interface AppShellProps {
    children: React.ReactNode;
    title?: string;
    xp?: number;
    showNav?: boolean;
}

export function AppShell({ children, title = "Home", xp = 0, showNav = true }: AppShellProps) {
    return (
        <div className="w-full max-w-[480px] min-h-screen flex flex-col relative bg-white shadow-xl">
            {showNav && <TopNavBar title={title} xp={xp} />}
            <div className="flex-1 flex flex-col">
                {children}
            </div>
        </div>
    );
}

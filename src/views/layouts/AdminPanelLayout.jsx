import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    LayoutTemplate,
    Users,
    Package,
    FolderTree,
    MessageCircleQuestion,
    FileText,
    RotateCcw,
    Activity,
    LogOut,
    Command,
    ChevronsUpDown,
    Check,
    UserCircle,
    Settings,
    Clock
} from "lucide-react";
import {
    SidebarProvider,
    SidebarTrigger,
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarSeparator
} from "@/components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "../../hooks/useAuth";

export default function AdminPanelLayout({ children, role = "admin" }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user, navigate]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const menuItems = {
        admin: [
            {
                title: "Hero section",
                icon: LayoutTemplate,
                url: "/admin/hero-section",
            },
            {
                title: "Faq section",
                icon: MessageCircleQuestion,
                url: "/admin/faq-section",
            },
        ],
        borrower: [
            {
                title: "Dashboard",
                icon: LayoutDashboard,
                url: "/dashboard",
            },
            {
                title: "Items",
                icon: Package,
                url: "/items",
            },
            {
                title: "Borrows",
                icon: FileText,
                url: "/borrow-requests",
            },
            {
                title: "Returns",
                icon: RotateCcw,
                url: "/returns",
            },
        ],
        officer: [
            {
                title: "Dashboard",
                icon: LayoutDashboard,
                url: "/officer/dashboard",
            },
            {
                title: "Borrows",
                icon: FileText,
                url: "/officer/borrow-requests",
            },
            {
                title: "Returns",
                icon: RotateCcw,
                url: "/officer/returns",
            },
        ],
    };

    const exit = () => {
        logout();
        setTimeout(() => {
            navigate('/');
        }, 1000);
    };

    return (
        <SidebarProvider>
            <Sidebar className="border-r border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900" collapsible="icon">
                <SidebarHeader className="p-3">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="w-full text-left outline-none cursor-pointer bg-transparent border-none p-0">
                                    <SidebarMenuButton
                                        asChild
                                        size="lg"
                                        className="data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-zinc-800/80 hover:bg-slate-100 dark:hover:bg-zinc-800/50 transition-all rounded-xl w-full h-14 px-3"
                                    >
                                        <div className="flex w-full items-center gap-3">
                                            <div className="flex aspect-square size-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
                                                <Command className="size-4" />
                                            </div>
                                            <div className="flex flex-1 flex-col text-left leading-tight">
                                                <span className="truncate font-semibold text-slate-900 dark:text-slate-100">Villa Arira</span>
                                                <span className="truncate text-xs capitalize text-slate-500 dark:text-zinc-400">{role} Panel</span>
                                            </div>
                                            <ChevronsUpDown className="ml-auto size-4 text-slate-400 shrink-0" />
                                        </div>
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl shadow-lg border-slate-200 dark:border-zinc-800 p-1"
                                    align="start"
                                    side="bottom"
                                    sideOffset={4}
                                >
                                    <DropdownMenuLabel className="text-xs font-semibold text-slate-400 dark:text-zinc-500 px-2 py-1.5">
                                        Workspace Account
                                    </DropdownMenuLabel>
                                    <DropdownMenuItem className="flex items-center gap-2 p-2 rounded-lg font-medium cursor-pointer">
                                        <div className="flex size-6 items-center justify-center rounded-md bg-indigo-600 text-white text-xs">V</div>
                                        <span>Villa Arira Main</span>
                                        <Check className="ml-auto size-4 text-indigo-600" />
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                <SidebarSeparator className="mx-3 bg-slate-100 dark:bg-zinc-800/60" />

                <SidebarContent className="px-2 py-3">
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu className="space-y-1">
                                {menuItems[role]?.map((item) => {
                                    const isActive = location.pathname === item.url;

                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton
                                                tooltip={item.title}
                                                asChild
                                                className={`h-11 px-3 rounded-xl transition-all duration-200 ${isActive
                                                    ? "bg-indigo-50 text-indigo-600 font-semibold dark:bg-indigo-500/10 dark:text-indigo-400"
                                                    : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/60 hover:text-slate-900 dark:hover:text-slate-200"
                                                    }`}
                                            >
                                                <Link to={item.url} className="flex items-center gap-3">
                                                    <item.icon className={`size-4 shrink-0 ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-zinc-500"}`} />
                                                    <span className="text-sm tracking-tight">{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter className="p-3 border-t border-slate-100 dark:border-zinc-800/60">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="w-full text-left outline-none cursor-pointer bg-transparent border-none p-0">
                                    <SidebarMenuButton
                                        asChild
                                        size="lg"
                                        className="h-14 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800/50 transition-all data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-zinc-800/80 w-full"
                                        tooltip="Account Profile"
                                    >
                                        <div className="flex w-full items-center gap-3">
                                            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 dark:bg-zinc-800 text-indigo-600 dark:text-slate-200 font-bold text-sm">
                                                AD
                                            </div>
                                            <div className="flex flex-1 flex-col text-left leading-tight">
                                                <span className="truncate font-semibold text-slate-800 dark:text-slate-100 text-sm">Adam Malik</span>
                                                <span className="truncate text-xs text-slate-500 dark:text-zinc-400 capitalize">Role: {role}</span>
                                            </div>
                                            <ChevronsUpDown className="ml-auto size-4 text-slate-400 shrink-0" />
                                        </div>
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl shadow-lg border-slate-200 dark:border-zinc-800 p-1 mb-1"
                                    align="end"
                                    side="top"
                                    sideOffset={4}
                                >
                                    <div className="p-2 font-normal">
                                        <div className="flex items-center gap-3 px-1 py-1.5 text-left text-sm">
                                            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 dark:bg-zinc-800 text-indigo-600 dark:text-slate-200 font-bold text-xs">
                                                AD
                                            </div>
                                            <div className="flex flex-1 flex-col text-left leading-tight">
                                                <span className="truncate font-semibold text-slate-800 dark:text-slate-100">Adam Malik</span>
                                                <span className="truncate text-xs text-slate-500 dark:text-zinc-400">admin@villaarira.com</span>
                                            </div>
                                        </div>
                                    </div>
                                    <DropdownMenuSeparator className="bg-slate-100 dark:bg-zinc-800" />
                                    <DropdownMenuItem className="flex items-center gap-2 p-2 rounded-lg cursor-pointer text-slate-700 dark:text-slate-200 focus:bg-slate-100 dark:focus:bg-zinc-800">
                                        <UserCircle className="size-4" />
                                        <span>View Profile</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="flex items-center gap-2 p-2 rounded-lg cursor-pointer text-slate-700 dark:text-slate-200 focus:bg-slate-100 dark:focus:bg-zinc-800">
                                        <Settings className="size-4" />
                                        <span>Account Settings</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-slate-100 dark:bg-zinc-800" />
                                    <DropdownMenuItem
                                        onClick={() => exit()}
                                        className="flex items-center gap-2 p-2 rounded-lg cursor-pointer text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/50 font-medium"
                                    >
                                        <LogOut className="size-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>

            <main className="w-full min-h-screen bg-slate-50/50 dark:bg-zinc-950 flex flex-col">
                <header className="flex items-center justify-between h-16 px-6 bg-white/80 backdrop-blur-md dark:bg-zinc-900/80 border-b border-slate-200/80 dark:border-zinc-800 shrink-0 sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <SidebarTrigger className="text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 p-2 rounded-lg transition-colors" />
                        <span className="text-sm font-medium text-slate-300 dark:text-zinc-700">/</span>
                        <h1 className="font-semibold text-slate-800 dark:text-slate-100 text-sm tracking-tight">Admin Dashboard</h1>
                    </div>

                    <div className="flex items-center rounded-full bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-sm pr-4 pl-1.5 py-1.5 gap-2.5">
                        <div className="flex items-center justify-center size-7 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                            <Clock className="size-3.5" />
                        </div>
                        <span className="text-sm font-semibold tracking-wider font-mono text-slate-700 dark:text-slate-200 tabular-nums">
                            {currentTime.toLocaleTimeString('id-ID', {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                            }).replace(/\./g, ':')}
                        </span>
                    </div>
                </header>

                <div className="p-6 md:p-8 flex-1 flex flex-col">
                    <div className="max-w-7xl w-full mx-auto flex-1 flex flex-col">
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-6 md:p-8 shadow-sm flex-1 transition-all">
                            {children}
                        </div>
                    </div>
                </div>
            </main>
        </SidebarProvider>
    );
}
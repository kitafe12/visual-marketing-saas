'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from "@clerk/nextjs";
import { LayoutDashboard, Image as ImageIcon, Settings, Users, Split } from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarItems = [
    { icon: LayoutDashboard, label: 'Tableau de Bord', href: '/dashboard' },
    { icon: ImageIcon, label: 'Mes Analyses', href: '/dashboard/analyses' },
    { icon: Split, label: 'A/B Test', href: '/dashboard/ab-testing' },
    { icon: Users, label: 'Équipe', href: '/dashboard/team' },
    { icon: Settings, label: 'Paramètres', href: '/dashboard/settings' },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 hidden md:flex flex-col">
                <Link href="/" className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                        V
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                        VisualAI
                    </span>
                </Link>

                <nav className="flex-1 p-4 space-y-2">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                pathname === item.href
                                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                        <UserButton afterSignOutUrl="/" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                Mon Compte
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                Gérer le profil
                            </p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4">
                    <Link href="/" className="font-bold text-lg">VisualAI</Link>
                    <UserButton afterSignOutUrl="/" />
                </header>

                <div className="flex-1 overflow-auto p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

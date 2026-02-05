import React from "react";
import { Outlet } from "react-router-dom";
import SettingNavbar from "../pageComponent/settingNavbar";

export default function SettingsLayout() {
    return (
        <div className="bg-gray-50/50 min-h-screen">
            <SettingNavbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Outlet />
            </main>
        </div>
    );
}
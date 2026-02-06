import React from "react";
import MyAccount from "./myAccount";

export default function Settings() {
    return (
        <div className="max-w-6xl mx-auto">
            {/* Content Area - Focus on Account using Glassmorphism from MyAccount */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <MyAccount />
            </div>
        </div>
    );
}

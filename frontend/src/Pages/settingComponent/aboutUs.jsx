import React from "react";
import { Code, Layout, Bug, ShieldCheck, Heart } from "lucide-react";

export default function AboutUs() {
    const teamMembers = [
        {
            name: "พัชรอัศวื เมืองดีสกุล",
            role: "Backend-Dev",
            icon: <Code size={32} strokeWidth={1.5} />,
            color: "from-blue-600 to-indigo-700",
            textColor: "text-blue-600"
        },
        {
            name: "พิรชัช ไชยพล",
            role: "Frontend-Dev",
            icon: <Layout size={32} strokeWidth={1.5} />,
            color: "from-pink-600 to-purple-700",
            textColor: "text-pink-600"
        },
        {
            name: "ชยพล สมบูรณ์สุข",
            role: "Frontend-minion",
            icon: <Heart size={32} strokeWidth={1.5} />,
            color: "from-yellow-500 to-orange-600",
            textColor: "text-yellow-600"
        },
        {
            name: "จิรวัฒน์ ภู่นิ่ม",
            role: "Tester",
            icon: <Bug size={32} strokeWidth={1.5} />,
            color: "from-green-500 to-emerald-700",
            textColor: "text-green-600"
        },
        {
            name: "ธนายุทธ แป้นมา",
            role: "Libero",
            icon: <ShieldCheck size={32} strokeWidth={1.5} />,
            color: "from-red-600 to-rose-700",
            textColor: "text-red-600"
        }
    ];

    return (
        <div className="animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="mb-20 border-l-8 border-gray-900 pl-8">
                <h1 className="text-7xl font-black text-gradient-to-r from-purple-600 to-pink-500 tracking-tighter leading-none mb-4">OUR TEAM</h1>
                <p className="text-2xl text-gray-400 font-bold uppercase tracking-[0.3em]">ทีมพัฒนา "สายปั่น"</p>
            </div>

            {/* Large Angular Rectangles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-0 border-2 border-gray-900 overflow-hidden">
                {teamMembers.map((member, index) => (
                    <div
                        key={index}
                        className={`group flex flex-col bg-white h-[650px] transition-all duration-500 border-gray-900 ${index !== 4 ? 'xl:border-r-2' : ''} ${index < 4 ? 'border-b-2 md:border-b-0' : ''} hover:bg-gray-50`}
                    >
                        {/* Huge Image/Gradient Area - NO ROUNDING */}
                        <div className={`flex-[4] bg-gradient-to-br ${member.color} relative overflow-hidden flex items-center justify-center group-hover:flex-[6] transition-all duration-700 ease-in-out`}>
                            {/* Decorative Background Icon */}
                            <div className="opacity-10 transform scale-[2] group-hover:scale-[3] group-hover:rotate-12 transition-transform duration-1000 text-white">
                                {member.icon}
                            </div>

                            {/* Overlay info that appears on hover */}
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                <span className="text-white text-xs font-black tracking-[0.5em] uppercase border-2 border-white px-4 py-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700 delay-100">
                                    View Profile
                                </span>
                            </div>
                        </div>

                        {/* Name & Role Section - Bottom */}
                        <div className="flex-1 p-8 bg-white flex flex-col justify-center relative z-10">
                            <h3 className="text-2xl font-black text-gray-900 leading-none tracking-tighter uppercase mb-2">
                                {member.name.split(" ")[0]}
                                <span className="block text-sm opacity-30 mt-1">{member.name.split(" ").slice(1).join(" ")}</span>
                            </h3>

                            <div className="flex items-center gap-3 mt-4 overflow-hidden">
                                <div className={`w-8 h-1 bg-gradient-to-r ${member.color}`} />
                                <p className={`text-[10px] font-black uppercase tracking-widest ${member.textColor} whitespace-nowrap`}>
                                    {member.role}
                                </p>
                            </div>
                        </div>

                        {/* Sharp Accent Box */}
                        <div className={`h-2 bg-gradient-to-r ${member.color} w-0 group-hover:w-full transition-all duration-500`} />
                    </div>
                ))}
            </div>

            {/* Footer Quote */}
            <div className="mt-24 border-t-8 border-gray-900 pt-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div>
                    <p className="text-4xl font-black text-gray-900 tracking-tighter uppercase mb-2 italic">Precision & Passion</p>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Building the future of Book2Hand</p>
                </div>
                <div className="flex gap-2">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-4 h-4 bg-gray-900" />
                    ))}
                </div>
            </div>
        </div>
    );
}

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

// Import images
import chayaphonImg from "../../assets/chayaphon.png";
import thanayutImg from "../../assets/Q.png";
import pcruImg from "../../assets/pcru.png";
import jrwImg from "../../assets/best.png";
import taizhonImg from "../../assets/taizhon.png";

// Import Effects
import Fire from "../../components/ui/Fire";

export default function AboutUs() {
    const [hoveredMember, setHoveredMember] = useState(null);

    useEffect(() => {
        document.body.classList.add('about-us-mode');
        return () => {
            document.body.classList.remove('about-us-mode');
        };
    }, []);

    const teamMembers = [
        {
            name: "PATCHRAUS MEUANGDEKSUKUL",
            role: "Backend-Dev",
            image: pcruImg,
            effect: <div className="absolute inset-0 opacity-70 scale-125 translate-y-10"><Fire /></div>,
            color: "from-green-600 to-green-900",
            textColor: "text-green-400",
            borderColor: "border-green-500"
        },
        {
            name: "CHAYAPHON SOMBOONSUK",
            role: "Frontend-minion",
            image: chayaphonImg,
            effect: <div className="absolute inset-0 opacity-70 scale-125 translate-y-10"><Fire /></div>,
            color: "from-blue-600 to-indigo-900",
            textColor: "text-blue-400",
            borderColor: "border-blue-500"
        },
        {
            name: "PIRACHAT CHAIPOL",
            role: "Frontend-Dev",
            image: taizhonImg,
            effect: <div className="absolute inset-0 opacity-70 scale-125 translate-y-10"><Fire /></div>,
            color: "from-[#720a00] to-red-400",
            textColor: "text-red-600",
            borderColor: "border-red-500"
        },
        {
            name: "JIRAWAT PHUNIM",
            role: "Tester",
            image: jrwImg,
            effect: <div className="absolute inset-0 opacity-70 scale-125 translate-y-10"><Fire /></div>,
            color: "from-yellow-500 to-emerald-700",
            textColor: "text-yellow-400",
            borderColor: "border-yellow-500"
        },
        {
            name: "THANAYUT PAENMA",
            role: "Libero",
            image: thanayutImg,
            effect: <div className="absolute inset-0 opacity-70 scale-125 translate-y-10"><Fire /></div>,
            color: "from-purple-600 to-rose-700",
            textColor: "text-red-400",
            borderColor: "border-purple-500"
        }
    ];

    return (
        <div className="relative animate-in fade-in duration-1000 -m-8 p-8 min-h-screen overflow-hidden">
            <style>
                {`
                    body.about-us-mode .bg-white, 
                    body.about-us-mode .bg-slate-50\\/50, 
                    body.about-us-mode .bg-gray-50\\/50,
                    body.about-us-mode main {
                        background-color: transparent !important;
                        border-color: rgba(255,255,255,0.05) !important;
                    }
                    body.about-us-mode {
                        background-color: #05020a !important;
                    }
                    /* Keyframes สำหรับการไหลของตัวหนังสือ */
                    @keyframes driftUp {
                        0% { transform: translateY(0); }
                        100% { transform: translateY(-50%); }
                    }
                    @keyframes driftDown {
                        0% { transform: translateY(-50%); }
                        100% { transform: translateY(0%); }
                    }
                    .animate-drift-up {
                        animation: driftUp 20s linear infinite;
                    }
                    .animate-drift-down {
                        animation: driftDown 20s linear infinite;
                    }
                `}
            </style>

            {/* Background */}
            {createPortal(
                <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/30 via-purple-950/50 to-slate-950 -z-10 animate-in fade-in duration-1000" />,
                document.body
            )}

            {/* Header */}
            <div className="mb-24 border-l-4 border-purple-500/60 rounded-l-xl pl-10 relative z-10">
                <h1 className="text-8xl font-black bg-gradient-to-r from-purple-500 via-indigo-400 to-purple-600 bg-clip-text text-transparent tracking-tighter leading-none mb-4 uppercase">OUR TEAM</h1>
                <p className="text-2xl text-purple-400/80 font-bold uppercase tracking-[0.4em]">ทีมพัฒนา "ABDBQ"</p>
            </div>

            {/* Grid Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4 overflow-hidden rounded-3xl shadow-[0_0_100px_rgba(147,51,234,0.2)] backdrop-blur-sm bg-slate-900/30 relative z-10">
                {teamMembers.map((member, index) => (
                    <div
                        key={index}
                        onMouseEnter={() => setHoveredMember(member)}
                        onMouseLeave={() => setHoveredMember(null)}
                        className={`group flex flex-col bg-slate-900/50 backdrop-blur-md h-[700px] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden hover:z-20 hover:scale-[1.05] hover:shadow-[0_0_80px_rgba(147,51,234,0.4)] rounded-2xl`}
                    >
                        {/* Image Area */}
                        <div className={`flex-[4] bg-gradient-to-br ${member.color} relative overflow-hidden flex items-center justify-center group-hover:flex-[25] transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]`}>
                            {/* Effect */}
                            <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none mix-blend-hard-light">
                                {member.effect}
                            </div>
                            
                            {/* Image */}
                            {member.image ? (
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="relative z-10 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out grayscale group-hover:grayscale-0"
                                />
                            ) : (
                                <div className="text-white/30 text-[10px] font-black uppercase tracking-[0.5em] group-hover:scale-150 transition-transform duration-700">No Data</div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20" />
                        </div>

                        {/* Text Area */}
                        <div className="flex-1 p-10 bg-slate-900/60 backdrop-blur flex flex-col justify-center relative z-30 transition-colors duration-500 group-hover:bg-slate-800/70">
                            <h3 className="text-2xl font-black text-white leading-tight tracking-tighter uppercase mb-2 group-hover:text-purple-400 transition-colors duration-500">
                                {member.name.split(" ")[0]}
                                <span className="block text-xs opacity-40 mt-2 font-bold tracking-widest">{member.name.split(" ").slice(1).join(" ")}</span>
                            </h3>

                            <div className="flex items-center gap-3 mt-6 overflow-hidden">
                                <div name="rolebar" className={`w-6 h-1 bg-gradient-to-r ${member.color} scale-x-100 group-hover:scale-x-150 origin-left transition-transform duration-700`} />
                                <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${member.textColor} whitespace-nowrap leading-none`}>
                                    {member.role}
                                </p>
                            </div>
                        </div>
                        <div className={`h-3 bg-gradient-to-r ${member.color} w-0 group-hover:w-full transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]`} />
                    </div>
                ))}
            </div>

            {/* --- DOUBLE SIDE HUD (ซ้ายขึ้น - ขวาลง) --- */}
            {hoveredMember && createPortal(
                <>
                    {/* ===== LEFT SIDE HUD (ไหลขึ้น) ===== */}
                    <div className="fixed top-0 left-0 h-screen w-20 md:w-32 z-[9999] pointer-events-none overflow-hidden animate-in slide-in-from-left fade-in duration-[250ms]">
                        {/* เส้นขอบขวาของแถบซ้าย */}
                        <div className={`absolute right-0 top-0 h-full w-[2px] bg-gradient-to-b ${hoveredMember.color} opacity-80 shadow-[0_0_20px_currentColor]`} />
                        
                        {/* Container สำหรับวิ่งขึ้น */}
                        <div className="absolute w-full h-[200vh] flex flex-col items-center gap-12 animate-drift-up opacity-40">
                            {/* สร้าง Text ซ้ำๆ เพื่อให้ดูเหมือนวิ่งไม่หยุด */}
                            {Array(20).fill("").map((_, i) => (
                                <div key={i} className="rotate-180" style={{ writingMode: 'vertical-rl' }}>
                                    <p className={`text-4xl font-black uppercase tracking-widest ${hoveredMember.textColor} whitespace-nowrap`}>
                                        {hoveredMember.name.split(" ")[0]} &nbsp; // &nbsp; {hoveredMember.role}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ===== RIGHT SIDE HUD (ไหลลง) ===== */}
                    <div className="fixed top-0 right-0 h-screen w-20 md:w-32 z-[9999] pointer-events-none overflow-hidden animate-in slide-in-from-right fade-in duration-[250ms]">
                        {/* เส้นขอบซ้ายของแถบขวา */}
                        <div className={`absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b ${hoveredMember.color} opacity-80 shadow-[0_0_20px_currentColor]`} />
                        
                        {/* Container สำหรับวิ่งลง */}
                        <div className="absolute w-full h-[200vh] -top-[100vh] flex flex-col items-center gap-12 animate-drift-down opacity-100">
                             {/* สร้าง Text ซ้ำๆ เพื่อให้ดูเหมือนวิ่งไม่หยุด */}
                             {Array(20).fill("").map((_, i) => (
                                <div key={i} className="" style={{ writingMode: 'vertical-rl' }}>
                                     <h2 className={`text-5xl md:text-6xl font-black uppercase tracking-tight ${hoveredMember.textColor} drop-shadow-[0_0_15px_rgba(0,0,0,1)]`}>
                                        {hoveredMember.name.split(" ")[0]}
                                    </h2>
                                    <p className="text-white/50 text-xs font-mono mt-2 text-center tracking-[0.5em] uppercase">
                                        {hoveredMember.role}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </>,
                document.body
            )}

            {/* Footer */}
            <div className="mt-32 border-t-8 border-purple-500/10 pt-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-12 pb-24 relative z-10">
                <div>
                    <p className="text-6xl font-black text-white/90 tracking-tighter uppercase mb-4 italic">Precision & Passion</p>
                    <p className="text-purple-400/60 font-bold uppercase tracking-[0.5em] text-sm">Building the future of Book2Hand</p>
                </div>
                <div className="flex gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="w-8 h-8 bg-purple-500/5 hover:bg-purple-500/20 transition-all duration-300 transform -skew-x-12 border border-purple-500/10" />
                    ))}
                </div>
            </div>
        </div>
    );
}
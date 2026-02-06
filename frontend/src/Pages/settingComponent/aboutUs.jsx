import React, { useEffect, useState } from "react";

// Import images to ensure Vite resolves them correctly
import chayaphonImg from "../../assets/chayaphon.png";
import thanayutImg from "../../assets/Q.png";
import pcruImg from "../../assets/pcru.png";
import jrwImg from "../../assets/best.png";
import taizhonImg from "../../assets/taizhon.png";

//popup img
import knightImg from "../../assets/saber.png";
import samuraiImg from "../../assets/samurai.png";
import mageImg from "../../assets/mage.png";
import monkImg from "../../assets/monk.png";
import crossImg from "../../assets/cross.png";

import { createPortal } from "react-dom";

export default function AboutUs() {
    // Force the body and parent layouts to be transparent/dark while this page is active
    useEffect(() => {
        document.body.classList.add("about-us-mode");
        const originalBg = document.body.style.background;
        document.body.style.background = "linear-gradient(135deg, #13092D 0%, #070210 100%)";

        return () => {
            document.body.classList.remove("about-us-mode");
            document.body.style.background = originalBg;
        };
    }, []);

    const [hoveredMember, setHoveredMember] = useState(null);

    const teamMembers = [
        {
            name: "PATCHRAUS MEUANGDEKSUKUL",
            role: "Backend-Dev",
            image: pcruImg,
            extraImage: mageImg,
            extraText: "PATCHRAUS THE BACKEND DEV",
            color: "from-green-600 to-indigo-700",
            textColor: "text-green-400"
        }, {
            name: "CHAYAPHON SOMBOONSUK",
            role: "Frontend-minion",
            image: chayaphonImg,
            extraImage: samuraiImg,
            extraText: "CHAYAPHON THE FRONTEND MINION",
            color: "from-blue-600 to-orange-600",
            textColor: "text-blue-400"
        },
        {
            name: "PIRACHAT CHAIPOL",
            role: "Frontend-Dev",
            image: taizhonImg,
            extraImage: knightImg,
            extraText: "TAIZHON THE FRONTEND",
            color: "from-pink-600 to-purple-700",
            textColor: "text-pink-400"
        },
        {
            name: "JIRAWAT PHUNIM",
            role: "Tester",
            image: jrwImg,
            extraImage: monkImg,
            extraText: "JIRAWAT THE TESTER",
            color: "from-yellow-500 to-emerald-700",
            textColor: "text-yellow-400"
        },
        {
            name: "THANAYUT PAENMA",
            role: "Libero",
            image: thanayutImg,
            extraImage: crossImg,
            extraText: "THANAYUT THE LIBERO",
            color: "from-red-600 to-rose-700",
            textColor: "text-red-400"
        }
    ];

    return (
        <div className="relative animate-in fade-in duration-1000 -m-8 p-8 min-h-screen overflow-hidden">
            {/* Inject Global Styles to force transparency for parent containers only on this page */}
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
                        background-color: #13092D !important;
                    }
                    @keyframes textGlitch {
                        0% { clip-path: inset(40% 0 61% 0); transform: translate(-2px, 2px); }
                        20% { clip-path: inset(92% 0 1% 0); transform: translate(2px, -2px); }
                        40% { clip-path: inset(43% 0 1% 0); transform: translate(1px, 2px); }
                        60% { clip-path: inset(25% 0 58% 0); transform: translate(-2px, 1px); }
                        80% { clip-path: inset(54% 0 7% 0); transform: translate(1px, -2px); }
                        100% { clip-path: inset(58% 0 43% 0); transform: translate(-1px, 1px); }
                    }
                    @keyframes cyberEntrance {
                        0% { transform: scale(0.2) rotate(-15deg) translateY(50px); opacity: 0; filter: blur(20px); }
                        60% { transform: scale(1.1) rotate(3deg) translateY(0); opacity: 1; filter: blur(0px); }
                        80% { transform: scale(0.95) rotate(-1deg); }
                        100% { transform: scale(1) rotate(0deg); }
                    }
                    @keyframes float {
                        0%, 100% { transform: translateY(0) rotate(0deg); }
                        25% { transform: translateY(-15px) rotate(1deg); }
                        75% { transform: translateY(15px) rotate(-1deg); }
                    }
                    @keyframes rumble {
                        0% { transform: translate(0, 0) rotate(0deg); }
                        25% { transform: translate(1px, 1px) rotate(0.2deg); }
                        50% { transform: translate(-1px, -1px) rotate(-0.2deg); }
                        75% { transform: translate(-1px, 1px) rotate(0.2deg); }
                        100% { transform: translate(1px, -1px) rotate(-0.2deg); }
                    }
                    @keyframes saiyanAura {
                        0% { filter: drop-shadow(0 0 20px currentColor) drop-shadow(0 0 40px currentColor); transform: scale(1); }
                        50% { filter: drop-shadow(0 -20px 40px currentColor) drop-shadow(0 -50px 70px currentColor); transform: scale(1.01); }
                        100% { filter: drop-shadow(0 0 20px currentColor) drop-shadow(0 0 40px currentColor); transform: scale(1); }
                    }
                    .animate-glitch {
                        animation: textGlitch 0.4s infinite linear alternate-reverse;
                    }
                    .animate-cyber-entrance {
                        animation: cyberEntrance 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
                    }
                    .animate-rumble {
                        animation: rumble 0.15s infinite linear;
                    }
                    .animate-saiyan-aura {
                        animation: saiyanAura 1.5s infinite ease-in-out;
                    }
                    .neon-glow {
                        text-shadow: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 40px currentColor;
                    }
                    .text-static {
                        transform: translateZ(0); /* Hardware accelerate but no movement */
                    }
                `}
            </style>

            {/* Immersive Dark Background Transition - PROTAL TO BODY to escape parent layout clipping */}
            {createPortal(
                <div className="fixed inset-0 bg-[#13092D] bg-gradient-to-br from-[#13092D] via-[#0c0518] to-[#020105] -z-10 animate-in fade-in duration-1000" />,
                document.body
            )}

            {/* Header Section */}
            <div className="mb-24 border-l-[12px] border-purple-600 pl-10">
                <h1 className="text-8xl font-black bg-gradient-to-r from-purple-500 via-indigo-400 to-purple-600 bg-clip-text text-transparent tracking-tighter leading-none mb-4 uppercase">OUR TEAM</h1>
                <p className="text-2xl text-purple-400/80 font-bold uppercase tracking-[0.4em]">ทีมพัฒนา "ABDBQ"</p>
            </div>

            {/* Large Angular Rectangles Grid - Borderless Sharp Style */}
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-0 overflow-hidden shadow-[0_0_100px_rgba(147,51,234,0.15)] bg-[#13092D]">
                {teamMembers.map((member, index) => (
                    <div
                        key={index}
                        onMouseEnter={() => setHoveredMember(member)}
                        onMouseLeave={() => setHoveredMember(null)}
                        className={`group flex flex-col bg-[#13092D] h-[700px] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden hover:z-20 hover:scale-[1.02] hover:shadow-[0_0_120px_rgba(0,0,0,0.8)]`}
                    >
                        {/* Huge Image Area - Expanding to fill */}
                        <div className={`flex-[4] bg-gradient-to-br ${member.color} relative overflow-hidden flex items-center justify-center group-hover:flex-[25] transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]`}>
                            {/* Member Image Hook */}
                            {member.image ? (
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                                />
                            ) : (
                                <div className="text-white/30 text-[10px] font-black uppercase tracking-[0.5em] group-hover:scale-150 transition-transform duration-700">No Data</div>
                            )}

                            {/* Decorative Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        </div>

                        {/* Name & Role Section - Bottom */}
                        <div className="flex-1 p-10 bg-[#13092D] flex flex-col justify-center relative z-10 transition-colors duration-500 group-hover:bg-[#0c0518]">
                            <h3 className="text-2xl font-black text-white leading-tight tracking-tighter uppercase mb-2 group-hover:text-purple-400 transition-colors duration-500">
                                {member.name.split(" ")[0]}
                                <span className="block text-xs opacity-40 mt-2 font-bold tracking-widest">{member.name.split(" ").slice(1).join(" ")}</span>
                            </h3>

                            <div className="flex items-center gap-4 mt-6 overflow-hidden">
                                <div className={`w-12 h-1.5 bg-gradient-to-r ${member.color} scale-x-100 group-hover:scale-x-150 origin-left transition-transform duration-700`} />
                                <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${member.textColor} whitespace-nowrap`}>
                                    {member.role}
                                </p>
                            </div>
                        </div>

                        {/* Sharp Accent Box */}
                        <div className={`h-3 bg-gradient-to-r ${member.color} w-0 group-hover:w-full transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]`} />
                    </div>
                ))}
            </div>

            {/* Global Explosive Hover Overlay - PORTAL TO BODY to ensure it appears on top of everything */}
            {hoveredMember && createPortal(
                <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center overflow-visible animate-rumble">
                    {/* Extra Popup Image - Fire Aura Steady */}
                    {hoveredMember.extraImage && (
                        <div className={`absolute inset-0 flex items-center justify-center ${hoveredMember.textColor}`}>
                            <img
                                src={hoveredMember.extraImage}
                                alt="Extra"
                                className="w-[80vw] h-[80vh] object-contain animate-cyber-entrance animate-saiyan-aura"
                            />
                        </div>
                    )}

                    {/* Extra Animated Text - Static, Glowing, SMALLER */}
                    {hoveredMember.extraText && (
                        <div className="absolute inset-0 flex items-center justify-center z-[130]">
                            <p className={`${hoveredMember.textColor} font-black text-3xl md:text-5xl tracking-widest whitespace-nowrap neon-glow text-static drop-shadow-2xl animate-cyber-entrance`}>
                                {hoveredMember.extraText}
                            </p>
                        </div>
                    )}
                </div>,
                document.body
            )}

            {/* Footer Quote */}
            <div className="mt-32 border-t-8 border-purple-500/10 pt-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-12 pb-24">
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

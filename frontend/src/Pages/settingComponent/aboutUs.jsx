import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

// Import images
import chayaphonImg from "../../assets/chayaphon.png";
import thanayutImg from "../../assets/Q.png";
import pcruImg from "../../assets/pcru.png";
import jrwImg from "../../assets/best.png";
import taizhonImg from "../../assets/taizhon.png";

//import removebgIMG
import chayaphonImgRemovebg from "../../assets/chayaphonbg.png";
import thanayutImgRemovebg from "../../assets/Qbg.png";
import pcruImgRemovebg from "../../assets/pcrubg.png";
import jrwImgRemovebg from "../../assets/bestbg.png";
import taizhonImgRemovebg from "../../assets/taizhonbg.png";

//import activeIMG
import pcruActiveImg from "../../assets/pcruActiveImg.png";
import chayaphonActiveImg from "../../assets/chayaphonActiveImg.png";
import taizhonActiveImg from "../../assets/taizhonActiveImg.png";
import jrwActiveImg from "../../assets/jrwActiveImg.png";
import thanayutActiveImg from "../../assets/thanayutActiveImg.png";

// Import Effects
import Fire from "../../components/ui/Fire";

export default function AboutUs() {
    const [hoveredMember, setHoveredMember] = useState(null);
    const [activeMember, setActiveMember] = useState(null);

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
            imageRemovebg: pcruImgRemovebg,
            imageActive: pcruActiveImg,
            effect: <div className="absolute inset-0 opacity-70 scale-125 translate-y-10"><Fire /></div>,
            color: "from-green-600 to-green-900",
            textColor: "text-green-400",
            borderColor: "border-green-500",
            topic: "CORE ARCHITECTURE",
            description: "Crafting the digital backbone with high-performance APIs and secure data pipelines."
        },
        {
            name: "CHAYAPHON SOMBOONSUK",
            role: "Frontend-minion",
            image: chayaphonImg,
            imageRemovebg: chayaphonImgRemovebg,
            imageActive: chayaphonActiveImg,
            effect: <div className="absolute inset-0 opacity-70 scale-125 translate-y-10"><Fire /></div>,
            color: "from-blue-600 to-indigo-900",
            textColor: "text-blue-400",
            borderColor: "border-blue-500",
            topic: "UI INTEGRATION",
            description: "Bringing static designs to life with precise React implementation and state management."
        },
        {
            name: "PIRACHAT CHAIPOL",
            role: "Frontend-Dev",
            image: taizhonImg,
            imageRemovebg: taizhonImgRemovebg,
            imageActive: taizhonActiveImg,
            effect: <div className="absolute inset-0 opacity-70 scale-125 translate-y-10"><Fire /></div>,
            color: "from-[#720a00] to-red-400",
            textColor: "text-red-600",
            borderColor: "border-red-500",
            topic: "EXPERIENCE DESIGN",
            description: "Mastering the art of motion and aesthetics to deliver a truly premium user experience."
        },
        {
            name: "JIRAWAT PHUNIM",
            role: "Tester",
            image: jrwImg,
            imageRemovebg: jrwImgRemovebg,
            imageActive: jrwActiveImg,
            effect: <div className="absolute inset-0 opacity-70 scale-125 translate-y-10"><Fire /></div>,
            color: "from-yellow-500 to-emerald-700",
            textColor: "text-yellow-400",
            borderColor: "border-yellow-500",
            topic: "QUALITY ASSURANCE",
            description: "Rigorous testing and optimization to ensure every feature is flawless and production-ready."
        },
        {
            name: "THANAYUT PAENMA",
            role: "Libero",
            image: thanayutImg,
            imageRemovebg: thanayutImgRemovebg,
            imageActive: thanayutActiveImg,
            effect: <div className="absolute inset-0 opacity-70 scale-125 translate-y-10"><Fire /></div>,
            color: "from-purple-600 to-rose-700",
            textColor: "text-red-400",
            borderColor: "border-purple-500",
            topic: "VERSATILE SUPPORT",
            description: "The ultimate team player, bridging gaps between frontend and backend with rapid adaptation."
        }
    ];

    return (
        <div className="relative animate-in fade-in duration-1000 -m-8 p-8 min-h-screen">
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
                        overflow-x: hidden;
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
                    .animate-drift-up-fast {
                        animation: driftUp 5s linear infinite;
                    }
                    .animate-drift-down {
                        animation: driftDown 20s linear infinite;
                    }
                    .animate-drift-down-fast {
                        animation: driftDown 5s linear infinite;
                    }
                    @keyframes glitch {
                        0% { text-shadow: 2px 0 #ff00c1, -2px 0 #00fff9; transform: translate(0); }
                        20% { text-shadow: -2px 0 #ff00c1, 2px 0 #00fff9; transform: translate(-2px, 2px); }
                        40% { text-shadow: 2px 2px #ff00c1, -2px -2px #00fff9; transform: translate(2px, -2px); }
                        60% { text-shadow: -2px -2px #ff00c1, 2px 2px #00fff9; transform: translate(-2px, -2px); }
                        80% { text-shadow: 2px -2px #ff00c1, -2px 2px #00fff9; transform: translate(2px, 2px); }
                        100% { text-shadow: 2px 0 #ff00c1, -2px 0 #00fff9; transform: translate(0); }
                    }
                    .animate-glitch {
                        animation: glitch 0.2s ease-in-out infinite;
                    }
                    @keyframes intense-shake {
                        0%, 100% { transform: translate(0, 0) scale(1.5) translateY(-6rem); }
                        10% { transform: translate(-2px, -2px) scale(1.52) translateY(-6.1rem); }
                        20% { transform: translate(2px, -1px) scale(1.48) translateY(-5.9rem); }
                        30% { transform: translate(-3px, 1px) scale(1.5) translateY(-6rem); }
                        40% { transform: translate(3px, -1px) scale(1.51) translateY(-6.05rem); }
                        50% { transform: translate(-1px, 2px) scale(1.49) translateY(-5.95rem); }
                        60% { transform: translate(2px, 1px) scale(1.5) translateY(-6rem); }
                        70% { transform: translate(-1px, -1px) scale(1.52) translateY(-6.1rem); }
                        80% { transform: translate(1px, 2px) scale(1.48) translateY(-5.9rem); }
                        90% { transform: translate(-1px, -2px) scale(1.51) translateY(-6.05rem); }
                    }
                    .animate-intense-shake {
                        animation: intense-shake 0.1s linear infinite;
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
                <h1 className="text-8xl font-black bg-gradient-to-r from-purple-500 via-indigo-400 to-purple-600 bg-clip-text text-transparent tracking-tighter leading-none mb-4 uppercase">BOOK2HAND</h1>
                <p className="text-2xl text-purple-400/80 font-bold uppercase tracking-[0.4em]">5 developers of book2hand</p>
            </div>

            {/* Grid Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4 rounded-3xl shadow-[0_0_100px_rgba(147,51,234,0.2)] backdrop-blur-sm bg-slate-900/30 relative z-10">
                {teamMembers.map((member, index) => (
                    <div
                        key={index}
                        onMouseEnter={() => setHoveredMember(member)}
                        onMouseLeave={() => { setHoveredMember(null); setActiveMember(null); }}
                        onMouseDown={() => setActiveMember(member)}
                        onMouseUp={() => setActiveMember(null)}
                        className={`group flex flex-col bg-slate-900/50 backdrop-blur-md h-[700px] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] hover:z-20 hover:scale-[1.05] hover:shadow-[0_0_80px_rgba(147,51,234,0.4)] rounded-2xl cursor-pointer select-none`}
                    >
                        {/* Image Area */}
                        <div className={`flex-[4] bg-gradient-to-br ${member.color} relative flex items-center justify-center group-hover:flex-[25] transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] rounded-t-2xl`}>
                            {/* Effect */}
                            <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none mix-blend-hard-light">
                                {member.effect}
                            </div>

                            {/* Image Container */}
                            <div className="relative w-full h-full rounded-t-2xl">
                                <div className="absolute inset-0 overflow-hidden rounded-t-2xl">
                                    {member.image && (
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[250ms] ease-out"
                                        />
                                    )}
                                </div>

                                {/* Main Pop-out Image (Changes on Click) */}
                                {member.imageRemovebg && (
                                    <img
                                        src={activeMember === member ? member.imageActive : member.imageRemovebg}
                                        alt={`${member.name} cutout`}
                                        className={`absolute inset-0 w-full h-full object-contain z-30 opacity-0 group-hover:opacity-100 transition-all duration-[100ms] ease-out pointer-events-none 
                                        drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] group-hover:drop-shadow-[0_0_20px_currentColor] ${member.textColor}
                                        ${activeMember === member 
                                            ? 'animate-intense-shake brightness-150 scale-150 -translate-y-24' 
                                            : 'group-hover:scale-150 group-hover:-translate-y-24'
                                        }`}
                                    />
                                )}

                                {!member.image && (
                                    <div className="absolute inset-0 flex items-center justify-center text-white/30 text-[10px] font-black uppercase tracking-[0.5em] group-hover:scale-150 transition-transform duration-700">No Data</div>
                                )}
                            </div>
                            
                            <div className={`absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-40 flex flex-col justify-end p-8 ${activeMember === member ? 'brightness-150' : ''}`}>
                                <div className={`mb-6 transform -translate-x-10 scale-90 group-hover:translate-x-0 group-hover:scale-100 transition-all duration-[250ms] delay-50 opacity-0 group-hover:opacity-100 ${activeMember === member ? 'animate-pulse scale-110 -rotate-2' : ''}`}>
                                    <p className={`text-sm font-black text-white/90 ${activeMember === member ? 'animate-glitch' : ''}`}>({member.topic})</p>
                                    <div className={`w-full h-[1px] bg-white/30 my-2 transition-all duration-300 ${activeMember === member ? 'w-[120%] bg-white' : ''}`} />
                                    <p className={`text-[10px] text-white/70 leading-relaxed max-w-[200px] italic transition-all duration-300 ${activeMember === member ? 'text-white translate-x-4' : ''}`}>
                                        ({member.description})
                                    </p>
                                </div>
                                <div className={`transform translate-y-4 group-hover:translate-y-0 transition-transform duration-[250ms] flex items-end justify-between ${activeMember === member ? 'scale-125 -translate-y-6 rotate-2' : ''}`}>
                                    <div className="flex-1">
                                        <h3 className={`text-2xl font-black text-white tracking-tighter uppercase leading-none transition-all ${activeMember === member ? 'text-4xl tracking-widest animate-glitch' : ''}`}>
                                            {member.name.split(" ")[0]}
                                        </h3>
                                        <p className={`text-[10px] font-black uppercase tracking-[0.2em] mt-2 transition-all ${member.textColor} ${activeMember === member ? 'tracking-[0.8em] brightness-200' : ''}`}>
                                            {member.role}
                                        </p>
                                    </div>
                                </div>
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
                        <div className={`absolute right-0 top-0 h-full w-[2px] bg-gradient-to-b ${hoveredMember.color} opacity-80 shadow-[0_0_20px_currentColor]`} />
                        <div className={`absolute w-full h-[200vh] flex flex-col items-center gap-12 opacity-40 ${activeMember === hoveredMember ? 'animate-drift-up-fast' : 'animate-drift-up'}`}>
                            {Array(20).fill("").map((_, i) => (
                                <div key={i} className="rotate-180" style={{ writingMode: 'vertical-rl' }}>
                                    <p className={`text-4xl font-black uppercase tracking-widest ${hoveredMember.textColor} whitespace-nowrap transition-all ${activeMember === hoveredMember ? 'animate-glitch' : ''}`}>
                                        {hoveredMember.name.split(" ")[0]} &nbsp; // &nbsp; {hoveredMember.role}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ===== RIGHT SIDE HUD (ไหลลง) ===== */}
                    <div className="fixed top-0 right-0 h-screen w-20 md:w-32 z-[9999] pointer-events-none overflow-hidden animate-in slide-in-from-right fade-in duration-[250ms]">
                        <div className={`absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b ${hoveredMember.color} opacity-80 shadow-[0_0_20px_currentColor]`} />
                        <div className={`absolute w-full h-[200vh] -top-[100vh] flex flex-col items-center gap-12 opacity-100 ${activeMember === hoveredMember ? 'animate-drift-down-fast' : 'animate-drift-down'}`}>
                            {Array(20).fill("").map((_, i) => (
                                <div key={i} className="" style={{ writingMode: 'vertical-rl' }}>
                                    <h2 className={`text-5xl md:text-6xl font-black uppercase tracking-tight ${hoveredMember.textColor} drop-shadow-[0_0_15px_rgba(0,0,0,1)] transition-all ${activeMember === hoveredMember ? 'animate-glitch text-7xl' : ''}`}>
                                        {hoveredMember.name.split(" ")[0]}
                                    </h2>
                                    <p className={`text-white/50 text-xs font-mono mt-2 text-center tracking-[0.5em] uppercase transition-all ${activeMember === hoveredMember ? 'tracking-[1.5em] text-white' : ''}`}>
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
                    <p className="text-6xl font-black text-white/90 tracking-tighter uppercase mb-4 italic">UNLOCK YOUR POTENTIAL</p>
                    <p className="text-purple-400/60 font-bold uppercase tracking-[0.5em] text-sm">North Bangkok University</p>
                </div>
                <div className="flex gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="w-8 h-8 bg-purple-500/5 hover:bg-purple-500/20 transition-all duration-300 transform -skew-x-12 border border-purple-500/10" />
                    ))}
                </div>
            </div>

            {/* PRELOAD ACTIVE IMAGES (ป้องกันรูปกระพริบตอนกดครั้งแรก) */}
            <div className="hidden">
                {teamMembers.map((m, i) => (
                    <img key={i} src={m.imageActive} alt="preload" />
                ))}
            </div>
        </div>
    );
}
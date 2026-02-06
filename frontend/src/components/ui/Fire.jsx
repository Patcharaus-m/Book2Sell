import React from 'react';
import './Fire.css'; // นำเข้าไฟล์ CSS ข้างบน

const Fire = () => {
    // สร้าง array เปล่าๆ สัก 15-20 อัน เพื่อแทนจำนวนเปลวไฟย่อย
    const particles = Array.from({ length: 20 });

    return (
        <div className="fire-container">
            {particles.map((_, index) => {
                // เทคนิคสำคัญ: สุ่มค่า animation-delay และ ขนาด
                // เพื่อให้ไฟแต่ละดวงวิ่งไม่พร้อมกัน ดูเป็นธรรมชาติ
                const randomDelay = Math.random() * 1.5; // สุ่ม delay ระหว่าง 0 - 1.5 วิ
                const randomScale = 0.8 + Math.random() * 0.5; // สุ่มขนาดให้ต่างกันนิดหน่อย
                const randomLeftOffset = (Math.random() - 0.5) * 30; // สุ่มตำแหน่งซ้ายขวา

                const style = {
                    animationDelay: `${randomDelay}s`,
                    transform: `scale(${randomScale})`,
                    marginLeft: `${randomLeftOffset}px`
                };

                return <div key={index} className="fire-particle" style={style} />;
            })}
        </div>
    );
};

export default Fire;

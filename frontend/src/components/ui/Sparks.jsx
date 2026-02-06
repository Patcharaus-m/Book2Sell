import React from 'react';
import './Sparks.css';

const SparksComponent = () => {
    // สร้างประกายไฟเยอะๆ หน่อย
    const sparks = Array.from({ length: 30 });

    return (
        <div className="sparks-container">
            <h3 style={{ color: 'white', textAlign: 'center' }}>เปรี๊ยะๆ!</h3>
            {sparks.map((_, index) => {
                // เทคนิคสำคัญ: สุ่มตำแหน่ง (Top/Left) และสุ่มระยะเวลา Animation
                const randomTop = Math.random() * 100; // 0% - 100%
                const randomLeft = Math.random() * 100; // 0% - 100%
                const randomDuration = 0.2 + Math.random() * 0.4; // 0.2s - 0.6s (เร็วมาก)
                const randomDelay = Math.random() * 1; // delay เพื่อไม่ให้เริ่มพร้อมกัน

                const style = {
                    top: `${randomTop}%`,
                    left: `${randomLeft}%`,
                    animationDuration: `${randomDuration}s`,
                    animationDelay: `${randomDelay}s`
                };

                return <div key={index} className="spark" style={style} />;
            })}
        </div>
    );
};

export default SparksComponent;

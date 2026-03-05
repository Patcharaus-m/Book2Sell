import React from 'react';
import './Sparks.css';
import { generateSparks } from '../../utils/particleUtils';

const SPARKS = generateSparks(30);

const SparksComponent = () => {
    return (
        <div className="sparks-container">
            <h3 style={{ color: 'white', textAlign: 'center' }}>เปรี๊ยะๆ!</h3>
            {SPARKS.map((spark) => (
                <div key={spark.id} className="spark" style={spark.style} />
            ))}
        </div>
    );
};

export default SparksComponent;

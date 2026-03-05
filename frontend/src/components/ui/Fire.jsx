import { generateFireParticles } from '../../utils/particleUtils';
import './Fire.css';

const FIRE_PARTICLES = generateFireParticles(20);

const Fire = () => {
    return (
        <div className="fire-container">
            {FIRE_PARTICLES.map((particle) => (
                <div key={particle.id} className="fire-particle" style={particle.style} />
            ))}
        </div>
    );
};

export default Fire;

import React from "react";
import Chip from '@mui/material/Chip';
import { skills } from '../portfolio';
import '../assets/styles/Expertise.scss';

function Expertise() {
    return (
    <div className="container" id="expertise">
        <div className="skills-container">
            <h1>Skills</h1>
            <div className="skills-grid">
                <div className="skill">
                    <div className="flex-chips">
                        {skills.map((skill, index) => (
                            <Chip key={index} className='chip' label={skill} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}

export default Expertise;
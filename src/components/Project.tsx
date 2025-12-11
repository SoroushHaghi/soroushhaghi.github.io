import React from "react";
import { projects } from '../portfolio';
import AI_ASSISTANT from '../pics/AI_ASSISTANT.png';
import AI_EYES from '../pics/AI_EYES.png';
import AI_NOSE from '../pics/AI_NOSE.png';
import '../assets/styles/Project.scss';

const images: { [key: string]: string } = {
    "AI_ASSISTANT.png": AI_ASSISTANT,
    "AI_EYES.png": AI_EYES,
    "AI_NOSE.png": AI_NOSE,
};

function Project() {
    return(
    <div className="projects-container" id="projects">
        <h1>Personal Projects</h1>
        <div className="projects-grid">
            {projects.map((project) => (
                <div className="project" key={project.name}>
                    <a href={project.livePreview || project.sourceCode} target="_blank" rel="noreferrer"><img src={images[project.image]} className="zoom" alt="thumbnail" width="100%"/></a>
                    <a href={project.livePreview || project.sourceCode} target="_blank" rel="noreferrer"><h2>{project.name}</h2></a>
                    <p>{project.description}</p>
                </div>
            ))}
        </div>
    </div>
    );
}

export default Project;
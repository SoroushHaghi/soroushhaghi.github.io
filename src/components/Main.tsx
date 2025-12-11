import React from "react";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { about, header } from '../portfolio';
import '../assets/styles/Main.scss';

function Main() {

  return (
    <div className="container">
      <div className="about-section">
        <div className="image-wrapper">
          <img src={`https://github.com/${about.social.github.split('/').pop()}.png`} alt="Avatar" />
        </div>
        <div className="content">
          <div className="social_icons">
            <a href={about.social.github} target="_blank" rel="noreferrer"><GitHubIcon/></a>
            <a href={about.social.linkedin} target="_blank" rel="noreferrer"><LinkedInIcon/></a>
          </div>
          <h1>{about.name}</h1>
          <p>{about.role}</p>

          <div className="mobile_social_icons">
            <a href={about.social.github} target="_blank" rel="noreferrer"><GitHubIcon/></a>
            <a href={about.social.linkedin} target="_blank" rel="noreferrer"><LinkedInIcon/></a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
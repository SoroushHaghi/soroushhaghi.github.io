import React from "react";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { about } from '../portfolio';
import '../assets/styles/Footer.scss'

function Footer() {
  return (
    <footer>
      <div>
        <a href={about.social.github} target="_blank" rel="noreferrer"><GitHubIcon/></a>
        <a href={about.social.linkedin} target="_blank" rel="noreferrer"><LinkedInIcon/></a>
      </div>
      <p>S. Haghi | Quantum Tech & AI Engineer | All rights reserved 2026 ©</p>
    </footer>
  );
}

export default Footer;
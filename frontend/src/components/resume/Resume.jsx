import React from 'react';
import Header from './Header';
import Section from './Section';
import EducationItem from './EducationItem';
import ExperienceItem from './ExperienceItem';
import SkillGroup from './SkillGroup';
import ProjectItem from './ProjectItem';
import CertificationItem from './CertificationItem';
import AwardItem from './AwardItem';

const Resume = ({ data }) => (
  <div className="resume-container font-serif text-black leading-normal">
    {/* Header with name, role, and contact info */}
    <Header {...data.header} />

    {/* Education Section */}
    <Section title="Education">
      {data.education.map((edu, index) => (
        <EducationItem key={index} {...edu} />
      ))}
    </Section>

    {/* Experience Section */}
    <Section title="Experience">
      {data.experience.map((exp, index) => (
        <ExperienceItem key={index} {...exp} />
      ))}
    </Section>

    {/* Technical Skills Section */}
    <Section title="Technical Skills">
      {data.skills.map((skill, index) => (
        <SkillGroup key={index} {...skill} />
      ))}
    </Section>

    {/* Projects Section */}
    <Section title="Projects">
      {data.projects.map((proj, index) => (
        <ProjectItem key={index} {...proj} />
      ))}
    </Section>

    {/* Certifications Section */}
    <Section title="Certifications">
      {data.certifications.map((cert, index) => (
        <CertificationItem key={index} {...cert} />
      ))}
    </Section>

    {/* Awards & Honors Section */}
    <Section title="Awards & Honors">
      {data.awards.map((award, index) => (
        <AwardItem key={index} {...award} />
      ))}
    </Section>
  </div>
);

export default Resume;

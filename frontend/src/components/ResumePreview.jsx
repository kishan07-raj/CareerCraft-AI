import React from 'react';
import { MapPinIcon, EnvelopeIcon, PhoneIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

const ResumePreview = () => {
  // Dummy data for the premium resume template
  const resumeData = {
    personal: {
      name: 'Alexandra Chen',
      title: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      email: 'alexandra.chen@email.com',
      phone: '(555) 123-4567',
      linkedin: 'linkedin.com/in/alexandrachen',
      github: 'github.com/alexandrachen'
    },
    summary: 'Experienced software engineer with 6+ years of expertise in full-stack development, distributed systems, and cloud architecture. Proven track record of leading high-impact projects, mentoring junior developers, and delivering scalable solutions that drive business growth.',
    skills: {
      languages: ['JavaScript', 'TypeScript', 'Python', 'Java', 'Go'],
      frameworks: ['React', 'Node.js', 'Express', 'Django', 'Spring Boot'],
      tools: ['AWS', 'Docker', 'Kubernetes', 'PostgreSQL', 'Redis', 'Git']
    },
    experience: [
      {
        role: 'Senior Software Engineer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        dates: 'Jan 2022 - Present',
        bullets: [
          'Led development of microservices architecture serving 1M+ users, improving system reliability by 40%',
          'Architected and implemented real-time data processing pipeline handling 10TB+ daily data',
          'Mentored 5 junior developers and established coding standards that improved code quality metrics by 35%',
          'Collaborated with cross-functional teams to deliver features that increased user engagement by 25%'
        ]
      },
      {
        role: 'Software Engineer',
        company: 'StartupXYZ',
        location: 'San Francisco, CA',
        dates: 'Jun 2019 - Dec 2021',
        bullets: [
          'Built and maintained RESTful APIs serving 500K+ requests per day with 99.9% uptime',
          'Implemented CI/CD pipelines reducing deployment time from 2 hours to 15 minutes',
          'Developed automated testing suite that increased test coverage from 60% to 95%',
          'Optimized database queries resulting in 50% improvement in application performance'
        ]
      }
    ],
    projects: [
      {
        name: 'Real-time Analytics Dashboard',
        tech: 'React, Node.js, WebSocket, PostgreSQL',
        bullets: [
          'Built real-time dashboard processing 100K+ events per minute with sub-second latency',
          'Implemented WebSocket connections for live data updates across 10K+ concurrent users'
        ]
      },
      {
        name: 'Microservices Migration',
        tech: 'Docker, Kubernetes, AWS ECS, Go',
        bullets: [
          'Led migration of monolithic application to microservices architecture',
          'Reduced infrastructure costs by 30% and improved deployment frequency from weekly to daily'
        ]
      }
    ],
    education: {
      degree: 'Bachelor of Science in Computer Science',
      institution: 'Stanford University',
      year: '2019',
      highlights: 'Summa Cum Laude, Phi Beta Kappa, Dean\'s List (2016-2019)'
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Resume Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8 md:p-12">

            {/* Header Section */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                {resumeData.personal.name}
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-4">
                {resumeData.personal.title}
              </p>
              <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{resumeData.personal.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <EnvelopeIcon className="w-4 h-4" />
                  <span>{resumeData.personal.email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <PhoneIcon className="w-4 h-4" />
                  <span>{resumeData.personal.phone}</span>
                </div>
                <div className="flex items-center gap-1">
                  <GlobeAltIcon className="w-4 h-4" />
                  <span>{resumeData.personal.linkedin}</span>
                </div>
              </div>
            </div>

            {/* Summary Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-900 pb-2">
                PROFESSIONAL SUMMARY
              </h2>
              <p className="text-gray-700 leading-relaxed text-justify">
                {resumeData.summary}
              </p>
            </div>

            {/* Skills Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-gray-900 pb-2">
                SKILLS
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.languages.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Frameworks</h3>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.frameworks.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Tools & Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.tools.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Experience Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-gray-900 pb-2">
                PROFESSIONAL EXPERIENCE
              </h2>
              <div className="space-y-8">
                {resumeData.experience.map((job, index) => (
                  <div key={index}>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{job.role}</h3>
                        <p className="text-lg text-gray-600">{job.company}</p>
                      </div>
                      <div className="text-gray-600 mt-1 md:mt-0">
                        <p className="text-sm">{job.location}</p>
                        <p className="text-sm">{job.dates}</p>
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {job.bullets.map((bullet, bulletIndex) => (
                        <li key={bulletIndex} className="flex items-start">
                          <span className="text-gray-600 mr-2 mt-1">•</span>
                          <span className="text-gray-700 leading-relaxed">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-gray-900 pb-2">
                KEY PROJECTS
              </h2>
              <div className="space-y-6">
                {resumeData.projects.map((project, index) => (
                  <div key={index}>
                    <div className="mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                      <p className="text-sm text-gray-600 italic">{project.tech}</p>
                    </div>
                    <ul className="space-y-1">
                      {project.bullets.map((bullet, bulletIndex) => (
                        <li key={bulletIndex} className="flex items-start">
                          <span className="text-gray-600 mr-2 mt-1">•</span>
                          <span className="text-gray-700 leading-relaxed">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Education Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-gray-900 pb-2">
                EDUCATION
              </h2>
              <div>
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{resumeData.education.degree}</h3>
                    <p className="text-gray-600">{resumeData.education.institution}</p>
                  </div>
                  <p className="text-gray-600 mt-1 md:mt-0">{resumeData.education.year}</p>
                </div>
                <p className="text-gray-700 text-sm italic">{resumeData.education.highlights}</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;

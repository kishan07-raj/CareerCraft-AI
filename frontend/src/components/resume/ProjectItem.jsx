import React from 'react';

const ProjectItem = ({ title, technologies, duration, details, link }) => (
  <div className="entry-item">
    {/* Project title and year on same line */}
    <div className="entry-header">
      <span className="entry-title">{title}</span>
      <span className="entry-date">{duration}</span>
    </div>
    
    {/* Technologies used */}
    {technologies && (
      <p className="text-sm text-gray-700 italic mt-1">
        {technologies}
      </p>
    )}
    
    {/* Project details as bullet points */}
    {details && details.length > 0 && (
      <ul className="list-disc list-outside ml-4 mt-1 text-sm text-gray-800 leading-snug">
        {details.map((detail, index) => (
          <li key={index}>{detail}</li>
        ))}
      </ul>
    )}
    
    {/* Link if available */}
    {link && (
      <p className="text-sm text-gray-600 mt-1">
        <span className="font-semibold">Link:</span> {link}
      </p>
    )}
  </div>
);

export default ProjectItem;

import React from 'react';

const ExperienceItem = ({ company, role, location, duration, details }) => (
  <div className="entry-item">
    {/* Role and date on same line */}
    <div className="entry-header">
      <span className="entry-title">{role}</span>
      <span className="entry-date">{duration}</span>
    </div>
    
    {/* Company and location */}
    <div className="flex justify-between items-baseline">
      <span className="entry-subtitle">{company}</span>
      <span className="text-sm text-gray-700">{location}</span>
    </div>
    
    {/* Experience details as bullet points */}
    {details && details.length > 0 && (
      <ul className="list-disc list-outside ml-4 mt-1 text-sm text-gray-800 leading-snug">
        {details.map((detail, index) => (
          <li key={index}>{detail}</li>
        ))}
      </ul>
    )}
  </div>
);

export default ExperienceItem;

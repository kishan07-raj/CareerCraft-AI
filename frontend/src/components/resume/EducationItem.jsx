import React from 'react';

const EducationItem = ({ institution, degree, location, duration, gpa, details }) => (
  <div className="entry-item">
    {/* Institution and date on same line */}
    <div className="entry-header">
      <span className="entry-title">{institution}</span>
      <span className="entry-date">{duration}</span>
    </div>
    
    {/* Degree and location */}
    <div className="flex justify-between items-baseline">
      <span className="entry-subtitle">{degree}</span>
      <span className="text-sm text-gray-700">{location}</span>
    </div>
    
    {/* GPA if available */}
    {gpa && (
      <p className="text-sm text-gray-700 mt-1">
        <span className="font-semibold">GPA:</span> {gpa}
      </p>
    )}
    
    {/* Additional details as bullet points */}
    {details && details.length > 0 && (
      <ul className="list-disc list-outside ml-4 mt-1 text-sm text-gray-800 leading-snug">
        {details.map((detail, index) => (
          <li key={index}>{detail}</li>
        ))}
      </ul>
    )}
  </div>
);

export default EducationItem;

import React from 'react';

const AwardItem = ({ title, organization, year, description }) => (
  <div className="entry-item">
    {/* Award title and year */}
    <div className="entry-header">
      <span className="entry-title">{title}</span>
      <span className="entry-date">{year}</span>
    </div>
    
    {/* Organization */}
    {organization && (
      <p className="text-sm text-gray-700 italic">
        {organization}
      </p>
    )}
    
    {/* Description */}
    {description && (
      <p className="text-sm text-gray-800 mt-1 leading-snug">
        {description}
      </p>
    )}
  </div>
);

export default AwardItem;

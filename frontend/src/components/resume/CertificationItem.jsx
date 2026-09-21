import React from 'react';

const CertificationItem = ({ name, issuer, date, id }) => (
  <div className="entry-item">
    {/* Certification name and date */}
    <div className="entry-header">
      <span className="entry-title">{name}</span>
      <span className="entry-date">{date}</span>
    </div>
    
    {/* Issuer */}
    {issuer && (
      <p className="text-sm text-gray-700 italic">
        {issuer}
      </p>
    )}
    
    {/* Certification ID if available */}
    {id && (
      <p className="text-sm text-gray-600 mt-1">
        <span className="font-semibold">Credential ID:</span> {id}
      </p>
    )}
  </div>
);

export default CertificationItem;

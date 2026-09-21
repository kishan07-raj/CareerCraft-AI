import React from 'react';

const Header = ({ name, role, email, phone, location, github, linkedin, website }) => (
  <header className="text-center mb-6 section-avoid-break">
    {/* Large centered name - LaTeX style */}
    <h1 className="text-3xl font-serif font-bold tracking-wide text-black mb-2">
      {name}
    </h1>
    
    {/* Role/Title */}
    {role && (
      <p className="text-base font-serif text-gray-800 mb-3">
        {role}
      </p>
    )}
    
    {/* Contact information - compact inline format */}
    <div className="text-sm font-serif text-gray-700 space-x-2">
      {email && <span>{email}</span>}
      {email && phone && <span>|</span>}
      {phone && <span>{phone}</span>}
      {(email || phone) && location && <span>|</span>}
      {location && <span>{location}</span>}
    </div>
    
    {/* Links - GitHub, LinkedIn, Website */}
    <div className="text-sm font-serif text-gray-700 mt-1 space-x-2">
      {github && (
        <span>
          <span className="font-semibold">GitHub:</span> {github}
        </span>
      )}
      {github && linkedin && <span>|</span>}
      {linkedin && (
        <span>
          <span className="font-semibold">LinkedIn:</span> {linkedin}
        </span>
      )}
      {(github || linkedin) && website && <span>|</span>}
      {website && (
        <span>
          <span className="font-semibold">Web:</span> {website}
        </span>
      )}
    </div>
  </header>
);

export default Header;

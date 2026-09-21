import React from 'react';

const Links = ({ github, linkedin, portfolio }) => (
  <div className="mb-6">
    <p className="text-sm">
      {github && <span>GitHub: {github} | </span>}
      {linkedin && <span>LinkedIn: {linkedin} | </span>}
      {portfolio && <span>Portfolio: {portfolio}</span>}
    </p>
  </div>
);

export default Links;

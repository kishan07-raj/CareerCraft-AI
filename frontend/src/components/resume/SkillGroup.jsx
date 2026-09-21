import React from 'react';

const SkillGroup = ({ category, items }) => (
  <div className="mb-2 text-sm leading-snug">
    {/* Category in bold, items inline - LaTeX compact style */}
    <span className="font-semibold">{category}:</span>{' '}
    <span className="text-gray-800">{items}</span>
  </div>
);

export default SkillGroup;

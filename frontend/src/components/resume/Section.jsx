import React from 'react';

const Section = ({ title, children }) => (
  <section className="mb-4 section-avoid-break">
    {/* LaTeX-style section header: left-aligned, small caps, thin border */}
    <h2 className="section-header font-serif">
      {title}
    </h2>
    <div className="font-serif">
      {children}
    </div>
  </section>
);

export default Section;

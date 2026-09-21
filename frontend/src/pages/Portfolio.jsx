import React from 'react';
import Resume from '../components/resume/Resume';
import { resumeData } from '../data/resumeData';

const Portfolio = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8 print:bg-white print:py-0">
      {/* Print button - hidden when printing */}
      <div className="max-w-[8.5in] mx-auto mb-4 px-4 no-print">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-serif font-bold text-gray-800">Portfolio</h1>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-black text-white text-sm font-serif rounded hover:bg-gray-800 transition-colors"
          >
            Print / Save as PDF
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-1 font-serif">
          This page is optimized for printing. Click the button above to save as PDF.
        </p>
      </div>

      {/* Resume Component */}
      <Resume data={resumeData} />
    </div>
  );
};

export default Portfolio;

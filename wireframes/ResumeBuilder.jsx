import React from 'react';

function ResumeBuilder() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-4">
        <h1 className="text-2xl font-bold">Resume Builder</h1>
      </header>
      <main className="p-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Build Your Resume</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">Personal Information</label>
              <input type="text" className="w-full px-3 py-2 border rounded-lg mb-4" placeholder="Full Name" />
              <input type="email" className="w-full px-3 py-2 border rounded-lg mb-4" placeholder="Email" />
              <input type="text" className="w-full px-3 py-2 border rounded-lg" placeholder="Phone" />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Skills</label>
              <textarea className="w-full px-3 py-2 border rounded-lg" rows="4" placeholder="List your skills"></textarea>
            </div>
          </div>
          <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Generate Resume</button>
        </div>
      </main>
    </div>
  );
}

export default ResumeBuilder;

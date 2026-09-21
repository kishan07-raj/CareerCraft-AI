 import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import Breadcrumbs from '../components/Breadcrumbs';

const CareerVisualizer = () => {
  const [selectedPath, setSelectedPath] = useState('software-engineer');

  const careerPaths = {
    'software-engineer': {
      name: 'Software Engineer',
      data: [
        { year: 1, salary: 75000, satisfaction: 7.5 },
        { year: 2, salary: 85000, satisfaction: 7.8 },
        { year: 3, salary: 95000, satisfaction: 8.0 },
        { year: 4, salary: 110000, satisfaction: 8.2 },
        { year: 5, salary: 130000, satisfaction: 8.3 }
      ],
      skills: [
        { skill: 'Programming', value: 90 },
        { skill: 'Problem Solving', value: 85 },
        { skill: 'Teamwork', value: 80 },
        { skill: 'Communication', value: 75 },
        { skill: 'Leadership', value: 70 }
      ]
    },
    'data-scientist': {
      name: 'Data Scientist',
      data: [
        { year: 1, salary: 80000, satisfaction: 8.0 },
        { year: 2, salary: 95000, satisfaction: 8.2 },
        { year: 3, salary: 110000, satisfaction: 8.4 },
        { year: 4, salary: 130000, satisfaction: 8.5 },
        { year: 5, salary: 150000, satisfaction: 8.6 }
      ],
      skills: [
        { skill: 'Statistics', value: 95 },
        { skill: 'Machine Learning', value: 90 },
        { skill: 'Python', value: 85 },
        { skill: 'Data Visualization', value: 80 },
        { skill: 'SQL', value: 75 }
      ]
    },
    'ux-designer': {
      name: 'UX Designer',
      data: [
        { year: 1, salary: 65000, satisfaction: 8.5 },
        { year: 2, salary: 75000, satisfaction: 8.7 },
        { year: 3, salary: 85000, satisfaction: 8.8 },
        { year: 4, salary: 95000, satisfaction: 8.9 },
        { year: 5, salary: 110000, satisfaction: 9.0 }
      ],
      skills: [
        { skill: 'User Research', value: 90 },
        { skill: 'Prototyping', value: 85 },
        { skill: 'Design Systems', value: 80 },
        { skill: 'Usability Testing', value: 75 },
        { skill: 'Visual Design', value: 85 }
      ]
    }
  };

  const currentPath = careerPaths[selectedPath];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold text-gray-900 mb-8"
        >
          Career Visualizer
        </motion.h1>

        <div className="mb-8">
          <label htmlFor="career-path" className="block text-sm font-medium text-gray-700 mb-2">
            {"Select Career Path"}
          </label>
          <select
            id="career-path"
            value={selectedPath}
            onChange={(e) => setSelectedPath(e.target.value)}
            className="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {Object.entries(careerPaths).map(([key, path]) => (
              <option key={key} value={key}>{path.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Salary Progression</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={currentPath.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" label={{ value: 'Years of Experience', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Salary ($)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Salary']} />
                <Line type="monotone" dataKey="salary" stroke="#3b82f6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Job Satisfaction</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={currentPath.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" label={{ value: 'Years of Experience', position: 'insideBottom', offset: -5 }} />
                <YAxis domain={[0, 10]} label={{ value: 'Satisfaction (1-10)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => [`${value}/10`, 'Satisfaction']} />
                <Line type="monotone" dataKey="satisfaction" stroke="#10b981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Required Skills Profile</h3>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={currentPath.skills}>
              <PolarGrid />
              <PolarAngleAxis dataKey="skill" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Proficiency" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-white p-6 rounded-lg shadow-md"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Career Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">${currentPath.data[currentPath.data.length - 1].salary.toLocaleString()}</div>
              <div className="text-gray-600">5-Year Salary Potential</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{currentPath.data[currentPath.data.length - 1].satisfaction}/10</div>
              <div className="text-gray-600">Peak Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{currentPath.skills.length}</div>
              <div className="text-gray-600">Key Skills to Master</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CareerVisualizer;

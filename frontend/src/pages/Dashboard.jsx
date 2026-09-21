import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { recommendationAPI, resumeAPI, jobAPI } from '../utils/api';
import Breadcrumbs from '../components/Breadcrumbs';
import { CodeBracketIcon, DocumentTextIcon, BriefcaseIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalJobs: 0,
    matchedJobs: 0,
    skillsCount: 0,
    resumeScore: 0,
    codingScore: 0,
    correctAnswers: 0,
    totalAttempts: 0
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch career insights
      try {
        const insightsResponse = await recommendationAPI.getCareerInsights();
        const insights = insightsResponse.data;
        
        setStats(prev => ({
          ...prev,
          skillsCount: insights.stats?.skillsCount || 0,
          resumeScore: insights.profileStrength || 0,
          totalJobs: insights.stats?.totalJobsAvailable || 0
        }));
      } catch (error) {
        console.log('Career insights not available yet');
      }

      // Fetch job recommendations
      try {
        const jobsResponse = await recommendationAPI.getJobRecommendations();
        setRecommendations(jobsResponse.data.slice(0, 5));
        setStats(prev => ({
          ...prev,
          matchedJobs: jobsResponse.data.length
        }));
      } catch (error) {
        console.log('Job recommendations not available yet');
      }

      // Fetch user applications
      try {
        const applicationsResponse = await jobAPI.getUserApplications();
        setStats(prev => ({
          ...prev,
          totalApplications: applicationsResponse.data.length
        }));
      } catch (error) {
        console.log('Applications not available yet');
      }

      // Mock chart data (could be replaced with real data)
      setChartData([
        { month: 'Jan', applications: 4 },
        { month: 'Feb', applications: 7 },
        { month: 'Mar', applications: 12 },
        { month: 'Apr', applications: 15 },
        { month: 'May', applications: 20 },
        { month: 'Jun', applications: 25 }
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-2">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-lg text-gray-600">Here's your career progress overview</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resume Score</p>
                <p className="text-3xl font-bold text-blue-600">{stats.resumeScore}%</p>
              </div>
              <DocumentTextIcon className="w-10 h-10 text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Matched Jobs</p>
                <p className="text-3xl font-bold text-green-600">{stats.matchedJobs}</p>
              </div>
              <BriefcaseIcon className="w-10 h-10 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
            className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Skills</p>
                <p className="text-3xl font-bold text-purple-600">{stats.skillsCount}</p>
              </div>
              <AcademicCapIcon className="w-10 h-10 text-purple-500" />
            </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
            className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Jobs</p>
                <p className="text-3xl font-bold text-orange-600">{stats.totalJobs}</p>
              </div>
              <CodeBracketIcon className="w-10 h-10 text-orange-500" />
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <button
            onClick={() => navigate('/resume-builder')}
            className="flex items-center p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:-translate-y-0.5"
          >
            <DocumentTextIcon className="w-6 h-6 mr-3" />
            Resume Builder
          </button>
          <button
            onClick={() => navigate('/job-matching')}
            className="flex items-center p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 hover:-translate-y-0.5"
          >
            <BriefcaseIcon className="w-6 h-6 mr-3" />
            Find Jobs
          </button>
          <button
            onClick={() => navigate('/skills')}
            className="flex items-center p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:-translate-y-0.5"
          >
            <AcademicCapIcon className="w-6 h-6 mr-3" />
            Skills
          </button>
          <button
            onClick={() => navigate('/coding-assessment')}
            className="flex items-center p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 hover:-translate-y-0.5"
          >
            <CodeBracketIcon className="w-6 h-6 mr-3" />
            Coding Assessment
          </button>
        </motion.div>

        {/* Job Recommendations */}
        {recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 mb-8"
          >
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Recommended Jobs</h3>
              <p className="text-sm text-gray-600">Based on your skills and profile</p>
            </div>
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div>
                    <h4 className="font-medium text-gray-900">{rec.job?.title}</h4>
                    <p className="text-sm text-gray-600">{rec.job?.company} • {rec.job?.location}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      rec.matchScore >= 70 ? 'bg-green-100 text-green-800' :
                      rec.matchScore >= 50 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {rec.matchScore}% Match
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Application Trends Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Application Trends</h3>
              <p className="text-sm text-gray-600">Your job application activity over time</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Applications</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                }}
              />
              <Line
                type="monotone"
                dataKey="applications"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 2, fill: 'white' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;

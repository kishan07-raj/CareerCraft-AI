import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Breadcrumbs from '../components/Breadcrumbs';
import JobSkeleton from '../components/JobSkeleton';
import { jobAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { BriefcaseIcon, MapPinIcon, CurrencyDollarIcon, ClockIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const JobMatching = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    skills: '',
    location: '',
    salary: '',
    type: ''
  });
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [applyingJob, setApplyingJob] = useState(null);

  const fetchJobs = useCallback(async (page = 1, filterParams = {}) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        ...filters,
        ...filterParams
      };
      const response = await jobAPI.getAllJobs(params);
      setJobs(response.data.jobs);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to fetch jobs. Using cached data.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchJobs(1);
  }, [fetchJobs]);

  const handleFilterChange = (e) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value };
    setFilters(newFilters);
    fetchJobs(1, newFilters); // Server-side search
  };

  const handleApply = async (jobId) => {
    if (!user) {
      toast.error('Please log in to apply');
      return;
    }
    try {
      setApplyingJob(jobId);
      await jobAPI.applyForJob(jobId);
      toast.success('Application submitted!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply');
    } finally {
      setApplyingJob(null);
    }
  };

  const getMatchColor = (score) => {
    if (!score) return 'text-gray-600';
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handlePageChange = (newPage) => {
    fetchJobs(newPage);
  };

  const skeletonJobs = Array(6).fill(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-2">
            Find Your Dream Job
          </h1>
          <p className="text-lg text-gray-600">Discover real job opportunities matching your skills</p>
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills/Keywords</label>
              <input type="text" name="skills" value={filters.skills} onChange={handleFilterChange} placeholder="React, Python..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input type="text" name="location" value={filters.location} onChange={handleFilterChange} placeholder="e.g., Remote, USA" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
              <select name="salary" value={filters.salary} onChange={handleFilterChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Any</option>
                <option value="50k">$50k+</option>
                <option value="80k">$80k+</option>
                <option value="100k">$100k+</option>
                <option value="120k">$120k+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select name="type" value={filters.type} onChange={handleFilterChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Any</option>
                <option value="FULL_TIME">Full-time</option>
                <option value="PART_TIME">Part-time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Jobs */}
        <div className="space-y-4 mb-8">
          {loading ? (
            skeletonJobs.map((_, index) => (
              <JobSkeleton key={index} />
            ))
          ) : jobs.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-white/50 rounded-2xl p-12 border-2 border-dashed border-gray-200">
              <BriefcaseIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search filters or check back later</p>
              <button onClick={() => fetchJobs(1)} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Clear Filters
              </button>
            </motion.div>
          ) : (
            jobs.map((job, index) => (
              <motion.div key={job.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all hover:-translate-y-1 group">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors pr-4">{job.title}</h3>
                        {job.matchScore && (
                          <span className={`text-sm font-bold px-3 py-1 rounded-full ${getMatchColor(job.matchScore)}`}>
                            {job.matchScore}%
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                        <span className="flex items-center">
                          <BriefcaseIcon className="w-4 h-4 mr-1" />
                          {job.company}
                        </span>
                        <span className="flex items-center">
                          <MapPinIcon className="w-4 h-4 mr-1" />
                          {job.location}
                        </span>
                        <span className="flex items-center">
                          <CurrencyDollarIcon className="w-4 h-4 mr-1" />
                          {job.salary}
                        </span>
                        <span className="flex items-center">
                          <ClockIcon className="w-4 h-4 mr-1" />
                          {job.type}
                        </span>
                      </div>
                      {job.requiredSkills && job.requiredSkills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.requiredSkills.slice(0, 5).map((skill, skillIndex) => (
                            <span key={skillIndex} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                              {skill}
                            </span>
                          ))}
                          {job.requiredSkills.length > 5 && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{job.requiredSkills.length - 5} more
                            </span>
                          )}
                        </div>
                      )}
                      <p className="text-gray-700 leading-relaxed line-clamp-3">{job.description}</p>
                      <p className="text-gray-500 text-xs mt-2">Posted {job.postedDate}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      {job.applyLink && job.applyLink !== '#' && (
                        <a href={job.applyLink} target="_blank" rel="noopener noreferrer" className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all text-center">
                          Apply Now →
                        </a>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleApply(job.id)}
                        disabled={applyingJob === job.id}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-lg hover:shadow-blue-500/25 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {applyingJob === job.id ? 'Applying...' : 'Save Job'}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/20">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="p-2 text-gray-500 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-700">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} jobs)
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="p-2 text-gray-500 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default JobMatching;


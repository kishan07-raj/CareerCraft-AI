import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { skillAPI, recommendationAPI } from '../utils/api';
import Breadcrumbs from '../components/Breadcrumbs';
import { PlusIcon, PencilIcon, TrashIcon, ArrowPathIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Skills = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [editingSkill, setEditingSkill] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [gapAnalysis, setGapAnalysis] = useState(null);
  const [skillRecommendations, setSkillRecommendations] = useState([]);

  useEffect(() => {
    if (user) {
      fetchSkills();
      fetchGapAnalysis();
      fetchSkillRecommendations();
    } else {
      setSkills(mockSkills);
      setLoading(false);
    }
  }, [user]);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const response = await skillAPI.getMySkills();
      if (response.data && response.data.length > 0) {
        setSkills(response.data);
      } else {
        setSkills(mockSkills);
      }
    } catch (error) {
      console.log('Using mock skills');
      setSkills(mockSkills);
    } finally {
      setLoading(false);
    }
  };

  const fetchGapAnalysis = async () => {
    try {
      const response = await skillAPI.getGapAnalysis();
      setGapAnalysis(response.data);
    } catch (error) {
      console.log('Gap analysis not available');
    }
  };

  const fetchSkillRecommendations = async () => {
    try {
      const response = await recommendationAPI.getSkillRecommendations();
      setSkillRecommendations(response.data);
    } catch (error) {
      console.log('Skill recommendations not available');
    }
  };

  const addSkill = async () => {
    if (!newSkill.trim()) return;

    if (!user) {
      // If not logged in, use local state
      const skill = { id: Date.now(), name: newSkill, level: 'Beginner' };
      setSkills([...skills, skill]);
      setNewSkill('');
      return;
    }

    try {
      setSaving(true);
      await skillAPI.addSkill({ name: newSkill, level: 'Beginner' });
      toast.success('Skill added successfully!');
      fetchSkills();
      fetchGapAnalysis();
      fetchSkillRecommendations();
      setNewSkill('');
    } catch (error) {
      console.error('Error adding skill:', error);
      toast.error('Failed to add skill');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (skill) => {
    setEditingSkill(skill.id);
    setEditValue(skill.name);
  };

  const saveEdit = async () => {
    if (!editValue.trim()) return;

    if (!user) {
      setSkills(skills.map(skill =>
        skill.id === editingSkill ? { ...skill, name: editValue } : skill
      ));
      setEditingSkill(null);
      setEditValue('');
      return;
    }

    try {
      await skillAPI.updateSkill(editingSkill, { name: editValue });
      toast.success('Skill updated successfully!');
      fetchSkills();
      setEditingSkill(null);
      setEditValue('');
    } catch (error) {
      console.error('Error updating skill:', error);
      toast.error('Failed to update skill');
    }
  };

  const deleteSkill = async (id) => {
    if (!user) {
      setSkills(skills.filter(skill => skill.id !== id));
      return;
    }

    try {
      await skillAPI.deleteSkill(id);
      toast.success('Skill deleted successfully!');
      fetchSkills();
      fetchGapAnalysis();
    } catch (error) {
      console.error('Error deleting skill:', error);
      toast.error('Failed to delete skill');
    }
  };

  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'expert':
        return 'bg-purple-100 text-purple-800';
      case 'advanced':
        return 'bg-blue-100 text-blue-800';
      case 'intermediate':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const mockSkills = [
    { id: 1, name: 'JavaScript', level: 'Advanced' },
    { id: 2, name: 'React', level: 'Intermediate' },
    { id: 3, name: 'Node.js', level: 'Beginner' }
  ];

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
            My Skills
          </h1>
          <p className="text-lg text-gray-600">Manage and update your professional skills</p>
        </motion.div>

        {/* Skill Gap Analysis */}
        {gapAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-100 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Skill Gap Analysis</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Gap Score:</span>
                <span className={`text-2xl font-bold ${
                  gapAnalysis.gapScore >= 70 ? 'text-green-600' :
                  gapAnalysis.gapScore >= 50 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {gapAnalysis.gapScore || 0}%
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Your Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {gapAnalysis.userSkills?.slice(0, 5).map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">In-Demand Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {gapAnalysis.demandSkills?.slice(0, 5).map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Skill Gaps</h4>
                <div className="flex flex-wrap gap-2">
                  {gapAnalysis.gaps?.slice(0, 5).map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Skill Recommendations */}
        {skillRecommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recommended Skills to Learn</h3>
              <ChartBarIcon className="w-5 h-5 text-gray-400" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {skillRecommendations.slice(0, 6).map((rec, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{rec.skill}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                      rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {rec.priority} demand
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{rec.demand} jobs require this skill</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Add New Skill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 mb-8"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Add New Skill</h3>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              placeholder="Enter skill name..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={addSkill}
              disabled={saving || !newSkill.trim()}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {saving ? (
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
              ) : (
                <PlusIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </motion.div>

        {/* Skills List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Skills ({skills.length})</h3>
          
          {skills.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No skills added yet. Add your first skill above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills.map((skill) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {skill.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      {editingSkill === skill.id ? (
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                          className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                      ) : (
                        <div>
                          <h4 className="font-medium text-gray-900">{skill.name}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getLevelColor(skill.level)}`}>
                            {skill.level || 'Beginner'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {editingSkill === skill.id ? (
                      <button
                        onClick={saveEdit}
                        className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => startEdit(skill)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteSkill(skill.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Skills;

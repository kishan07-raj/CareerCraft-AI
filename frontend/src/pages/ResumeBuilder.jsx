import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Resume from '../components/resume/Resume';
import { useAuth } from '../context/AuthContext';
import { resumeAPI } from '../utils/api';
import {
  DocumentTextIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
  UserIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  StarIcon,
  XMarkIcon,
  ChartBarIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const ResumeBuilder = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState('personal');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const resumeRef = useRef(null);

  const getInitialResumeData = () => {
    return {
      personal: {
        name: '',
        email: '',
        phone: '',
        location: '',
        summary: ''
      },
      experience: [],
      education: [],
      skills: []
    };
  };

  const [resumeData, setResumeData] = useState(getInitialResumeData);

  // Fetch existing resume from backend
  useEffect(() => {
    if (user) {
      fetchResume();
    }
  }, [user]);

  const fetchResume = async () => {
    try {
      const response = await resumeAPI.getResume();
      if (response.data && Object.keys(response.data).length > 0) {
        setResumeData(response.data);
      }
    } catch (error) {
      console.log('No existing resume found');
    }
  };

  const saveResume = async () => {
    if (!user) {
      toast.error('Please log in to save your resume');
      navigate('/login?redirect=/resume-builder');
      return;
    }

    try {
      setIsSaving(true);
      await resumeAPI.saveResume(resumeData);
      toast.success('Resume saved successfully!');
      // Fetch analysis after saving
      analyzeResume();
    } catch (error) {
      console.error('Error saving resume:', error);
      toast.error('Failed to save resume. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const analyzeResume = async () => {
    if (!user) return;

    try {
      setIsAnalyzing(true);
      const response = await resumeAPI.getAnalysis();
      setAnalysis(response.data);
    } catch (error) {
      console.log('Could not analyze resume:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const updateResumeData = (section, data) => {
    setResumeData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const handlePreview = () => {
    setIsPreviewOpen(true);
  };

  const generateResumePDF = async () => {
    try {
      // Create a temporary div for PDF generation
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      tempDiv.style.width = '800px';
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.padding = '40px';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      tempDiv.innerHTML = `
        <div style="max-width: 700px; margin: 0 auto;">
          <!-- Resume Header -->
          <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #000; padding-bottom: 20px;">
            <h1 style="font-size: 36px; font-weight: bold; color: #000; margin: 0 0 10px 0;">${resumeData.personal.name || 'Your Name'}</h1>
            <div style="display: flex; justify-content: center; gap: 30px; color: #666; font-size: 14px;">
              <span>${resumeData.personal.email || 'email@example.com'}</span>
              <span>${resumeData.personal.phone || 'Phone'}</span>
              <span>${resumeData.personal.location || 'Location'}</span>
            </div>
          </div>

          <!-- Summary -->
          ${resumeData.personal.summary ? `
          <div style="margin-bottom: 30px;">
            <h2 style="font-size: 24px; font-weight: bold; color: #000; margin: 0 0 15px 0; border-bottom: 2px solid #000; padding-bottom: 5px;">PROFESSIONAL SUMMARY</h2>
            <p style="color: #333; line-height: 1.6; margin: 0;">${resumeData.personal.summary}</p>
          </div>
          ` : ''}

          <!-- Experience -->
          ${resumeData.experience && resumeData.experience.length > 0 ? `
          <div style="margin-bottom: 30px;">
            <h2 style="font-size: 24px; font-weight: bold; color: #000; margin: 0 0 15px 0; border-bottom: 2px solid #000; padding-bottom: 5px;">WORK EXPERIENCE</h2>
            <div style="display: flex; flex-direction: column; gap: 25px;">
              ${resumeData.experience.map(exp => `
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                    <div>
                      <h3 style="font-size: 20px; font-weight: bold; color: #000; margin: 0;">${exp.title || 'Job Title'}</h3>
                      <p style="font-size: 18px; color: #666; margin: 0;">${exp.company || 'Company'}</p>
                    </div>
                    <p style="color: #666; margin: 0;">${exp.startDate || 'Start'} - ${exp.endDate || 'End'}</p>
                  </div>
                  <p style="color: #333; line-height: 1.6; margin: 0;">${exp.description || ''}</p>
                </div>
              `).join('')}
            </div>
          </div>
          ` : ''}

          <!-- Education -->
          ${resumeData.education && resumeData.education.length > 0 ? `
          <div style="margin-bottom: 30px;">
            <h2 style="font-size: 24px; font-weight: bold; color: #000; margin: 0 0 15px 0; border-bottom: 2px solid #000; padding-bottom: 5px;">EDUCATION</h2>
            <div style="display: flex; flex-direction: column; gap: 15px;">
              ${resumeData.education.map(edu => `
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <div>
                    <h3 style="font-size: 18px; font-weight: bold; color: #000; margin: 0;">${edu.degree || 'Degree'}</h3>
                    <p style="color: #666; margin: 0;">${edu.school || 'School'}, ${edu.location || 'Location'}</p>
                  </div>
                  <p style="color: #666; margin: 0;">${edu.graduationYear || 'Year'}</p>
                </div>
              `).join('')}
            </div>
          </div>
          ` : ''}

          <!-- Skills -->
          ${resumeData.skills && resumeData.skills.length > 0 ? `
          <div style="margin-bottom: 30px;">
            <h2 style="font-size: 24px; font-weight: bold; color: #000; margin: 0 0 15px 0; border-bottom: 2px solid #000; padding-bottom: 5px;">SKILLS</h2>
            <div style="display: flex; flex-wrap: wrap; gap: 10px;">
              ${resumeData.skills.map(skill => `
                <span style="background-color: #f3f4f6; color: #374151; padding: 6px 12px; border-radius: 20px; font-size: 14px;">${skill}</span>
              `).join('')}
            </div>
          </div>
          ` : ''}
        </div>
      `;

      document.body.appendChild(tempDiv);

      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 800,
        height: tempDiv.scrollHeight
      });

      document.body.removeChild(tempDiv);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${resumeData.personal.name.replace(/\s+/g, '_') || 'resume'}_resume.pdf`);
      toast.success('Resume PDF downloaded!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Error generating PDF. Please try again.');
    }
  };

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: UserIcon },
    { id: 'experience', label: 'Experience', icon: BriefcaseIcon },
    { id: 'education', label: 'Education', icon: AcademicCapIcon },
    { id: 'skills', label: 'Skills', icon: StarIcon },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resume Builder</h1>
          <p className="text-gray-600 mt-1">Create a professional resume that stands out</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" onClick={analyzeResume} disabled={isAnalyzing}>
            {isAnalyzing ? (
              <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <ChartBarIcon className="w-5 h-5 mr-2" />
            )}
            Analyze
          </Button>
          <Button variant="secondary" onClick={handlePreview}>
            <EyeIcon className="w-5 h-5 mr-2" />
            Preview
          </Button>
          <Button variant="primary" onClick={saveResume} disabled={isSaving}>
            {isSaving ? (
              <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <DocumentTextIcon className="w-5 h-5 mr-2" />
            )}
            Save
          </Button>
        </div>
      </motion.div>

      {/* Analysis Results */}
      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Resume Analysis</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">ATS Score:</span>
              <span className={`text-2xl font-bold ${
                analysis.atsScore?.score >= 70 ? 'text-green-600' :
                analysis.atsScore?.score >= 50 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {analysis.atsScore?.score || 0}%
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Keywords Found</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.keywords?.slice(0, 10).map((keyword, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Score Factors</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Format:</span>
                  <span className="font-medium">{analysis.atsScore?.factors?.format || 0}/20</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Content:</span>
                  <span className="font-medium">{analysis.atsScore?.factors?.content || 0}/30</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Keywords:</span>
                  <span className="font-medium">{analysis.atsScore?.factors?.keywords || 0}/30</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Structure:</span>
                  <span className="font-medium">{analysis.atsScore?.factors?.structure || 0}/20</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Suggestions</h4>
              <ul className="space-y-1 text-sm">
                {analysis.suggestions?.slice(0, 3).map((suggestion, index) => (
                  <li key={index} className="text-gray-600 flex items-start">
                    <span className="text-yellow-500 mr-2">•</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Section Navigation */}
          <Card>
            <CardContent className="p-4">
              <div className="flex space-x-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeSection === section.id
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <section.icon className="w-4 h-4 mr-2" />
                    {section.label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          {activeSection === 'personal' && (
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={resumeData.personal.name}
                      onChange={(e) => updateResumeData('personal', { ...resumeData.personal, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={resumeData.personal.email}
                      onChange={(e) => updateResumeData('personal', { ...resumeData.personal, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={resumeData.personal.phone}
                      onChange={(e) => updateResumeData('personal', { ...resumeData.personal, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={resumeData.personal.location}
                      onChange={(e) => updateResumeData('personal', { ...resumeData.personal, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="San Francisco, CA"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Professional Summary</label>
                  <textarea
                    rows={4}
                    value={resumeData.personal.summary}
                    onChange={(e) => updateResumeData('personal', { ...resumeData.personal, summary: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Write a brief summary of your professional background..."
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Experience Section */}
          {activeSection === 'experience' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Work Experience</CardTitle>
                  <Button size="sm" onClick={() => {
                    const newExp = {
                      id: Date.now(),
                      title: '',
                      company: '',
                      location: '',
                      startDate: '',
                      endDate: '',
                      description: ''
                    };
                    updateResumeData('experience', [...(resumeData.experience || []), newExp]);
                  }}>
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Experience
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {(resumeData.experience || []).map((exp, index) => (
                  <div key={exp.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                        <input
                          type="text"
                          value={exp.title}
                          onChange={(e) => {
                            const newExp = [...resumeData.experience];
                            newExp[index].title = e.target.value;
                            updateResumeData('experience', newExp);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Software Engineer"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => {
                            const newExp = [...resumeData.experience];
                            newExp[index].company = e.target.value;
                            updateResumeData('experience', newExp);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="TechCorp Inc."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                          type="text"
                          value={exp.startDate}
                          onChange={(e) => {
                            const newExp = [...resumeData.experience];
                            newExp[index].startDate = e.target.value;
                            updateResumeData('experience', newExp);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Jan 2022"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input
                          type="text"
                          value={exp.endDate}
                          onChange={(e) => {
                            const newExp = [...resumeData.experience];
                            newExp[index].endDate = e.target.value;
                            updateResumeData('experience', newExp);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Present"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        rows={3}
                        value={exp.description}
                        onChange={(e) => {
                          const newExp = [...resumeData.experience];
                          newExp[index].description = e.target.value;
                          updateResumeData('experience', newExp);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Describe your responsibilities and achievements..."
                      />
                    </div>
                  </div>
                ))}
                {(resumeData.experience || []).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No work experience added yet.</p>
                    <Button size="sm" className="mt-2" onClick={() => {
                      const newExp = {
                        id: Date.now(),
                        title: '',
                        company: '',
                        location: '',
                        startDate: '',
                        endDate: '',
                        description: ''
                      };
                      updateResumeData('experience', [newExp]);
                    }}>
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Add Experience
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Education Section */}
          {activeSection === 'education' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Education</CardTitle>
                  <Button size="sm" onClick={() => {
                    const newEdu = {
                      id: Date.now(),
                      degree: '',
                      school: '',
                      location: '',
                      graduationYear: ''
                    };
                    updateResumeData('education', [...(resumeData.education || []), newEdu]);
                  }}>
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Education
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {(resumeData.education || []).map((edu, index) => (
                  <div key={edu.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => {
                            const newEdu = [...resumeData.education];
                            newEdu[index].degree = e.target.value;
                            updateResumeData('education', newEdu);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Bachelor of Science in Computer Science"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">School</label>
                        <input
                          type="text"
                          value={edu.school}
                          onChange={(e) => {
                            const newEdu = [...resumeData.education];
                            newEdu[index].school = e.target.value;
                            updateResumeData('education', newEdu);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="University of California"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input
                          type="text"
                          value={edu.location}
                          onChange={(e) => {
                            const newEdu = [...resumeData.education];
                            newEdu[index].location = e.target.value;
                            updateResumeData('education', newEdu);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Berkeley, CA"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
                        <input
                          type="text"
                          value={edu.graduationYear}
                          onChange={(e) => {
                            const newEdu = [...resumeData.education];
                            newEdu[index].graduationYear = e.target.value;
                            updateResumeData('education', newEdu);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="2020"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {(resumeData.education || []).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No education added yet.</p>
                    <Button size="sm" className="mt-2" onClick={() => {
                      const newEdu = {
                        id: Date.now(),
                        degree: '',
                        school: '',
                        location: '',
                        graduationYear: ''
                      };
                      updateResumeData('education', [newEdu]);
                    }}>
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Add Education
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Skills Section */}
          {activeSection === 'skills' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Skills</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(resumeData.skills || []).map((skill, index) => (
                      <Badge key={index} variant="primary" className="px-3 py-1 flex items-center">
                        {skill}
                        <button
                          onClick={() => {
                            const newSkills = resumeData.skills.filter((_, i) => i !== index);
                            updateResumeData('skills', newSkills);
                          }}
                          className="ml-2 text-xs"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="newSkill"
                      placeholder="Add a skill..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const skill = e.target.value.trim();
                          if (skill && !resumeData.skills.includes(skill)) {
                            updateResumeData('skills', [...(resumeData.skills || []), skill]);
                            e.target.value = '';
                          }
                        }
                      }}
                    />
                    <Button
                      onClick={() => {
                        const input = document.getElementById('newSkill');
                        const skill = input.value.trim();
                        if (skill && !resumeData.skills.includes(skill)) {
                          updateResumeData('skills', [...(resumeData.skills || []), skill]);
                          input.value = '';
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-600">
                    Add skills that are relevant to your target jobs. The system will analyze your resume and provide recommendations.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Preview Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <EyeIcon className="w-5 h-5 mr-2" />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="scale-50 origin-top transform -translate-y-8">
<Resume data={{
                  header: {
                    name: resumeData.personal.name || 'Your Name',
                    role: resumeData.personal.summary || '',
                    email: resumeData.personal.email || 'email@example.com',
                    phone: resumeData.personal.phone || 'Phone',
                    location: resumeData.personal.location || 'Location'
                  },
                  education: resumeData.education || [],
                  experience: resumeData.experience || [],
                  skills: resumeData.skills ? [{ title: 'Technical Skills', items: resumeData.skills }] : [],
                  projects: [],
                  certifications: [],
                  awards: []
                }} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Resume Preview</h2>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div ref={resumeRef}>
<Resume data={{
                  header: {
                    name: resumeData.personal.name || 'Your Name',
                    role: resumeData.personal.summary || '',
                    email: resumeData.personal.email || 'email@example.com',
                    phone: resumeData.personal.phone || 'Phone',
                    location: resumeData.personal.location || 'Location'
                  },
                  education: resumeData.education || [],
                  experience: resumeData.experience || [],
                  skills: resumeData.skills ? [{ title: 'Technical Skills', items: resumeData.skills }] : [],
                  projects: [],
                  certifications: [],
                  awards: []
                }} />
              </div>
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
              <Button variant="secondary" onClick={() => setIsPreviewOpen(false)}>
                Close
              </Button>
              <Button variant="primary" onClick={generateResumePDF}>
                <DocumentTextIcon className="w-5 h-5 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeBuilder;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeBracketIcon, CheckCircleIcon, XCircleIcon, SparklesIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import Breadcrumbs from '../components/Breadcrumbs';

const CodingAssessment = () => {
  const [tests, setTests] = useState([]);
  const [currentTest, setCurrentTest] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('JavaScript');
  const [aiGuidance, setAiGuidance] = useState('');

  const languages = ['JavaScript', 'HTML', 'CSS', 'React'];

  useEffect(() => {
    fetchTests();
  }, [selectedLanguage]);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8000/api/coding/tests?language=${selectedLanguage}`);
      setTests(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tests:', error);
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async () => {
    if (!selectedAnswer) return;

    try {
      const response = await axios.post('http://localhost:8000/api/coding/submit-answer', {
        testId: tests[currentTest]._id,
        userAnswer: selectedAnswer,
        language: selectedLanguage
      });

      if (response.data.isCorrect) {
        setScore(score + 1);
      }

      nextQuestion();
    } catch (error) {
      console.error('Error submitting answer:', error);
      nextQuestion();
    }
  };

  const nextQuestion = () => {
    if (currentTest < tests.length - 1) {
      setCurrentTest(currentTest + 1);
      setSelectedAnswer('');
    } else {
      setCompleted(true);
      generateAIGuidance();
    }
  };

  const generateAIGuidance = () => {
    const percentage = Math.round((score / tests.length) * 100);
    let guidance = '';

    if (percentage >= 80) {
      guidance = `Excellent performance! You have strong ${selectedLanguage} skills. Focus on advanced topics like asynchronous programming and design patterns.`;
    } else if (percentage >= 60) {
      guidance = `Good job! You have solid ${selectedLanguage} fundamentals. Work on improving your understanding of ${selectedLanguage === 'JavaScript' ? 'arrays, objects, and functions' : selectedLanguage === 'React' ? 'hooks and state management' : 'advanced selectors and layouts'}.`;
    } else {
      guidance = `Keep practicing! Focus on ${selectedLanguage} basics like ${selectedLanguage === 'JavaScript' ? 'variables, loops, and conditionals' : selectedLanguage === 'React' ? 'components and props' : 'selectors and box model'}. Consider reviewing documentation and doing more exercises.`;
    }

    setAiGuidance(guidance);
  };

  const resetAssessment = () => {
    setCurrentTest(0);
    setSelectedAnswer('');
    setScore(0);
    setCompleted(false);
    setAiGuidance('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (completed) {
    const percentage = Math.round((score / tests.length) * 100);
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumbs />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 text-center"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="w-10 h-10 text-white" />
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">Assessment Complete!</h2>

            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-6 mb-6">
              <div className="text-6xl font-bold mb-2">{percentage}%</div>
              <div className="text-xl">Score: {score}/{tests.length} correct answers</div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
              <div className="flex items-center mb-3">
                <SparklesIcon className="w-6 h-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-blue-900">AI Guidance</h3>
              </div>
              <p className="text-blue-800">{aiGuidance}</p>
            </div>

            <button
              onClick={resetAssessment}
              className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
            >
              Take Another Assessment
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (tests.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center">
        <div className="text-center">
          <CodeBracketIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Tests Available</h2>
          <p className="text-gray-600">Please check back later for {selectedLanguage} assessments.</p>
        </div>
      </div>
    );
  }

  const currentQuestion = tests[currentTest];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <CodeBracketIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Coding Assessment</h1>
                  <p className="text-sm text-gray-600">{selectedLanguage} • Question {currentTest + 1} of {tests.length}</p>
                </div>
              </div>

              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-4 bg-gray-50/50">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentTest + 1) / tests.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{currentQuestion.question}</h2>

              {currentQuestion.codeSnippet && (
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg mb-4 font-mono text-sm overflow-x-auto">
                  <pre>{currentQuestion.codeSnippet}</pre>
                </div>
              )}

              {currentQuestion.expectedOutput && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4">
                  <p className="text-sm font-medium text-blue-900 mb-2">Expected Output:</p>
                  <p className="text-blue-800 font-mono">{currentQuestion.expectedOutput}</p>
                </div>
              )}
            </div>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((option, index) => (
                <label key={index} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="answer"
                    value={option}
                    checked={selectedAnswer === option}
                    onChange={(e) => setSelectedAnswer(e.target.value)}
                    className="mr-3"
                  />
                  <span className="text-gray-900">{option}</span>
                </label>
              ))}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                onClick={handleAnswerSubmit}
                disabled={!selectedAnswer}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {currentTest === tests.length - 1 ? 'Finish Assessment' : 'Next Question'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CodingAssessment;

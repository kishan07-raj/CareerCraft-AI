const CodingTest = require('../models/codingTest');
const UserCodingProgress = require('../models/userCodingProgress');

// Get all coding tests with optional language filter
const getCodingTests = async (req, res) => {
  try {
    const { language } = req.query;
    let query = {};

    if (language) {
      query.language = language;
    }

    let tests = await CodingTest.find(query).select('-correctAnswer'); // Don't send correct answers

    // If no tests in database, return sample data for development
    if (tests.length === 0) {
      tests = getSampleTests(language || 'JavaScript');
    }

    res.json(tests);
  } catch (error) {
    console.error('Error fetching coding tests:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Sample test data for development
const getSampleTests = (language) => {
  if (language === 'JavaScript') {
    return [
      {
        _id: 'sample1',
        question: 'What will be the output of the following JavaScript code?',
        codeSnippet: 'console.log(typeof null);',
        expectedOutput: 'object',
        options: ['null', 'object', 'undefined', 'boolean'],
        language: 'JavaScript',
        difficulty: 'Easy'
      },
      {
        _id: 'sample2',
        question: 'Which method is used to add an element to the end of an array in JavaScript?',
        codeSnippet: '',
        expectedOutput: '',
        options: ['push()', 'pop()', 'shift()', 'unshift()'],
        language: 'JavaScript',
        difficulty: 'Easy'
      },
      {
        _id: 'sample3',
        question: 'What does the "===" operator do in JavaScript?',
        codeSnippet: '',
        expectedOutput: '',
        options: ['Assigns a value', 'Compares values and types', 'Compares values only', 'Creates a new variable'],
        language: 'JavaScript',
        difficulty: 'Easy'
      }
    ];
  } else if (language === 'HTML') {
    return [
      {
        _id: 'sample4',
        question: 'Which HTML tag is used to create a hyperlink?',
        codeSnippet: '',
        expectedOutput: '',
        options: ['<link>', '<a>', '<href>', '<url>'],
        language: 'HTML',
        difficulty: 'Easy'
      }
    ];
  } else if (language === 'CSS') {
    return [
      {
        _id: 'sample5',
        question: 'Which CSS property is used to change the text color?',
        codeSnippet: '',
        expectedOutput: '',
        options: ['color', 'font-color', 'text-color', 'foreground-color'],
        language: 'CSS',
        difficulty: 'Easy'
      }
    ];
  } else if (language === 'React') {
    return [
      {
        _id: 'sample6',
        question: 'Which hook is used to manage state in functional components?',
        codeSnippet: '',
        expectedOutput: '',
        options: ['useState', 'useEffect', 'useContext', 'useReducer'],
        language: 'React',
        difficulty: 'Easy'
      }
    ];
  }
  return [];
};

// Get a specific coding test by ID
const getCodingTestById = async (req, res) => {
  try {
    const test = await CodingTest.findById(req.params.id).select('-correctAnswer');
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    res.json(test);
  } catch (error) {
    console.error('Error fetching coding test:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new coding test (admin only)
const createCodingTest = async (req, res) => {
  try {
    const { title, description, language, difficulty, codeSnippet, correctAnswer, testCases } = req.body;

    const newTest = new CodingTest({
      title,
      description,
      language,
      difficulty,
      codeSnippet,
      correctAnswer,
      testCases
    });

    await newTest.save();
    res.status(201).json({ message: 'Test created successfully', test: newTest });
  } catch (error) {
    console.error('Error creating coding test:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Submit answer for a coding test
const submitTestAnswer = async (req, res) => {
  try {
    const { testId, userAnswer, language } = req.body;
    const userId = req.user?.id || 'guest'; // Allow guest users for demo

    let isCorrect = false;
    let test = null;

    // Check if it's a sample test
    if (testId.startsWith('sample')) {
      const sampleTests = getSampleTests(language);
      test = sampleTests.find(t => t._id === testId);
      if (test) {
        // For sample tests, check against expectedOutput or correct option
        if (test.expectedOutput) {
          isCorrect = userAnswer.toLowerCase() === test.expectedOutput.toLowerCase();
        } else {
          // For multiple choice, the correct answer is the expectedOutput or we can hardcode
          const correctAnswers = {
            'sample1': 'object',
            'sample2': 'push()',
            'sample3': 'Compares values and types',
            'sample4': '<a>',
            'sample5': 'color',
            'sample6': 'useState'
          };
          isCorrect = userAnswer === correctAnswers[testId];
        }
      }
    } else {
      // Database test
      test = await CodingTest.findById(testId);
      if (!test) {
        return res.status(404).json({ message: 'Test not found' });
      }
      isCorrect = userAnswer === test.correctAnswer;
    }

    // Update or create user progress (skip for guest users)
    if (userId !== 'guest') {
      let progress = await UserCodingProgress.findOne({ userId, testId });
      if (!progress) {
        progress = new UserCodingProgress({
          userId,
          testId,
          attempts: 0,
          correct: false
        });
      }

      progress.attempts += 1;
      if (isCorrect && !progress.correct) {
        progress.correct = true;
      }

      await progress.save();
    }

    res.json({
      isCorrect,
      correct: isCorrect, // For backward compatibility
      attempts: 1, // Simplified for demo
      message: isCorrect ? 'Correct answer!' : 'Incorrect answer, try again.'
    });
  } catch (error) {
    console.error('Error submitting test answer:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user coding progress
const getUserCodingProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const progress = await UserCodingProgress.find({ userId }).populate('testId');
    res.json(progress);
  } catch (error) {
    console.error('Error fetching user progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get AI guidance (placeholder)
const getAIGuidance = async (req, res) => {
  try {
    // Placeholder for AI guidance functionality
    res.json({
      guidance: 'This is a placeholder for AI-powered coding guidance. Implement AI logic here.'
    });
  } catch (error) {
    console.error('Error getting AI guidance:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getCodingTests,
  getCodingTestById,
  createCodingTest,
  submitTestAnswer,
  getUserCodingProgress,
  getAIGuidance,
};

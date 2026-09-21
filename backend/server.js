const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { loginLimiter, apiLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const User = require('./models/user');
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
app.use(apiLimiter);
app.use('/api/auth', loginLimiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// DB Connect moved to async startup

// Create default admin user
const createAdminUser = async () => {
  try {
    const adminEmail = 'admin@careercraft.ai';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      const adminUser = new User({
        name: 'Admin User',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        isVerified: true
      });
      await adminUser.save();
      console.log('Default admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

// createAdminUser moved to async startup

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/skills', require('./routes/skillRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/resume', require('./routes/resumeRoutes'));
app.use('/api/recommendations', require('./routes/recommendationRoutes'));
app.use('/api/coding', require('./routes/codingRoutes'));

app.get('/', (req, res) => {
  res.json({ 
    message: 'CareerCraft AI Backend 🚀', 
    version: '1.0.0',
    status: 'production-ready'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), port: PORT });
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

// Async startup
const startServer = async () => {
  try {
    console.log('Starting CareerCraft AI Backend...');
    await connectDB();
    await createAdminUser();
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    });
  } catch (error) {
    console.error('❌ Startup failed:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;


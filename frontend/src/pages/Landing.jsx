import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  SparklesIcon,
  DocumentTextIcon,
  BriefcaseIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  CodeBracketIcon,
  UserIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  StarIcon,
  PlayIcon,
  ShieldCheckIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  CpuChipIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [isInView, end, duration]);

  return (
    <span ref={ref} className="text-4xl md:text-5xl font-bold">
      {count}{suffix}
    </span>
  );
};

// Floating Particle Background
const ParticleBackground = () => {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 blur-sm"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

// Glow Card Component
const GlowCard = ({ children, className = "", glowColor = "blue" }) => {
  const glowColors = {
    blue: "hover:shadow-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]",
    purple: "hover:shadow-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]",
    pink: "hover:shadow-pink-500/50 hover:shadow-[0_0_30px_rgba(236,72,153,0.3)]",
    cyan: "hover:shadow-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]",
    green: "hover:shadow-green-500/50 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      className={`bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 transition-all duration-300 hover:border-gray-700 ${glowColors[glowColor]} ${className}`}
    >
      {children}
    </motion.div>
  );
};

// Feature Card with Icon
const FeatureCard = ({ icon: Icon, title, description, delay, glowColor = "blue" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      <GlowCard glowColor={glowColor} className="h-full">
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-${glowColor}-500/20 to-${glowColor}-600/20 border border-${glowColor}-500/30 flex items-center justify-center mb-5`}>
          <Icon className={`w-7 h-7 text-${glowColor}-400`} />
        </div>
        <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{description}</p>
      </GlowCard>
    </motion.div>
  );
};

// Step Component for How It Works
const StepCard = ({ number, title, description, icon: Icon, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="relative"
    >
      <div className="flex items-start gap-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gray-900 border-2 border-blue-500 flex items-center justify-center">
            <span className="text-sm font-bold text-blue-400">{number}</span>
          </div>
        </div>
        <div className="flex-1 pt-2">
          <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
          <p className="text-gray-400">{description}</p>
        </div>
      </div>
      {number < 4 && (
        <div className="absolute left-8 top-20 w-0.5 h-16 bg-gradient-to-b from-blue-500 to-transparent" />
      )}
    </motion.div>
  );
};

// Testimonial Card
const TestimonialCard = ({ name, role, company, content, avatar, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <GlowCard className="h-full">
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          ))}
        </div>
        <p className="text-gray-300 mb-6 leading-relaxed">"{content}"</p>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <span className="text-lg font-bold text-white">{name.charAt(0)}</span>
          </div>
          <div>
            <h4 className="font-semibold text-white">{name}</h4>
            <p className="text-sm text-gray-400">{role} at {company}</p>
          </div>
        </div>
      </GlowCard>
    </motion.div>
  );
};

// Main Landing Component
const Landing = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const features = [
    {
      icon: DocumentTextIcon,
      title: 'AI Resume Builder',
      description: 'Create stunning, ATS-optimized resumes with AI-powered suggestions and professional templates tailored to your industry.',
      glowColor: 'blue'
    },
    {
      icon: BriefcaseIcon,
      title: 'Smart Job Matching',
      description: 'Our AI analyzes your skills and preferences to match you with the perfect job opportunities from thousands of companies.',
      glowColor: 'purple'
    },
    {
      icon: ChartBarIcon,
      title: 'Career Visualization',
      description: 'Visualize your career trajectory with interactive charts and personalized growth recommendations.',
      glowColor: 'pink'
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'AI Career Chat',
      description: 'Get instant answers to career questions, interview tips, and personalized advice from our AI assistant.',
      glowColor: 'cyan'
    },
    {
      icon: CodeBracketIcon,
      title: 'Coding Assessments',
      description: 'Practice and improve your coding skills with timed assessments and detailed performance analytics.',
      glowColor: 'green'
    },
    {
      icon: UserIcon,
      title: 'Profile Management',
      description: 'Build a comprehensive professional profile that showcases your skills, experience, and achievements.',
      glowColor: 'blue'
    }
  ];

  const steps = [
    {
      icon: RocketLaunchIcon,
      title: 'Create Your Profile',
      description: 'Sign up and build your professional profile with your skills, experience, and career goals.'
    },
    {
      icon: LightBulbIcon,
      title: 'Get AI Recommendations',
      description: 'Our AI analyzes your profile to provide personalized job matches and career suggestions.'
    },
    {
      icon: DocumentTextIcon,
      title: 'Build Your Resume',
      description: 'Use our AI-powered resume builder to create documents that stand out to recruiters.'
    },
    {
      icon: ChartBarIcon,
      title: 'Track Your Progress',
      description: 'Monitor your applications, interview prep, and career growth with our dashboard tools.'
    }
  ];

  const stats = [
    { value: 50, suffix: 'K+', label: 'Active Users' },
    { value: 10, suffix: 'K+', label: 'Jobs Available' },
    { value: 95, suffix: '%', label: 'Success Rate' },
    { value: 500, suffix: '+', label: 'Companies' }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Software Engineer',
      company: 'Google',
      content: 'CareerCraft AI helped me land my dream job! The resume builder and job matching were incredibly accurate.'
    },
    {
      name: 'Marcus Johnson',
      role: 'Product Manager',
      company: 'Meta',
      content: 'The AI career chat gave me amazing interview prep tips. I felt confident and prepared for every question.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Data Scientist',
      company: 'Netflix',
      content: 'The skills assessment feature helped me identify gaps and improve my profile. Highly recommended!'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Gradient Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/3 -right-32 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-cyan-600/15 rounded-full blur-[128px]"
        />
        <ParticleBackground />
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                CareerCraft AI
              </span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              {['Features', 'How it Works', 'Pricing', 'About'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-200 shadow-lg shadow-blue-500/25"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-16">
        <motion.div style={{ y, opacity }} className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
            <div className="text-center max-w-4xl mx-auto">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900/80 border border-gray-700/50 mb-8"
              >
                <SparklesIcon className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-300">Powered by Advanced AI Technology</span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
              >
                <span className="bg-gradient-to-r from-white via-blue-100 to-gray-300 bg-clip-text text-transparent">
                  Build Your Dream Career
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  With AI Power
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
              >
                Transform your career journey with intelligent tools for resume building, 
                job matching, career planning, and professional development powered by cutting-edge AI.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Link
                  to="/register"
                  className="group relative inline-flex items-center gap-3 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative flex items-center gap-2">
                    Start Free Trial
                    <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                <button className="group inline-flex items-center gap-3 px-8 py-4 text-base font-semibold text-gray-300 bg-gray-900/80 border border-gray-700 rounded-xl hover:border-gray-600 transition-all">
                  <PlayIcon className="w-5 h-5" />
                  Watch Demo
                </button>
              </motion.div>

              {/* Trust Badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="mt-16 flex flex-wrap items-center justify-center gap-8 text-gray-500"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="w-5 h-5" />
                  <span className="text-sm">Secure & Private</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5" />
                  <span className="text-sm">Free to Start</span>
                </div>
                <div className="flex items-center gap-2">
                  <CpuChipIcon className="w-5 h-5" />
                  <span className="text-sm">AI-Powered</span>
                </div>
              </motion.div>
            </div>

            {/* Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="mt-20 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent z-10" />
              <div className="relative rounded-2xl overflow-hidden border border-gray-800 bg-gray-900/50 backdrop-blur-xl shadow-2xl shadow-blue-500/20">
                <div className="p-1">
                  <div className="bg-gray-900/80 rounded-xl p-6 md:p-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: 'Resume Score', value: '92%', color: 'blue' },
                        { label: 'Matched Jobs', value: '24', color: 'green' },
                        { label: 'Skills', value: '12', color: 'purple' },
                        { label: 'Applications', value: '8', color: 'cyan' }
                      ].map((stat, i) => (
                        <div key={i} className="bg-gray-800/50 rounded-xl p-4 text-center">
                          <div className={`text-2xl md:text-3xl font-bold text-${stat.color}-400`}>{stat.value}</div>
                          <div className="text-xs md:text-sm text-gray-500 mt-1">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 bg-gray-950/50 border-y border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-gray-500 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Everything You Need for{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Career Success
              </span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools and insights you need to advance your career with AI-powered precision.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                {...feature}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-24 bg-gray-950/50 border-y border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              How{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                CareerCraft AI
              </span>{' '}
              Works
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Get started in minutes and transform your career journey with our simple four-step process.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <StepCard
                key={index}
                number={index + 1}
                {...step}
                delay={index * 0.15}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Trusted by{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Professionals
              </span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Join thousands of professionals who have transformed their careers with CareerCraft AI.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                {...testimonial}
                delay={index * 0.15}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-cyan-900/20" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-gray-900 to-gray-900/80 border border-gray-800 rounded-3xl p-8 md:p-16 text-center"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <RocketLaunchIcon className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Career?
            </h2>
            <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto">
              Join thousands of professionals who are already using CareerCraft AI to achieve their career goals.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
              >
                Start Your Free Trial
              </Link>
              <Link
                to="/contact"
                className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-gray-300 hover:text-white transition-colors"
              >
                Contact Sales
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 border-t border-gray-800/50 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <SparklesIcon className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">CareerCraft AI</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <p className="text-sm text-gray-500">© 2024 CareerCraft AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

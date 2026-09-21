export const resumeData = {
  // Header Information
  header: {
    name: "John Doe",
    role: "Software Engineer",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    github: "github.com/johndoe",
    linkedin: "linkedin.com/in/johndoe",
    website: "johndoe.dev"
  },
  
  // Education Section
  education: [
    {
      institution: "Stanford University",
      degree: "M.S. in Computer Science",
      location: "Stanford, CA",
      duration: "Sept 2018 - June 2020",
      gpa: "3.9/4.0",
      details: [
        "Specialization in Artificial Intelligence and Machine Learning",
        "Teaching Assistant for CS 229: Machine Learning"
      ]
    },
    {
      institution: "University of California, Berkeley",
      degree: "B.S. in Electrical Engineering and Computer Science",
      location: "Berkeley, CA",
      duration: "Aug 2014 - May 2018",
      gpa: "3.8/4.0",
      details: [
        "Dean's Honor List, Graduated with High Honors",
        "Senior Thesis: Distributed Systems Optimization"
      ]
    }
  ],
  
  // Experience Section
  experience: [
    {
      company: "Google",
      role: "Senior Software Engineer",
      location: "Mountain View, CA",
      duration: "July 2022 - Present",
      details: [
        "Led development of distributed caching layer serving 10M+ requests/second",
        "Reduced infrastructure costs by 35% through intelligent resource allocation",
        "Mentored 3 junior engineers and conducted 50+ technical interviews"
      ]
    },
    {
      company: "Microsoft",
      role: "Software Engineer II",
      location: "Seattle, WA",
      duration: "June 2020 - June 2022",
      details: [
        "Built real-time collaboration features for Office 365, adopted by 2M+ users",
        "Improved application performance by 40% through code optimization",
        "Collaborated with cross-functional teams across 3 time zones"
      ]
    }
  ],
  
  // Technical Skills Section
  skills: [
    {
      category: "Programming Languages",
      items: "Python, Java, C++, JavaScript, TypeScript, Go, SQL"
    },
    {
      category: "Frameworks & Libraries",
      items: "React, Node.js, TensorFlow, PyTorch, Django, Flask, Spring Boot"
    },
    {
      category: "Tools & Platforms",
      items: "AWS, GCP, Kubernetes, Docker, Terraform, Git, Linux"
    },
    {
      category: "Databases",
      items: "PostgreSQL, MongoDB, Redis, Elasticsearch, BigQuery"
    }
  ],
  
  // Projects Section
  projects: [
    {
      title: "Distributed Task Scheduler",
      technologies: "Go, Kubernetes, etcd, gRPC",
      duration: "2023",
      details: [
        "Built a distributed task scheduling system processing 100K+ tasks/day",
        "Implemented consensus algorithm for leader election using Raft",
        "Open-sourced with 2,000+ GitHub stars"
      ],
      link: "github.com/johndoe/task-scheduler"
    },
    {
      title: "ML-Based Code Review Assistant",
      technologies: "Python, PyTorch, Transformers, React",
      duration: "2022",
      details: [
        "Developed NLP model to automatically detect code anti-patterns",
        "Integrated with GitHub API, used by 500+ developers",
        "Published research paper at ICSE 2023"
      ],
      link: "github.com/johndoe/code-review-ai"
    }
  ],
  
  // Certifications Section
  certifications: [
    {
      name: "AWS Certified Solutions Architect - Professional",
      issuer: "Amazon Web Services",
      date: "Dec 2023",
      id: "AWS-PSA-12345"
    },
    {
      name: "Google Cloud Professional Data Engineer",
      issuer: "Google Cloud",
      date: "Aug 2022",
      id: "GCP-PDE-67890"
    },
    {
      name: "Certified Kubernetes Administrator (CKA)",
      issuer: "Cloud Native Computing Foundation",
      date: "Mar 2021",
      id: "CKA-2021-54321"
    }
  ],
  
  // Awards & Honors Section
  awards: [
    {
      title: "Outstanding Engineer Award",
      organization: "Google",
      year: "2023",
      description: "Recognized for exceptional technical leadership and innovation"
    },
    {
      title: "Best Paper Award",
      organization: "ICSE 2023",
      year: "2023",
      description: "Awarded for research on ML-based code review systems"
    },
    {
      title: "Phi Beta Kappa",
      organization: "UC Berkeley",
      year: "2018",
      description: "Academic honor society for liberal arts and sciences"
    }
  ]
};

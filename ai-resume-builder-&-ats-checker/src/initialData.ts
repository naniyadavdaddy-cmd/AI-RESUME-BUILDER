import { ResumeData } from "./types";

export const initialResume: ResumeData = {
  fullName: "Alex Rivera",
  email: "alex.rivera@email.com",
  phone: "(555) 019-2834",
  location: "San Francisco, CA",
  website: "https://linkedin.com/in/alex-rivera-dev",
  summary: "Results-driven Software Engineer with over 4 years of experience designing, scaling, and maintaining full-stack web applications. Expert in modern JavaScript frameworks and scalable backend development.",
  templateType: "classic",
  fontFamily: "sans",
  colorScheme: "slate",
  fontSize: "base",
  sectionOrder: ["summary", "experience", "skills", "education"],
  experience: [
    {
      id: "exp-1",
      company: "InnovateTech Solutions",
      position: "Full Stack Engineer",
      startDate: "2023-01",
      endDate: "Present",
      description: "Led development of a high-traffic microservices application. Drafted reusable React UI structures. Coordinated cross-functional workflows to design APIs in real time. Refactored state managers."
    },
    {
      id: "exp-2",
      company: "CloudScale Systems",
      position: "Web Developer",
      startDate: "2021-06",
      endDate: "2022-12",
      description: "Implemented front-end features in Vue and JavaScript. Monitored database query benchmarks. Resolved site latency hurdles by pre-fetching static layouts and optimizing assets. Drafted technical documentation."
    }
  ],
  skills: [
    "React",
    "Node.js",
    "Express",
    "TypeScript",
    "JavaScript",
    "Tailwind CSS",
    "PostgreSQL",
    "RESTful APIs",
    "Git",
    "CI/CD"
  ],
  education: [
    {
      id: "edu-1",
      school: "State Engineering University",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      graduationDate: "2021"
    }
  ]
};

export const sampleJobDescription = `
We are seeking a senior-level Full Stack Lead React Developer to join our Cloud Engineering division.

Key Responsibilities:
- Design, optimize, and build robust, single-column friendly applications in React, TypeScript, and Tailwind CSS.
- Build secure server-side proxy engines utilizing Node.js and Express.
- Setup microservice orchestration workflows using Kubernetes and Docker clusters.
- Collaborate closely with QA, DevOps, and Product Management to ship high-quality CI/CD code.
- Optimize database performance using advanced PostgreSQL query analysis.

Requirements:
- 3+ years experience with React and TypeScript.
- Strong understanding of Node.js cluster performance metrics.
- Familiarity with Kubernetes cloud setups and container security standards.
- Excellent communication skills and structured technical documentation expertise.
`;

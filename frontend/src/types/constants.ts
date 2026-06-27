export const AVAILABLE_SKILLS = [
   // Core Software Engineering
   "Frontend Development",
   "Backend Development",
   "Full-Stack Development",
   "Data Structures & Algorithms",
   "System Design",
   "Database Design",
   "Object-Oriented Programming (OOP)",
   "Functional Programming",
   "API Design & Integration",
   "Microservices Architecture",

   // Languages (if you want them as explicit skill tags)
   "Python",
   "JavaScript / TypeScript",
   "Java",
   "C++",
   "Go (Golang)",
   "Rust",
   "Ruby",
   "PHP",
   "C# / .NET",

   // Web Frameworks & Libraries
   "React.js",
   "Next.js",
   "Vue.js",
   "Angular",
   "Node.js / Express",
   "FastAPI / Django",
   "Spring Boot",

   // Mobile Development
   "iOS Development (Swift)",
   "Android Development (Kotlin)",
   "React Native",
   "Flutter",

   // Infrastructure, Cloud & DevOps
   "DevOps",
   "Cloud Computing (AWS/GCP/Azure)",
   "Docker & Containerization",
   "Kubernetes",
   "CI/CD Pipelines",
   "Infrastructure as Code (Terraform)",
   "Linux Systems Administration",
   "Serverless Architectures",

   // Data Engineering & Databases
   "Data Engineering",
   "SQL & Relational Databases",
   "NoSQL Databases (MongoDB/Redis)",
   "Data Warehousing (Snowflake/BigQuery)",
   "Big Data (Spark/Hadoop)",
   "GraphQL",

   // AI, Machine Learning & Data Science
   "Machine Learning",
   "Deep Learning",
   "Data Science & Analytics",
   "Natural Language Processing (NLP)",
   "Computer Vision",
   "Generative AI & LLMs",
   "MLOps",

   // Cybersecurity & Testing
   "Cybersecurity",
   "Penetration Testing",
   "Application Security (AppSec)",
   "Unit & Integration Testing",
   "Automated QA Engineering",

   // Product, Design & Agility
   "Product Management",
   "UI/UX Design",
   "System Architecture",
   "Agile / Scrum Methodologies",

   // Soft Skills & Leadership
   "Technical Leadership",
   "Engineering Management",
   "Mentorship & Code Review",
   "System Troubleshooting"
];

export const InterviewerType = {
  TECHNICAL: "technical",
  NON_TECHNICAL: "non_technical",
  BOTH: "both",
} as const;

export type InterviewerType =
  (typeof InterviewerType)[keyof typeof InterviewerType];
import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FileTextIcon, CopyIcon, CheckIcon } from 'lucide-react';

const SampleResume = ({ onUseTemplate }: { onUseTemplate: (text: string) => void }) => {
  const [copied, setCopied] = useState(false);
  const containerRef = useRef(null);
  
  // Sample resume content with a variety of skills
  const sampleResumeText = `JANE SMITH
Software Developer | jane.smith@email.com | (555) 123-4567 | linkedin.com/in/janesmith

PROFESSIONAL SUMMARY
Innovative software developer with 5+ years of experience in full-stack development, specializing in JavaScript frameworks and cloud technologies. Proven track record of delivering scalable web applications and improving system performance.

SKILLS
Programming Languages: JavaScript, TypeScript, Python, Java, SQL
Frameworks/Libraries: React, Node.js, Express, Next.js, Redux, Vue.js
Cloud & DevOps: AWS (EC2, S3, Lambda), Docker, Kubernetes, CI/CD pipelines
Tools: Git, GitHub, JIRA, Figma, VS Code, Postman
Databases: MongoDB, PostgreSQL, MySQL, Redis
Other: RESTful APIs, GraphQL, Microservices, Agile methodologies

WORK EXPERIENCE
Senior Frontend Developer
TechSolutions Inc. | June 2021 - Present
• Led a team of 5 developers in rebuilding the company's e-commerce platform using React and TypeScript, resulting in a 40% increase in page load speed
• Implemented responsive design principles to improve mobile user experience, increasing mobile conversion rates by 25%
• Collaborated with UX/UI designers to create intuitive user interfaces and streamline checkout processes
• Mentored junior developers through code reviews and pair programming sessions

Software Engineer
DataCorp Systems | August 2018 - May 2021
• Developed and maintained RESTful APIs using Node.js and Express, serving over 10,000 daily active users
• Optimized database queries, reducing average response time by 35%
• Implemented automated testing using Jest and Cypress, achieving 85% code coverage
• Participated in Agile development cycles, consistently meeting sprint goals and deadlines

Junior Web Developer
StartupNow | March 2017 - July 2018
• Built interactive web applications using JavaScript, HTML5, and CSS3
• Collaborated with cross-functional teams to implement new features and resolve bugs
• Contributed to the migration from AngularJS to React, improving developer productivity

EDUCATION
Bachelor of Science in Computer Science
University of Technology | 2013 - 2017
• GPA: 3.8/4.0
• Relevant coursework: Data Structures, Algorithms, Web Development, Database Systems

PROJECTS
Personal Finance Dashboard (2022)
• Created a full-stack application using React, Node.js, and PostgreSQL to track personal finances
• Implemented data visualization using D3.js, providing intuitive insights into spending patterns

Community Forum Platform (2020)
• Developed an open-source forum platform using Vue.js and Firebase
• Implemented real-time messaging and notification features

LANGUAGES
• English (Native)
• Spanish (Conversational)
• French (Basic)`;

  // GSAP animation setup
  useEffect(() => {
    if (!containerRef.current) return;
    
    const tl = gsap.timeline();
    
    tl.from(containerRef.current, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    });
    
    // Add subtle paper-like floating animation
    gsap.to(containerRef.current, {
      y: "-10px",
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }, []);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(sampleResumeText);
    setCopied(true);
    
    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  const handleUseTemplate = () => {
    onUseTemplate(sampleResumeText);
  };
  
  return (
    <div 
      ref={containerRef}
      className="border border-border/30 p-6 mt-8 bg-accent/10 relative overflow-hidden"
    >
      {/* Background design element */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
      
      <div className="flex items-center mb-4">
        <FileTextIcon className="h-5 w-5 text-primary mr-2" />
        <h3 className="text-xl font-display font-semibold text-foreground">Sample Resume Template</h3>
      </div>
      
      <div className="h-48 overflow-auto mb-4 bg-background/50 border border-border/20 p-3 text-xs md:text-sm font-mono text-foreground/80 whitespace-pre-wrap">
        {sampleResumeText.split('\n').slice(0, 15).join('\n')}...
      </div>
      
      <p className="text-sm text-foreground/70 mb-4">
        This sample resume contains various skills and experiences to test the extraction feature. 
      </p>
      
      <div className="flex flex-wrap gap-3">
        <Button
          size="sm"
          variant="outline"
          className="flex items-center gap-2 border-border/50"
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <CheckIcon className="h-4 w-4 text-green-400" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <CopyIcon className="h-4 w-4" />
              <span>Copy Template</span>
            </>
          )}
        </Button>
        
        <Button
          size="sm"
          className="flex items-center gap-2"
          onClick={handleUseTemplate}
        >
          <span>Use This Template</span>
        </Button>
      </div>
    </div>
  );
};

export default SampleResume;
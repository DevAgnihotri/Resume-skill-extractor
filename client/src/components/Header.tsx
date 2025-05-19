import { Link } from "wouter";
import { useEffect, useRef } from "react";
import gsap from "gsap";

// Array of skills for the marquee effect
const skillsList = [
  "JavaScript", "React", "TypeScript", "Node.js", "Python", 
  "Data Science", "UI/UX Design", "Project Management", "Leadership",
  "AWS", "DevOps", "Communication", "Problem Solving", "Teamwork"
];

export const Header = () => {
  // Double the skills array for continuous flow
  const doubledSkills = [...skillsList, ...skillsList];
  
  // Refs for GSAP animations
  const headerRef = useRef(null);
  const logoRef = useRef(null);
  const textRef = useRef(null);
  useEffect(() => {
    const tl = gsap.timeline();
    
    // Header animation
    tl.from(headerRef.current, {
      y: -100,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    });
    
    // Logo animation with scale and glow effect
    gsap.to(logoRef.current, {
      scale: 1.1,
      boxShadow: "0 0 20px rgba(255, 255, 255, 0.3)",
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    
    // Text reveal animation for "TRACKER"
    gsap.from(textRef.current, {
      backgroundPosition: "200% 0",
      duration: 1.5,
      ease: "power3.out",
      delay: 0.5
    });
  }, []);
  
  return (
    <header ref={headerRef} className="bg-background border-b border-border/30">
      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center h-20 items-center">
          <Link href="/">
            <a className="flex items-center group">
              <div ref={logoRef} className="h-10 w-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center mr-3 overflow-hidden">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6H16V4C16 2.89 15.11 2 14 2H10C8.89 2 8 2.89 8 4V6H4C2.89 6 2 6.89 2 8V19C2 20.11 2.89 21 4 21H20C21.11 21 22 20.11 22 19V8C22 6.89 21.11 6 20 6ZM10 4H14V6H10V4ZM20 19H4V8H20V19Z" fill="currentColor" />
                  <path d="M7 14C7 12.34 8.34 11 10 11C11.66 11 13 12.34 13 14C13 15.66 11.66 17 10 17C8.34 17 7 15.66 7 14Z" fill="currentColor" />
                  <path d="M15 11H19V13H15V11Z" fill="currentColor" />
                  <path d="M15 15H19V17H15V15Z" fill="currentColor" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold font-display tracking-tight text-foreground">
                <span className="animate-glow">Skill</span>
                <span ref={textRef} className="bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent bg-[length:200%_auto]">TRACKER</span>
              </h1>
            </a>
          </Link>
        </div>
      </div>
      
      {/* Marquee Skills Banner */}
      <div className="relative bg-accent/30 overflow-hidden py-3 border-y border-border/20">
        <div className="flex whitespace-nowrap animate-marquee">
          {doubledSkills.map((skill, index) => (
            <div key={index} className="mx-5 text-foreground/80 flex items-center">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
              <span className="text-sm font-medium">{skill}</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;

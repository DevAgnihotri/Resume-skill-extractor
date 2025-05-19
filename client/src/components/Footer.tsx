import { Link } from "wouter";

export const Footer = () => {
  return (
    <footer className="bg-card py-6 mt-12 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-primary mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6H16V4C16 2.89 15.11 2 14 2H10C8.89 2 8 2.89 8 4V6H4C2.89 6 2 6.89 2 8V19C2 20.11 2.89 21 4 21H20C21.11 21 22 20.11 22 19V8C22 6.89 21.11 6 20 6ZM10 4H14V6H10V4ZM20 19H4V8H20V19Z" fill="currentColor" />
                <path d="M7 14C7 12.34 8.34 11 10 11C11.66 11 13 12.34 13 14C13 15.66 11.66 17 10 17C8.34 17 7 15.66 7 14Z" fill="currentColor" />
                <path d="M15 11H19V13H15V11Z" fill="currentColor" />
                <path d="M15 15H19V17H15V15Z" fill="currentColor" />
              </svg>
              <span className="text-foreground font-medium">SkillExtract</span>
            </div>
            <p className="text-foreground/70 text-sm mt-1">Resume skill extraction powered by AI</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <a href="#" className="hover:text-blue-200 text-sm">Privacy Policy</a>
            <a href="#" className="hover:text-blue-200 text-sm">Terms of Service</a>
            <a href="#" className="hover:text-blue-200 text-sm">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

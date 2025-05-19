// ...existing code...
import winkNLP from 'wink-nlp';
import model from 'wink-eng-lite-web-model';
import { Skill, ExtractSkillsResponse } from '@shared/schema';

// Initialize winkNLP
const nlp = winkNLP(model);
const its = nlp.its;

// Define technical skills dictionary (common programming languages, frameworks, tools, etc.)
const technicalSkills = new Set([
  // Programming languages
  'javascript', 'typescript', 'python', 'java', 'c#', 'c++', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin',
  'scala', 'html', 'css', 'sql', 'nosql', 'r', 'matlab', 'perl', 'bash', 'powershell', 'shell',
  
  // Frameworks & libraries
  'react', 'angular', 'vue', 'svelte', 'node.js', 'express', 'django', 'flask', 'spring', 'asp.net',
  'laravel', 'symfony', 'rails', 'jquery', 'bootstrap', 'tailwind', 'redux', 'graphql', 'apollo',
  'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy', 'keras', 'next.js', 'gatsby',
  
  // Databases
  'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'cassandra', 'dynamodb', 'neo4j',
  'couchbase', 'firebase', 'mariadb', 'oracle', 'ms sql', 'sqlite', 'supabase',
  
  // Cloud & DevOps
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'circleci', 'travis ci', 'terraform',
  'ansible', 'puppet', 'chef', 'git', 'github', 'gitlab', 'bitbucket', 'ci/cd', 'devops',
  'serverless', 'microservices', 'linux', 'unix', 'windows server',
  
  // Other technical
  'rest api', 'soap', 'graphql', 'oauth', 'jwt', 'web sockets', 'security', 'encryption',
  'testing', 'agile', 'scrum', 'kanban', 'jira', 'confluence', 'figma', 'sketch', 'adobe xd',
  'photoshop', 'illustrator', 'indesign', 'autodesk', 'cad', 'mobile development',
  'responsive design', 'cms', 'wordpress', 'seo', 'analytics', 'big data', 'machine learning',
  'artificial intelligence', 'data science', 'blockchain', 'webrtc', 'webpack', 'babel', 'npm', 'yarn',
]);

// Define soft skills
const softSkills = new Set([
  'communication', 'teamwork', 'problem solving', 'critical thinking', 'creativity', 'adaptability',
  'leadership', 'time management', 'organization', 'emotional intelligence', 'conflict resolution',
  'decision making', 'negotiation', 'persuasion', 'public speaking', 'presentation', 'mentoring',
  'coaching', 'customer service', 'interpersonal', 'flexibility', 'patience', 'resilience',
  'work ethic', 'attention to detail', 'self-motivation', 'reliability', 'responsibility',
  'collaboration', 'analytical', 'planning', 'research', 'writing', 'editing', 'project management',
  'team building', 'multitasking', 'prioritization', 'innovation', 'initiative',
]);

// Define languages
const languages = new Set([
  'english', 'spanish', 'french', 'german', 'italian', 'portuguese', 'dutch', 'russian',
  'mandarin', 'chinese', 'japanese', 'korean', 'arabic', 'hindi', 'bengali', 'punjabi',
  'turkish', 'polish', 'ukrainian', 'vietnamese', 'thai', 'indonesian', 'malay', 'tagalog',
  'filipino', 'urdu', 'persian', 'hebrew', 'greek', 'swedish', 'norwegian', 'danish', 'finnish',
  'czech', 'slovak', 'hungarian', 'romanian', 'bulgarian', 'serbian', 'croatian', 'bosnian',
  'albanian', 'macedonian', 'lithuanian', 'latvian', 'estonian', 'georgian', 'armenian',
  'basque', 'catalan', 'welsh', 'irish', 'scots gaelic', 'maltese', 'luxembourgish',
]);

export async function extractSkillsFromText(text: string): Promise<ExtractSkillsResponse> {
  try {
    // Process text with winkNLP
    const doc = nlp.readDoc(text);
    
    // Extract potential skill tokens (nouns, proper nouns, and technical terms)
    const tokens = doc.tokens().out(its.value, its.pos);
    const sentences = doc.sentences().out(its.value);
    
    // Extract skill candidates
    const skillCandidates = new Set<string>();
    
    // Process individual tokens for matching skills
    tokens.forEach((item: [string, string]) => {
      const [word, pos] = item;
      const lowerWord = word.toLowerCase();
      
      // Check if it's a known skill or possibly a noun that could be a skill
      if (
        technicalSkills.has(lowerWord) || 
        softSkills.has(lowerWord) || 
        languages.has(lowerWord) ||
        pos === 'NN' || // Noun
        pos === 'NNP' || // Proper noun
        pos === 'NNPS' || // Plural proper noun
        pos === 'NNS' // Plural noun
      ) {
        skillCandidates.add(lowerWord);
      }
    });
    
    // Process multi-word skills using n-grams
    sentences.forEach((sentence: string) => {
      const words = sentence.toLowerCase().split(/\s+/);
      
      // Check for 2-word and 3-word phrases that might be skills
      for (let i = 0; i < words.length; i++) {
        // 2-word phrases
        if (i < words.length - 1) {
          const phrase2 = `${words[i]} ${words[i+1]}`;
          if (technicalSkills.has(phrase2) || softSkills.has(phrase2)) {
            skillCandidates.add(phrase2);
          }
        }
        
        // 3-word phrases
        if (i < words.length - 2) {
          const phrase3 = `${words[i]} ${words[i+1]} ${words[i+2]}`;
          if (technicalSkills.has(phrase3) || softSkills.has(phrase3)) {
            skillCandidates.add(phrase3);
          }
        }
      }
    });
    
    // Convert skill candidates to structured Skill objects
    const skills: Skill[] = Array.from(skillCandidates).map(skill => {
      // Determine category
      let category: 'technical' | 'soft' | 'languages';
      
      if (technicalSkills.has(skill)) {
        category = 'technical';
      } else if (softSkills.has(skill)) {
        category = 'soft';
      } else if (languages.has(skill)) {
        category = 'languages';
      } else {
        // Default to technical if not found in predefined lists
        category = 'technical';
      }
      
      // Format skill name properly (capitalize first letter of each word)
      const formattedName = skill
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      return {
        name: formattedName,
        category,
      };
    });
    
    // Sort skills by category and name
    skills.sort((a, b) => {
      // First sort by category
      if (a.category !== b.category) {
        const categoryOrder = { technical: 1, soft: 2, languages: 3 };
        return categoryOrder[a.category] - categoryOrder[b.category];
      }
      // Then by name
      return a.name.localeCompare(b.name);
    });
    
    // Generate suggestions based on skills analysis
    const suggestions: string[] = generateSuggestions(skills);
    
    return {
      skills,
      suggestions,
    };
  } catch (error) {
    console.error('Error extracting skills:', error);
    throw new Error('Failed to extract skills from the provided resume text');
  }
}

function generateSuggestions(skills: Skill[]): string[] {
  const suggestions: string[] = [];
  
  // Count skills in each category
  const technicalCount = skills.filter(s => s.category === 'technical').length;
  const softCount = skills.filter(s => s.category === 'soft').length;
  const languagesCount = skills.filter(s => s.category === 'languages').length;
  
  // Generate suggestions based on counts
  if (skills.length < 5) {
    suggestions.push("<span class='font-medium'>Add more skills to your resume</span> to improve your chances of getting noticed by recruiters.");
  }
  
  if (softCount < 3 && technicalCount > 5) {
    suggestions.push("<span class='font-medium'>Consider adding more soft skills</span> like teamwork or adaptability to balance your technical expertise.");
  }
  
  if (technicalCount < 3 && softCount > 5) {
    suggestions.push("<span class='font-medium'>Add more technical skills</span> to demonstrate your hands-on capabilities.");
  }
  
  if (languagesCount === 0) {
    suggestions.push("<span class='font-medium'>Consider adding language proficiencies</span> if you speak any foreign languages, even at a basic level.");
  }
  
  // Always add these general suggestions
  suggestions.push("<span class='font-medium'>Add quantifiable achievements</span> to demonstrate your skills in action.");
  
  if (technicalCount > 0) {
    suggestions.push("<span class='font-medium'>Highlight experience with trending technologies</span> like Docker, Kubernetes, or cloud platforms if applicable.");
  }
  
  return suggestions;
}

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CodeBlock } from "@/components/ai-elements/code-block";
import { Copy, RefreshCw } from "lucide-react";

interface LaTeXReferenceProps {
  onContentUpdate?: (content: string) => void;
  aiGeneratedContent?: string;
}

const LaTeXReferencePanel = ({
  onContentUpdate,
  aiGeneratedContent,
}: LaTeXReferenceProps) => {
  const [customContent, setCustomContent] = useState<string>("");
  const [isCustomContent, setIsCustomContent] = useState(false);

  // Default content from latex-reference.md
  const defaultContent = `\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\input{glyphtounicode}

\\pagestyle{fancy}
\\fancyhf{} % clear all header and footer fields
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

% Ensure that generate pdf is machine readable/ATS parsable
\\pdfgentounicode=1

%-------------------------
% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubSubheading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\textit{\\small#1} & \\textit{\\small #2} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

%-------------------------------------------
%%%%%%  RESUME STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\begin{document}

%----------HEADING----------
\\begin{center}
    \\textbf{\\Huge \\scshape Your Name} \\\\ \\vspace{1pt}
    \\small Phone $|$ \\href{mailto:email@example.com}{\\underline{email@example.com}} $|$
    \\href{https://linkedin.com/in/username}{\\underline{linkedin.com/in/username}} $|$
    \\href{https://github.com/username}{\\underline{github.com/username}}
\\end{center}

%-----------EXPERIENCE-----------
\\section{Experience}
  \\resumeSubHeadingListStart
    \\resumeSubheading
      {Software Engineer}{Jan 2023 - Present}
      {Tech Company Inc.}{San Francisco, CA}
      \\resumeItemListStart
        \\resumeItem{Developed scalable web applications using React and Node.js}
        \\resumeItem{Implemented CI/CD pipelines reducing deployment time by 50\\%}
        \\resumeItem{Led a team of 3 developers in agile development practices}
      \\resumeItemListEnd
      
    \\resumeSubheading
      {Junior Developer}{Jun 2021 - Dec 2022}
      {Startup XYZ}{Remote}
      \\resumeItemListStart
        \\resumeItem{Built responsive UI components with modern JavaScript frameworks}
        \\resumeItem{Collaborated with designers to implement pixel-perfect designs}
      \\resumeItemListEnd
  \\resumeSubHeadingListEnd

%-----------EDUCATION-----------
\\section{Education}
  \\resumeSubheading
    {Bachelor of Science in Computer Science}{Aug 2017 - May 2021}
    {University of California, Berkeley}{Berkeley, CA}

%-----------SKILLS-----------
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     \\textbf{Languages}{: JavaScript, Python, Java, C++, SQL} \\\\
     \\textbf{Frameworks}{: React, Node.js, Django, Spring Boot} \\\\
     \\textbf{Tools}{: Git, Docker, AWS, Kubernetes}
    }}
 \\end{itemize}

%-----------PROJECTS-----------
\\section{Projects}
    \\resumeSubHeadingListStart
      \\resumeProjectHeading
          {\\textbf{E-Commerce Platform} $|$ \\emph{React, Node.js, MongoDB}}{2023}
          \\resumeItemListStart
            \\resumeItem{Developed a full-stack e-commerce platform with user authentication}
            \\resumeItem{Implemented payment processing using Stripe API}
          \\resumeItemListEnd
      \\resumeProjectHeading
          {\\textbf{Task Management App} $|$ \\emph{React, Express, PostgreSQL}}{2022}
          \\resumeItemListStart
            \\resumeItem{Built real-time collaborative task management tool}
            \\resumeItem{Integrated WebSocket for live updates}
          \\resumeItemListEnd
    \\resumeSubHeadingListEnd

\\end{document}`;

  // Effect to update content when AI generates new LaTeX
  useEffect(() => {
    if (aiGeneratedContent) {
      setCustomContent(aiGeneratedContent);
      setIsCustomContent(true);
    }
  }, [aiGeneratedContent]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleResetToOriginal = () => {
    setIsCustomContent(false);
    setCustomContent("");
  };

  const getCurrentContent = () => {
    if (isCustomContent && customContent) {
      return {
        title: "AI Edited Resume",
        description: "LaTeX code modified by the AI assistant",
        code: customContent,
      };
    }
    return {
      title: "LaTeX Resume Template",
      description: "Complete resume template from the reference documentation",
      code: defaultContent,
    };
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">LaTeX Resume</h2>
            <p className="text-sm text-muted-foreground">
              {isCustomContent
                ? "AI-modified LaTeX resume"
                : "Complete LaTeX resume template"}
            </p>
          </div>
          {isCustomContent && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetToOriginal}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reset to Original
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {getCurrentContent().title}
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(getCurrentContent().code)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                {getCurrentContent().description}
              </p>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <CodeBlock code={getCurrentContent().code} language="latex" />
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

export default LaTeXReferencePanel;

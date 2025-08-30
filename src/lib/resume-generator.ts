interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    website: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string[];
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    gpa: string;
  }>;
  skills: Array<{
    category: string;
    skills: string[];
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    link: string;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    link: string;
  }>;
}

export function generateLaTeXResume(data: ResumeData): string {
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const formatDateRange = (
    startDate: string,
    endDate: string,
    current: boolean
  ) => {
    const start = formatDate(startDate);
    const end = current ? "Present" : formatDate(endDate);
    return `${start} - ${end}`;
  };

  const escapeLaTeX = (text: string) => {
    return text
      .replace(/\\/g, "\\textbackslash{}")
      .replace(/[&%$#_{}~^]/g, "\\$&")
      .replace(/</g, "\\textless{}")
      .replace(/>/g, "\\textgreater{}");
  };

  const generateContactInfo = () => {
    const contactItems = [];

    if (data.personalInfo.email) {
      contactItems.push(
        `\\href{mailto:${data.personalInfo.email}}{${escapeLaTeX(
          data.personalInfo.email
        )}}`
      );
    }
    if (data.personalInfo.phone) {
      contactItems.push(escapeLaTeX(data.personalInfo.phone));
    }
    if (data.personalInfo.location) {
      contactItems.push(escapeLaTeX(data.personalInfo.location));
    }
    if (data.personalInfo.linkedin) {
      contactItems.push(
        `\\href{https://${data.personalInfo.linkedin}}{${escapeLaTeX(
          data.personalInfo.linkedin
        )}}`
      );
    }
    if (data.personalInfo.github) {
      contactItems.push(
        `\\href{https://${data.personalInfo.github}}{${escapeLaTeX(
          data.personalInfo.github
        )}}`
      );
    }
    if (data.personalInfo.website) {
      contactItems.push(
        `\\href{https://${data.personalInfo.website}}{${escapeLaTeX(
          data.personalInfo.website
        )}}`
      );
    }

    return contactItems.join(" \\textbullet{} ");
  };

  const generateExperienceSection = () => {
    if (data.experience.length === 0) return "";

    let experienceText =
      "%-----------EXPERIENCE-----------\n\\section{Experience}\n  \\resumeSubHeadingListStart\n";

    data.experience.forEach((exp) => {
      const dateRange = formatDateRange(
        exp.startDate,
        exp.endDate,
        exp.current
      );
      experienceText += `    \\resumeSubheading\n      {${escapeLaTeX(
        exp.position
      )}}{${escapeLaTeX(dateRange)}}\n      {${escapeLaTeX(
        exp.company
      )}}{${escapeLaTeX(exp.location || "")}}\n      \\resumeItemListStart\n`;
      exp.description.forEach((desc) => {
        if (desc.trim()) {
          experienceText += `        \\resumeItem{${escapeLaTeX(
            desc.trim()
          )}}\n`;
        }
      });
      experienceText += "      \\resumeItemListEnd\n";
    });

    experienceText += "  \\resumeSubHeadingListEnd\n";
    return experienceText;
  };

  const generateEducationSection = () => {
    if (data.education.length === 0) return "";

    let educationText =
      "%-----------EDUCATION-----------\n\\section{Education}\n  \\resumeSubHeadingListStart\n";

    data.education.forEach((edu) => {
      const dateRange = formatDateRange(
        edu.startDate,
        edu.endDate,
        edu.current
      );
      const degreeField = `${escapeLaTeX(edu.degree)} in ${escapeLaTeX(
        edu.field
      )}`;
      educationText += `    \\resumeSubheading\n      {${escapeLaTeX(
        edu.institution
      )}}{${escapeLaTeX(
        edu.location || ""
      )}}\n      {${degreeField}}{${escapeLaTeX(dateRange)}}\n`;
      if (edu.gpa) {
        educationText += `    \\resumeSubItem{GPA: ${escapeLaTeX(edu.gpa)}}\n`;
      }
    });

    educationText += "  \\resumeSubHeadingListEnd\n";
    return educationText;
  };

  const generateSkillsSection = () => {
    if (data.skills.length === 0) return "";

    let skillsText =
      "%-----------PROGRAMMING SKILLS-----------\n\\section{Technical Skills}\n \\begin{itemize}[leftmargin=0.15in, label={}]\n    \\small{\\item{\n";

    data.skills.forEach((skillGroup, index) => {
      if (skillGroup.category && skillGroup.skills.length > 0) {
        const skillsList = skillGroup.skills
          .filter((skill) => skill.trim())
          .map((skill) => escapeLaTeX(skill.trim()))
          .join(", ");
        skillsText += `     \\textbf{${escapeLaTeX(
          skillGroup.category
        )}}{: ${skillsList}`;
        if (index < data.skills.length - 1) {
          skillsText += " \\\\";
        }
        skillsText += " \\n";
      }
    });

    skillsText += "    }}\n \\end{itemize}\n";
    return skillsText;
  };

  const generateProjectsSection = () => {
    if (data.projects.length === 0) return "";

    let projectsText =
      "%-----------PROJECTS-----------\n\\section{Projects}\n    \\resumeSubHeadingListStart\n";

    data.projects.forEach((project) => {
      const techList = project.technologies
        .filter((tech) => tech.trim())
        .map((tech) => escapeLaTeX(tech.trim()))
        .join(", ");
      const projectTitle = `\\textbf{${escapeLaTeX(
        project.name
      )}} $|$ \\emph{${techList}}`;
      projectsText += `      \\resumeProjectHeading\n          {${projectTitle}}{}\n          \\resumeItemListStart\n`;
      projectsText += `            \\resumeItem{${escapeLaTeX(
        project.description
      )}}\n`;
      if (project.link) {
        projectsText += `            \\resumeItem{Project Link: \\href{${
          project.link
        }}{${escapeLaTeX(project.link)}}}\n`;
      }
      projectsText += "          \\resumeItemListEnd\n";
    });

    projectsText += "    \\resumeSubHeadingListEnd\n";
    return projectsText;
  };

  const generateCertificationsSection = () => {
    if (data.certifications.length === 0) return "";

    let certText =
      "%-----------CERTIFICATIONS-----------\n\\section{Certifications}\n  \\resumeSubHeadingListStart\n";

    data.certifications.forEach((cert) => {
      certText += `    \\resumeSubheading\n      {${escapeLaTeX(
        cert.name
      )}}{${escapeLaTeX(cert.date)}}\n      {${escapeLaTeX(cert.issuer)}}{}\n`;
      if (cert.link) {
        certText += `    \\resumeSubItem{\\href{${cert.link}}{View Certificate}}\n`;
      }
    });

    certText += "  \\resumeSubHeadingListEnd\n";
    return certText;
  };

  const latex = `%-------------------------
% Resume in Latex
% Generated by LaTeX Resume Generator
% Based off of: https://github.com/sb2nov/resume
% License : MIT
%------------------------

\\documentclass[letterpaper,11pt]{article}

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
    \\textbf{\\Huge \\scshape ${escapeLaTeX(
      data.personalInfo.name
    )} } \\\\ \\vspace{1pt}
    \\small ${escapeLaTeX(
      data.personalInfo.phone
    )} $|$ \\href{mailto:${escapeLaTeX(
    data.personalInfo.email
  )}}{\\underline{${escapeLaTeX(data.personalInfo.email)}}} $|$ 
    ${
      data.personalInfo.linkedin
        ? `\\href{https://${escapeLaTeX(
            data.personalInfo.linkedin
          )}}{\\underline{${escapeLaTeX(data.personalInfo.linkedin)}}}`
        : ""
    } $|$
    ${
      data.personalInfo.github
        ? `\\href{https://${escapeLaTeX(
            data.personalInfo.github
          )}}{\\underline{${escapeLaTeX(data.personalInfo.github)}}}`
        : ""
    }
    ${
      data.personalInfo.website
        ? `$|$ \\href{https://${escapeLaTeX(
            data.personalInfo.website
          )}}{\\underline{${escapeLaTeX(data.personalInfo.website)}}}`
        : ""
    }
    ${
      data.personalInfo.location
        ? `$|$ ${escapeLaTeX(data.personalInfo.location)}`
        : ""
    }
\\end{center}

${
  data.summary
    ? `%----------SUMMARY----------
\\section{Summary}
${escapeLaTeX(data.summary)}
`
    : ""
}

${generateEducationSection()}

${generateExperienceSection()}

${generateProjectsSection()}

${generateSkillsSection()}

${generateCertificationsSection()}

\\end{document}`;

  return latex;
}

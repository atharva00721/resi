# LaTeX Resume Quick Reference

A quick reference guide for the most commonly used LaTeX commands and formatting in the resume generator.

## 📋 Basic Document Structure

```latex
\documentclass[letterpaper,11pt]{article}

\usepackage{latexsym}
\usepackage[empty]{fullpage}
\usepackage{titlesec}
\usepackage{marvosym}
\usepackage[usenames,dvipsnames]{color}
\usepackage{verbatim}
\usepackage{enumitem}
\usepackage[hidelinks]{hyperref}
\usepackage{fancyhdr}
\usepackage[english]{babel}
\usepackage{tabularx}
\input{glyphtounicode}

% Custom commands and formatting
\pagestyle{fancy}
\fancyhf{}
\fancyfoot{}
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0pt}

% Adjust margins
\addtolength{\oddsidemargin}{-0.5in}
\addtolength{\evensidemargin}{-0.5in}
\addtolength{\textwidth}{1in}
\addtolength{\topmargin}{-.5in}
\addtolength{\textheight}{1.0in}

\urlstyle{same}
\raggedbottom
\raggedright
\setlength{\tabcolsep}{0in}

% Sections formatting
\titleformat{\section}{
  \vspace{-4pt}\scshape\raggedright\large
}{}{0em}{}[\color{black}\titlerule \vspace{-5pt}]

\pdfgentounicode=1

\begin{document}
% Your sections here
\end{document}
```

## 👤 Personal Information

```latex
\begin{center}
    \textbf{\Huge \scshape Your Name} \\ \vspace{1pt}
    \small Phone $|$ \href{mailto:your.email@example.com}{\underline{your.email@example.com}} $|$
    \href{https://linkedin.com/in/username}{\underline{linkedin.com/in/username}} $|$
    \href{https://github.com/username}{\underline{github.com/username}}
\end{center}
```

## 📝 Section Commands

| Section    | Command             | Example                                             |
| ---------- | ------------------- | --------------------------------------------------- |
| Section    | `\section{Title}`   | `\section{Experience}`                              |
| Subheading | `\resumeSubheading` | `\resumeSubheading{Title}{Date}{Company}{Location}` |
| Item       | `\resumeItem{text}` | `\resumeItem{Achievement description}`              |
| Bold       | `\textbf{text}`     | `\textbf{Skills}:`                                  |
| Link       | `\href{url}{text}`  | `\href{https://github.com}{GitHub}`                 |

## 🏢 Experience Format

```latex
%-----------EXPERIENCE-----------
\section{Experience}
  \resumeSubHeadingListStart
    \resumeSubheading
      {Job Title}{Date Range}
      {Company Name}{Location}
      \resumeItemListStart
        \resumeItem{Achievement description}
        \resumeItem{Another achievement}
        \resumeItem{Third achievement}
      \resumeItemListEnd
  \resumeSubHeadingListEnd
```

## 🎓 Education Format

```latex
%-----------EDUCATION-----------
\section{Education}
  \resumeSubHeadingListStart
    \resumeSubheading
      {Institution}{Location}
      {Degree in Field}{Date Range}
    \resumeSubItem{GPA: 3.8/4.0}
  \resumeSubHeadingListEnd
```

## 💡 Skills Format

```latex
%-----------PROGRAMMING SKILLS-----------
\section{Technical Skills}
 \begin{itemize}[leftmargin=0.15in, label={}]
    \small{\item{
     \textbf{Languages}{: JavaScript, Python, Java} \\
     \textbf{Frameworks}{: React, Node.js, Django} \\
     \textbf{Tools}{: Git, Docker, AWS}
    }}
 \end{itemize}
```

## 🚀 Projects Format

```latex
%-----------PROJECTS-----------
\section{Projects}
    \resumeSubHeadingListStart
      \resumeProjectHeading
          {\textbf{Project Name} $|$ \emph{React, Node.js, MongoDB}}{}
          \resumeItemListStart
            \resumeItem{Project description here.}
            \resumeItem{Project Link: \href{project-url}{project-url}}
          \resumeItemListEnd
    \resumeSubHeadingListEnd
```

## 🏆 Certifications Format

```latex
%-----------CERTIFICATIONS-----------
\section{Certifications}
  \resumeSubHeadingListStart
    \resumeSubheading
      {Certification Name}{Date}
      {Issuing Organization}{}
    \resumeSubItem{\href{certificate-url}{View Certificate}}
  \resumeSubHeadingListEnd
```

## 🎨 Custom Commands

### Available Commands

```latex
\resumeSubheading{Title}{Date}{Company}{Location}  % For experience/education entries
\resumeItem{Description}                           % For bullet points
\resumeSubItem{Additional info}                    % For sub-items
\resumeProjectHeading{Title}{Date}                 % For project entries
\resumeSubHeadingListStart                         % Start list container
\resumeSubHeadingListEnd                           % End list container
\resumeItemListStart                               % Start item list
\resumeItemListEnd                                 % End item list
```

### Section Formatting

```latex
\titleformat{\section}{                          % Section title style
  \vspace{-4pt}\scshape\raggedright\large
}{}{0em}{}[\color{black}\titlerule \vspace{-5pt}]
```

## 📏 Spacing Commands

| Command          | Description                           |
| ---------------- | ------------------------------------- |
| `\vspace{0.5em}` | Small space (between entries)         |
| `\vspace{1em}`   | Medium space                          |
| `\vspace{2em}`   | Large space                           |
| `\hfill`         | Fill horizontal space (for alignment) |
| `\\`             | Line break                            |

## 🔧 Common Customizations

### Change Margins

```latex
\usepackage[scale=0.75]{geometry}  % 75% of default
\usepackage[scale=1.0]{geometry}   % Standard margins
\usepackage[scale=0.5]{geometry}   % Very narrow
```

### Change Font Size

```latex
\documentclass[10pt,a4paper,sans]{moderncv}  % Small
\documentclass[11pt,a4paper,sans]{moderncv}  % Default
\documentclass[12pt,a4paper,sans]{moderncv}  % Large
```

### Custom Commands

```latex
% Add to preamble
\newcommand{\highlight}[1]{\textbf{\color{blue}#1}}
\newcommand{\skillgroup}[2]{\textbf{#1}: #2}
```

## ⚠️ Common Issues & Solutions

### Special Characters

| Character | LaTeX Command |
| --------- | ------------- |
| `&`       | `\&`          |
| `%`       | `\%`          |
| `$`       | `\$`          |
| `#`       | `\#`          |
| `_`       | `\_`          |
| `{`       | `\{`          |
| `}`       | `\}`          |

### Error Messages

- **"Command not found"** → Check spelling, install missing package
- **"Missing $ inserted"** → Escape special characters
- **"Overfull hbox"** → Text too long, break lines or reduce font

### Package Installation

```bash
# TeX Live
sudo tlmgr install moderncv
sudo tlmgr install enumitem

# MiKTeX
mpm --install moderncv
mpm --install enumitem
```

## 📋 Best Practices Checklist

- [ ] Use reverse chronological order (most recent first)
- [ ] Keep bullet points concise (1-2 lines)
- [ ] Start bullet points with action verbs
- [ ] Use consistent date format
- [ ] Escape special characters
- [ ] Add `\vspace{0.5em}` between entries
- [ ] Use `\textit{}` for company names and locations
- [ ] Use `\textbf{}` for section headers in skills
- [ ] Include technologies in project descriptions
- [ ] Test compilation before finalizing

## 🔗 Useful Links

- [Full Reference Guide](./latex-reference.md)
- [ModernCV Documentation](https://github.com/xdanaux/moderncv)
- [Overleaf LaTeX Guide](https://www.overleaf.com/learn)
- [LaTeX Wikibook](https://en.wikibooks.org/wiki/LaTeX)

---

_Quick reference for the LaTeX Resume Generator. For detailed explanations, see the full reference guide._

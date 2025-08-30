# Resi - LaTeX Resume Generator

A modern, beautiful web application for generating professional LaTeX resumes. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Interactive Form Interface**: Easy-to-use form for entering resume information
- **LaTeX Generation**: Automatically generates professional LaTeX code using the ModernCV class
- **Real-time Preview**: See the generated LaTeX code before downloading
- **Professional Design**: Clean, modern UI with responsive design
- **Multiple Sections**: Support for experience, education, skills, projects, and certifications
- **Download Ready**: Direct download of .tex files for compilation

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or bun

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd resi
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
bun install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use the Resume Generator

1. **Navigate to the Resume Generator**: Click the "Resume Generator" button on the home page or go to `/resume`

2. **Fill in Your Information**:

   - **Personal Information**: Name, email, phone, location, LinkedIn, GitHub, website
   - **Professional Summary**: A brief overview of your background and goals
   - **Work Experience**: Add your work history with company, position, dates, and descriptions
   - **Education**: Include your academic background with institutions, degrees, and GPA
   - **Skills**: Organize your skills by categories
   - **Projects**: Showcase your projects with descriptions and technologies
   - **Certifications**: List your professional certifications

3. **Generate LaTeX**: Click the "Generate LaTeX Resume" button to create your LaTeX code

4. **Preview**: Switch to the "LaTeX Preview" tab to see the generated code

5. **Download**: Go to the "Download" tab and click "Download resume.tex"

## Compiling Your LaTeX Resume

### Option 1: Overleaf (Recommended for beginners)

1. Go to [overleaf.com](https://overleaf.com)
2. Create a new project
3. Upload your `resume.tex` file
4. Compile to generate a PDF

### Option 2: Local LaTeX Installation

1. Install a LaTeX distribution (TeX Live, MiKTeX, etc.)
2. Install a LaTeX editor (TeXstudio, TeXmaker, VS Code with LaTeX Workshop)
3. Open your `resume.tex` file
4. Compile to generate a PDF

### Required LaTeX Packages

The generated LaTeX uses the standard `article` class with custom formatting. Make sure your LaTeX distribution includes:

- `latexsym` package
- `fullpage` package
- `titlesec` package
- `marvosym` package
- `color` package
- `verbatim` package
- `enumitem` package
- `hyperref` package
- `fancyhdr` package
- `babel` package
- `tabularx` package

## Documentation

### 📚 Reference Guides

- **[LaTeX Reference Guide](./docs/latex-reference.md)**: Comprehensive guide to the LaTeX format, customization options, and best practices
- **[Quick Reference](./docs/quick-reference.md)**: Essential LaTeX commands and formatting for quick lookup

## Customization

### LaTeX Template

The resume uses the standard `article` class with custom formatting optimized for professional resumes. The template includes:

- **ATS-friendly formatting**: Machine-readable for Applicant Tracking Systems
- **Professional layout**: Clean, modern design with proper spacing
- **Custom commands**: Specialized commands for resume sections
- **Industry standard**: Based on widely-used professional resume templates

### Adding More Sections

The generator supports all major resume sections. You can extend it by:

1. Adding new form fields in the React component
2. Updating the `ResumeData` interface
3. Adding corresponding LaTeX generation functions

### Advanced Customization

For detailed customization options, formatting examples, and troubleshooting, see the [LaTeX Reference Guide](./docs/latex-reference.md).

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home page
│   ├── resume/
│   │   └── page.tsx          # Resume generator page
│   └── layout.tsx            # Root layout
├── components/
│   └── ui/                   # Shadcn/ui components
├── lib/
│   ├── resume-generator.ts   # LaTeX generation logic
│   └── utils.ts              # Utility functions
```

## Technologies Used

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: Beautiful, accessible UI components
- **Lucide React**: Icon library
- **React Hook Form**: Form handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Include your LaTeX distribution and editor information for compilation issues

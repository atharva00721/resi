# Resi - LaTeX Resume Generator

A modern, beautiful web application for generating professional LaTeX resumes. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Interactive Form Interface**: Easy-to-use form for entering resume information
- **AI-Powered Enhancement**: Gemini AI integration for smart content suggestions and optimization
- **LaTeX Generation**: Automatically generates professional LaTeX code using industry-standard formatting
- **Real-time Preview**: See the generated LaTeX code before downloading
- **Professional Design**: Clean, modern UI with responsive design
- **Multiple Sections**: Support for experience, education, skills, projects, and certifications
- **Download Ready**: Direct download of .tex files for compilation

### 🤖 AI Features

- **Smart Content Generation**: AI-powered bullet points and professional summaries
- **ATS Optimization**: Analyze and improve resume for Applicant Tracking Systems
- **Keyword Suggestions**: Get relevant keywords for your target job
- **Content Enhancement**: Improve existing content with better action verbs and impact
- **Real-time Analysis**: Get instant feedback on resume quality and compatibility
- **Interactive Chat**: Chat with AI assistants powered by Google Gemini models

> **Note**: AI features require a Google Generative AI API key. The resume generator works without AI features, but you'll need the API key for the smart enhancement capabilities and chat functionality.

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or bun
- Google Generative AI API Key (for AI features)

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

3. Set up your Google Generative AI API Key:

   Create a `.env.local` file in the root directory and add your API key:

   ```bash
   # .env.local
   GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key_here
   ```

   **To get your API key:**

   1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   2. Sign in with your Google account
   3. Click "Create API Key"
   4. Copy the generated key and paste it in your `.env.local` file

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use the Resume Generator

1. **Navigate to the Resume Generator**: Click the "Resume Generator" button on the home page or go to `/resume`

## How to Use the Chat Feature

1. **Navigate to the Chat**: Go to `/chat` in your browser
2. **Select a Model**: Choose from available models:
   - **Gemini Models**: Gemini 2.5 Pro, Flash, and Flash Lite
3. **Enable Features**: Toggle web search and thinking mode as needed
4. **Start Chatting**: Type your message and press Enter to start a conversation
5. **View Sources**: When web search is enabled, view sources used in responses
6. **See Reasoning**: When thinking mode is enabled, see the AI's reasoning process

7. **Fill in Your Information**:

   - **Personal Information**: Name, email, phone, location, LinkedIn, GitHub, website
   - **Professional Summary**: A brief overview of your background and goals
   - **Work Experience**: Add your work history with company, position, dates, and descriptions
   - **Education**: Include your academic background with institutions, degrees, and GPA
   - **Skills**: Organize your skills by categories
   - **Projects**: Showcase your projects with descriptions and technologies
   - **Certifications**: List your professional certifications

8. **Enhance with AI** (Optional): Use the AI enhancement buttons to:

   - Generate professional summaries
   - Create compelling bullet points
   - Optimize content for ATS systems
   - Get keyword suggestions

9. **Generate LaTeX**: Click the "Generate LaTeX Resume" button to create your LaTeX code

10. **Analyze ATS**: Click "Analyze ATS" to get compatibility score and improvement suggestions

11. **Preview**: Switch to the "LaTeX Preview" tab to see the generated code

12. **Download**: Go to the "Download" tab and click "Download resume.tex"

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

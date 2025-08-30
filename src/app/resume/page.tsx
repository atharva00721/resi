"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Plus, Download, FileText, Eye, Sparkles, Wand2 } from "lucide-react";
import { generateLaTeXResume } from "@/lib/resume-generator";
// AI functions are now handled via API routes

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

export default function ResumeGenerator() {
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      website: "",
    },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
  });

  const [generatedLaTeX, setGeneratedLaTeX] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAIEnhancing, setIsAIEnhancing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [atsScore, setAtsScore] = useState<number | null>(null);

  const addExperience = () => {
    setResumeData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: Date.now().toString(),
          company: "",
          position: "",
          location: "",
          startDate: "",
          endDate: "",
          current: false,
          description: [""],
        },
      ],
    }));
  };

  const addEducation = () => {
    setResumeData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: Date.now().toString(),
          institution: "",
          degree: "",
          field: "",
          location: "",
          startDate: "",
          endDate: "",
          current: false,
          gpa: "",
        },
      ],
    }));
  };

  const addSkillCategory = () => {
    setResumeData((prev) => ({
      ...prev,
      skills: [
        ...prev.skills,
        {
          category: "",
          skills: [""],
        },
      ],
    }));
  };

  const addProject = () => {
    setResumeData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          id: Date.now().toString(),
          name: "",
          description: "",
          technologies: [""],
          link: "",
        },
      ],
    }));
  };

  const addCertification = () => {
    setResumeData((prev) => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        {
          id: Date.now().toString(),
          name: "",
          issuer: "",
          date: "",
          link: "",
        },
      ],
    }));
  };

  const updateExperience = (id: string, field: string, value: any) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const updateEducation = (id: string, field: string, value: any) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  const generateResume = async () => {
    setIsGenerating(true);
    try {
      const latex = generateLaTeXResume(resumeData);
      setGeneratedLaTeX(latex);
    } catch (error) {
      console.error("Error generating LaTeX:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadLaTeX = () => {
    const blob = new Blob([generatedLaTeX], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.tex";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const enhanceWithAI = async (
    type: "bullet-points" | "summary" | "skills" | "optimization" | "keywords"
  ) => {
    setIsAIEnhancing(true);
    try {
      let request: any = { type };

      switch (type) {
        case "bullet-points":
          // Use the first experience entry if available
          if (resumeData.experience.length > 0) {
            const exp = resumeData.experience[0];
            request = {
              ...request,
              jobTitle: exp.position,
              company: exp.company,
              currentContent: exp.description.join(" "),
            };
          }
          break;
        case "summary":
          request = {
            ...request,
            jobTitle: resumeData.experience[0]?.position || "Software Engineer",
            experience: `${resumeData.experience.length} years of experience`,
            targetRole:
              resumeData.experience[0]?.position || "Senior Software Engineer",
          };
          break;
        case "skills":
          request = {
            ...request,
            jobTitle: resumeData.experience[0]?.position || "Software Engineer",
            experience: `${resumeData.experience.length} years of experience`,
          };
          break;
        case "keywords":
          request = {
            ...request,
            jobTitle: resumeData.experience[0]?.position || "Software Engineer",
            targetRole:
              resumeData.experience[0]?.position || "Senior Software Engineer",
          };
          break;
      }

      const response = await fetch("/api/ai/enhance-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error("Failed to enhance resume");
      }

      const result = await response.json();
      setAiSuggestions(result.suggestions);

      // If it's an optimization request, update the summary
      if (type === "optimization" && result.improvedContent) {
        setResumeData((prev) => ({
          ...prev,
          summary: result.improvedContent || "",
        }));
      }
    } catch (error) {
      console.error("Error enhancing with AI:", error);
      setAiSuggestions(["Unable to generate suggestions at this time."]);
    } finally {
      setIsAIEnhancing(false);
    }
  };

  const analyzeResume = async () => {
    setIsAIEnhancing(true);
    try {
      const targetJob =
        resumeData.experience[0]?.position || "Software Engineer";
      const resumeContent = JSON.stringify(resumeData);

      const response = await fetch("/api/ai/analyze-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resumeContent, targetJob }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze resume");
      }

      const analysis = await response.json();
      setAtsScore(analysis.score);
      setAiSuggestions([...analysis.suggestions, ...analysis.strengths]);
    } catch (error) {
      console.error("Error analyzing resume:", error);
      setAiSuggestions([
        "Unable to analyze resume effectiveness at this time.",
      ]);
    } finally {
      setIsAIEnhancing(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">LaTeX Resume Generator</h1>
        <p className="text-muted-foreground">
          Create a professional LaTeX resume with a beautiful, modern design
        </p>
      </div>

      <Tabs defaultValue="form" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="form">Resume Form</TabsTrigger>
          <TabsTrigger value="preview">LaTeX Preview</TabsTrigger>
          <TabsTrigger value="download">Download</TabsTrigger>
        </TabsList>

        <TabsContent value="form" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Your basic contact and personal details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={resumeData.personalInfo.name}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        personalInfo: {
                          ...prev.personalInfo,
                          name: e.target.value,
                        },
                      }))
                    }
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={resumeData.personalInfo.email}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        personalInfo: {
                          ...prev.personalInfo,
                          email: e.target.value,
                        },
                      }))
                    }
                    placeholder="john.doe@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={resumeData.personalInfo.phone}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        personalInfo: {
                          ...prev.personalInfo,
                          phone: e.target.value,
                        },
                      }))
                    }
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={resumeData.personalInfo.location}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        personalInfo: {
                          ...prev.personalInfo,
                          location: e.target.value,
                        },
                      }))
                    }
                    placeholder="San Francisco, CA"
                  />
                </div>
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={resumeData.personalInfo.linkedin}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        personalInfo: {
                          ...prev.personalInfo,
                          linkedin: e.target.value,
                        },
                      }))
                    }
                    placeholder="linkedin.com/in/johndoe"
                  />
                </div>
                <div>
                  <Label htmlFor="github">GitHub</Label>
                  <Input
                    id="github"
                    value={resumeData.personalInfo.github}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        personalInfo: {
                          ...prev.personalInfo,
                          github: e.target.value,
                        },
                      }))
                    }
                    placeholder="github.com/johndoe"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Professional Summary
                <div className="flex gap-2">
                  <Button
                    onClick={() => enhanceWithAI("summary")}
                    size="sm"
                    variant="outline"
                    disabled={isAIEnhancing}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    {isAIEnhancing ? "Generating..." : "AI Enhance"}
                  </Button>
                  <Button
                    onClick={() => enhanceWithAI("optimization")}
                    size="sm"
                    variant="outline"
                    disabled={isAIEnhancing}
                  >
                    <Wand2 className="h-4 w-4 mr-2" />
                    {isAIEnhancing ? "Optimizing..." : "Optimize"}
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                A brief overview of your professional background and goals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={resumeData.summary}
                onChange={(e) =>
                  setResumeData((prev) => ({
                    ...prev,
                    summary: e.target.value,
                  }))
                }
                placeholder="Experienced software engineer with 5+ years of expertise in full-stack development..."
                rows={4}
              />

              {/* AI Suggestions */}
              {aiSuggestions.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                    <Sparkles className="h-4 w-4 mr-2" />
                    AI Suggestions
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    {aiSuggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Resume Score */}
              {atsScore !== null && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">
                    Resume Effectiveness Score: {atsScore}/10
                  </h4>
                  <div className="w-full bg-green-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${(atsScore / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Work Experience
                <Button onClick={addExperience} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Experience
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {resumeData.experience.map((exp, index) => (
                <div key={exp.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold">Experience #{index + 1}</h4>
                    <Button
                      onClick={() => removeExperience(exp.id)}
                      size="sm"
                      variant="destructive"
                    >
                      Remove
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Company</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) =>
                          updateExperience(exp.id, "company", e.target.value)
                        }
                        placeholder="Google"
                      />
                    </div>
                    <div>
                      <Label>Position</Label>
                      <Input
                        value={exp.position}
                        onChange={(e) =>
                          updateExperience(exp.id, "position", e.target.value)
                        }
                        placeholder="Senior Software Engineer"
                      />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input
                        value={exp.location}
                        onChange={(e) =>
                          updateExperience(exp.id, "location", e.target.value)
                        }
                        placeholder="Mountain View, CA"
                      />
                    </div>
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) =>
                          updateExperience(exp.id, "startDate", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        type="month"
                        value={exp.endDate}
                        onChange={(e) =>
                          updateExperience(exp.id, "endDate", e.target.value)
                        }
                        disabled={exp.current}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`current-${exp.id}`}
                        checked={exp.current}
                        onChange={(e) =>
                          updateExperience(exp.id, "current", e.target.checked)
                        }
                      />
                      <Label htmlFor={`current-${exp.id}`}>
                        Current Position
                      </Label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Description</Label>
                      <Button
                        onClick={() => enhanceWithAI("bullet-points")}
                        size="sm"
                        variant="outline"
                        disabled={isAIEnhancing}
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        {isAIEnhancing ? "Generating..." : "AI Enhance"}
                      </Button>
                    </div>
                    <Textarea
                      value={exp.description.join("\n")}
                      onChange={(e) =>
                        updateExperience(
                          exp.id,
                          "description",
                          e.target.value
                            .split("\n")
                            .filter((line) => line.trim())
                        )
                      }
                      placeholder="• Led development of key features..."
                      rows={3}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Education
                <Button onClick={addEducation} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Education
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {resumeData.education.map((edu, index) => (
                <div key={edu.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold">Education #{index + 1}</h4>
                    <Button
                      onClick={() => removeEducation(edu.id)}
                      size="sm"
                      variant="destructive"
                    >
                      Remove
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Institution</Label>
                      <Input
                        value={edu.institution}
                        onChange={(e) =>
                          updateEducation(edu.id, "institution", e.target.value)
                        }
                        placeholder="Stanford University"
                      />
                    </div>
                    <div>
                      <Label>Degree</Label>
                      <Input
                        value={edu.degree}
                        onChange={(e) =>
                          updateEducation(edu.id, "degree", e.target.value)
                        }
                        placeholder="Bachelor of Science"
                      />
                    </div>
                    <div>
                      <Label>Field of Study</Label>
                      <Input
                        value={edu.field}
                        onChange={(e) =>
                          updateEducation(edu.id, "field", e.target.value)
                        }
                        placeholder="Computer Science"
                      />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input
                        value={edu.location}
                        onChange={(e) =>
                          updateEducation(edu.id, "location", e.target.value)
                        }
                        placeholder="Stanford, CA"
                      />
                    </div>
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        type="month"
                        value={edu.startDate}
                        onChange={(e) =>
                          updateEducation(edu.id, "startDate", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        type="month"
                        value={edu.endDate}
                        onChange={(e) =>
                          updateEducation(edu.id, "endDate", e.target.value)
                        }
                        disabled={edu.current}
                      />
                    </div>
                    <div>
                      <Label>GPA</Label>
                      <Input
                        value={edu.gpa}
                        onChange={(e) =>
                          updateEducation(edu.id, "gpa", e.target.value)
                        }
                        placeholder="3.8/4.0"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`edu-current-${edu.id}`}
                        checked={edu.current}
                        onChange={(e) =>
                          updateEducation(edu.id, "current", e.target.checked)
                        }
                      />
                      <Label htmlFor={`edu-current-${edu.id}`}>
                        Currently Studying
                      </Label>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-center gap-4">
            <Button onClick={generateResume} disabled={isGenerating} size="lg">
              {isGenerating ? "Generating..." : "Generate LaTeX Resume"}
            </Button>
            <Button
              onClick={analyzeResume}
              disabled={isAIEnhancing}
              size="lg"
              variant="outline"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {isAIEnhancing ? "Analyzing..." : "Analyze Resume"}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Generated LaTeX Code
              </CardTitle>
              <CardDescription>
                Preview the LaTeX code that will be generated for your resume
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedLaTeX ? (
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">{generatedLaTeX}</pre>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Generate your resume first to see the LaTeX code</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="download" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Download LaTeX File
              </CardTitle>
              <CardDescription>
                Download the generated LaTeX file to compile with your preferred
                LaTeX editor
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {generatedLaTeX ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Your LaTeX resume has been generated successfully! Click the
                    button below to download the .tex file.
                  </p>
                  <Button onClick={downloadLaTeX} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download resume.tex
                  </Button>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      Next Steps:
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>
                        • Open the .tex file in a LaTeX editor (Overleaf,
                        TeXstudio, etc.)
                      </li>
                      <li>• Compile the document to generate a PDF</li>
                      <li>• Customize the styling if needed</li>
                      <li>• Save your final resume as a PDF</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Download className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Generate your resume first to download the LaTeX file</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

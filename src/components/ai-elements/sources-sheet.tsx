"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BookIcon,
  CalendarIcon,
  GlobeIcon,
  FileTextIcon,
  ClockIcon,
} from "lucide-react";
import { useState, useEffect } from "react";

interface SourceData {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  domain?: string;
  publishedDate?: string;
  author?: string;
  readingTime?: string;
}

interface SourcesSheetProps {
  sources: Array<{ url: string; title?: string }>;
  trigger?: React.ReactNode;
  className?: string;
}

// Function to extract readable title and metadata from URL
const getSourceData = (url: string, title?: string): SourceData => {
  try {
    // Remove the Google redirect prefix
    const cleanUrl = url.replace(
      "https://vertexaisearch.cloud.google.com/grounding-api-redirect/",
      ""
    );

    const urlObj = new URL(cleanUrl);
    const domain = urlObj.hostname.replace("www.", "");
    const path = urlObj.pathname;

    // Create a readable title
    let readableTitle = title;
    if (!readableTitle && path && path !== "/") {
      const pathParts = path.split("/").filter(Boolean);
      if (pathParts.length > 0) {
        const lastPart = pathParts[pathParts.length - 1];
        const readablePart = lastPart
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());
        readableTitle = `${readablePart} - ${domain}`;
      }
    }

    if (!readableTitle) {
      readableTitle = domain;
    }

    // Generate a description based on the URL
    let description = "";
    if (path.includes("internship") || path.includes("career")) {
      description = "Career and internship opportunities";
    } else if (path.includes("startup") || path.includes("company")) {
      description = "Startup and company information";
    } else if (path.includes("tech") || path.includes("software")) {
      description = "Technology and software development resources";
    } else {
      description = "Relevant information and resources";
    }

    return {
      url: cleanUrl,
      title: readableTitle,
      description,
      domain,
      publishedDate: new Date().toLocaleDateString(), // Placeholder
      author: "Various Authors", // Placeholder
      readingTime: "2-5 min", // Placeholder
    };
  } catch {
    return {
      url,
      title: title || "Unknown Source",
      description: "Source information",
      domain: "unknown.com",
    };
  }
};

export const SourcesSheet = ({
  sources,
  trigger,
  className,
}: SourcesSheetProps) => {
  const [sourceData, setSourceData] = useState<SourceData[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen && sources.length > 0) {
      const data = sources.map((source) =>
        getSourceData(source.url, source.title)
      );
      setSourceData(data);
    }
  }, [isOpen, sources]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            size="sm"
            className={cn("flex items-center gap-2", className)}
          >
            <BookIcon className="h-4 w-4" />
            <span>Used {sources.length} sources</span>
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader className="pb-6">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <BookIcon className="h-5 w-5" />
            Sources & References
          </SheetTitle>
          <SheetDescription className="text-sm">
            {sources.length} source{sources.length !== 1 ? "s" : ""} used in
            this response
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-3">
          {sourceData.map((source, index) => (
            <div key={index} className="group">
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="block rounded-lg border border-border bg-card p-4 hover:bg-muted/50 transition-all duration-200 hover:border-border/80 hover:shadow-sm"
              >
                {/* Source Header */}
                <div className="mb-3">
                  <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-relaxed">
                    {source.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <GlobeIcon className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs text-muted-foreground truncate">
                      {source.domain}
                    </span>
                  </div>
                </div>

                {/* Source Description */}
                <p className="text-xs text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                  {source.description}
                </p>

                {/* Source Metadata */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  {source.publishedDate && (
                    <div className="flex items-center gap-1.5">
                      <CalendarIcon className="h-3 w-3" />
                      <span>{source.publishedDate}</span>
                    </div>
                  )}
                  {source.readingTime && (
                    <div className="flex items-center gap-1.5">
                      <ClockIcon className="h-3 w-3" />
                      <span>{source.readingTime}</span>
                    </div>
                  )}
                  {source.author && (
                    <div className="flex items-center gap-1.5">
                      <FileTextIcon className="h-3 w-3" />
                      <span>{source.author}</span>
                    </div>
                  )}
                </div>

                {/* Source URL */}
                <div className="pt-3 border-t border-border/50">
                  <p className="text-xs text-primary/70 group-hover:text-primary transition-colors break-all leading-relaxed">
                    {source.url}
                  </p>
                </div>
              </a>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            Sources are automatically extracted from web search results
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};

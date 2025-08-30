import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md border-0 shadow-none">
        <CardHeader className="text-center space-y-4">
          <CardTitle className="text-3xl font-light">Welcome to Resi</CardTitle>
          <CardDescription className="text-base">
            A beautiful, minimal space for your next big idea. Simple, clean,
            and ready to inspire.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="flex-1" size="lg">
              Get Started
            </Button>
            <Button variant="outline" className="flex-1" size="lg">
              Learn More
            </Button>
          </div>
          <div className="text-center text-sm text-muted-foreground pt-4">
            Built with Next.js & Tailwind CSS
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

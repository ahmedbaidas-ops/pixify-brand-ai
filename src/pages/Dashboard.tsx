import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, FolderOpen, Sparkles, Download, ArrowRight, FileStack, Activity } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-5xl font-bold mb-3 text-foreground">Qatar Airways</h1>
              <p className="text-xl text-muted-foreground">
                Premium airline brand guidelines & digital asset management
              </p>
            </div>
            <Button size="lg" className="bg-gradient-primary hover:opacity-90">
              <Download className="mr-2 h-5 w-5" />
              Download Brand Kit
            </Button>
          </div>

          {/* AI Prompt Card */}
          <Card className="shadow-lg border-2 border-primary/10 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                Ask Pixify about your brand
              </CardTitle>
              <CardDescription>
                Get instant answers about brand guidelines, find assets, generate copy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., 'What's our primary color?' or 'Find logo variations'"
                  className="flex-1 h-12 text-base"
                />
                <Button size="lg" className="bg-gradient-primary hover:opacity-90">
                  Ask <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Link to="/brand-health">
            <Card className="hover:shadow-md transition-shadow cursor-pointer group h-full">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Brand Health Score</CardTitle>
                <CardDescription>Monitor brand consistency metrics</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/playbook">
            <Card className="hover:shadow-md transition-shadow cursor-pointer group h-full">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <FileStack className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Generate Playbook</CardTitle>
                <CardDescription>One-click brand playbook export</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/guideline">
            <Card className="hover:shadow-md transition-shadow cursor-pointer group h-full">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Open Guideline</CardTitle>
                <CardDescription>View complete brand guidelines</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/requests">
            <Card className="hover:shadow-md transition-shadow cursor-pointer group h-full">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Request Asset</CardTitle>
                <CardDescription>AI-powered design requests</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/library">
            <Card className="hover:shadow-md transition-shadow cursor-pointer group h-full">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <FolderOpen className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Browse Library</CardTitle>
                <CardDescription>All brand assets in one place</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Brand Snapshot */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Brand Strategy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Archetype</h4>
                <p className="text-foreground font-medium">Caregiver / Explorer</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Tone</h4>
                <p className="text-foreground font-medium">Warm, Premium, Trustworthy</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Values</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    Excellence
                  </span>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    Innovation
                  </span>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    Care
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Color Palette</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-3 text-sm text-muted-foreground">Primary Colors</h4>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <div className="h-16 rounded-lg bg-[#5C0A3A] shadow-md mb-2"></div>
                    <p className="text-xs font-mono">#5C0A3A</p>
                    <p className="text-xs text-muted-foreground">Qatar Maroon</p>
                  </div>
                  <div className="flex-1">
                    <div className="h-16 rounded-lg bg-[#CBB59C] shadow-md mb-2"></div>
                    <p className="text-xs font-mono">#CBB59C</p>
                    <p className="text-xs text-muted-foreground">Sand</p>
                  </div>
                  <div className="flex-1">
                    <div className="h-16 rounded-lg bg-[#0F1020] shadow-md mb-2"></div>
                    <p className="text-xs font-mono">#0F1020</p>
                    <p className="text-xs text-muted-foreground">Neutral</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Logo uploaded</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-muted-foreground mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Guideline updated</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-muted-foreground mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Playbook generated</p>
                    <p className="text-xs text-muted-foreground">3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

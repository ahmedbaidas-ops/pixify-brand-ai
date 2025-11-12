import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, FolderOpen, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-8">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">AI-Powered Brand Management</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 text-foreground">
            Pixify DAM
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed">
            The complete brand DAM with AI-powered guidelines.
            <br />
            Manage assets, enforce standards, and scale your brand consistently.
          </p>

          <div className="flex gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90 text-lg px-8 py-6">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto">
          <div className="text-center p-8 rounded-2xl bg-card shadow-md hover:shadow-lg transition-shadow">
            <div className="h-14 w-14 rounded-xl bg-gradient-primary flex items-center justify-center mx-auto mb-6">
              <Sparkles className="h-7 w-7 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-3">AI Assistant</h3>
            <p className="text-muted-foreground">
              Ask questions about your brand, find assets instantly, and generate on-brand copy
            </p>
          </div>

          <div className="text-center p-8 rounded-2xl bg-card shadow-md hover:shadow-lg transition-shadow">
            <div className="h-14 w-14 rounded-xl bg-gradient-primary flex items-center justify-center mx-auto mb-6">
              <FolderOpen className="h-7 w-7 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-3">Digital Asset Management</h3>
            <p className="text-muted-foreground">
              Centralized library with versioning, tagging, and smart search
            </p>
          </div>

          <div className="text-center p-8 rounded-2xl bg-card shadow-md hover:shadow-lg transition-shadow">
            <div className="h-14 w-14 rounded-xl bg-gradient-primary flex items-center justify-center mx-auto mb-6">
              <Shield className="h-7 w-7 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-3">Brand Guidelines</h3>
            <p className="text-muted-foreground">
              Interactive guidelines with Cash-App inspired design and AI-powered assistance
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

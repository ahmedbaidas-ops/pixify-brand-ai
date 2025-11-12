import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Sparkles, Zap, Shield, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Index = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Excellence",
      description: "Leverage cutting-edge AI to transform your creative workflows and deliver exceptional results faster.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Streamline your entire creative process with automated workflows that save hours every day.",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with SOC 2 compliance, keeping your creative assets safe and sound.",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Built for teams. Real-time collaboration that keeps everyone aligned and moving forward.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Modern Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-background/80 backdrop-blur-xl border-b border-border' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src="/qatar-airways-logo.png" 
                alt="Pixify Logo" 
                className="h-10 w-auto transition-transform duration-300 group-hover:scale-110"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-primary via-[#E639C4] to-[#FF8451] bg-clip-text text-transparent">
                Pixify
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
                Features
              </a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
                How it works
              </a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
                Pricing
              </a>
              <Link to="/auth">
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Get Started
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(154,51,166,0.15),transparent_50%)]" />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-4">
              <Sparkles className="w-4 h-4" />
              AI-Powered Brand Management
            </div>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight max-w-5xl mx-auto leading-[1.1]">
              Your brand assets,
              <span className="block bg-gradient-to-r from-primary via-[#E639C4] to-[#FF8451] bg-clip-text text-transparent">
                powered by AI
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Manage, organize, and distribute your creative assets with intelligence. 
              Pixify transforms how teams work with digital assets.
            </p>

            <div className="flex items-center justify-center gap-4 pt-4">
              <Link to="/auth">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 h-14 group">
                  Start for free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 h-14">
                Watch demo
              </Button>
            </div>

            <div className="pt-8 text-sm text-muted-foreground">
              <div className="flex items-center justify-center gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image/Visual */}
          <div className="mt-20 relative animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="relative rounded-2xl overflow-hidden border border-border shadow-2xl bg-card">
              <div className="aspect-video bg-gradient-to-br from-primary/20 via-background to-background p-12">
                <div className="grid grid-cols-3 gap-4 h-full">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="rounded-lg bg-muted/50 backdrop-blur-sm border border-border/50 hover:scale-105 transition-transform duration-300"
                      style={{ animationDelay: `${i * 100}ms` }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-[#E639C4]/20 blur-3xl -z-10 opacity-50" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-4xl md:text-5xl font-bold">Everything you need</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features that transform how your team manages creative assets
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group relative p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-4xl md:text-5xl font-bold">Simple, powerful workflow</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes, not days
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Upload & Organize",
                description: "Drag and drop your assets. Our AI automatically tags and categorizes everything.",
              },
              {
                step: "02",
                title: "Collaborate",
                description: "Share with your team, get feedback, and approve assets in real-time.",
              },
              {
                step: "03",
                title: "Distribute",
                description: "Deliver the right assets to the right channels at the right time.",
              },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="text-6xl font-bold text-primary/10 mb-4">{item.step}</div>
                <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-12 -right-6 w-12 h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="pricing" className="py-32 px-6 bg-gradient-to-br from-primary/10 via-background to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(230,57,196,0.15),transparent_50%)]" />
        
        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Ready to transform your
            <span className="block bg-gradient-to-r from-primary via-[#E639C4] to-[#FF8451] bg-clip-text text-transparent">
              creative workflow?
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Join thousands of teams already using Pixify to manage their brand assets.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link to="/auth">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 h-14 group">
                Get started for free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 h-14">
              Talk to sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src="/qatar-airways-logo.png" alt="Pixify Logo" className="h-8 w-auto" />
              <span className="text-sm text-muted-foreground">© 2024 Pixify. All rights reserved.</span>
            </div>
            <nav className="flex items-center gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

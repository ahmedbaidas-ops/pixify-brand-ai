import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Sparkles, Zap, Shield, Users, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { MagneticButton } from "@/components/MagneticButton";
import { CustomCursor } from "@/components/CustomCursor";
import { GrainOverlay } from "@/components/GrainOverlay";
import { AnimatedLetter } from "@/components/AnimatedText";

const Index = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  // Smooth spring physics for natural movement
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  // Different parallax speeds and rotations for each image
  const imageY1 = useTransform(smoothProgress, [0, 1], [0, -120]);
  const imageY2 = useTransform(smoothProgress, [0, 1], [0, -180]);
  const imageY3 = useTransform(smoothProgress, [0, 1], [0, -80]);
  const imageY4 = useTransform(smoothProgress, [0, 1], [0, -150]);
  
  const imageRotate1 = useTransform(smoothProgress, [0, 1], [-8, 15]);
  const imageRotate2 = useTransform(smoothProgress, [0, 1], [6, -12]);
  const imageRotate3 = useTransform(smoothProgress, [0, 1], [-4, 10]);
  const imageRotate4 = useTransform(smoothProgress, [0, 1], [10, -8]);
  
  const imageScale1 = useTransform(smoothProgress, [0, 0.5, 1], [1, 1.1, 0.9]);
  const imageScale2 = useTransform(smoothProgress, [0, 0.5, 1], [1, 1.15, 0.85]);
  const imageScale3 = useTransform(smoothProgress, [0, 0.5, 1], [1, 1.05, 0.95]);
  const imageScale4 = useTransform(smoothProgress, [0, 0.5, 1], [1, 1.12, 0.88]);
  
  const imageOpacity = useTransform(smoothProgress, [0, 0.8, 1], [1, 0.8, 0]);
  
  // Text parallax for depth
  const textY = useTransform(smoothProgress, [0, 1], [0, 100]);
  const textOpacity = useTransform(smoothProgress, [0, 0.5], [1, 0]);

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

  const marqueeImages = [
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1618172193622-ae2d025f4032?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?w=400&h=400&fit=crop",
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <CustomCursor />
      {/* Minimal Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-background/95 backdrop-blur-md' : 'bg-transparent'
      }`}>
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src="/qatar-airways-logo.png" 
                alt="Pixify Logo" 
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold tracking-tight">
                PIXIFY
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-10 h-10 flex items-center justify-center hover:bg-muted rounded-full transition-colors"
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div 
          initial={false}
          animate={{ height: menuOpen ? "auto" : 0, opacity: menuOpen ? 1 : 0 }}
          className="overflow-hidden bg-background border-b border-border"
        >
          <nav className="max-w-[1800px] mx-auto px-6 md:px-12 py-8 flex flex-col gap-4">
            <a href="#features" className="text-2xl font-medium hover:text-primary transition-colors" onClick={() => setMenuOpen(false)}>
              Features
            </a>
            <a href="#how-it-works" className="text-2xl font-medium hover:text-primary transition-colors" onClick={() => setMenuOpen(false)}>
              How it works
            </a>
            <a href="#cta" className="text-2xl font-medium hover:text-primary transition-colors" onClick={() => setMenuOpen(false)}>
              Get Started
            </a>
            <Link to="/auth" className="mt-4">
              <Button size="lg" className="w-full">
                Sign In
              </Button>
            </Link>
          </nav>
        </motion.div>
      </header>

      {/* Hero Section - Cattleya Style */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center pt-32 pb-20 px-6 md:px-12 overflow-hidden">
        {/* Grain texture overlay */}
        <GrainOverlay />
        
        {/* Subtitle */}
        <motion.p 
          style={{ y: textY, opacity: textOpacity }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center text-sm md:text-base tracking-[0.3em] uppercase text-muted-foreground mb-8"
        >
          AI-Powered Brand Management
        </motion.p>

        {/* Large Hero Text with Overlapping Images */}
        <div className="relative max-w-[1800px] mx-auto w-full">
          <motion.h1 
            style={{ y: textY }}
            className="text-[12vw] md:text-[10vw] lg:text-[9vw] font-bold tracking-tighter leading-[0.85] text-center"
          >
            <AnimatedLetter delay={0.2} className="relative">
              P
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                style={{ 
                  y: imageY1, 
                  rotate: imageRotate1, 
                  scale: imageScale1,
                  opacity: imageOpacity 
                }}
                className="absolute -top-[20%] -left-[10%] w-[80px] md:w-[120px] lg:w-[160px] aspect-square rounded-2xl overflow-hidden shadow-2xl z-10"
              >
                <img src={marqueeImages[0]} alt="" className="w-full h-full object-cover" />
              </motion.div>
            </AnimatedLetter>
            <AnimatedLetter delay={0.28}>I</AnimatedLetter>
            <AnimatedLetter delay={0.36} className="relative">
              X
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                style={{ 
                  y: imageY2, 
                  rotate: imageRotate2, 
                  scale: imageScale2,
                  opacity: imageOpacity 
                }}
                className="absolute top-[10%] -right-[30%] w-[70px] md:w-[100px] lg:w-[140px] aspect-square rounded-2xl overflow-hidden shadow-2xl z-10"
              >
                <img src={marqueeImages[1]} alt="" className="w-full h-full object-cover" />
              </motion.div>
            </AnimatedLetter>
            <AnimatedLetter delay={0.44}>I</AnimatedLetter>
            <AnimatedLetter delay={0.52} className="relative">
              F
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                style={{ 
                  y: imageY3, 
                  rotate: imageRotate3, 
                  scale: imageScale3,
                  opacity: imageOpacity 
                }}
                className="absolute -bottom-[40%] left-[20%] w-[60px] md:w-[90px] lg:w-[120px] aspect-square rounded-2xl overflow-hidden shadow-2xl z-10"
              >
                <img src={marqueeImages[2]} alt="" className="w-full h-full object-cover" />
              </motion.div>
            </AnimatedLetter>
            <AnimatedLetter delay={0.6} className="relative">
              Y
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.1 }}
                style={{ 
                  y: imageY4, 
                  rotate: imageRotate4, 
                  scale: imageScale4,
                  opacity: imageOpacity 
                }}
                className="absolute top-[30%] -right-[40%] w-[65px] md:w-[95px] lg:w-[130px] aspect-square rounded-2xl overflow-hidden shadow-2xl z-10"
              >
                <img src={marqueeImages[3]} alt="" className="w-full h-full object-cover" />
              </motion.div>
            </AnimatedLetter>
          </motion.h1>
        </div>

        {/* Hero Description */}
        <motion.div 
          style={{ y: textY, opacity: textOpacity }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 max-w-2xl mx-auto text-center"
        >
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Manage, organize, and distribute your creative assets with intelligence. 
            Pixify transforms how teams work with digital assets.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div 
          style={{ y: textY, opacity: textOpacity }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 flex items-center justify-center gap-4"
        >
          <MagneticButton strength={0.35}>
            <Link to="/auth">
              <Button size="lg" className="text-base px-8 h-14 group rounded-full">
                Get started
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </MagneticButton>
        </motion.div>
      </section>

      {/* Horizontal Scrolling Marquee */}
      <section className="py-12 overflow-hidden border-y border-border">
        <div className="flex animate-marquee">
          {[...marqueeImages, ...marqueeImages, ...marqueeImages].map((img, idx) => (
            <div 
              key={idx} 
              className="flex-shrink-0 w-[200px] md:w-[280px] h-[200px] md:h-[280px] mx-3 rounded-2xl overflow-hidden"
            >
              <img 
                src={img} 
                alt="" 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="py-32 px-6 md:px-12">
        <div className="max-w-[1800px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-6">About us</p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-8">
                Where ideas meet
                <br />
                <span className="text-primary">impact</span>
              </h2>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Founded on integrity and excellence, Pixify has always believed that success comes from 
                consistency and dedication. We craft bold digital solutions through strategy, design, 
                and AI—helping brands move faster, connect deeper, and stand out.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 md:px-12 bg-muted/30">
        <div className="max-w-[1800px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-6">Services</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl leading-[1.1]">
              We craft bold digital solutions through strategy, design, and AI
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 60, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ 
                  duration: 0.5, 
                  delay: idx * 0.15,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group relative p-8 rounded-3xl bg-background border border-border hover:border-primary/50 transition-colors duration-500 hover:shadow-xl cursor-pointer"
              >
                <motion.div 
                  className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                  whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
                >
                  <feature.icon className="w-6 h-6" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-32 px-6 md:px-12">
        <div className="max-w-[1800px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-6">How it works</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Simple, powerful workflow
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-16">
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
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="relative text-center md:text-left"
              >
                <div className="text-8xl md:text-9xl font-bold text-primary/10 mb-4 leading-none">{item.step}</div>
                <h3 className="text-2xl md:text-3xl font-semibold mb-4 tracking-tight">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-32 px-6 md:px-12 bg-foreground text-background">
        <div className="max-w-[1800px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-8">
                Ready to transform your creative workflow?
              </h2>
              <p className="text-lg md:text-xl opacity-70 mb-12">
                Join thousands of teams already using Pixify to manage their brand assets.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <MagneticButton strength={0.35}>
                  <Link to="/auth">
                    <Button size="lg" variant="secondary" className="text-base px-8 h-14 rounded-full group">
                      Get started for free
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </MagneticButton>
                <MagneticButton strength={0.35}>
                  <Button size="lg" variant="outline" className="text-base px-8 h-14 rounded-full border-background/30 text-background hover:bg-background/10">
                    Talk to sales
                  </Button>
                </MagneticButton>
              </div>
            </div>

            <div className="space-y-6">
              {[
                "No credit card required",
                "14-day free trial",
                "Cancel anytime",
                "Enterprise-grade security"
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-6 h-6 rounded-full bg-background/20 flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="text-lg">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 md:px-12 border-t border-border">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src="/qatar-airways-logo.png" alt="Pixify Logo" className="h-8 w-auto" />
              <span className="font-bold tracking-tight">PIXIFY</span>
            </div>
            
            <nav className="flex items-center gap-8">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                How it works
              </a>
              <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Sign In
              </Link>
            </nav>
            
            <span className="text-sm text-muted-foreground">© 2024 Pixify. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

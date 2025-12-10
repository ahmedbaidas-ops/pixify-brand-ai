import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Sparkles, Zap, Shield, Users, Menu, X, Layers, Info, Briefcase, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";
import { MagneticButton } from "@/components/MagneticButton";
import { CustomCursor } from "@/components/CustomCursor";
import { GrainOverlay } from "@/components/GrainOverlay";
import pixifyLogo from "@/assets/pixify-logo-hero.png";

const Index = () => {
  const [menuOpen, setMenuOpen] = useState(false);

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

  const marketingWords = [
    "Brand Assets", "AI-Powered", "Collaboration", "Templates", "Guidelines",
    "Auto-Tagging", "Version Control", "Smart Search", "Analytics", "Compliance",
    "Motion Design", "Brand Health", "Workflows", "Distribution", "Marketing Suite",
  ];

  return (
    <div className="min-h-screen bg-white text-black overflow-x-hidden">
      <CustomCursor />
      {/* Noura-style Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-6">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img 
              src={pixifyLogo} 
              alt="Pixify" 
              className="h-8 w-auto dark:invert"
            />
          </Link>

          {/* Right side nav pill */}
          <nav className="hidden md:flex items-center bg-black/5 backdrop-blur-md rounded-full px-2 py-2 border border-black/10">
            <motion.a 
              href="#features" 
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-black/70 hover:text-black transition-colors rounded-full hover:bg-black/5"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Layers className="w-4 h-4" />
              Features
            </motion.a>
            <motion.a 
              href="#how-it-works" 
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-black/70 hover:text-black transition-colors rounded-full hover:bg-black/5"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Info className="w-4 h-4" />
              About
            </motion.a>
            <motion.a 
              href="#cta" 
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-black/70 hover:text-black transition-colors rounded-full hover:bg-black/5"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Briefcase className="w-4 h-4" />
              Works
            </motion.a>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link 
                to="/auth" 
                className="ml-2 px-5 py-2 text-sm font-medium bg-black text-white rounded-full hover:bg-black/90 transition-colors"
              >
                Contact
              </Link>
            </motion.div>
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-3">
            <ThemeToggle />
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 flex items-center justify-center bg-black/5 backdrop-blur-md rounded-full border border-black/10"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Desktop theme toggle + Get Started */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Link 
              to="/auth"
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-black text-white rounded-full hover:bg-black/90 transition-all hover:scale-105 shadow-lg whitespace-nowrap"
            >
              <Play className="w-4 h-4" />
              Get Started
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div 
          initial={false}
          animate={{ height: menuOpen ? "auto" : 0, opacity: menuOpen ? 1 : 0 }}
          className="md:hidden overflow-hidden mt-4"
        >
          <nav className="bg-white/95 backdrop-blur-md rounded-2xl p-6 flex flex-col gap-3 border border-black/10">
            <a href="#features" className="text-lg font-medium text-black/70 hover:text-black transition-colors" onClick={() => setMenuOpen(false)}>
              Features
            </a>
            <a href="#how-it-works" className="text-lg font-medium text-black/70 hover:text-black transition-colors" onClick={() => setMenuOpen(false)}>
              About
            </a>
            <a href="#cta" className="text-lg font-medium text-black/70 hover:text-black transition-colors" onClick={() => setMenuOpen(false)}>
              Works
            </a>
            <Link to="/auth" className="mt-2">
              <Button className="w-full bg-black text-white hover:bg-black/90 rounded-full">
                Contact
              </Button>
            </Link>
          </nav>
        </motion.div>
      </header>

      {/* Hero Section - Full Video */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Full-screen Video Background */}
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/logo_animation.mp4" type="video/mp4" />
        </video>
        
        {/* Optional overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Grain texture overlay */}
        <GrainOverlay />
        
        {/* Hero Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12">
          {/* Hero Description */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-2xl text-center"
          >
            <p className="text-lg md:text-xl text-black leading-relaxed mb-8">
              Manage, organize, and distribute your creative assets with intelligence. 
              Pixify transforms how teams work with digital assets.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex items-center justify-center gap-4">
              <MagneticButton strength={0.35}>
                <Link to="/auth">
                  <Button size="lg" className="text-base px-8 h-14 group rounded-full bg-black text-white hover:bg-black/90">
                    Get started
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </MagneticButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Horizontal Scrolling Marquee with Floating Chips */}
      <section className="py-12 overflow-hidden border-y border-black/10">
        <div className="flex animate-marquee">
          {[...marketingWords, ...marketingWords, ...marketingWords].map((word, idx) => (
            <motion.div 
              key={idx} 
              className="flex-shrink-0 mx-3"
              animate={{ 
                y: [0, -8, 0],
              }}
              transition={{
                duration: 2 + (idx % 5) * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: idx * 0.1,
              }}
              whileHover={{ 
                scale: 1.15, 
                y: -20,
                transition: { type: "spring", stiffness: 400, damping: 15 }
              }}
            >
              <span className="inline-block px-6 py-3 md:px-8 md:py-4 rounded-full bg-black text-white font-medium text-sm md:text-base border border-black hover:bg-black/80 transition-colors duration-300 cursor-default whitespace-nowrap shadow-sm hover:shadow-lg">
                {word}
              </span>
            </motion.div>
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
              <p className="text-sm tracking-[0.3em] uppercase text-black/60 mb-6">About us</p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-8">
                Where ideas meet
                <br />
                <span className="text-black">impact</span>
              </h2>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <p className="text-lg md:text-xl text-black/60 leading-relaxed">
                Founded on integrity and excellence, Pixify has always believed that success comes from 
                consistency and dedication. We craft bold digital solutions through strategy, design, 
                and AI—helping brands move faster, connect deeper, and stand out.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 md:px-12 bg-black/5">
        <div className="max-w-[1800px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <p className="text-sm tracking-[0.3em] uppercase text-black/60 mb-6">Services</p>
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
                className="group relative p-8 rounded-3xl bg-white border border-black/10 hover:border-black/30 transition-colors duration-500 hover:shadow-xl cursor-pointer"
              >
                <motion.div 
                  className="w-14 h-14 rounded-2xl bg-black/10 flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-all duration-300"
                  whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
                >
                  <feature.icon className="w-6 h-6" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-black/60 leading-relaxed">{feature.description}</p>
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
            <p className="text-sm tracking-[0.3em] uppercase text-black/60 mb-6">How it works</p>
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
                <div className="text-8xl md:text-9xl font-bold text-black/10 mb-4 leading-none">{item.step}</div>
                <h3 className="text-2xl md:text-3xl font-semibold mb-4 tracking-tight">{item.title}</h3>
                <p className="text-black/60 leading-relaxed text-lg">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-32 px-6 md:px-12 bg-white text-black">
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
                     <Button size="lg" className="text-base px-8 h-14 rounded-full group bg-black text-white hover:bg-black/90">
                      Get started for free
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </MagneticButton>
                <MagneticButton strength={0.35}>
                  <Button size="lg" variant="outline" className="text-base px-8 h-14 rounded-full border-black/30 text-black hover:bg-black/10">
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
                  <div className="w-6 h-6 rounded-full bg-black/20 flex items-center justify-center">
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
      <footer className="py-12 px-6 md:px-12 border-t border-black/10">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src={pixifyLogo} alt="Pixify Logo" className="h-8 w-auto" />
              <span className="font-bold tracking-tight">PIXIFY</span>
            </div>
            
            <nav className="flex items-center gap-8">
              <a href="#features" className="text-sm text-black/60 hover:text-black transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-black/60 hover:text-black transition-colors">
                How it works
              </a>
              <Link to="/auth" className="text-sm text-black/60 hover:text-black transition-colors">
                Sign In
              </Link>
            </nav>
            
            <span className="text-sm text-black/60">© 2024 Pixify. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

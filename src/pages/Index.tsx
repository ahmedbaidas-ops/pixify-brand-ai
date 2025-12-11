import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Sparkles, Zap, Shield, Users, Menu, X, Layers, Info, Briefcase, Play, DollarSign, Coins } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";
import { MagneticButton } from "@/components/MagneticButton";
import { CustomCursor } from "@/components/CustomCursor";
import { GrainOverlay } from "@/components/GrainOverlay";
import pixifyLogo from "@/assets/pixify-logo-hero.png";

const Index = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isOverDark, setIsOverDark] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [pricingTab, setPricingTab] = useState<'plans' | 'credits'>('plans');
  const [isAnnual, setIsAnnual] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('header');
      if (!header) return;
      
      // Check if user has scrolled
      setHasScrolled(window.scrollY > 50);
      
      const headerRect = header.getBoundingClientRect();
      const headerMiddle = headerRect.top + headerRect.height / 2;
      
      // Check all dark sections
      const darkSections = document.querySelectorAll('[data-dark-section]');
      let overDark = false;
      
      darkSections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (headerMiddle >= rect.top && headerMiddle <= rect.bottom) {
          overDark = true;
        }
      });
      
      setIsOverDark(overDark);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
    
    return () => window.removeEventListener('scroll', handleScroll);
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

  const marketingWords = [
    "Brand Assets", "AI-Powered", "Collaboration", "Templates", "Guidelines",
    "Auto-Tagging", "Version Control", "Smart Search", "Analytics", "Compliance",
    "Motion Design", "Brand Health", "Workflows", "Distribution", "Marketing Suite",
  ];

  return (
    <div className="min-h-screen bg-white text-black overflow-x-hidden">
      <CustomCursor />
      {/* Noura-style Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-6 transition-all duration-300 ${
        hasScrolled 
          ? isOverDark 
            ? 'bg-black/60 backdrop-blur-xl border-b border-white/10' 
            : 'bg-white/60 backdrop-blur-xl border-b border-black/5'
          : 'bg-transparent border-b border-transparent'
      } ${isOverDark ? 'text-white' : 'text-black'}`}>
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img 
              src={pixifyLogo} 
              alt="Pixify" 
              className={`h-8 w-auto transition-all duration-300 ${isOverDark ? 'invert' : ''}`}
            />
          </Link>

          {/* Right side nav pill */}
          <nav className={`hidden md:flex items-center backdrop-blur-md rounded-full px-2 py-2 border transition-colors duration-300 ${
            isOverDark 
              ? 'bg-white/10 border-white/20' 
              : 'bg-black/5 border-black/10'
          }`}>
            <motion.a 
              href="#features" 
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-full ${
                isOverDark 
                  ? 'text-white/70 hover:text-white hover:bg-white/10' 
                  : 'text-black/70 hover:text-black hover:bg-black/5'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Layers className="w-4 h-4" />
              Features
            </motion.a>
            <motion.a 
              href="#how-it-works" 
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-full ${
                isOverDark 
                  ? 'text-white/70 hover:text-white hover:bg-white/10' 
                  : 'text-black/70 hover:text-black hover:bg-black/5'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Info className="w-4 h-4" />
              About
            </motion.a>
            <motion.a 
              href="#cta" 
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-full ${
                isOverDark 
                  ? 'text-white/70 hover:text-white hover:bg-white/10' 
                  : 'text-black/70 hover:text-black hover:bg-black/5'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Briefcase className="w-4 h-4" />
              Works
            </motion.a>
            <motion.a 
              href="#pricing" 
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-full ${
                isOverDark 
                  ? 'text-white/70 hover:text-white hover:bg-white/10' 
                  : 'text-black/70 hover:text-black hover:bg-black/5'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <DollarSign className="w-4 h-4" />
              Pricing
            </motion.a>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link 
                to="/auth" 
                className={`ml-2 px-5 py-2 text-sm font-medium rounded-full transition-colors ${
                  isOverDark 
                    ? 'bg-white text-black hover:bg-white/90' 
                    : 'bg-black text-white hover:bg-black/90'
                }`}
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
              className={`w-10 h-10 flex items-center justify-center backdrop-blur-md rounded-full border transition-colors duration-300 ${
                isOverDark 
                  ? 'bg-white/10 border-white/20' 
                  : 'bg-black/5 border-black/10'
              }`}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Desktop theme toggle + Get Started */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Link 
              to="/auth"
              className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-full transition-all hover:scale-105 shadow-lg whitespace-nowrap ${
                isOverDark 
                  ? 'bg-white text-black hover:bg-white/90' 
                  : 'bg-black text-white hover:bg-black/90'
              }`}
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
            <a href="#pricing" className="text-lg font-medium text-black/70 hover:text-black transition-colors" onClick={() => setMenuOpen(false)}>
              Pricing
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
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 md:pb-24 px-6 md:px-12">
          {/* Hero Description */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-4xl text-center flex flex-col items-center"
          >
            <motion.h1 
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-black mb-6 tracking-tight text-center whitespace-nowrap glitch-text"
              data-text="Unlock Your Brand Potential"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {"Unlock Your Brand Potential".split("").map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: 0.3 + index * 0.03,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  className="inline-block glitch-letter"
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-black/70 leading-relaxed mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              Manage, organize, and distribute your creative assets with intelligence. 
              Pixify transforms how teams work with digital assets.
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div 
              className="flex items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            >
              <MagneticButton strength={0.35}>
                <Link to="/auth">
                  <Button size="lg" className="text-base px-8 h-14 group rounded-full bg-black text-white hover:bg-black/90">
                    Get started
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </MagneticButton>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Horizontal Scrolling Marquee with Floating Chips */}
      <section className="py-12 overflow-hidden border-y border-black/10 relative z-10">
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

      {/* Features Section - Creative Layout */}
      <section id="features" data-dark-section className="py-32 px-6 md:px-12 bg-black text-white overflow-hidden">
        <div className="max-w-[1800px] mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="mb-20 relative"
          >
            <motion.p 
              className="text-sm tracking-[0.3em] uppercase text-white/40 mb-6"
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Services
            </motion.p>
            <motion.h2 
              className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight max-w-4xl leading-[1.1]"
              initial={{ y: 100, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              We craft bold digital solutions through{" "}
              <motion.span 
                className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/60 to-white"
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                style={{ backgroundSize: "200% 200%" }}
              >
                strategy, design, and AI
              </motion.span>
            </motion.h2>
            
            {/* Floating accent elements */}
            <motion.div 
              className="absolute -right-20 top-0 w-40 h-40 rounded-full bg-white/5 blur-3xl"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 100, rotateX: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.8, 
                  delay: idx * 0.2,
                  ease: [0.25, 0.1, 0.25, 1]
                }}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.4 } 
                }}
                className="group relative p-8 md:p-12 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-700 cursor-pointer overflow-hidden"
              >
                {/* Animated background gradient on hover */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                />
                
                {/* Floating number */}
                <motion.span 
                  className="absolute -right-4 -top-8 text-[120px] md:text-[180px] font-bold text-white/[0.03] select-none"
                  initial={{ x: 50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: idx * 0.2 + 0.5 }}
                >
                  0{idx + 1}
                </motion.span>
                
                <div className="relative z-10">
                  {/* Icon with creative animation */}
                  <motion.div 
                    className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-8 group-hover:bg-white group-hover:text-black transition-all duration-500"
                    whileHover={{ 
                      rotate: 360,
                      scale: 1.1,
                      transition: { duration: 0.8, ease: "easeInOut" }
                    }}
                  >
                    <feature.icon className="w-7 h-7" />
                  </motion.div>
                  
                  {/* Title with underline animation */}
                  <h3 className="text-2xl md:text-3xl font-semibold mb-4 tracking-tight relative inline-block">
                    {feature.title}
                    <motion.span 
                      className="absolute -bottom-2 left-0 h-[2px] bg-white/50"
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: idx * 0.2 + 0.6 }}
                    />
                  </h3>
                  
                  {/* Description with stagger reveal */}
                  <motion.p 
                    className="text-white/60 leading-relaxed text-lg max-w-md"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.2 + 0.4 }}
                  >
                    {feature.description}
                  </motion.p>
                  
                  {/* Arrow indicator */}
                  <motion.div 
                    className="mt-8 flex items-center gap-2 text-white/40 group-hover:text-white transition-colors duration-500"
                    initial={{ x: -10, opacity: 0 }}
                    whileHover={{ x: 10 }}
                  >
                    <span className="text-sm font-medium">Learn more</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                  </motion.div>
                </div>
                
                {/* Corner accent */}
                <motion.div 
                  className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-white/5 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
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

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6 md:px-12 bg-[#f8f8f6] overflow-hidden">
        <div className="max-w-[1800px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-16 text-center"
          >
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-block px-4 py-2 rounded-full bg-black/5 text-sm font-medium text-black/60 mb-6"
            >
              Pricing
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
            >
              Transparent pricing
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg md:text-xl text-black/60 max-w-xl mx-auto"
            >
              No hidden fees, no transaction costs, no surprises.
              <br />
              That means more value for your investment.
            </motion.p>
          </motion.div>

          {/* Pricing Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center mb-12"
          >
            <div className="inline-flex bg-black/5 rounded-full p-1.5">
              {[
                { id: 'plans' as const, label: 'Subscription Plans', icon: Layers },
                { id: 'credits' as const, label: 'AI Credits', icon: Coins },
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setPricingTab(tab.id)}
                  className={`relative px-6 py-3 rounded-full text-sm font-medium flex items-center gap-2 transition-colors duration-300 ${
                    pricingTab === tab.id ? 'text-white' : 'text-black/60 hover:text-black'
                  }`}
                  whileHover={{ scale: pricingTab === tab.id ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {pricingTab === tab.id && (
                    <motion.div
                      layoutId="pricingTab"
                      className="absolute inset-0 bg-black rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <tab.icon className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">{tab.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {pricingTab === 'plans' ? (
              <motion.div
                key="plans"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {/* Pricing Stats Row */}
                <motion.div 
                  className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-black/10"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {[
                    { label: "Starting at", value: isAnnual ? "$23" : "$29", suffix: "/mo" },
                    { label: "Storage included", value: "50GB", suffix: "" },
                    { label: "Team members", value: "Unlimited", suffix: "" },
                    { label: "Platform fee", value: "0%", suffix: "" },
                  ].map((stat, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ 
                        duration: 0.5, 
                        delay: 0.3 + idx * 0.1,
                        ease: [0.16, 1, 0.3, 1]
                      }}
                      whileHover={{ scale: 1.05 }}
                      className="group cursor-default"
                    >
                      <p className="text-sm text-black/50 mb-2 group-hover:text-black/70 transition-colors">{stat.label}</p>
                      <div className="text-3xl md:text-4xl font-bold">
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={stat.value}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                          >
                            {stat.value}
                          </motion.span>
                        </AnimatePresence>
                        {stat.suffix && <span className="text-lg font-normal text-black/60">{stat.suffix}</span>}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Billing Toggle - Above pricing cards */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex items-center justify-center gap-4 mt-16 mb-8"
                >
                  <span className={`text-sm font-medium transition-colors ${!isAnnual ? 'text-black' : 'text-black/50'}`}>Monthly</span>
                  <Switch
                    checked={isAnnual}
                    onCheckedChange={setIsAnnual}
                    className="data-[state=checked]:bg-black"
                  />
                  <span className={`text-sm font-medium transition-colors ${isAnnual ? 'text-black' : 'text-black/50'}`}>
                    Annual
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="ml-2 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold"
                    >
                      Save 20%
                    </motion.span>
                  </span>
                </motion.div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    {
                      name: "Starter",
                      monthlyPrice: 29,
                      annualPrice: 23,
                      description: "Perfect for small teams getting started with brand management.",
                      features: ["50GB storage", "Up to 10 users", "Basic AI tagging", "Email support", "API access"],
                      aiCredits: 500,
                      popular: false,
                    },
                    {
                      name: "Pro",
                      monthlyPrice: 99,
                      annualPrice: 79,
                      description: "For growing teams that need advanced features and more power.",
                      features: ["500GB storage", "Unlimited users", "Advanced AI features", "Priority support", "Custom integrations", "Analytics dashboard"],
                      aiCredits: 5000,
                      popular: true,
                    },
                    {
                      name: "Enterprise",
                      monthlyPrice: null,
                      annualPrice: null,
                      description: "For large organizations with custom requirements.",
                      features: ["Unlimited storage", "SSO & SAML", "Dedicated success manager", "Custom AI training", "SLA guarantee", "On-premise option"],
                      aiCredits: null,
                      popular: false,
                    },
                  ].map((plan, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 60, rotateX: -10 }}
                      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                      viewport={{ once: true }}
                      transition={{ 
                        duration: 0.7, 
                        delay: 0.2 + idx * 0.15,
                        ease: [0.16, 1, 0.3, 1]
                      }}
                      whileHover={{ 
                        y: -12,
                        scale: 1.02,
                        transition: { duration: 0.3, ease: "easeOut" }
                      }}
                      className={`relative p-8 rounded-3xl cursor-pointer group flex flex-col h-full ${
                        plan.popular 
                          ? 'bg-black text-white shadow-2xl shadow-black/20' 
                          : 'bg-white border border-black/10 hover:border-black/20 hover:shadow-xl'
                      } transition-shadow duration-500`}
                    >
                      {plan.popular && (
                        <motion.span 
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.6 }}
                          className="absolute top-6 right-6 px-3 py-1 rounded-full bg-white/20 text-xs font-medium"
                        >
                          Most Popular
                        </motion.span>
                      )}
                      
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 + idx * 0.1 }}
                      >
                        <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                      </motion.div>
                      
                      <motion.div 
                        className="mb-2"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.5 + idx * 0.1 }}
                      >
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={isAnnual ? 'annual' : 'monthly'}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="text-4xl font-bold"
                          >
                            {plan.monthlyPrice ? `$${isAnnual ? plan.annualPrice : plan.monthlyPrice}` : 'Custom'}
                          </motion.span>
                        </AnimatePresence>
                        {plan.monthlyPrice && (
                          <span className={`text-lg ${plan.popular ? 'text-white/60' : 'text-black/60'}`}>/month</span>
                        )}
                      </motion.div>

                      {/* AI Credits Badge */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.55 + idx * 0.1 }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium mb-4 w-fit ${
                          plan.popular 
                            ? 'bg-white/10 text-white/90' 
                            : 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700'
                        }`}
                      >
                        <Sparkles className="w-3 h-3" />
                        {plan.aiCredits ? `${plan.aiCredits.toLocaleString()} AI credits/mo` : 'Custom AI credits'}
                      </motion.div>
                      
                      <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.6 + idx * 0.1 }}
                        className={`text-sm mb-6 min-h-[40px] ${plan.popular ? 'text-white/70' : 'text-black/60'}`}
                      >
                        {plan.description}
                      </motion.p>
                      
                      <ul className="space-y-3 mb-8 flex-1">
                        {plan.features.map((feature, fIdx) => (
                          <motion.li 
                            key={fIdx} 
                            className="flex items-center gap-3"
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ 
                              duration: 0.4, 
                              delay: 0.65 + idx * 0.1 + fIdx * 0.05,
                              ease: "easeOut"
                            }}
                          >
                            <motion.div
                              initial={{ scale: 0 }}
                              whileInView={{ scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ 
                                duration: 0.3, 
                                delay: 0.7 + idx * 0.1 + fIdx * 0.05,
                                type: "spring",
                                stiffness: 300
                              }}
                            >
                              <Check className={`w-4 h-4 ${plan.popular ? 'text-white/70' : 'text-black/50'}`} />
                            </motion.div>
                            <span className={`text-sm ${plan.popular ? 'text-white/90' : 'text-black/70'}`}>{feature}</span>
                          </motion.li>
                        ))}
                      </ul>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.85 + idx * 0.1 }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-auto"
                      >
                        <Button 
                          className={`w-full rounded-full h-12 transition-all duration-300 ${
                            plan.popular 
                              ? 'bg-white text-black hover:bg-white/90 hover:shadow-lg hover:shadow-white/20' 
                              : 'bg-black text-white hover:bg-black/90 hover:shadow-lg hover:shadow-black/20'
                          }`}
                        >
                          {!plan.monthlyPrice ? "Contact Sales" : "Get Started"}
                        </Button>
                      </motion.div>

                      {/* Hover glow effect for popular card */}
                      {plan.popular && (
                        <motion.div 
                          className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
                        />
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Feature Comparison Table */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mt-24"
                >
                  <motion.h3 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-2xl md:text-3xl font-bold text-center mb-12"
                  >
                    Compare all features
                  </motion.h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                      <thead>
                        <motion.tr
                          initial={{ opacity: 0, y: -20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                          className="border-b border-black/10"
                        >
                          <th className="text-left py-4 px-4 font-medium text-black/60">Features</th>
                          <th className="text-center py-4 px-4 font-semibold">Starter</th>
                          <th className="text-center py-4 px-4 font-semibold bg-black/5 rounded-t-xl">Pro</th>
                          <th className="text-center py-4 px-4 font-semibold">Enterprise</th>
                        </motion.tr>
                      </thead>
                      <tbody>
                        {[
                          { feature: "Storage", starter: "50GB", pro: "500GB", enterprise: "Unlimited" },
                          { feature: "Team members", starter: "10", pro: "Unlimited", enterprise: "Unlimited" },
                          { feature: "AI credits/month", starter: "500", pro: "5,000", enterprise: "Custom" },
                          { feature: "AI asset tagging", starter: "Basic", pro: "Advanced", enterprise: "Custom trained" },
                          { feature: "Brand guidelines", starter: true, pro: true, enterprise: true },
                          { feature: "API access", starter: true, pro: true, enterprise: true },
                          { feature: "Custom integrations", starter: false, pro: true, enterprise: true },
                          { feature: "Analytics dashboard", starter: false, pro: true, enterprise: true },
                          { feature: "SSO & SAML", starter: false, pro: false, enterprise: true },
                          { feature: "Dedicated support", starter: false, pro: false, enterprise: true },
                          { feature: "SLA guarantee", starter: false, pro: false, enterprise: true },
                          { feature: "On-premise option", starter: false, pro: false, enterprise: true },
                        ].map((row, idx) => (
                          <motion.tr
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ 
                              duration: 0.4, 
                              delay: 0.15 + idx * 0.05,
                              ease: "easeOut"
                            }}
                            className="border-b border-black/5 hover:bg-black/[0.02] transition-colors"
                          >
                            <td className="py-4 px-4 text-sm font-medium">{row.feature}</td>
                            <td className="py-4 px-4 text-center">
                              <motion.div
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: 0.2 + idx * 0.05, type: "spring" }}
                              >
                                {typeof row.starter === 'boolean' ? (
                                  row.starter ? (
                                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                                  ) : (
                                    <X className="w-5 h-5 text-black/20 mx-auto" />
                                  )
                                ) : (
                                  <span className="text-sm text-black/70">{row.starter}</span>
                                )}
                              </motion.div>
                            </td>
                            <td className="py-4 px-4 text-center bg-black/5">
                              <motion.div
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: 0.25 + idx * 0.05, type: "spring" }}
                              >
                                {typeof row.pro === 'boolean' ? (
                                  row.pro ? (
                                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                                  ) : (
                                    <X className="w-5 h-5 text-black/20 mx-auto" />
                                  )
                                ) : (
                                  <span className="text-sm font-medium">{row.pro}</span>
                                )}
                              </motion.div>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <motion.div
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: 0.3 + idx * 0.05, type: "spring" }}
                              >
                                {typeof row.enterprise === 'boolean' ? (
                                  row.enterprise ? (
                                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                                  ) : (
                                    <X className="w-5 h-5 text-black/20 mx-auto" />
                                  )
                                ) : (
                                  <span className="text-sm text-black/70">{row.enterprise}</span>
                                )}
                              </motion.div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>

                {/* Customer Testimonials */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mt-24"
                >
                  <motion.h3 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-2xl md:text-3xl font-bold text-center mb-4"
                  >
                    Trusted by leading brands
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-black/60 text-center mb-12 max-w-lg mx-auto"
                  >
                    See what our customers have to say about transforming their brand workflows
                  </motion.p>

                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      {
                        quote: "Pixify has completely transformed how we manage our brand assets. The AI tagging alone saves us hours every week.",
                        author: "Sarah Chen",
                        role: "Head of Brand",
                        company: "TechFlow",
                        avatar: "SC",
                      },
                      {
                        quote: "The best investment we made this year. Our team collaboration improved dramatically and brand consistency is now effortless.",
                        author: "Marcus Johnson",
                        role: "Creative Director",
                        company: "Elevate Agency",
                        avatar: "MJ",
                      },
                      {
                        quote: "Finally, a DAM that understands modern brand teams. The AI features are incredibly powerful yet simple to use.",
                        author: "Emma Rodriguez",
                        role: "Marketing Lead",
                        company: "Startify",
                        avatar: "ER",
                      },
                    ].map((testimonial, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 40, rotateY: -5 }}
                        whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                        viewport={{ once: true }}
                        transition={{ 
                          duration: 0.6, 
                          delay: 0.2 + idx * 0.15,
                          ease: [0.16, 1, 0.3, 1]
                        }}
                        whileHover={{ 
                          y: -8,
                          transition: { duration: 0.3, ease: "easeOut" }
                        }}
                        className="relative p-8 rounded-3xl bg-white border border-black/10 hover:border-black/20 hover:shadow-xl transition-all duration-500 group"
                      >
                        {/* Quote mark */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: 0.3 + idx * 0.1, type: "spring" }}
                          className="absolute -top-4 left-8 w-8 h-8 bg-black rounded-full flex items-center justify-center"
                        >
                          <span className="text-white text-xl font-serif leading-none">"</span>
                        </motion.div>

                        <motion.p
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.35 + idx * 0.1 }}
                          className="text-black/70 leading-relaxed mb-6 pt-2"
                        >
                          {testimonial.quote}
                        </motion.p>

                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: 0.4 + idx * 0.1 }}
                          className="flex items-center gap-4"
                        >
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-semibold text-sm"
                          >
                            {testimonial.avatar}
                          </motion.div>
                          <div>
                            <p className="font-semibold text-sm">{testimonial.author}</p>
                            <p className="text-xs text-black/50">{testimonial.role}, {testimonial.company}</p>
                          </div>
                        </motion.div>

                        {/* Hover gradient */}
                        <motion.div 
                          className="absolute inset-0 rounded-3xl bg-gradient-to-br from-black/[0.02] to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
                        />
                      </motion.div>
                    ))}
                  </div>

                  {/* Trust indicators */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="mt-12 flex flex-wrap items-center justify-center gap-8 text-black/40"
                  >
                    {[
                      { value: "10,000+", label: "Active users" },
                      { value: "500+", label: "Companies" },
                      { value: "99.9%", label: "Uptime" },
                      { value: "4.9/5", label: "Rating" },
                    ].map((stat, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.55 + idx * 0.1 }}
                        className="text-center"
                      >
                        <motion.p
                          initial={{ scale: 0.5 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: 0.6 + idx * 0.1, type: "spring" }}
                          className="text-2xl font-bold text-black"
                        >
                          {stat.value}
                        </motion.p>
                        <p className="text-xs">{stat.label}</p>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Customer Logos Marquee */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-16 overflow-hidden"
                  >
                    <p className="text-center text-xs text-black/40 uppercase tracking-widest mb-8">
                      Trusted by innovative teams worldwide
                    </p>
                    
                    <div className="relative">
                      {/* Gradient masks */}
                      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#f8f8f6] to-transparent z-10 pointer-events-none" />
                      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#f8f8f6] to-transparent z-10 pointer-events-none" />
                      
                      {/* Scrolling container */}
                      <div className="flex animate-marquee">
                        {[...Array(2)].map((_, setIdx) => (
                          <div key={setIdx} className="flex items-center gap-16 px-8">
                            {[
                              { name: "TechFlow", letters: "TF" },
                              { name: "Elevate", letters: "EL" },
                              { name: "Startify", letters: "ST" },
                              { name: "Nexus", letters: "NX" },
                              { name: "Quantum", letters: "QT" },
                              { name: "Horizon", letters: "HZ" },
                              { name: "Pinnacle", letters: "PN" },
                              { name: "Catalyst", letters: "CT" },
                              { name: "Vertex", letters: "VX" },
                              { name: "Synergy", letters: "SY" },
                            ].map((company, idx) => (
                              <motion.div
                                key={`${setIdx}-${idx}`}
                                whileHover={{ scale: 1.1 }}
                                className="flex items-center gap-3 shrink-0 group cursor-pointer"
                              >
                                <div className="w-10 h-10 rounded-xl bg-black/5 group-hover:bg-black group-hover:text-white flex items-center justify-center font-bold text-sm text-black/40 transition-all duration-300">
                                  {company.letters}
                                </div>
                                <span className="text-lg font-semibold text-black/30 group-hover:text-black transition-colors duration-300">
                                  {company.name}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="credits"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {/* AI Credits Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-center mb-12"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 text-black/70 text-sm font-medium mb-4">
                    <Sparkles className="w-4 h-4" />
                    Power your AI features
                  </div>
                  <p className="text-black/60 max-w-lg mx-auto">
                    Need more AI power? Purchase additional credits to fuel your creative workflows.
                    Credits never expire and can be used across all AI features.
                  </p>
                </motion.div>

                {/* AI Credits Cards */}
                <div className="grid md:grid-cols-4 gap-6">
                  {[
                    {
                      credits: 1000,
                      price: 10,
                      perCredit: 0.01,
                      popular: false,
                      label: "Starter Pack",
                    },
                    {
                      credits: 5000,
                      price: 40,
                      perCredit: 0.008,
                      popular: false,
                      label: "Growth Pack",
                      savings: 20,
                    },
                    {
                      credits: 15000,
                      price: 99,
                      perCredit: 0.0066,
                      popular: true,
                      label: "Pro Pack",
                      savings: 34,
                    },
                    {
                      credits: 50000,
                      price: 249,
                      perCredit: 0.005,
                      popular: false,
                      label: "Enterprise Pack",
                      savings: 50,
                    },
                  ].map((pack, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 40, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ 
                        duration: 0.5, 
                        delay: 0.15 + idx * 0.1,
                        ease: [0.16, 1, 0.3, 1]
                      }}
                      whileHover={{ 
                        y: -8,
                        scale: 1.02,
                        transition: { duration: 0.3, ease: "easeOut" }
                      }}
                      className={`relative p-6 rounded-3xl cursor-pointer group flex flex-col ${
                        pack.popular 
                          ? 'bg-black text-white shadow-2xl shadow-black/20' 
                          : 'bg-white border border-black/10 hover:border-black/20 hover:shadow-xl'
                      } transition-all duration-500`}
                    >
                      {pack.popular && (
                        <motion.span 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.4 }}
                          className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white text-black text-xs font-bold shadow-lg border border-black/10"
                        >
                          Best Value
                        </motion.span>
                      )}

                      <div className="text-center mb-4">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.4, delay: 0.2 + idx * 0.1, type: "spring" }}
                          className={`w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center ${
                            pack.popular 
                              ? 'bg-white/10' 
                              : 'bg-black/5'
                          }`}
                        >
                          <Coins className={`w-6 h-6 ${pack.popular ? 'text-white' : 'text-black/70'}`} />
                        </motion.div>
                        <p className={`text-xs font-medium mb-1 ${pack.popular ? 'text-white/70' : 'text-black/50'}`}>
                          {pack.label}
                        </p>
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.25 + idx * 0.1 }}
                          className="text-2xl font-bold"
                        >
                          {pack.credits.toLocaleString()}
                        </motion.p>
                        <p className={`text-xs ${pack.popular ? 'text-white/60' : 'text-black/40'}`}>credits</p>
                      </div>

                      <div className="text-center mb-4">
                        <motion.span
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.3 + idx * 0.1 }}
                          className="text-3xl font-bold"
                        >
                          ${pack.price}
                        </motion.span>
                        {pack.savings && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.35 + idx * 0.1 }}
                            className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                              pack.popular 
                                ? 'bg-white/20 text-white' 
                                : 'bg-black/10 text-black/70'
                            }`}
                          >
                            Save {pack.savings}%
                          </motion.span>
                        )}
                      </div>

                      <p className={`text-xs text-center mb-4 ${pack.popular ? 'text-white/60' : 'text-black/40'}`}>
                        ${pack.perCredit.toFixed(4)} per credit
                      </p>

                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-auto"
                      >
                        <Button 
                          className={`w-full rounded-full h-10 text-sm transition-all duration-300 ${
                            pack.popular 
                              ? 'bg-white text-black hover:bg-white/90 hover:shadow-lg' 
                              : 'bg-black text-white hover:bg-black/90'
                          }`}
                        >
                          Buy Credits
                        </Button>
                      </motion.div>

                      {/* Glow effect */}
                      {pack.popular && (
                        <motion.div 
                          className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
                        />
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Credits Usage Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="mt-12 grid md:grid-cols-3 gap-6"
                >
                  {[
                    { icon: Zap, title: "AI Image Generation", credits: "~10 credits/image" },
                    { icon: Sparkles, title: "AI Copy Writing", credits: "~5 credits/generation" },
                    { icon: Layers, title: "AI Asset Tagging", credits: "~2 credits/asset" },
                  ].map((usage, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.6 + idx * 0.1 }}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-black/5"
                    >
                      <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center">
                        <usage.icon className="w-5 h-5 text-black/60" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{usage.title}</p>
                        <p className="text-xs text-black/50">{usage.credits}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Additional Info */}
          <motion.div 
            className="mt-16 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-black/50"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p>~0.25% average platform cost compared to competitors</p>
            <p>All prices in USD. Billed annually for best value.</p>
          </motion.div>
        </div>
      </section>

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
              <a href="#pricing" className="text-sm text-black/60 hover:text-black transition-colors">
                Pricing
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

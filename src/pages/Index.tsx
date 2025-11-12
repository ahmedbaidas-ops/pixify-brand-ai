import { Button } from "@/components/ui/button";
import { Check, X, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import heroBg from "@/assets/hero-bg.jpg";
import featureCardBg from "@/assets/feature-card-bg.jpg";

const Index = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const features = [
    { emoji: "🌿", title: "Simplicity", rotation: "rotate-0" },
    { emoji: "🏅", title: "Quality", rotation: "-rotate-6" },
    { emoji: "⚡", title: "Speed", rotation: "rotate-0" },
    { emoji: "🤖", title: "Automation", rotation: "rotate-[4.8deg]" },
    { emoji: "🔒", title: "Reliability", rotation: "-rotate-[9.7deg]" },
    { emoji: "🔍", title: "Transparency", rotation: "-rotate-[12.6deg]" },
  ];

  const mainFeatures = [
    {
      title: "Simplicity",
      description: "A clean and intuitive interface that makes navigation and project management effortless.",
    },
    {
      title: "Quality",
      description: "Access to top-tier design professionals and AI-driven insights to deliver exceptional outcomes.",
    },
    {
      title: "Automation",
      description: "Smart workflows that handle repetitive tasks, allowing you to focus on creativity and strategy.",
    },
    {
      title: "Speed",
      description: "Accelerate project timelines with efficient task management and instant communication",
    },
    {
      title: "Reliability",
      description: "Secure platforms and trusted teams that ensure consistent delivery",
    },
    {
      title: "Transparency",
      description: "Real-time progress tracking and clear communication at every step.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#121212] text-white font-[Montserrat]">
      {/* Interactive Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#121212]/80 backdrop-blur-lg border-b border-[#362F2F] transition-all duration-300">
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src="/qatar-airways-logo.png" 
                alt="Pixify Logo" 
                className="h-12 w-auto transition-transform duration-300 group-hover:scale-110"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-[#9A33A6] to-[#E639C4] bg-clip-text text-transparent">
                Pixify DAM
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-white/80 hover:text-white transition-colors duration-200 hover:scale-105 transform">
                Features
              </a>
              <a href="#compare" className="text-white/80 hover:text-white transition-colors duration-200 hover:scale-105 transform">
                Compare
              </a>
              <a href="#why" className="text-white/80 hover:text-white transition-colors duration-200 hover:scale-105 transform">
                Why Pixify
              </a>
              <Link to="/auth">
                <Button className="bg-gradient-to-r from-[#3F2D82] via-[#9A33A6] to-[#E639C4] hover:opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_0_rgba(127,86,217,0.4)]">
                  Get Started
                </Button>
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <nav className="md:hidden pt-4 pb-2 space-y-2 animate-fade-in">
              <a href="#features" className="block py-2 text-white/80 hover:text-white hover:bg-white/5 rounded px-2 transition-all">
                Features
              </a>
              <a href="#compare" className="block py-2 text-white/80 hover:text-white hover:bg-white/5 rounded px-2 transition-all">
                Compare
              </a>
              <a href="#why" className="block py-2 text-white/80 hover:text-white hover:bg-white/5 rounded px-2 transition-all">
                Why Pixify
              </a>
              <Link to="/auth" className="block pt-2">
                <Button className="w-full bg-gradient-to-r from-[#3F2D82] via-[#9A33A6] to-[#E639C4]">
                  Get Started
                </Button>
              </Link>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative min-h-[1242px] flex items-center justify-center overflow-hidden pt-20"  id="why">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBg}
            alt="Background" 
            className="w-full h-[824px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#121212]/50 to-[#121212]" />
        </div>

        {/* Main Hero Card */}
        <div className="relative z-10 max-w-[1239px] w-full mx-auto px-4 mt-[260px]">
          <div className="backdrop-blur-[21px] bg-gradient-to-r from-[rgba(39,39,39,0.18)] to-[rgba(0,0,0,0.12)] border border-[#362F2F] rounded-3xl p-12 text-center transition-all duration-500 hover:scale-[1.02] hover:border-[#9A33A6]/50 hover:shadow-[0_0_40px_0_rgba(154,51,166,0.3)]">
            <div className="space-y-6">
              <div className="text-xl font-bold">Why Pixify</div>
              <h1 className="text-4xl font-bold">Simplifying Design with Automated Excellence</h1>
              <p className="text-lg max-w-[888px] mx-auto">
                Pixify eliminates the complexity of traditional design workflows. Whether you're a startup, agency, or corporation, our platform helps you manage projects effortlessly by matching you with expert teams and solutions tailored to your needs.
              </p>
              <Link to="/auth">
                <Button 
                  className="w-full max-w-[576px] h-16 text-lg font-semibold bg-gradient-to-r from-[#3F2D82] via-[#9A33A6] via-[#E639C4] via-[#FF8451] to-[#FFBA9E] hover:opacity-90 shadow-[0_0_30px_0_rgba(127,86,217,0.2)]"
                >
                  Try Pixify
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Feature Badges with Concentric Circles */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[971px] h-[479px]">
          {/* Concentric circles */}
          <div className="absolute left-[11px] top-0 w-[950px] h-[950px] rounded-full border-2 border-[#525252]" />
          <div className="absolute left-[111px] top-[74px] w-[750px] h-[750px] rounded-full border-2 border-[#525252]" />
          <div className="absolute left-[211px] top-[161px] w-[550px] h-[550px] rounded-full border-2 border-[#525252]" />
          
          {/* Feature badges positioned around circles */}
          <div className={`absolute left-[407px] top-[-52px] ${features[4].rotation} transition-all duration-300 hover:scale-110 hover:-translate-y-2 cursor-pointer`}>
            <div className="flex items-center gap-2 px-7 py-[30px] rounded-3xl border border-[#525252] bg-[#1C1C1C] shadow-[0_0_20px_0_rgba(0,0,0,0.3)] whitespace-nowrap hover:border-[#9A33A6] hover:shadow-[0_0_30px_0_rgba(154,51,166,0.5)] transition-all duration-300">
              <span className="text-lg font-bold">{features[4].emoji} {features[4].title}</span>
            </div>
          </div>
          <div className={`absolute left-[0px] top-[323px] ${features[1].rotation} transition-all duration-300 hover:scale-110 hover:-translate-y-2 cursor-pointer`}>
            <div className="flex items-center gap-2 px-7 py-[30px] rounded-3xl border border-[#525252] bg-[#1C1C1C] shadow-[0_0_20px_0_rgba(0,0,0,0.3)] whitespace-nowrap hover:border-[#9A33A6] hover:shadow-[0_0_30px_0_rgba(154,51,166,0.5)] transition-all duration-300">
              <span className="text-lg font-bold">{features[1].emoji} {features[1].title}</span>
            </div>
          </div>
          <div className={`absolute left-[230px] top-[262px] ${features[3].rotation} transition-all duration-300 hover:scale-110 hover:-translate-y-2 cursor-pointer`}>
            <div className="flex items-center gap-2 px-7 py-[30px] rounded-3xl border border-[#525252] bg-[#1C1C1C] shadow-[0_0_20px_0_rgba(0,0,0,0.3)] whitespace-nowrap hover:border-[#9A33A6] hover:shadow-[0_0_30px_0_rgba(154,51,166,0.5)] transition-all duration-300">
              <span className="text-lg font-bold">{features[3].emoji} {features[3].title}</span>
            </div>
          </div>
          <div className={`absolute left-[552px] top-[158px] ${features[2].rotation} transition-all duration-300 hover:scale-110 hover:-translate-y-2 cursor-pointer`}>
            <div className="flex items-center gap-2 px-7 py-[30px] rounded-3xl border border-[#525252] bg-[#1C1C1C] shadow-[0_0_20px_0_rgba(0,0,0,0.3)] whitespace-nowrap hover:border-[#9A33A6] hover:shadow-[0_0_30px_0_rgba(154,51,166,0.5)] transition-all duration-300">
              <span className="text-lg font-bold">{features[2].emoji} {features[2].title}</span>
            </div>
          </div>
          <div className={`absolute left-[780px] top-[259px] ${features[0].rotation} transition-all duration-300 hover:scale-110 hover:-translate-y-2 cursor-pointer`}>
            <div className="flex items-center gap-2 px-7 py-[30px] rounded-3xl border border-[#525252] bg-[#1C1C1C] shadow-[0_0_20px_0_rgba(0,0,0,0.3)] whitespace-nowrap hover:border-[#9A33A6] hover:shadow-[0_0_30px_0_rgba(154,51,166,0.5)] transition-all duration-300">
              <span className="text-lg font-bold">{features[0].emoji} {features[0].title}</span>
            </div>
          </div>
          <div className={`absolute left-[918px] top-[344px] ${features[5].rotation} transition-all duration-300 hover:scale-110 hover:-translate-y-2 cursor-pointer`}>
            <div className="flex items-center gap-2 px-7 py-[30px] rounded-3xl border border-[#525252] bg-[#1C1C1C] shadow-[0_0_20px_0_rgba(0,0,0,0.3)] whitespace-nowrap hover:border-[#9A33A6] hover:shadow-[0_0_30px_0_rgba(154,51,166,0.5)] transition-all duration-300">
              <span className="text-lg font-bold">{features[5].emoji} {features[5].title}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table Section */}
      <div className="py-[120px] px-4" id="compare">
        <div className="max-w-[1240px] mx-auto text-center space-y-14">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">Compare Pixify's Features</h2>
            <p className="text-lg max-w-[666px] mx-auto">
              Reasons why you should consider Pixify as your go to design agencies
            </p>
          </div>

          {/* Comparison Table */}
          <div className="space-y-6">
            {/* Header Row */}
            <div className="grid grid-cols-4 gap-4 text-xl font-bold pb-4 border-b border-dashed border-[#525252]">
              <div></div>
              <div>Pixify</div>
              <div>Traditional design agency</div>
              <div>Freelancers</div>
            </div>

            {/* Comparison Rows */}
            {[
              { feature: "Custom Request", pixify: true, traditional: false, freelancer: true },
              { feature: "Progress Reports", pixify: true, traditional: true, freelancer: false },
              { feature: "Team Selection", pixify: true, traditional: false, freelancer: true },
              { feature: "Workflow Optimization", pixify: true, traditional: false, freelancer: false },
              { feature: "Version Control", pixify: "(Real-Time)", traditional: false, freelancer: "(Manual)" },
              { feature: "Dedicated Support", pixify: "(24/7)", traditional: "Office Hours", freelancer: "(Manual)" },
              { feature: "Risk Mitigation", pixify: "(Built-in)", traditional: "(With Cost)", freelancer: false },
            ].map((row, idx) => (
              <div key={idx} className="grid grid-cols-4 gap-4 items-center py-4 border-b border-dashed border-[#525252] text-xl transition-all duration-300 hover:bg-white/5 hover:scale-[1.02] rounded-lg px-4 cursor-pointer">
                <div className="font-bold text-left">{row.feature}</div>
                <div className="flex justify-center">
                  {typeof row.pixify === "boolean" ? (
                    row.pixify ? <Check className="text-white" size={24} /> : <X className="text-red-500" size={24} />
                  ) : (
                    <span className="text-lg">{row.pixify}</span>
                  )}
                </div>
                <div className="flex justify-center">
                  {typeof row.traditional === "boolean" ? (
                    row.traditional ? <Check className="text-white" size={24} /> : <X className="text-red-500" size={24} />
                  ) : (
                    <span className="text-lg">{row.traditional}</span>
                  )}
                </div>
                <div className="flex justify-center">
                  {typeof row.freelancer === "boolean" ? (
                    row.freelancer ? <Check className="text-white" size={24} /> : <X className="text-red-500" size={24} />
                  ) : (
                    <span className="text-lg">{row.freelancer}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Features Section */}
      <div className="py-[120px] px-4" id="features">
        <div className="max-w-[1240px] mx-auto text-center space-y-14">
          <h2 className="text-4xl font-bold">Main Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mainFeatures.map((feature, idx) => (
              <div 
                key={idx}
                className="group relative rounded-3xl border border-[#181818] bg-[#1C1C1C] shadow-[2px_4px_12px_0_rgba(0,0,0,0.48)] overflow-hidden h-[379px] cursor-pointer transition-all duration-500 hover:scale-105 hover:border-[#9A33A6] hover:shadow-[0_0_40px_0_rgba(154,51,166,0.4)]"
              >
                <img 
                  src={featureCardBg}
                  alt="" 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1C1C1C]/50 to-[#1C1C1C] group-hover:via-[#1C1C1C]/70 transition-all duration-500" />
                <div className="absolute bottom-6 left-6 right-6 space-y-4 transition-all duration-500 group-hover:bottom-8">
                  <h3 className="text-2xl font-bold transition-all duration-300 group-hover:text-[#E639C4]">{feature.title}</h3>
                  <p className="text-base opacity-90 group-hover:opacity-100 transition-opacity duration-300">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

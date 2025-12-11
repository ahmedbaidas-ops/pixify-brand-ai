import { motion } from "framer-motion";
import { ArrowLeft, Target, Eye, Compass, Heart, Users, MessageSquare, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Strategy = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  const coreValues = [
    { name: "Hospitality", description: "Warmth and care in every interaction" },
    { name: "Excellence", description: "Uncompromising quality standards" },
    { name: "Trust", description: "Reliability and transparency" },
    { name: "Cultural Pride", description: "Celebrating Qatari heritage" },
    { name: "Innovation", description: "Pioneering the future of travel" },
  ];

  const audienceSegments = [
    { name: "Business Travelers", traits: "Efficiency, comfort, productivity" },
    { name: "Luxury Seekers", traits: "Premium experiences, exclusivity" },
    { name: "Family Travelers", traits: "Safety, entertainment, convenience" },
    { name: "Adventure Seekers", traits: "Exploration, unique destinations" },
  ];

  const toneAttributes = [
    { primary: "Warm", description: "Welcoming and caring" },
    { primary: "Elegant", description: "Refined and sophisticated" },
    { primary: "Trustworthy", description: "Reliable and dependable" },
  ];

  return (
    <motion.div
      className="min-h-screen bg-background"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Sticky Header */}
      <motion.header
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border"
        variants={itemVariants}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/template")}
            className="hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Brand Strategy</h1>
            <p className="text-sm text-muted-foreground">Qatar Airways</p>
          </div>
        </div>
      </motion.header>

      {/* Hero Section - Primary Information */}
      <motion.section
        className="relative overflow-hidden"
        variants={itemVariants}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#5C0A3A] via-[#5C0A3A]/90 to-[#3d0627]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        
        <div className="relative max-w-6xl mx-auto px-6 py-20">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <motion.span
              className="inline-block px-3 py-1 mb-6 text-xs font-medium tracking-wider uppercase bg-white/10 text-white/90 rounded-full border border-white/20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              Brand Purpose
            </motion.span>
            
            <motion.h2
              className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              To connect the world with{" "}
              <span className="font-semibold text-[#CBB59C]">warmth</span> and{" "}
              <span className="font-semibold text-[#CBB59C]">excellence</span>
            </motion.h2>
            
            <motion.p
              className="text-lg text-white/70 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              Creating journeys that inspire and experiences that matter, while honoring
              the spirit of Qatari hospitality in every moment.
            </motion.p>
          </motion.div>
        </div>
      </motion.section>

      {/* Vision & Mission - Secondary Key Info */}
      <motion.section
        className="max-w-6xl mx-auto px-6 py-16"
        variants={containerVariants}
      >
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div variants={itemVariants}>
            <Card className="p-8 h-full bg-card hover:shadow-lg transition-shadow duration-300 border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-[#5C0A3A]/10">
                  <Eye className="h-6 w-6 text-[#5C0A3A]" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Vision</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                To be the most trusted and admired airline worldwide, setting the standard
                for exceptional travel experiences and cultural connection.
              </p>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="p-8 h-full bg-card hover:shadow-lg transition-shadow duration-300 border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-[#5C0A3A]/10">
                  <Target className="h-6 w-6 text-[#5C0A3A]" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Mission</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Deliver world-class service that exceeds expectations, foster meaningful
                connections between cultures, and champion sustainable aviation practices.
              </p>
            </Card>
          </motion.div>
        </div>
      </motion.section>

      <Separator className="max-w-6xl mx-auto" />

      {/* Core Values */}
      <motion.section
        className="max-w-6xl mx-auto px-6 py-16"
        variants={containerVariants}
      >
        <motion.div className="mb-12" variants={itemVariants}>
          <div className="flex items-center gap-3 mb-4">
            <Heart className="h-5 w-5 text-[#5C0A3A]" />
            <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Foundation
            </span>
          </div>
          <h3 className="text-3xl font-semibold text-foreground">Core Values</h3>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {coreValues.map((value, index) => (
            <motion.div
              key={value.name}
              variants={itemVariants}
              custom={index}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <Card className="p-6 h-full bg-card hover:bg-muted/50 transition-all duration-300 border-border group">
                <div className="h-1 w-12 bg-gradient-to-r from-[#5C0A3A] to-[#CBB59C] rounded-full mb-4 group-hover:w-full transition-all duration-500" />
                <h4 className="font-semibold text-foreground mb-2">{value.name}</h4>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <Separator className="max-w-6xl mx-auto" />

      {/* Brand Archetype */}
      <motion.section
        className="max-w-6xl mx-auto px-6 py-16"
        variants={containerVariants}
      >
        <motion.div className="mb-12" variants={itemVariants}>
          <div className="flex items-center gap-3 mb-4">
            <Compass className="h-5 w-5 text-[#5C0A3A]" />
            <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Personality
            </span>
          </div>
          <h3 className="text-3xl font-semibold text-foreground">Brand Archetype</h3>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-8"
          variants={itemVariants}
        >
          <Card className="p-8 bg-gradient-to-br from-[#5C0A3A] to-[#3d0627] text-white border-0">
            <span className="text-[#CBB59C] text-sm font-medium uppercase tracking-wider">
              Primary
            </span>
            <h4 className="text-3xl font-light mt-2 mb-4">The Caregiver</h4>
            <p className="text-white/70 leading-relaxed">
              Nurturing, protective, and compassionate. We prioritize the well-being
              and comfort of every passenger, treating them as honored guests.
            </p>
          </Card>

          <Card className="p-8 bg-card border-border">
            <span className="text-[#5C0A3A] text-sm font-medium uppercase tracking-wider">
              Secondary
            </span>
            <h4 className="text-3xl font-light mt-2 mb-4 text-foreground">The Explorer</h4>
            <p className="text-muted-foreground leading-relaxed">
              Adventurous, curious, and pioneering. We inspire discovery and help
              passengers explore the world with confidence and excitement.
            </p>
          </Card>
        </motion.div>
      </motion.section>

      <Separator className="max-w-6xl mx-auto" />

      {/* Audience Segments */}
      <motion.section
        className="max-w-6xl mx-auto px-6 py-16"
        variants={containerVariants}
      >
        <motion.div className="mb-12" variants={itemVariants}>
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-5 w-5 text-[#5C0A3A]" />
            <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Audience
            </span>
          </div>
          <h3 className="text-3xl font-semibold text-foreground">Target Segments</h3>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {audienceSegments.map((segment, index) => (
            <motion.div
              key={segment.name}
              variants={itemVariants}
              custom={index}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              <Card className="p-6 h-full bg-card hover:shadow-md transition-all duration-300 border-border">
                <div className="w-10 h-10 rounded-full bg-[#5C0A3A]/10 flex items-center justify-center mb-4 text-[#5C0A3A] font-semibold">
                  {index + 1}
                </div>
                <h4 className="font-semibold text-foreground mb-2">{segment.name}</h4>
                <p className="text-sm text-muted-foreground">{segment.traits}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <Separator className="max-w-6xl mx-auto" />

      {/* Tone of Voice */}
      <motion.section
        className="max-w-6xl mx-auto px-6 py-16"
        variants={containerVariants}
      >
        <motion.div className="mb-12" variants={itemVariants}>
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="h-5 w-5 text-[#5C0A3A]" />
            <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Communication
            </span>
          </div>
          <h3 className="text-3xl font-semibold text-foreground">Tone of Voice</h3>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {toneAttributes.map((tone, index) => (
            <motion.div
              key={tone.primary}
              variants={itemVariants}
              custom={index}
            >
              <Card className="p-8 h-full bg-card border-border hover:border-[#5C0A3A]/30 transition-colors duration-300">
                <h4 className="text-2xl font-light text-foreground mb-3">{tone.primary}</h4>
                <p className="text-muted-foreground">{tone.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-8 p-6 rounded-xl bg-muted/50 border border-border"
          variants={itemVariants}
        >
          <p className="text-sm text-muted-foreground mb-4 uppercase tracking-wider">
            Example Messaging
          </p>
          <blockquote className="text-xl md:text-2xl font-light text-foreground italic">
            "Where luxury meets discovery. Every journey with us is an invitation to
            experience the world through care, comfort, and culture."
          </blockquote>
        </motion.div>
      </motion.section>

      <Separator className="max-w-6xl mx-auto" />

      {/* Competitive Position */}
      <motion.section
        className="max-w-6xl mx-auto px-6 py-16 pb-24"
        variants={containerVariants}
      >
        <motion.div className="mb-12" variants={itemVariants}>
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="h-5 w-5 text-[#5C0A3A]" />
            <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Position
            </span>
          </div>
          <h3 className="text-3xl font-semibold text-foreground">Competitive Positioning</h3>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="p-8 bg-gradient-to-r from-muted/50 to-muted/30 border-border">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                  Differentiator
                </p>
                <p className="text-foreground font-medium">
                  Authentic Qatari hospitality combined with world-class innovation
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                  Promise
                </p>
                <p className="text-foreground font-medium">
                  Every journey exceeds expectations through personalized care
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                  Proof Points
                </p>
                <p className="text-foreground font-medium">
                  Award-winning service, premium cabins, global connectivity
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.section>
    </motion.div>
  );
};

export default Strategy;

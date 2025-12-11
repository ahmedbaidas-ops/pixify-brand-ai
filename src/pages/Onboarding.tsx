import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Users, Briefcase, Rocket, Building, Target, Zap, UsersRound, CheckCircle2, Upload, ArrowRight, ArrowLeft, Image, FileText, Check } from "lucide-react";
import pixifyLogo from "@/assets/pixify-logo.png";

const INDUSTRIES = [
  "Technology", "Healthcare", "Finance", "Retail", "Education", 
  "Entertainment", "Travel & Hospitality", "Food & Beverage",
  "Real Estate", "Manufacturing", "Consulting", "Non-profit", "Other"
];

const BUSINESS_TYPES = [
  { id: "agency", label: "Agency", icon: Building2, description: "Marketing or creative agency" },
  { id: "brand", label: "Brand", icon: Briefcase, description: "In-house brand team" },
  { id: "freelancer", label: "Freelancer", icon: Users, description: "Independent professional" },
  { id: "startup", label: "Startup", icon: Rocket, description: "Early-stage company" },
  { id: "enterprise", label: "Enterprise", icon: Building, description: "Large organization" },
];

const GOALS = [
  { id: "organize", label: "Organize Assets", icon: Target, description: "Centralize brand materials" },
  { id: "consistency", label: "Brand Consistency", icon: CheckCircle2, description: "Maintain visual standards" },
  { id: "speed", label: "Speed Up Creation", icon: Zap, description: "Faster content production" },
  { id: "collaboration", label: "Team Collaboration", icon: UsersRound, description: "Work better together" },
];

const TEAM_SIZES = [
  { value: "solo", label: "Just me" },
  { value: "small", label: "2-5 people" },
  { value: "medium", label: "6-20 people" },
  { value: "large", label: "20+ people" },
];

const STEPS = [
  { id: 1, label: "Business Type" },
  { id: 2, label: "Your Goals" },
  { id: 3, label: "Brand Setup" },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [orgId, setOrgId] = useState<string | null>(null);

  // Step 1: Business Type
  const [businessType, setBusinessType] = useState("");
  
  // Step 2: Goals
  const [primaryGoals, setPrimaryGoals] = useState<string[]>([]);
  const [teamSize, setTeamSize] = useState("");
  const [industry, setIndustry] = useState("");
  const [managesMultipleBrands, setManagesMultipleBrands] = useState(false);

  // Step 3: Brand Assets
  const [brandName, setBrandName] = useState("");
  const [brandTagline, setBrandTagline] = useState("");
  const [brandArchetype, setBrandArchetype] = useState("");
  const [brandTone, setBrandTone] = useState("");
  const [primaryLogo, setPrimaryLogo] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [guidelinePdf, setGuidelinePdf] = useState<File | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUserId(session.user.id);

      const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", session.user.id)
        .single();

      if (profile?.organization_id) {
        setOrgId(profile.organization_id);

        const { data: workspaceProfile } = await supabase
          .from("workspace_profiles")
          .select("onboarding_complete")
          .eq("organization_id", profile.organization_id)
          .single();

        if (workspaceProfile?.onboarding_complete) {
          navigate("/dashboard");
          return;
        }
      }

      setCheckingAuth(false);
    };

    checkAuth();
  }, [navigate]);

  const handleGoalToggle = (goalId: string) => {
    setPrimaryGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(g => g !== goalId) 
        : [...prev, goalId]
    );
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setter(file);
    }
  };

  const handleStep1Next = () => {
    if (!businessType) {
      toast.error("Please select your business type");
      return;
    }
    setStep(2);
  };

  const handleStep2Next = async () => {
    if (primaryGoals.length === 0) {
      toast.error("Please select at least one goal");
      return;
    }
    if (!teamSize) {
      toast.error("Please select your team size");
      return;
    }
    if (!industry) {
      toast.error("Please select your industry");
      return;
    }

    setLoading(true);
    try {
      if (orgId) {
        const { error } = await supabase
          .from("workspace_profiles")
          .upsert({
            organization_id: orgId,
            business_type: businessType,
            industry,
            team_size: teamSize,
            primary_goals: primaryGoals,
            manages_multiple_brands: managesMultipleBrands,
          }, { onConflict: 'organization_id' });

        if (error) throw error;
      }
      setStep(3);
    } catch (error: any) {
      toast.error(error.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!brandName) {
      toast.error("Brand name is required");
      return;
    }
    if (!primaryLogo) {
      toast.error("Primary logo is required");
      return;
    }
    if (!orgId || !userId) {
      toast.error("Session expired. Please sign in again.");
      navigate("/auth");
      return;
    }

    setLoading(true);
    try {
      const { data: brand, error: brandError } = await supabase
        .from("brands")
        .insert({
          organization_id: orgId,
          name: brandName,
          purpose: brandTagline,
          archetype: brandArchetype,
          tone: brandTone,
        })
        .select()
        .single();

      if (brandError) throw brandError;

      if (brand) {
        if (primaryLogo) {
          const logoPath = `${orgId}/${brand.id}/logos/${primaryLogo.name}`;
          const { error: uploadError } = await supabase.storage
            .from("brand-assets")
            .upload(logoPath, primaryLogo);

          if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage
              .from("brand-assets")
              .getPublicUrl(logoPath);

            await supabase.from("assets").insert({
              brand_id: brand.id,
              name: "Primary Logo",
              type: "logo",
              file_key: logoPath,
              storage_url: publicUrl,
              mime_type: primaryLogo.type,
              size_bytes: primaryLogo.size,
              uploaded_by: userId,
            });
          }
        }

        if (coverImage) {
          const coverPath = `${orgId}/${brand.id}/images/${coverImage.name}`;
          const { error: uploadError } = await supabase.storage
            .from("brand-assets")
            .upload(coverPath, coverImage);

          if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage
              .from("brand-assets")
              .getPublicUrl(coverPath);

            await supabase.from("assets").insert({
              brand_id: brand.id,
              name: "Brand Cover",
              type: "image",
              file_key: coverPath,
              storage_url: publicUrl,
              mime_type: coverImage.type,
              size_bytes: coverImage.size,
              uploaded_by: userId,
            });
          }
        }

        const guidelineSections = [
          { type: "strategy" as const, title: "Brand Strategy", order_index: 0 },
          { type: "logo" as const, title: "Logo Usage", order_index: 1 },
          { type: "color" as const, title: "Color Palette", order_index: 2 },
          { type: "typography" as const, title: "Typography", order_index: 3 },
        ];

        for (const section of guidelineSections) {
          await supabase.from("guideline_sections").insert({
            brand_id: brand.id,
            type: section.type,
            title: section.title,
            order_index: section.order_index,
            content: {},
          });
        }
      }

      await supabase
        .from("workspace_profiles")
        .update({ onboarding_complete: true })
        .eq("organization_id", orgId);

      toast.success("Your brand workspace is ready!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to create workspace");
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Static Info */}
      <div className="hidden lg:flex lg:w-[420px] xl:w-[480px] bg-gradient-to-br from-muted/50 via-muted/30 to-background p-8 flex-col justify-between border-r border-border/40">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="h-10 w-10 rounded-xl bg-foreground flex items-center justify-center">
              <img src={pixifyLogo} alt="Pixify" className="h-6 w-6 object-contain brightness-0 invert" />
            </div>
            <span className="font-semibold text-lg">Pixify</span>
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight mb-3">
            Set up your workspace
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Create your account in a few steps and get access to your brand management platform.
          </p>
        </div>

        {/* Steps Progress */}
        <div className="space-y-4">
          {STEPS.map((s, index) => (
            <div key={s.id} className="flex items-center gap-4">
              <div className={`
                h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-all
                ${step > s.id 
                  ? 'bg-primary text-primary-foreground' 
                  : step === s.id 
                    ? 'bg-foreground text-background' 
                    : 'bg-muted text-muted-foreground'}
              `}>
                {step > s.id ? <Check className="h-5 w-5" /> : s.id}
              </div>
              <span className={`text-sm font-medium ${step >= s.id ? 'text-foreground' : 'text-muted-foreground'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          © 2024 Pixify. All rights reserved.
        </p>
      </div>

      {/* Right Panel - Forms */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="lg:hidden p-4 border-b border-border/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-foreground flex items-center justify-center">
              <img src={pixifyLogo} alt="Pixify" className="h-5 w-5 object-contain brightness-0 invert" />
            </div>
            <span className="font-semibold">Pixify</span>
          </div>
          <span className="text-sm text-muted-foreground">Step {step} of 3</span>
        </header>

        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-xl">
            <AnimatePresence mode="wait">
              {/* Step 1: Business Type */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-2xl font-bold mb-2">What type of business are you?</h2>
                    <p className="text-muted-foreground">Select the option that best describes your organization</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {BUSINESS_TYPES.map((type) => {
                      const Icon = type.icon;
                      const isSelected = businessType === type.id;
                      return (
                        <motion.button
                          key={type.id}
                          onClick={() => setBusinessType(type.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`
                            relative p-5 rounded-2xl border-2 text-left transition-all
                            ${isSelected 
                              ? 'border-primary bg-primary/5 shadow-lg' 
                              : 'border-border hover:border-primary/50 hover:bg-muted/50'}
                          `}
                        >
                          {isSelected && (
                            <div className="absolute top-3 right-3">
                              <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                                <Check className="h-4 w-4 text-primary-foreground" />
                              </div>
                            </div>
                          )}
                          <div className="h-11 w-11 rounded-xl bg-muted flex items-center justify-center mb-3">
                            <Icon className="h-5 w-5 text-foreground" />
                          </div>
                          <h3 className="font-semibold mb-1">{type.label}</h3>
                          <p className="text-sm text-muted-foreground">{type.description}</p>
                        </motion.button>
                      );
                    })}
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button 
                      onClick={handleStep1Next}
                      size="lg"
                      className="px-8"
                      disabled={!businessType}
                    >
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Goals */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-2xl font-bold mb-2">What are your primary goals?</h2>
                    <p className="text-muted-foreground">Select all that apply to help us customize your experience</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {GOALS.map((goal) => {
                      const Icon = goal.icon;
                      const isSelected = primaryGoals.includes(goal.id);
                      return (
                        <motion.button
                          key={goal.id}
                          onClick={() => handleGoalToggle(goal.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`
                            relative p-5 rounded-2xl border-2 text-left transition-all
                            ${isSelected 
                              ? 'border-primary bg-primary/5 shadow-lg' 
                              : 'border-border hover:border-primary/50 hover:bg-muted/50'}
                          `}
                        >
                          {isSelected && (
                            <div className="absolute top-3 right-3">
                              <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                                <Check className="h-4 w-4 text-primary-foreground" />
                              </div>
                            </div>
                          )}
                          <div className="h-11 w-11 rounded-xl bg-muted flex items-center justify-center mb-3">
                            <Icon className="h-5 w-5 text-foreground" />
                          </div>
                          <h3 className="font-semibold mb-1">{goal.label}</h3>
                          <p className="text-sm text-muted-foreground">{goal.description}</p>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Team Size */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Team Size</Label>
                    <div className="flex flex-wrap gap-2">
                      {TEAM_SIZES.map((size) => (
                        <button
                          key={size.value}
                          onClick={() => setTeamSize(size.value)}
                          className={`
                            px-4 py-2 rounded-full text-sm font-medium transition-all
                            ${teamSize === size.value 
                              ? 'bg-foreground text-background' 
                              : 'bg-muted hover:bg-muted/80 text-foreground'}
                          `}
                        >
                          {size.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Industry */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Industry</Label>
                    <div className="flex flex-wrap gap-2">
                      {INDUSTRIES.slice(0, 8).map((ind) => (
                        <button
                          key={ind}
                          onClick={() => setIndustry(ind.toLowerCase())}
                          className={`
                            px-4 py-2 rounded-full text-sm font-medium transition-all
                            ${industry === ind.toLowerCase() 
                              ? 'bg-foreground text-background' 
                              : 'bg-muted hover:bg-muted/80 text-foreground'}
                          `}
                        >
                          {ind}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Multiple Brands Toggle */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                    <span className="text-sm font-medium">Do you manage multiple brands?</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setManagesMultipleBrands(true)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                          managesMultipleBrands ? 'bg-foreground text-background' : 'bg-background border border-border'
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setManagesMultipleBrands(false)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                          !managesMultipleBrands ? 'bg-foreground text-background' : 'bg-background border border-border'
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="ghost" onClick={() => setStep(1)}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button 
                      onClick={handleStep2Next}
                      size="lg"
                      className="px-8"
                      disabled={loading || primaryGoals.length === 0 || !teamSize || !industry}
                    >
                      {loading ? "Saving..." : "Continue"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Brand Setup */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Set up your brand</h2>
                    <p className="text-muted-foreground">Add your brand details and assets to get started</p>
                  </div>

                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Brand Name *</Label>
                      <Input
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        placeholder="Enter your brand name"
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Brand Tagline</Label>
                      <Input
                        value={brandTagline}
                        onChange={(e) => setBrandTagline(e.target.value)}
                        placeholder="Your brand's mission or tagline"
                        className="h-12"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Archetype</Label>
                        <Input
                          value={brandArchetype}
                          onChange={(e) => setBrandArchetype(e.target.value)}
                          placeholder="e.g., Explorer, Caregiver"
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Tone of Voice</Label>
                        <Input
                          value={brandTone}
                          onChange={(e) => setBrandTone(e.target.value)}
                          placeholder="e.g., Warm, Professional"
                          className="h-12"
                        />
                      </div>
                    </div>
                  </div>

                  {/* File Uploads */}
                  <div className="space-y-4">
                    <Label className="text-base font-medium">Brand Assets</Label>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Primary Logo */}
                      <label className={`
                        relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed cursor-pointer transition-all
                        ${primaryLogo ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50'}
                      `}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, setPrimaryLogo)}
                          className="hidden"
                        />
                        {primaryLogo ? (
                          <>
                            <div className="absolute top-2 right-2">
                              <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                                <Check className="h-3 w-3 text-primary-foreground" />
                              </div>
                            </div>
                            <Image className="h-8 w-8 text-primary mb-2" />
                            <span className="text-sm font-medium truncate max-w-full">{primaryLogo.name}</span>
                          </>
                        ) : (
                          <>
                            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                            <span className="text-sm font-medium">Primary Logo *</span>
                            <span className="text-xs text-muted-foreground">PNG or SVG</span>
                          </>
                        )}
                      </label>

                      {/* Cover Image */}
                      <label className={`
                        relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed cursor-pointer transition-all
                        ${coverImage ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50'}
                      `}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, setCoverImage)}
                          className="hidden"
                        />
                        {coverImage ? (
                          <>
                            <div className="absolute top-2 right-2">
                              <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                                <Check className="h-3 w-3 text-primary-foreground" />
                              </div>
                            </div>
                            <Image className="h-8 w-8 text-primary mb-2" />
                            <span className="text-sm font-medium truncate max-w-full">{coverImage.name}</span>
                          </>
                        ) : (
                          <>
                            <Image className="h-8 w-8 text-muted-foreground mb-2" />
                            <span className="text-sm font-medium">Cover Image</span>
                            <span className="text-xs text-muted-foreground">Optional</span>
                          </>
                        )}
                      </label>
                    </div>

                    {/* Guidelines PDF */}
                    <label className={`
                      flex items-center gap-4 p-4 rounded-xl border-2 border-dashed cursor-pointer transition-all
                      ${guidelinePdf ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50'}
                    `}>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleFileChange(e, setGuidelinePdf)}
                        className="hidden"
                      />
                      <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {guidelinePdf ? guidelinePdf.name : "Upload Brand Guidelines (PDF)"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {guidelinePdf ? "Click to replace" : "We'll extract colors, fonts, and rules"}
                        </p>
                      </div>
                      {guidelinePdf && (
                        <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="h-3 w-3 text-primary-foreground" />
                        </div>
                      )}
                    </label>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="ghost" onClick={() => setStep(2)}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button 
                      onClick={handleComplete}
                      size="lg"
                      className="px-8"
                      disabled={loading || !brandName || !primaryLogo}
                    >
                      {loading ? "Creating..." : "Create Workspace"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;

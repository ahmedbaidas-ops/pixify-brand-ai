import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Users, Target, Upload, Check, ArrowRight, ArrowLeft, Image, FileText, Sparkles } from "lucide-react";
import pixifyLogo from "@/assets/pixify-logo.png";

const INDUSTRIES = [
  "Technology", "Healthcare", "Finance", "Retail", "Education", 
  "Entertainment", "Travel & Hospitality", "Food & Beverage",
  "Real Estate", "Manufacturing", "Consulting", "Non-profit", "Other"
];

const GOALS = [
  { id: "organize", label: "Organize brand assets" },
  { id: "consistency", label: "Improve brand consistency" },
  { id: "speed", label: "Speed up content creation" },
  { id: "collaboration", label: "Improve team collaboration" },
  { id: "approvals", label: "Automate approvals" },
  { id: "educate", label: "Learn/educate team on brand" },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [orgId, setOrgId] = useState<string | null>(null);

  // Step 1: KYB Data
  const [businessType, setBusinessType] = useState("");
  const [industry, setIndustry] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [primaryGoals, setPrimaryGoals] = useState<string[]>([]);
  const [managesMultipleBrands, setManagesMultipleBrands] = useState(false);

  // Step 2: Brand Assets
  const [brandName, setBrandName] = useState("");
  const [brandTagline, setBrandTagline] = useState("");
  const [brandArchetype, setBrandArchetype] = useState("");
  const [brandTone, setBrandTone] = useState("");
  const [primaryLogo, setPrimaryLogo] = useState<File | null>(null);
  const [darkLogo, setDarkLogo] = useState<File | null>(null);
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

      // Get user's organization
      const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", session.user.id)
        .single();

      if (profile?.organization_id) {
        setOrgId(profile.organization_id);

        // Check if onboarding is complete
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

  const handleStep1Next = async () => {
    if (!businessType || !industry || !teamSize) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      // Create or update workspace profile
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

      setStep(2);
    } catch (error: any) {
      toast.error(error.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Next = async () => {
    if (!brandName) {
      toast.error("Brand name is required");
      return;
    }

    if (!primaryLogo) {
      toast.error("Primary logo is required");
      return;
    }

    setStep(3);
  };

  const handleComplete = async () => {
    if (!orgId || !userId) {
      toast.error("Session expired. Please sign in again.");
      navigate("/auth");
      return;
    }

    setLoading(true);
    try {
      // Create the brand
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

      // Upload assets if brand was created
      if (brand) {
        // Upload primary logo
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

        // Upload cover image if provided
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

        // Create initial guideline sections
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

      // Mark onboarding as complete
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

  const progressPercent = (step / 3) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-foreground flex items-center justify-center">
              <img src={pixifyLogo} alt="Pixify" className="h-6 w-6 object-contain brightness-0 invert" />
            </div>
            <span className="font-semibold text-lg">Pixify</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Step {step} of 3</span>
            <Progress value={progressPercent} className="w-32 h-2" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-6">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {/* Step 1: About Your Business */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-border/40 shadow-xl">
                  <CardHeader className="text-center pb-6">
                    <div className="mx-auto h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                      <Building2 className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">About Your Business</CardTitle>
                    <CardDescription>
                      Help us customize Pixify for your needs
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Business Type */}
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Business Type *</Label>
                      <RadioGroup value={businessType} onValueChange={setBusinessType} className="grid grid-cols-2 gap-3">
                        {["Agency", "Brand", "Freelancer", "Startup", "Enterprise"].map((type) => (
                          <div key={type} className="flex items-center space-x-2">
                            <RadioGroupItem value={type.toLowerCase()} id={type} />
                            <Label htmlFor={type} className="cursor-pointer">{type}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    {/* Industry */}
                    <div className="space-y-2">
                      <Label className="text-base font-medium">Industry *</Label>
                      <Select value={industry} onValueChange={setIndustry}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {INDUSTRIES.map((ind) => (
                            <SelectItem key={ind} value={ind.toLowerCase()}>
                              {ind}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Team Size */}
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Team Size *</Label>
                      <RadioGroup value={teamSize} onValueChange={setTeamSize} className="grid grid-cols-2 gap-3">
                        {[
                          { value: "solo", label: "Just me" },
                          { value: "small", label: "2-5" },
                          { value: "medium", label: "6-20" },
                          { value: "large", label: "20+" },
                        ].map((size) => (
                          <div key={size.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={size.value} id={size.value} />
                            <Label htmlFor={size.value} className="cursor-pointer">{size.label}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    {/* Primary Goals */}
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Primary Goals</Label>
                      <div className="grid grid-cols-1 gap-2">
                        {GOALS.map((goal) => (
                          <div key={goal.id} className="flex items-center space-x-3">
                            <Checkbox
                              id={goal.id}
                              checked={primaryGoals.includes(goal.id)}
                              onCheckedChange={() => handleGoalToggle(goal.id)}
                            />
                            <Label htmlFor={goal.id} className="cursor-pointer text-sm">
                              {goal.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Multiple Brands */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                      <Label className="text-sm">Do you manage multiple brands?</Label>
                      <div className="flex items-center gap-3">
                        <Button
                          variant={managesMultipleBrands ? "default" : "outline"}
                          size="sm"
                          onClick={() => setManagesMultipleBrands(true)}
                        >
                          Yes
                        </Button>
                        <Button
                          variant={!managesMultipleBrands ? "default" : "outline"}
                          size="sm"
                          onClick={() => setManagesMultipleBrands(false)}
                        >
                          No
                        </Button>
                      </div>
                    </div>

                    <Button 
                      onClick={handleStep1Next} 
                      disabled={loading}
                      className="w-full h-12 text-base"
                    >
                      {loading ? "Saving..." : "Continue"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Brand Assets */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-border/40 shadow-xl">
                  <CardHeader className="text-center pb-6">
                    <div className="mx-auto h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                      <Upload className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Brand Assets</CardTitle>
                    <CardDescription>
                      Upload your brand materials to get started
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Brand Basic Info */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-base font-medium">Brand Name *</Label>
                        <Input
                          value={brandName}
                          onChange={(e) => setBrandName(e.target.value)}
                          placeholder="Enter your brand name"
                          className="h-11"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Brand Tagline</Label>
                        <Input
                          value={brandTagline}
                          onChange={(e) => setBrandTagline(e.target.value)}
                          placeholder="Your brand's tagline or mission"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Brand Archetype</Label>
                          <Select value={brandArchetype} onValueChange={setBrandArchetype}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select archetype" />
                            </SelectTrigger>
                            <SelectContent>
                              {["Hero", "Caregiver", "Explorer", "Creator", "Sage", "Magician", "Ruler", "Rebel", "Lover", "Jester", "Everyman", "Innocent"].map((arch) => (
                                <SelectItem key={arch} value={arch.toLowerCase()}>
                                  {arch}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Brand Tone</Label>
                          <Input
                            value={brandTone}
                            onChange={(e) => setBrandTone(e.target.value)}
                            placeholder="e.g., Professional, Friendly"
                          />
                        </div>
                      </div>
                    </div>

                    {/* File Uploads */}
                    <div className="space-y-4 pt-4 border-t border-border/40">
                      <h4 className="font-medium flex items-center gap-2">
                        <Image className="h-4 w-4" />
                        Brand Assets
                      </h4>

                      {/* Primary Logo */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Primary Logo (Light BG) *</Label>
                        <div className="border-2 border-dashed border-border rounded-xl p-4 hover:border-primary/50 transition-colors">
                          <input
                            type="file"
                            accept="image/png,image/svg+xml"
                            onChange={(e) => handleFileChange(e, setPrimaryLogo)}
                            className="hidden"
                            id="primaryLogo"
                          />
                          <label htmlFor="primaryLogo" className="flex items-center justify-center gap-3 cursor-pointer">
                            {primaryLogo ? (
                              <div className="flex items-center gap-2 text-primary">
                                <Check className="h-4 w-4" />
                                <span className="text-sm">{primaryLogo.name}</span>
                              </div>
                            ) : (
                              <>
                                <Upload className="h-5 w-5 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Upload PNG or SVG</span>
                              </>
                            )}
                          </label>
                        </div>
                      </div>

                      {/* Cover Image */}
                      <div className="space-y-2">
                        <Label className="text-sm">Brand Cover / Hero Image</Label>
                        <div className="border-2 border-dashed border-border rounded-xl p-4 hover:border-primary/50 transition-colors">
                          <input
                            type="file"
                            accept="image/png,image/jpeg"
                            onChange={(e) => handleFileChange(e, setCoverImage)}
                            className="hidden"
                            id="coverImage"
                          />
                          <label htmlFor="coverImage" className="flex items-center justify-center gap-3 cursor-pointer">
                            {coverImage ? (
                              <div className="flex items-center gap-2 text-primary">
                                <Check className="h-4 w-4" />
                                <span className="text-sm">{coverImage.name}</span>
                              </div>
                            ) : (
                              <>
                                <Upload className="h-5 w-5 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Upload PNG or JPG</span>
                              </>
                            )}
                          </label>
                        </div>
                      </div>

                      {/* Guidelines PDF */}
                      <div className="space-y-2">
                        <Label className="text-sm flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Brand Guidelines (PDF)
                        </Label>
                        <div className="border-2 border-dashed border-border rounded-xl p-4 hover:border-primary/50 transition-colors">
                          <input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => handleFileChange(e, setGuidelinePdf)}
                            className="hidden"
                            id="guidelinePdf"
                          />
                          <label htmlFor="guidelinePdf" className="flex items-center justify-center gap-3 cursor-pointer">
                            {guidelinePdf ? (
                              <div className="flex items-center gap-2 text-primary">
                                <Check className="h-4 w-4" />
                                <span className="text-sm">{guidelinePdf.name}</span>
                              </div>
                            ) : (
                              <>
                                <Upload className="h-5 w-5 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Upload brand guidelines PDF</span>
                              </>
                            )}
                          </label>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          We'll extract colors, fonts, and rules from your guidelines
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-12">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <Button onClick={handleStep2Next} className="flex-1 h-12 text-base">
                        Continue
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Summary */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-border/40 shadow-xl">
                  <CardHeader className="text-center pb-6">
                    <div className="mx-auto h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                      <Sparkles className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Ready to Launch!</CardTitle>
                    <CardDescription>
                      Review your brand setup and create your workspace
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Summary Cards */}
                    <div className="space-y-4">
                      {/* Brand Info */}
                      <div className="p-4 rounded-xl bg-muted/50 space-y-2">
                        <h4 className="font-medium text-sm text-muted-foreground">Brand</h4>
                        <p className="text-lg font-semibold">{brandName}</p>
                        {brandTagline && <p className="text-sm text-muted-foreground">{brandTagline}</p>}
                      </div>

                      {/* Business Info */}
                      <div className="p-4 rounded-xl bg-muted/50 space-y-2">
                        <h4 className="font-medium text-sm text-muted-foreground">Business</h4>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 rounded-full bg-background text-sm capitalize">{businessType}</span>
                          <span className="px-3 py-1 rounded-full bg-background text-sm capitalize">{industry}</span>
                          <span className="px-3 py-1 rounded-full bg-background text-sm">
                            {teamSize === "solo" ? "Solo" : teamSize === "small" ? "2-5 people" : teamSize === "medium" ? "6-20 people" : "20+ people"}
                          </span>
                        </div>
                      </div>

                      {/* Assets */}
                      <div className="p-4 rounded-xl bg-muted/50 space-y-2">
                        <h4 className="font-medium text-sm text-muted-foreground">Uploaded Assets</h4>
                        <div className="flex flex-wrap gap-2">
                          {primaryLogo && (
                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                              <Check className="h-3 w-3" />
                              Primary Logo
                            </span>
                          )}
                          {coverImage && (
                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                              <Check className="h-3 w-3" />
                              Cover Image
                            </span>
                          )}
                          {guidelinePdf && (
                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                              <Check className="h-3 w-3" />
                              Guidelines PDF
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* What happens next */}
                    <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-3">
                      <h4 className="font-medium text-sm">What happens next?</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          Pixify will create your Brand Hub with uploaded assets
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          Your DAM Library will be initialized and ready to use
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          Ask Pixify AI will be trained on your brand context
                        </li>
                      </ul>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button variant="outline" onClick={() => setStep(2)} className="flex-1 h-12">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <Button onClick={handleComplete} disabled={loading} className="flex-1 h-12 text-base">
                        {loading ? "Creating..." : "Create My Brand Workspace"}
                        <Sparkles className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Onboarding;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Mail, Lock, User, Building2 } from "lucide-react";
import pixifyLogo from "@/assets/pixify-logo.png";

const ROLES = [
  "Designer",
  "Founder",
  "Marketing",
  "Account Manager",
  "Developer",
  "Other"
];

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Sign in state
  const [signInEmail, setSignInEmail] = useState("ahmedbaidas@gmail.com");
  const [signInPassword, setSignInPassword] = useState("abb123");
  
  // Sign up state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          // Check onboarding status
          const { data: profile } = await supabase
            .from("profiles")
            .select("organization_id")
            .eq("id", session.user.id)
            .single();

          if (profile?.organization_id) {
            const { data: workspaceProfile } = await supabase
              .from("workspace_profiles")
              .select("onboarding_complete")
              .eq("organization_id", profile.organization_id)
              .single();

            if (workspaceProfile?.onboarding_complete) {
              navigate("/dashboard");
            } else {
              navigate("/onboarding");
            }
          } else {
            // New user without organization - go to onboarding
            navigate("/onboarding");
          }
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("organization_id")
          .eq("id", session.user.id)
          .single();

        if (profile?.organization_id) {
          const { data: workspaceProfile } = await supabase
            .from("workspace_profiles")
            .select("onboarding_complete")
            .eq("organization_id", profile.organization_id)
            .single();

          if (workspaceProfile?.onboarding_complete) {
            navigate("/dashboard");
          } else {
            navigate("/onboarding");
          }
        } else {
          navigate("/onboarding");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail || !signInPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: signInEmail,
        password: signInPassword,
      });
      
      if (error) throw error;
      toast.success("Welcome back!");
    } catch (error: any) {
      if (error.message.includes("Invalid login credentials")) {
        toast.error("Invalid email or password");
      } else {
        toast.error(error.message || "Authentication failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      // Sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: fullName,
            company_name: companyName,
            role: role,
          },
          emailRedirectTo: `${window.location.origin}/onboarding`,
        },
      });
      
      if (signUpError) throw signUpError;

      if (authData.user) {
        // Create organization for the user
        const { data: org, error: orgError } = await supabase
          .from("organizations")
          .insert({
            name: companyName || `${fullName}'s Workspace`,
          })
          .select()
          .single();

        if (orgError) {
          console.error("Org creation error:", orgError);
        }

        if (org) {
          // Update profile with organization
          await supabase
            .from("profiles")
            .update({
              organization_id: org.id,
              company_name: companyName,
              role: role,
            })
            .eq("id", authData.user.id);

          // Create workspace profile for onboarding tracking
          await supabase
            .from("workspace_profiles")
            .insert({
              organization_id: org.id,
              onboarding_complete: false,
            });

          // Assign admin role to user
          await supabase
            .from("user_roles")
            .insert({
              user_id: authData.user.id,
              organization_id: org.id,
              role: "admin",
            });
        }
      }
      
      toast.success("Account created! Let's set up your brand.");
    } catch (error: any) {
      if (error.message.includes("already registered")) {
        toast.error("An account with this email already exists");
      } else {
        toast.error(error.message || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/onboarding`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Google sign in failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Dark with gradient and text */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 bg-black relative overflow-hidden"
      >
        {/* Abstract gradient elements */}
        <div className="absolute inset-0">
          <div className="absolute bottom-0 left-0 w-96 h-[600px] bg-gradient-to-t from-neutral-800/80 via-neutral-700/40 to-transparent blur-3xl transform -translate-x-1/4" />
          <div className="absolute bottom-20 left-20 w-32 h-[400px] bg-gradient-to-t from-neutral-600/60 to-transparent blur-2xl" />
          <div className="absolute bottom-10 left-40 w-24 h-[300px] bg-gradient-to-t from-neutral-500/40 to-transparent blur-xl" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 py-12">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight"
          >
            Transform your<br />
            brand into<br />
            success.
          </motion.h1>
        </div>
      </motion.div>

      {/* Right Panel - Form */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white"
      >
        <div className="w-full max-w-md">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <img 
              src={pixifyLogo} 
              alt="Pixify" 
              className="h-10 w-auto"
            />
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-black mb-2">
              {isSignUp ? "Get Started" : "Welcome back"}
            </h2>
            <p className="text-neutral-500">
              {isSignUp 
                ? "Welcome to Pixify — Let's get started" 
                : "Sign in to your Pixify account"}
            </p>
          </motion.div>

          {/* Form */}
          {isSignUp ? (
            <form onSubmit={handleSignUp} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-neutral-600 text-sm">Full name</Label>
                <div className="relative">
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-12 border-neutral-200 bg-white focus:border-black focus:ring-black/10 pl-4"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-neutral-600 text-sm">Your email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="hi@pixify.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 border-neutral-200 bg-white focus:border-black focus:ring-black/10 pl-4"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-neutral-600 text-sm">Create new password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 border-neutral-200 bg-white focus:border-black focus:ring-black/10 pl-4"
                    minLength={6}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-neutral-600 text-sm">Company</Label>
                  <Input
                    id="companyName"
                    type="text"
                    placeholder="Acme Inc"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="h-12 border-neutral-200 bg-white focus:border-black focus:ring-black/10 pl-4"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-neutral-600 text-sm">Role</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger className="h-12 border-neutral-200 bg-white focus:border-black focus:ring-black/10">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((r) => (
                        <SelectItem key={r} value={r.toLowerCase()}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base bg-black text-white hover:bg-neutral-800 rounded-lg font-medium"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create new account"}
              </Button>

              <p className="text-center text-neutral-500 text-sm">
                Already have account?{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="text-black font-medium underline underline-offset-2 hover:no-underline"
                >
                  Login
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleSignIn} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="signin-email" className="text-neutral-600 text-sm">Your email</Label>
                <div className="relative">
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="hi@pixify.io"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    className="h-12 border-neutral-200 bg-white focus:border-black focus:ring-black/10 pl-4"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signin-password" className="text-neutral-600 text-sm">Password</Label>
                <div className="relative">
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="••••••••"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    className="h-12 border-neutral-200 bg-white focus:border-black focus:ring-black/10 pl-4"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base bg-black text-white hover:bg-neutral-800 rounded-lg font-medium"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-neutral-400">or continue with</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12 border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>

              <p className="text-center text-neutral-500 text-sm">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="text-black font-medium underline underline-offset-2 hover:no-underline"
                >
                  Create account
                </button>
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;

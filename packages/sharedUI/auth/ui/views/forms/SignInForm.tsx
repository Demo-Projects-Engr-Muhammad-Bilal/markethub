"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignInFormProps } from "../../../lib/types/auth.types";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getAuthService } from "../../../lib/services/auth.service";
import { signInSchema } from "../../../lib/validations/validation";
import { useConfig } from "../../../lib/context/ConfigContext"; // 🟢

export function SignInForm({ isLoading, setIsLoading, setView, setTempUserId, onSetup2FA }: SignInFormProps) {
          const [showPassword, setShowPassword] = useState(false);
          const [formData, setFormData] = useState({ email: "", password: "" });
          const [isValid, setIsValid] = useState(false);
          const { apiUrl, successRedirect, appRole } = useConfig();
                              useEffect(() => {
                    setIsValid(signInSchema.safeParse(formData).success);
          }, [formData]);

          const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    setFormData({ ...formData, [e.target.id]: e.target.value });
          };

          const handleSignIn = async (e: React.FormEvent) => {
                    e.preventDefault();
                    if (!isValid) return;
                    setIsLoading(true);
                    try {
                              const authService = getAuthService(apiUrl); // 🟢
                              const response = await authService.login(formData.email, formData.password, appRole);

                              if (response.require2FA && response.action === 'verify') {
                                        setTempUserId(response.userId);
                                        toast.info("Please enter your 2FA code.");
                                        setView('2fa');
                              } else if (response.require2FA && response.action === 'setup') {
                                        toast.info("Please setup 2FA first.");
                                        onSetup2FA(response.userId);
                              } else if (response.success) {
                                        localStorage.setItem("marketHub_token", response.token);
                                        toast.success(`Welcome back, ${response.user.username}!`);
                                        window.location.href = successRedirect;
                              }
                    } catch (error: any) {
                              toast.error(error);
                    } finally {
                              setIsLoading(false);
                    }
          };

          return (
                    <form onSubmit={handleSignIn} className="space-y-5">
                              <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input id="email" value={formData.email} onChange={handleChange} type="email" placeholder="user@company.com" required className="bg-background h-14 rounded-2xl px-4 text-base" />
                              </div>
                              <div className="space-y-2">
                                        <div className="flex justify-between items-center px-1">
                                                  <Label htmlFor="password">Password</Label>
                                                  <button type="button" onClick={() => setView('forgot')} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                                                            Forgot password?
                                                  </button>
                                        </div>
                                        <div className="relative">
                                                  <Input id="password" value={formData.password} onChange={handleChange} type={showPassword ? "text" : "password"} placeholder="••••••••" required className="bg-background h-14 rounded-2xl px-4 text-base pr-12" />
                                                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer">
                                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                  </button>
                                        </div>
                              </div>
                              <Button type="submit" className="w-full h-14 rounded-2xl mt-4 group font-medium text-lg cursor-pointer" disabled={isLoading || !isValid}>
                                        {isLoading ? "Authenticating..." : <><LogIn className="w-5 h-5 mr-2" />Secure Sign In</>}
                              </Button>
                    </form>
          );
}
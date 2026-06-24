"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignUpFormProps } from "../../../lib/types/auth.types";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getAuthService } from "../../../lib/services/auth.service";
import { signUpSchema } from "../../../lib/validations/validation";
import { useConfig } from "../../../lib/context/ConfigContext"; // 🟢

export function SignUpForm({ appRole, isLoading, setIsLoading, setView, changeTab }: SignUpFormProps) {
          const [showPassword, setShowPassword] = useState(false);
          const [showConfirm, setShowConfirm] = useState(false);

          const [formData, setFormData] = useState({ fullname: "", email: "", password: "", confirmPassword: "" });
          const [isValid, setIsValid] = useState(false);
          const { apiUrl } = useConfig(); // 🟢

          useEffect(() => {
                    setIsValid(signUpSchema.safeParse(formData).success);
          }, [formData]);

          const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    setFormData({ ...formData, [e.target.id]: e.target.value });
          };

          const handleSignUp = async (e: React.FormEvent) => {
                    e.preventDefault();
                    if (!isValid) return;

                    setIsLoading(true);
                    try {
                              const authService = getAuthService(apiUrl); // 🟢
                              const response = await authService.register({
                                        username: formData.fullname,
                                        email: formData.email,
                                        password: formData.password,
                                        role: appRole.toLowerCase()
                              });

                              toast.success(response.message || `Account created! Waiting for approval.`);
                              setView('main');
                              changeTab('signin');
                    } catch (error: any) {
                              toast.error(error);
                    } finally {
                              setIsLoading(false);
                    }
          };

          return (
                    <form onSubmit={handleSignUp} className="space-y-5">
                              <div className="space-y-2">
                                        <Label htmlFor="fullname">Business / Full Name</Label>
                                        <Input id="fullname" value={formData.fullname} onChange={handleChange} placeholder="John Doe" required className="bg-background h-14 rounded-2xl px-4 text-base" />
                              </div>
                              <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input id="email" value={formData.email} onChange={handleChange} type="email" placeholder="contact@company.com" required className="bg-background h-14 rounded-2xl px-4 text-base" />
                              </div>
                              <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <div className="relative">
                                                  <Input id="password" value={formData.password} onChange={handleChange} type={showPassword ? "text" : "password"} placeholder="Min. 8 chars, 1 Upper, 1 Num, 1 Special" required className="bg-background h-14 rounded-2xl px-4 text-base pr-12" />
                                                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer">
                                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                  </button>
                                        </div>
                              </div>
                              <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                                        <div className="relative">
                                                  <Input id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} type={showConfirm ? "text" : "password"} placeholder="Repeat password" required className="bg-background h-14 rounded-2xl px-4 text-base pr-12" />
                                                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer">
                                                            {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                  </button>
                                        </div>
                              </div>
                              <Button type="submit" className="w-full h-14 rounded-2xl mt-4 font-medium text-lg cursor-pointer" disabled={isLoading || !isValid}>
                                        {isLoading ? "Creating Account..." : <><UserPlus className="w-5 h-5 mr-2" />Apply as {appRole}</>}
                              </Button>
                    </form>
          );
}
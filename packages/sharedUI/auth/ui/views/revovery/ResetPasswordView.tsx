"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResetPasswordViewProps } from "../../../lib/types/auth.types";
import { Eye, EyeOff, KeyRound, MailCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getAuthService } from "../../../lib/services/auth.service";
import { resetPasswordSchema } from "../../../lib/validations/validation";
import { useConfig } from "../../../lib/context/ConfigContext"; // 

export function ResetPasswordView({ isLoading, setIsLoading, setView }: ResetPasswordViewProps) {
          const [showPassword, setShowPassword] = useState(false);
          const [showConfirm, setShowConfirm] = useState(false);
          const [token, setToken] = useState("");
          const [formData, setFormData] = useState({ newPassword: "", confirmPassword: "" });
          const [isValid, setIsValid] = useState(false);
          const { apiUrl } = useConfig(); // 🟢

          useEffect(() => {
                    setIsValid(resetPasswordSchema.safeParse(formData).success);
          }, [formData]);

          const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    setFormData({ ...formData, [e.target.id]: e.target.value });
          };

          const handleResetPassword = async (e: React.FormEvent) => {
                    e.preventDefault();
                    if (!isValid || !token) return;
                    setIsLoading(true);
                    try {
                              const authService = getAuthService(apiUrl); // 🟢
                              const response = await authService.resetPassword(token, formData.newPassword);
                              toast.success(response.message);
                              setView('main');
                    } catch (error: any) {
                              toast.error(error);
                    } finally {
                              setIsLoading(false);
                    }
          };

          return (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                              <div className="mb-8 text-center">
                                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-6">
                                                  <MailCheck className="w-7 h-7" />
                                        </div>
                                        <h2 className="text-3xl font-semibold mb-2">Set New Password</h2>
                                        <p className="text-muted-foreground text-sm">Enter the token from your email and set a new password.</p>
                              </div>
                              <form onSubmit={handleResetPassword} className="space-y-5">
                                        <div className="space-y-2">
                                                  <Label htmlFor="reset-token">Reset Token</Label>
                                                  <Input id="reset-token" type="text" placeholder="Paste token from your email" value={token} onChange={(e) => setToken(e.target.value)} required className="bg-background h-14 rounded-2xl px-4 text-base font-mono tracking-wider" />
                                        </div>
                                        <div className="space-y-2">
                                                  <Label htmlFor="newPassword">New Password</Label>
                                                  <div className="relative">
                                                            <Input id="newPassword" type={showPassword ? "text" : "password"} value={formData.newPassword} onChange={handleChange} placeholder="Min. 8 chars, 1 Upper, 1 Num, 1 Special" required className="bg-background h-14 rounded-2xl px-4 text-base pr-12" />
                                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer">
                                                                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                            </button>
                                                  </div>
                                        </div>
                                        <div className="space-y-2">
                                                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                                                  <div className="relative">
                                                            <Input id="confirmPassword" type={showConfirm ? "text" : "password"} value={formData.confirmPassword} onChange={handleChange} placeholder="Repeat new password" required className="bg-background h-14 rounded-2xl px-4 text-base pr-12" />
                                                            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer">
                                                                      {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                            </button>
                                                  </div>
                                        </div>
                                        <Button type="submit" className="w-full h-14 rounded-2xl mt-4 font-medium text-lg cursor-pointer" disabled={isLoading || !token || !isValid}>
                                                  {isLoading ? "Updating..." : <><KeyRound className="w-5 h-5 mr-2" />Update Password</>}
                                        </Button>
                                        <button type="button" onClick={() => setView('forgot')} className="w-full text-center text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer pt-2">
                                                  Didn't receive the token? Send again
                                        </button>
                              </form>
                    </div>
          );
}
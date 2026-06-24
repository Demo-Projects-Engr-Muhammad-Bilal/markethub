"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, KeyRound, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getAuthService } from "../../../lib/services/auth.service";
import { ForgotPasswordViewProps } from "../../../lib/types/auth.types";
import { forgotPasswordSchema } from "../../../lib/validations/validation";
import { useConfig } from "../../../lib/context/ConfigContext"; // 🟢

export function ForgotPasswordView({ isLoading, setIsLoading, setView }: ForgotPasswordViewProps) {
          const [email, setEmail] = useState("");
          const [isValid, setIsValid] = useState(false);
          const { apiUrl } = useConfig(); // 🟢

          useEffect(() => {
                    setIsValid(forgotPasswordSchema.safeParse({ email }).success);
          }, [email]);

          const handleForgotPassword = async (e: React.FormEvent) => {
                    e.preventDefault();
                    if (!isValid) return;
                    setIsLoading(true);
                    try {
                              const authService = getAuthService(apiUrl); // 🟢
                              const response = await authService.forgotPassword(email);
                              toast.success(response.message);
                              setView('reset');
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
                                                  <KeyRound className="w-7 h-7" />
                                        </div>
                                        <h2 className="text-3xl font-semibold mb-2">Reset Password</h2>
                                        <p className="text-muted-foreground text-sm max-w-sm mx-auto">Enter your email address to receive a reset link.</p>
                              </div>
                              <form onSubmit={handleForgotPassword} className="space-y-5">
                                        <div className="space-y-2">
                                                  <Label htmlFor="email">Account Email</Label>
                                                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="contact@company.com" required className="bg-background h-14 rounded-2xl px-4" />
                                        </div>
                                        <Button type="submit" className="w-full h-14 rounded-2xl mt-2 font-medium text-lg cursor-pointer" disabled={isLoading || !isValid}>
                                                  {isLoading ? "Sending Link..." : <><Send className="w-5 h-5 mr-2" />Send Reset Link</>}
                                        </Button>
                                        <Button variant="ghost" type="button" onClick={() => setView('main')} className="w-full h-14 rounded-2xl text-muted-foreground mt-2 cursor-pointer">
                                                  <ArrowLeft className="w-4 h-4 mr-2" />Back to Login
                                        </Button>
                              </form>
                    </div>
          );
}
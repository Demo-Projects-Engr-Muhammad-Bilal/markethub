"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useConfig } from "../../../lib/context/ConfigContext";
import { getAuthService } from "../../../lib/services/auth.service";
import { AuthView } from "../../../lib/types/auth.types";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, MailCheck, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";

interface VerifyEmailFormProps {
          setView: (view: AuthView) => void;
}

export function VerifyEmailForm({ setView }: VerifyEmailFormProps) {
          const searchParams = useSearchParams();
          const tokenFromUrl = searchParams.get("token");

          const [email, setEmail] = useState("");
          const [token, setToken] = useState("");
          const [isLoading, setIsLoading] = useState(false);
          const { apiUrl } = useConfig();

          useEffect(() => {
                    if (tokenFromUrl) setToken(tokenFromUrl);
          }, [tokenFromUrl]);

          const handleVerify = async (e?: React.FormEvent) => {
                    if (e) e.preventDefault();
                    setIsLoading(true);
                    try {
                              const authService = getAuthService(apiUrl);
                              await authService.verifyEmail(email, token);
                              toast.success("Email verified successfully!");
                              setView("main");
                    } catch (error: any) {
                              toast.error(error?.message || "Verification failed.");
                    } finally {
                              setIsLoading(false);
                    }
          };

          const inputClasses =
                    "h-14 rounded-2xl bg-muted/60 border-transparent focus:border-primary/20 transition-all";

          return (
                    <form className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                              <div className="space-y-4 flex flex-col justify-center items-center">
                                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-6">
                                                  <MailCheck className="w-7 h-7" />
                                        </div>
                                        <h2 className="text-2xl font-bold">Verify Email</h2>
                                        <p className="text-sm text-muted-foreground">
                                                  Enter your email and the verification token sent to you.
                                        </p>
                              </div>

                              <div className="space-y-4">
                                        <div className="space-y-2">
                                                  <Label htmlFor="email" className="text-sm font-medium">
                                                            Account Email
                                                  </Label>
                                                  <Input
                                                            id="email"
                                                            placeholder="user@example.com"
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                            required
                                                            className={inputClasses}
                                                  />
                                        </div>

                                        <div className="space-y-2">
                                                  <Label htmlFor="token" className="text-sm font-medium">
                                                            Verification Token
                                                  </Label>
                                                  <Input
                                                            id="token"
                                                            placeholder="Enter 64-character token"
                                                            value={token}
                                                            onChange={(e) => setToken(e.target.value)}
                                                            required
                                                            className={inputClasses}
                                                  />
                                        </div>
                              </div>

                              {/* ✅ Button now uses onClick instead of type=submit */}
                              <Button
                                        type="button"
                                        onClick={handleVerify}
                                        className="w-full h-14 rounded-full text-base font-semibold shadow-md cursor-pointer flex items-center justify-center gap-2"
                                        disabled={isLoading}
                              >
                                        {isLoading ? (
                                                  <>
                                                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                                            Verifying...
                                                  </>
                                        ) : (
                                                  <>
                                                            <MailCheck className="w-4 h-4 mr-2" />
                                                            Verify Account
                                                  </>
                                        )}
                              </Button>

                              <Button
                                        variant="ghost"
                                        type="button"
                                        onClick={() => setView("main")}
                                        className="w-full h-14 rounded-2xl text-muted-foreground mt-2 cursor-pointer"
                              >
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Back to Login
                              </Button>
                    </form>
          );
}

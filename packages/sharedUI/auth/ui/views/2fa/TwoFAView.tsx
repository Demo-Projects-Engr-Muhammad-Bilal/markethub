"use client";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { TwoFAViewProps } from "../../../lib/types/auth.types";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getAuthService } from "../../../lib/services/auth.service";
import { useConfig } from "../../../lib/context/ConfigContext"; // 🟢

export function TwoFAView({ tempUserId, otpCode, setOtpCode, isLoading, setIsLoading, setView, onSuccess }: TwoFAViewProps) {
          const router = useRouter();
          const { apiUrl } = useConfig(); // 🟢

          const executeVerify = async (codeToVerify: string) => {
                    if (!tempUserId || codeToVerify.length !== 6) return;
                    setIsLoading(true);
                    try {
                              const authService = getAuthService(apiUrl); // 🟢
                              const response = await authService.verify2FA(tempUserId, codeToVerify);
                              localStorage.setItem("marketHub_token", response.token);
                              toast.success("2FA Verified! Login Complete.");
                              router.push('/dashboard');
                    } catch (error: any) {
                              toast.error(error);
                              setOtpCode("");
                    } finally {
                              setIsLoading(false);
                    }
          };

          const handleOTPChange = (value: string) => {
                    setOtpCode(value);
                    if (value.length === 6) {
                              executeVerify(value);
                    }
          };

          return (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
                              <div className="mb-8">
                                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 text-primary mb-6">
                                                  <ShieldCheck className="w-12 h-12" />
                                        </div>
                                        <h2 className="text-3xl font-semibold mb-3">Two-Factor Auth</h2>
                              </div>
                              <div className="flex justify-center mb-10">
                                        {/* @ts-ignore */}
                                        <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS} value={otpCode} onChange={handleOTPChange} disabled={isLoading}>
                                                  <InputOTPGroup className="gap-2">
                                                            <InputOTPSlot index={0} className="w-12 h-14 rounded-xl text-xl border border-border" />
                                                            <InputOTPSlot index={1} className="w-12 h-14 rounded-xl text-xl border border-border" />
                                                            <InputOTPSlot index={2} className="w-12 h-14 rounded-xl text-xl border border-border" />
                                                  </InputOTPGroup>
                                                  <div className="w-3" />
                                                  <InputOTPGroup className="gap-2">
                                                            <InputOTPSlot index={3} className="w-12 h-14 rounded-xl text-xl border border-border" />
                                                            <InputOTPSlot index={4} className="w-12 h-14 rounded-xl text-xl border border-border" />
                                                            <InputOTPSlot index={5} className="w-12 h-14 rounded-xl text-xl border border-border" />
                                                  </InputOTPGroup>
                                        </InputOTP>
                              </div>
                              <div className="space-y-4">
                                        <Button onClick={() => executeVerify(otpCode)} className="w-full h-14 rounded-2xl font-medium text-lg cursor-pointer" disabled={isLoading || otpCode.length !== 6}>
                                                  {isLoading ? "Verifying..." : <><ShieldCheck className="w-5 h-5 mr-2" />Verify & Proceed</>}
                                        </Button>
                                        <Button variant="ghost" onClick={() => setView('main')} className="w-full h-14 rounded-2xl text-muted-foreground hover:text-foreground cursor-pointer">
                                                  <ArrowLeft className="w-4 h-4 mr-2" />Back to Login
                                        </Button>
                              </div>
                    </div>
          );
}
"use client";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Setup2FAViewProps } from "../../../lib/types/auth.types";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getAuthService } from "../../../lib/services/auth.service";
import { useConfig } from "../../../lib/context/ConfigContext"; // 🟢

function buildQrImageUrl(otpauthUrl: string): string {
          return `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(otpauthUrl)}`;
}

export function Setup2FAView({ tempUserId, otpCode, setOtpCode, otpauthUrl, isLoading, setIsLoading, setView, onSuccess }: Setup2FAViewProps) {
          const router = useRouter();
          const { apiUrl } = useConfig(); // 🟢

          const executeVerify = async (codeToVerify: string) => {
                    if (!tempUserId || codeToVerify.length !== 6) return;
                    setIsLoading(true);
                    try {
                              const authService = getAuthService(apiUrl); // 🟢
                              const response = await authService.verify2FA(tempUserId, codeToVerify);
                              localStorage.setItem("marketHub_token", response.token);
                              toast.success("2FA Enabled & Login Complete!");
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

          const qrImageUrl = otpauthUrl ? buildQrImageUrl(otpauthUrl) : null;

          return (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
                              <div className="mb-6">
                                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-4">
                                                  <ShieldCheck className="w-10 h-10" />
                                        </div>
                                        <h2 className="text-2xl font-semibold mb-2">Setup 2FA</h2>
                                        <p className="text-muted-foreground text-sm">Scan this QR code with Google Authenticator.</p>
                              </div>
                              <div className="flex justify-center mb-6">
                                        {qrImageUrl ? (
                                                  <img src={qrImageUrl} alt="2FA QR Code" width={160} height={160} className="border-4 border-white rounded-xl shadow-sm" />
                                        ) : (
                                                  <div className="w-40 h-40 bg-muted animate-pulse rounded-xl" />
                                        )}
                              </div>
                              <div className="flex justify-center mb-8">
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
                              <Button onClick={() => executeVerify(otpCode)} className="w-full h-14 rounded-2xl font-medium text-lg cursor-pointer" disabled={isLoading || otpCode.length !== 6}>
                                        {isLoading ? "Verifying..." : "Verify & Enable 2FA"}
                              </Button>
                              <div className="space-y-4 mt-4">
                                        <Button variant="ghost" onClick={() => setView('main')} className="w-full h-14 rounded-2xl text-muted-foreground hover:text-foreground cursor-pointer">
                                                  <ArrowLeft className="w-4 h-4 mr-2" />Back to Login
                                        </Button>
                              </div>
                    </div>
          );
}
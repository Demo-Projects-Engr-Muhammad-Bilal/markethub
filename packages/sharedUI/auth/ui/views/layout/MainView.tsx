"use client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { useConfig } from "../../../lib/context/ConfigContext";
import { getAuthService } from "../../../lib/services/auth.service";
import { MainViewProps } from "../../../lib/types/auth.types";
import { SignInForm } from "../forms/SignInForm";
import { SignUpForm } from "../forms/SignUpForm";

function GoogleSignInButton({ appRole, redirectUri }: { appRole: string; redirectUri?: string }) {
          const [isGoogleLoading, setIsGoogleLoading] = useState(false);
          const { apiUrl, successRedirect } = useConfig();

          const loginWithGoogle = useGoogleLogin({
                    flow: "auth-code",
                    redirect_uri: redirectUri,
                    onSuccess: async ({ code }) => {
                              setIsGoogleLoading(true);
                              try {
                                        const authService = getAuthService(apiUrl);
                                        const response = await authService.googleAuth(code, appRole.toLowerCase());
                                        localStorage.setItem("marketHub_token", response.token);
                                        toast.success(`Welcome, ${response.user?.username || "User"}!`);
                                        window.location.href = successRedirect;
                              } catch (error: any) {
                                        toast.error(error?.message || "Google Sign-In failed.");
                              } finally {
                                        setIsGoogleLoading(false);
                              }
                    },
                    onError: () => toast.error("Google Sign-In failed."),
          });

          return (
                    <Button
                              type="button"
                              variant="outline"
                              onClick={() => loginWithGoogle()}
                              disabled={isGoogleLoading}
                              className="h-14 rounded-2xl bg-background hover:bg-muted/50 transition-colors w-full cursor-pointer text-base"
                    >
                              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                              </svg>
                              {isGoogleLoading ? "Connecting..." : "Continue with Google"}
                    </Button>
          );
}

export function MainView({
          appName, logoSrc,
          appRole, isLoading, setIsLoading, setView, setTempUserId, googleClientId, googleRedirectUri,
          onSetup2FA, tabParam, changeTab, hideSignUp
}: MainViewProps) {
          return (
                    <div className="animate-in fade-in zoom-in-95 duration-300 pt-8 lg:pt-5 flex flex-col items-center text-center lg:items-start lg:text-left">

                              {/* MOBILE LOGO VIEW */}
                              <div className="lg:hidden flex items-center justify-center mb-8 w-full">
                                        {logoSrc ? (
                                                  <div className="relative h-10 flex items-center">
                                                            {/* @ts-ignore */}
                                                            <Image
                                                                      src={logoSrc}
                                                                      alt={`${appName} Logo`}
                                                                      width={160}
                                                                      height={40}
                                                                      className="h-full w-auto object-contain"
                                                                      priority
                                                            />
                                                  </div>
                                        ) : (
                                                  <div className="relative w-10 h-10">
                                                            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                                                                      {appName.substring(0, 2).toUpperCase()}
                                                            </div>
                                                  </div>
                                        )}
                              </div>

                              {/* HEADING + SUBTEXT */}
                              <div className="mb-8">
                                        <h2 className="text-3xl font-semibold mb-2">{appRole} Portal</h2>
                                        <p className="text-muted-foreground text-sm">
                                                  Log in to manage your {appRole.toLowerCase()} operations.
                                        </p>
                              </div>

                              <Tabs value={hideSignUp ? "signin" : tabParam} onValueChange={changeTab} className="w-full">
                                        {hideSignUp ? (
                                                  <></>
                                        ) : (
                                                  <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted/60 p-1.5 rounded-2xl h-14 border border-border/20">
                                                            <TabsTrigger
                                                                      value="signin"
                                                                      className="rounded-xl h-full text-base cursor-pointer transition-all border-transparent outline-none data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md"
                                                            >
                                                                      Sign In
                                                            </TabsTrigger>
                                                            <TabsTrigger
                                                                      value="signup"
                                                                      className="rounded-xl h-full text-base cursor-pointer transition-all border-transparent outline-none data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md"
                                                            >
                                                                      {appRole === "Customer" ? "Sign Up" : "Register"}
                                                            </TabsTrigger>
                                                  </TabsList>
                                        )}

                                        <TabsContent value="signin" className="space-y-6 w-full">
                                                  <SignInForm isLoading={isLoading} setIsLoading={setIsLoading} setView={setView} setTempUserId={setTempUserId} onSetup2FA={onSetup2FA} />
                                        </TabsContent>

                                        {!hideSignUp && (
                                                  <TabsContent value="signup" className="space-y-6 w-full">
                                                            <SignUpForm appRole={appRole} isLoading={isLoading} setIsLoading={setIsLoading} setView={setView} changeTab={changeTab} />
                                                  </TabsContent>
                                        )}
                              </Tabs>

                              {googleClientId && (
                                        <div className="mt-8 pt-8 border-t border-border text-center w-full">
                                                  <p className="text-center text-xs font-medium text-muted-foreground mb-5 uppercase tracking-wider">
                                                            Or continue with
                                                  </p>
                                                  <GoogleOAuthProvider clientId={googleClientId}>
                                                            <GoogleSignInButton appRole={appRole} redirectUri={googleRedirectUri} />
                                                  </GoogleOAuthProvider>
                                        </div>
                              )}
                    </div>
          );
}

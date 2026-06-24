"use client";
import { useState, useEffect, Suspense } from "react";
import { Moon, Sun } from "lucide-react";
import { toast } from "sonner";
import { AuthPageProps, AuthView } from "../lib/types/auth.types";
import { LeftPanel } from "./views/layout/LeftPanel";
import { MainView } from "./views/layout/MainView";
import { TwoFAView } from "./views/2fa/TwoFAView";
import { ForgotPasswordView } from "./views/revovery/ForgotPasswordView";
import { ResetPasswordView } from "./views/revovery/ResetPasswordView";
import { Setup2FAView } from "./views/2fa/Setup2FAView";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ConfigProvider } from "../lib/context/ConfigContext";
import { getAuthService } from "../lib/services/auth.service"; // 🟢 For top level setup2fa call
import { VerifyEmailForm } from "./views/forms/VerifyEmailForm";

interface ExtendedAuthPageProps extends AuthPageProps {
          hideSignUp?: boolean;
}

function AuthPageContent(props: ExtendedAuthPageProps) {
          const {
                    appName = "MarketHub",
                    appRole = "User",
                    leftPanelTitle = "Welcome to MarketHub",
                    leftPanelSubtitle = "The premium B2B marketplace platform.",
                    leftPanelFeatures = [],
                    googleClientId,
                    hideSignUp = false,
                    logoSrc,
          } = props;

          const [isLoading, setIsLoading] = useState(false);
          const [isDarkMode, setIsDarkMode] = useState(false);
          const [tempUserId, setTempUserId] = useState<string | null>(null);
          const [otpCode, setOtpCode] = useState("");
          const [otpauthUrl, setOtpauthUrl] = useState<string | null>(null);

          const router = useRouter();
          const pathname = usePathname();
          const searchParams = useSearchParams();

          const urlToken = searchParams?.get("token");
          const viewParam = searchParams?.get("view") as AuthView | null;
          const tabParam = searchParams?.get("tab") || "signin";

          const activeView: AuthView = viewParam
                    ? (viewParam as AuthView)
                    : (urlToken ? 'reset' : 'main');

          const changeView = (newView: AuthView) => {
                    const params = new URLSearchParams(searchParams?.toString() || "");
                    if (newView === 'main') {
                              params.delete('view');
                    } else {
                              params.set('view', newView);
                    }
                    if (newView !== 'reset') params.delete('token');
                    router.push(`${pathname}?${params.toString()}`, { scroll: false });
          };

          const changeTab = (newTab: string) => {
                    const params = new URLSearchParams(searchParams?.toString() || "");
                    if (newTab === 'signin') {
                              params.delete('tab');
                    } else {
                              params.set('tab', newTab);
                    }
                    router.push(`${pathname}?${params.toString()}`, { scroll: false });
          };

          useEffect(() => {
                    if (urlToken) {
                              toast.info("Please set your new password.");
                    }
          }, [urlToken]);

          const handleSetup2FA = async (userId: string) => {
                    setIsLoading(true);
                    try {
                              const authService = getAuthService(props.apiUrl); // 🟢 Get service for top level call
                              const response = await authService.setup2FA(userId);
                              setOtpauthUrl(response.otpauth_url);
                              setTempUserId(userId);
                              changeView('setup-2fa');
                    } catch (error: any) {
                              toast.error(error);
                    } finally {
                              setIsLoading(false);
                    }
          };

          const successRedirect = appRole?.toLowerCase() === 'customer' ? '/' : '/dashboard';

          return (
                    <ConfigProvider apiUrl={props.apiUrl} successRedirect={successRedirect} appRole={appRole}>
                              <div className={`${isDarkMode ? "dark" : ""} w-full h-screen font-sans`}>
                                        <main className="grid lg:grid-cols-12 h-screen w-full overflow-hidden bg-background text-foreground transition-colors duration-300">
                                                  <LeftPanel
                                                            appName={appName}
                                                            appRole={appRole!}
                                                            leftPanelTitle={leftPanelTitle!}
                                                            leftPanelSubtitle={leftPanelSubtitle!}
                                                            leftPanelFeatures={leftPanelFeatures!}
                                                            logoSrc={logoSrc}
                                                  />
                                                  <section className="relative flex flex-col p-6 lg:p-12 w-full h-full overflow-y-auto scrollbar-hide lg:col-span-7">
                                                            <button
                                                                      onClick={() => setIsDarkMode(!isDarkMode)}
                                                                      className="absolute top-4 right-4 lg:top-8 lg:right-8 p-3 rounded-full bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all cursor-pointer z-50"
                                                            >
                                                                      {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                                                            </button>
                                                            <div className="w-full max-w-[420px] my-auto mx-auto pb-10 transition-all duration-500 ease-in-out">
                                                                      {activeView === 'main' && (
                                                                                <MainView
                                                                                          appName={appName}
                                                                                          logoSrc={logoSrc}
                                                                                          appRole={appRole!}
                                                                                          isLoading={isLoading}
                                                                                          setIsLoading={setIsLoading}
                                                                                          setView={changeView}
                                                                                          setTempUserId={setTempUserId}
                                                                                          googleClientId={googleClientId}
                                                                                          googleRedirectUri={props.googleRedirectUri} // 🟢 Pass down for Google
                                                                                          onSetup2FA={handleSetup2FA}
                                                                                          tabParam={tabParam}
                                                                                          changeTab={changeTab}
                                                                                          hideSignUp={hideSignUp}
                                                                                />
                                                                      )}
                                                                      {activeView === 'forgot' && (
                                                                                <ForgotPasswordView isLoading={isLoading} setIsLoading={setIsLoading} setView={changeView} />
                                                                      )}
                                                                      {activeView === 'reset' && (
                                                                                <ResetPasswordView isLoading={isLoading} setIsLoading={setIsLoading} setView={changeView} />
                                                                      )}
                                                                      {activeView === 'verify-email' && (
                                                                                <VerifyEmailForm setView={changeView} />
                                                                      )}
                                                                      {activeView === '2fa' && (
                                                                                <TwoFAView
                                                                                          tempUserId={tempUserId}
                                                                                          otpCode={otpCode}
                                                                                          setOtpCode={setOtpCode}
                                                                                          isLoading={isLoading}
                                                                                          setIsLoading={setIsLoading}
                                                                                          setView={changeView}
                                                                                          onSuccess={() => router.push(successRedirect)}
                                                                                />
                                                                      )}
                                                                      {activeView === 'setup-2fa' && (
                                                                                <Setup2FAView
                                                                                          tempUserId={tempUserId}
                                                                                          otpCode={otpCode}
                                                                                          setOtpCode={setOtpCode}
                                                                                          otpauthUrl={otpauthUrl}
                                                                                          isLoading={isLoading}
                                                                                          setIsLoading={setIsLoading}
                                                                                          setView={changeView}
                                                                                          onSuccess={() => router.push(successRedirect)}
                                                                                />
                                                                      )}
                                                            </div>
                                                  </section>
                                        </main>
                              </div>
                    </ConfigProvider>
          );
}

export default function AuthPage(props: ExtendedAuthPageProps) {
          return (
                    <Suspense fallback={<div className="flex h-screen w-full items-center justify-center">Loading MarketHub...</div>}>
                              <AuthPageContent {...props} />
                    </Suspense>
          );
}
"use client"
import { AuthPage } from "@markethub/shared-ui";
import { BarChart3, ShieldCheck, Banknote } from "lucide-react";

export default function OwnerLoginPage() {
          return (
                    <AuthPage
                              apiUrl={process.env.NEXT_PUBLIC_AUTH_SERVICE_URL!}
                              appName="MarketHub"
                              appRole="Owner"
                              logoSrc="/logos/logo-red2.png"
                              hideSignUp={true} // 🟢 Important: No Sign Up for Owner
                              leftPanelTitle={<>Executive <br /> Control Board.</>}
                              leftPanelSubtitle="Monitor global analytics, manage revenue streams, oversee core administrators, and steer the platform's vision."
                              leftPanelFeatures={[
                                        { icon: BarChart3, text: "Global Business Analytics" },
                                        { icon: Banknote, text: "Revenue & Fee Management" },
                                        { icon: ShieldCheck, text: "Super Admin Privileges" }
                              ]}
                    />
          );
}
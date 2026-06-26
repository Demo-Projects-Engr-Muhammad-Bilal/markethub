"use client"
import { AuthPage } from "@markethub/shared-ui";
import { ShieldAlert, Users, Settings } from "lucide-react";

export default function AdminLoginPage() {
          return (
                    <AuthPage
                              apiUrl={process.env.NEXT_PUBLIC_AUTH_SERVICE_URL!}
                              appName="MarketHub"
                              appRole="Admin"
                              logoSrc="/logos/logo-blue2.png"
                              hideSignUp={true} // 🟢 Important: No Sign Up for Admin
                              leftPanelTitle={<>Platform <br /> Command Center.</>}
                              leftPanelSubtitle="Oversee platform operations, verify new sellers, resolve disputes, and maintain a secure wholesale ecosystem."
                              leftPanelFeatures={[
                                        { icon: Users, text: "User & Vendor Verification" },
                                        { icon: ShieldAlert, text: "Dispute & Security Management" },
                                        { icon: Settings, text: "Platform Configurations" }
                              ]}
                    />
          );
}
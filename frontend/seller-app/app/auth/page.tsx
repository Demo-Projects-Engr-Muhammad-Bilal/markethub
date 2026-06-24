"use client"
import { AuthPage } from "@markethub/shared-ui";
import { Store, TrendingUp, Lock } from "lucide-react";

export default function SellerLoginPage() {
          return (
                    <AuthPage
                              apiUrl={process.env.NEXT_PUBLIC_AUTH_SERVICE_URL!}
                              appName="MarketHub"
                              appRole="Seller"
                              logoSrc="/logos/logo-green2.png"
                              leftPanelTitle={<>Scale Your <br /> B2B Empire.</>}
                              leftPanelSubtitle="Manage inventory, automate dropshipping workflows, and track your wholesale metrics from one unified seller hub."
                              leftPanelFeatures={[
                                        { icon: Store, text: "Verified Seller Network" },
                                        { icon: TrendingUp, text: "Real-time Sales Analytics" },
                                        { icon: Lock, text: "Secure Payouts & Transactions" }
                              ]}
                    />
          );
}
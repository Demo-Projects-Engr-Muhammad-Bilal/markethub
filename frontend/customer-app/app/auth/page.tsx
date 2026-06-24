"use client"

import { AuthPage } from "@markethub/shared-ui";
import { ShoppingCart, Tag, HeadphonesIcon } from "lucide-react";

export default function CustomerLoginPage() {
          return (
                    <AuthPage
                              // 🟢 Core API Configuration
                              apiUrl={process.env.NEXT_PUBLIC_AUTH_SERVICE_URL!}

                              // 🟢 Google OAuth Configuration (Only explicitly passed here)
                              googleClientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
                              googleRedirectUri={process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}

                              // 🟢 UI Branding
                              appName="MarketHub"
                              appRole="Customer"
                              logoSrc="/logos/logo-rose2.png"
                              leftPanelTitle={<>Wholesale Buying, <br /> Simplified.</>}
                              leftPanelSubtitle="Experience seamless bulk purchasing, automated price discounts, and AI-powered product search."
                              leftPanelFeatures={[
                                        { icon: Tag, text: "Automated Bulk Discounts" },
                                        { icon: ShoppingCart, text: "Streamlined Cart Process" },
                                        { icon: HeadphonesIcon, text: "AI Chatbot Support" }
                              ]}
                    />
          );
}
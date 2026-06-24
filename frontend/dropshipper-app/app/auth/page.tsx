"use client"
import { AuthPage } from "@markethub/shared-ui";
import { Box, Repeat, Truck } from "lucide-react";

export default function DropshipperLoginPage() {
          return (
                    <AuthPage
                              apiUrl={process.env.NEXT_PUBLIC_AUTH_SERVICE_URL!}
                              appName="MarketHub"
                              appRole="Dropshipper"
                              logoSrc="/logos/logo-orange2.png"
                              leftPanelTitle={<>Automate Your <br /> Retail Growth.</>}
                              leftPanelSubtitle="Sync high-converting products instantly, automate order fulfillment, and scale your storefront without holding any inventory."
                              leftPanelFeatures={[
                                        { icon: Box, text: "Zero Inventory Required" },
                                        { icon: Repeat, text: "Automated Order Syncing" },
                                        { icon: Truck, text: "Direct-to-Customer Fulfillment" }
                              ]}
                    />
          );
}
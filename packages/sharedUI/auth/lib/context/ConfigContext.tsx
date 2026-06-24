"use client";
import { createContext, useContext, ReactNode } from "react";

interface ConfigContextType {
          apiUrl: string;
          successRedirect: string;
          appRole: string; // 🟢 appRole yahan add kiya gaya hai
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({
          apiUrl,
          successRedirect,
          appRole, // 🟢 Prop receive kiya
          children
}: {
          apiUrl: string;
          successRedirect: string;
          appRole: string; // 🟢 Prop ki type define ki
          children: ReactNode
}) {
          return (
                    // 🟢 Provider ki value mein appRole pass kar diya
                    <ConfigContext.Provider value={{ apiUrl, successRedirect, appRole }}>
                              {children}
                    </ConfigContext.Provider>
          );
}

export function useConfig() {
          const context = useContext(ConfigContext);
          if (!context) {
                    throw new Error("useConfig must be used within a ConfigProvider");
          }
          return context;
}
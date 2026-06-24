import { LeftPanelProps } from "../../../lib/types/auth.types";
import Image from "next/image";

export function LeftPanel({
          appName,
          appRole,
          logoSrc, // 🟢 Destructure logoSrc
          leftPanelTitle,
          leftPanelSubtitle,
          leftPanelFeatures,
}: LeftPanelProps) {
          return (
                    <section className="relative hidden lg:flex flex-col justify-between p-12 bg-zinc-950 overflow-hidden h-full lg:col-span-5 border-r border-border/10">
                              <div className="absolute inset-0 z-0 bg-[radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>
                              <div className="absolute inset-0 opacity-20 pointer-events-none z-0">
                                        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/50 to-transparent blur-3xl"></div>
                                        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-primary/30 to-transparent blur-3xl"></div>
                              </div>

                              <div className="relative z-10 flex items-center gap-2">
                                        <div className="relative w-10 h-10">
                                                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">MH</div>
                                        </div>
                                        <h1 className="text-2xl font-semibold tracking-tight text-white flex items-start gap-1.5">
                                                  {appName}
                                                  <span className="text-primary text-sm font-medium px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                                                            {appRole}
                                                  </span>
                                        </h1>
                              </div>

                              <div className="relative z-10">
                                        <h2 className="text-5xl font-semibold text-white mb-6 leading-tight">
                                                  {typeof leftPanelTitle === 'string'
                                                            ? leftPanelTitle.split('.').map((line, i) => (
                                                                      <span key={i}>{line}{i === 0 && <br />}</span>
                                                            ))
                                                            : leftPanelTitle}
                                        </h2>
                                        <p className="text-lg text-zinc-400 max-w-md">{leftPanelSubtitle}</p>
                              </div>

                              <div className="relative z-10 flex gap-6 flex-wrap">
                                        {leftPanelFeatures.map((Feature, index) => (
                                                  <div key={index} className="flex items-center gap-2 text-zinc-400">
                                                            <Feature.icon className="w-5 h-5 text-primary" />
                                                            <span className="text-sm font-medium tracking-wide">{Feature.text}</span>
                                                  </div>
                                        ))}
                              </div>
                    </section>
          );
}
"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { 
  Sparkles, 
  Moon, 
  Sun, 
  Laptop,
  CheckCircle2, 
  Terminal, 
  Layers, 
  Lock, 
  Globe, 
  ArrowRight,
  Github
} from "lucide-react";

export default function HomePage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [lang, setLang] = React.useState<"ar" | "en">("ar");

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const t = {
    ar: {
      title: "قالب تأسيس المشاريع الممتاز V3",
      subtitle: "مرحبًا بك في بيئة التطوير الخاصة بك. تم إعداد هذا القالب بالكامل ليتوافق مع معايير SaaS Master Foundation v3.4.0.",
      tag: "جاهز للتطوير",
      theme: "المظهر",
      langToggle: "English",
      stackTitle: "المكونات النشطة",
      stackDesc: "التقنيات المدمجة والمهيأة مسبقًا في القالب:",
      features: [
        { title: "Next.js 15 (App Router)", desc: "هيكلية متطورة للمسارات، وتوافق تام مع التصدير الثابت وأداء LCP سريع." },
        { title: "Supabase Real-time Backend", desc: "قاعدة بيانات علاقية لحظية تدعم مصادقة المستخدمين وسياسات الـ RLS وحفظ الملفات." },
        { title: "Tailwind CSS v3", desc: "تصميم متجاوب بالكامل (Mobile-First) يعتمد على الخصائص المنطقية لتوافق RTL تلقائي." },
        { title: "إدارة المظهر والتدويل", desc: "دعم كامل للوضع الداكن/الفاتح عبر next-themes مع بنية مجهزة للترجمة ثنائية اللغة." }
      ],
      verifyTitle: "خطوات التحقق السريع",
      verifyStep1: "تأكد من نسخ .env.example إلى .env.local وملء القيم الخاصة بك.",
      verifyStep2: "قم بتهيئة قاعدة البيانات والمصادقة في لوحة تحكم Supabase وتأكيد مفاتيح الربط.",
      verifyStep3: "ابدأ كتابة منطق العمل والواجهات في مجلد src/features.",
      footer: "تم التأسيس بواسطة Antigravity AI لصالح shorbah/SaaS"
    },
    en: {
      title: "Premium Boilerplate V3",
      subtitle: "Welcome to your development environment. This boilerplate is fully set up in compliance with SaaS Master Foundation v3.4.0 rules.",
      tag: "Ready for Dev",
      theme: "Theme",
      langToggle: "العربية",
      stackTitle: "Active Stack",
      stackDesc: "Integrated technologies configured and ready to build upon:",
      features: [
        { title: "Next.js 15 (App Router)", desc: "Advanced routing structure, fully compatible with static exports and fast LCP performance." },
        { title: "Supabase Real-time Backend", desc: "Real-time relational database with built-in Auth, Storage, and RLS security." },
        { title: "Tailwind CSS v3", desc: "Mobile-first responsive styling utilizing logical properties for seamless RTL support." },
        { title: "Themes & i18n", desc: "Complete light/dark mode support with next-themes and layout scaffolded for translation." }
      ],
      verifyTitle: "Quick Verification Steps",
      verifyStep1: "Make sure to copy .env.example to .env.local and fill in your keys.",
      verifyStep2: "Configure your Database and Auth in Supabase Dashboard and verify your keys.",
      verifyStep3: "Start building your pages and logic inside src/features directory.",
      footer: "Created by Antigravity AI for shorbah/SaaS"
    }
  };

  const currentT = t[lang];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between overflow-x-hidden bg-background text-foreground transition-colors duration-300">
      
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-500/10 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
            Shorbah SaaS
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-accent text-sm transition-all"
            aria-label="Toggle Language"
          >
            <Globe className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{currentT.langToggle}</span>
          </button>

          {/* Theme Toggle */}
          {mounted && (
            <div className="flex items-center gap-1 p-1 rounded-xl bg-card border border-border">
              <button
                onClick={() => setTheme("light")}
                className={`p-2 rounded-lg transition-all ${theme === "light" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:bg-accent"}`}
                title="Light Mode"
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`p-2 rounded-lg transition-all ${theme === "dark" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:bg-accent"}`}
                title="Dark Mode"
              >
                <Moon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTheme("system")}
                className={`p-2 rounded-lg transition-all ${theme === "system" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:bg-accent"}`}
                title="System Mode"
              >
                <Laptop className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Hero Content */}
      <main className="w-full max-w-7xl mx-auto px-6 py-12 flex-1 flex flex-col justify-center items-center gap-12 z-10">
        
        {/* Hero section text */}
        <div className="text-center max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            {currentT.tag}
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            {lang === "ar" ? (
              <>
                قالب <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">تأسيس المشاريع</span> الممتاز V3
              </>
            ) : (
              <>
                Premium <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">Boilerplate</span> V3
              </>
            )}
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {currentT.subtitle}
          </p>
        </div>

        {/* Stack Grid */}
        <div className="w-full max-w-5xl space-y-6">
          <div className="flex flex-col items-center md:items-start space-y-2">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Layers className="w-6 h-6 text-primary" />
              {currentT.stackTitle}
            </h2>
            <p className="text-muted-foreground text-sm">{currentT.stackDesc}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentT.features.map((feature, i) => (
              <div 
                key={i} 
                className="group relative p-6 rounded-2xl border border-border bg-card/60 backdrop-blur hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Steps */}
        <div className="w-full max-w-5xl p-8 rounded-3xl border border-border bg-gradient-to-b from-card/30 to-card/70 backdrop-blur space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Terminal className="w-6 h-6 text-primary" />
            {currentT.verifyTitle}
          </h2>

          <div className="space-y-4">
            {[currentT.verifyStep1, currentT.verifyStep2, currentT.verifyStep3].map((step, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                  {idx + 1}
                </div>
                <p className="text-muted-foreground text-sm md:text-base pt-0.5">{step}</p>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-8 border-t border-border/40 text-center z-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-muted-foreground text-sm">
          {currentT.footer}
        </p>

        <div className="flex items-center gap-4 text-muted-foreground text-sm">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground flex items-center gap-1.5 transition-colors"
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
        </div>
      </footer>

    </div>
  );
}

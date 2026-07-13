import logo from "../assets/logo.png";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthModal } from "@/components/AuthModal";
import { Contact } from "@/components/Shared";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { openAuthModal } from "@/lib/auth-modal";
import globeImg from "@/assets/globe.png";
import phoneImg from "@/assets/phone.png";
import {
  ArrowRight,
  ShieldCheck,
  Activity,
  Users,
  Globe2,
  Brain,
  AlertTriangle,
  Target,
  PieChart,
  LineChart,
  Coins,
  TrendingUp,
  BarChart3,
  BookOpen,
  Sparkles,
  FileText,
  Infinity as InfinityIcon,
  Check,
  Menu,
  X,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Futuria Network — Intelligence Financière Crypto par IA" },
      {
        name: "description",
        content:
          "Institutional-grade crypto investment intelligence. AI-driven market insights, strategic portfolios, and long-term wealth creation.",
      },
      { property: "og:title", content: "Futuria Network — une Crypto plus Intelligente et l'Investissement" },
      {
        property: "og:description",
        content: "AI-driven crypto wealth intelligence for modern investors.",
      },
    ],
  }),
  component: Index,
});

function Logo() {
  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <a href="#" onClick={scrollToTop} className="flex items-center">
      <img src={logo} alt="Futuria Network" className="h-9 w-auto" />
    </a>
  );
}

function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "h2" | "p" | "li";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const Comp = Tag as unknown as "div";
  return (
    <Comp
      ref={ref as never}
      className={`${visible ? "reveal-in" : "reveal"} ${className}`}
      style={{ animationDelay: visible ? `${delay}ms` : undefined }}
    >
      {children}
    </Comp>
  );
}

function Nav() {
  const links = [
    { label: "Comment ça marche", href: "#strategies" },
    { label: "Fonctionnalités", href: "#insights" },
    { label: "Application", href: "#portfolio" },
    { label: "Contact", href: "#contact" },
  ];
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      {/* ── Floating header ── */}
      <div className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 pointer-events-none">
        <header
          className={`pointer-events-auto w-full max-w-5xl rounded-2xl border transition-all duration-500 ${
            scrolled
              ? "border-white/10 bg-[rgba(10,10,10,0.75)] shadow-[0_8px_32px_-8px_rgba(0,0,0,0.7)] backdrop-blur-2xl"
              : "border-white/[0.08] bg-[rgba(10,10,10,0.45)] backdrop-blur-xl"
          }`}
        >
          <div className="flex h-14 items-center justify-between px-5">
            {/* Logo */}
            <Logo />

            {/* Centre nav */}
            <nav className="hidden items-center md:flex" aria-label="Main navigation">
              {links.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="group relative px-4 py-2 text-[14px] font-medium text-white/55 transition-colors duration-200 hover:text-white"
                >
                  {label}
                  <span className="absolute inset-x-4 bottom-1 h-px scale-x-0 rounded-full bg-[oklch(0.7_0.16_160)] transition-transform duration-300 group-hover:scale-x-100" />
                </a>
              ))}
            </nav>

            {/* Right actions */}
            <div className="hidden items-center gap-2 md:flex">
              <button
                onClick={() => openAuthModal("login")}
                className="px-4 py-2 text-[14px] font-medium text-white/55 transition-colors hover:text-white"
              >
                Se connecter
              </button>
              <button
                onClick={() => openAuthModal("signup")}
                className="btn-emerald inline-flex items-center gap-1.5 rounded-xl px-5 py-2 text-[14px] font-semibold text-black transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_0_20px_oklch(0.6_0.18_160_/_0.4)]"
              >
                Commencer
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2 text-white transition hover:bg-white/10 md:hidden"
              onClick={() => setMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </header>
      </div>

      {/* ── Mobile menu ── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed inset-0 z-[100] flex flex-col transition-all duration-300 ${
          menuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-background/95 backdrop-blur-2xl" onClick={() => setMenuOpen(false)} />

        <div className="relative flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
            <Logo />
            <button
              aria-label="Close menu"
              className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2 text-white transition hover:bg-white/10"
              onClick={() => setMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex flex-1 flex-col justify-center px-8">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); setMenuOpen(false); }}
              className="flex items-center justify-between border-b border-white/[0.05] py-5 text-[22px] font-medium tracking-tight text-foreground/50 transition-colors hover:text-white"
            >
              Accueil <ArrowRight className="h-5 w-5 opacity-30" />
            </a>
            {links.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between border-b border-white/[0.05] py-5 text-[22px] font-medium tracking-tight text-foreground/50 transition-colors hover:text-white"
              >
                {label} <ArrowRight className="h-5 w-5 opacity-30" />
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-3 border-t border-white/[0.06] px-8 py-8">
            <button
              onClick={() => { openAuthModal("signup"); setMenuOpen(false); }}
              className="btn-emerald flex w-full items-center justify-center gap-2 rounded-xl py-4 text-[16px] font-semibold text-black"
            >
              Commencer <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => { openAuthModal("login"); setMenuOpen(false); }}
              className="flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 py-4 text-[16px] font-medium text-foreground/70 transition hover:bg-white/10 hover:text-white"
            >
              Se connecter
            </button>
          </div>
        </div>
      </div>
    </>
  );
}


function AnimatedNumber({ value, suffix = "", prefix = "", decimals = 0 }: { value: number; suffix?: string; prefix?: string; decimals?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        const duration = 1500;
        const startTime = performance.now();
        const step = (now: number) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const easeOut = 1 - Math.pow(1 - progress, 4);
          setCount(easeOut * value);
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        obs.disconnect();
      }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);

  return <span ref={ref}>{prefix}{(count).toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>;
}

function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      {/* Glow */}
      <div className="pointer-events-none absolute left-1/2 top-[20%] h-[700px] w-[700px] -translate-x-1/2 glow-emerald" />
      <div className="pointer-events-none absolute left-[10%] top-[60%] h-[400px] w-[400px] glow-emerald opacity-60" />
      <div className="pointer-events-none absolute right-[5%] top-[30%] h-[300px] w-[300px] glow-emerald opacity-40" />

      {/* Vertical lines */}
      <div className="pointer-events-none absolute inset-0 mx-auto max-w-7xl">
        <div className="absolute left-6 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/[0.06] to-transparent" />
        <div className="absolute right-6 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/[0.06] to-transparent" />
        <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/[0.04] to-transparent" />
      </div>

      <Nav />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 pt-28 md:pt-36 text-center">
        <Reveal delay={100} className="flex flex-col items-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[12px] font-medium text-foreground/80 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.7_0.16_160)] shadow-[0_0_8px_oklch(0.7_0.16_160)]" />
          Intelligence Financière Crypto par IA
        </div>

        <h1 className="max-w-4xl text-balance text-[40px] md:text-[64px] lg:text-[80px] font-normal leading-[1.02] tracking-tight">
          Votre Portail vers{" "}
          <span className="bg-gradient-to-br from-[oklch(0.85_0.12_160)] to-[oklch(0.55_0.14_165)] bg-clip-text text-transparent">
            une Crypto plus Intelligente
          </span>{" "}
          et l'Investissement
        </h1>

        <p className="mt-8 max-w-2xl text-balance text-[17px] font-normal leading-relaxed text-foreground/60">
          Accédez à une veille de marché par l'IA, des analyses stratégiques de portefeuille et des opportunités d'investissement crypto de niveau institutionnel conçues pour la création de richesse à long terme.
        </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button onClick={() => openAuthModal("signup")}
              className="btn-emerald inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-medium transition hover:opacity-95 hover:scale-105 hover:shadow-[0_0_20px_rgba(20,184,166,0.4)] transition-all duration-300"
            >
              Commencer à investir
              <ArrowRight className="h-4 w-4" />
            </button>
          <a href="#strategies"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-7 py-3.5 text-[15px] font-medium backdrop-blur transition hover:bg-white/10"
          >
            Explorer les opportunités
          </a>
        </div>
        </Reveal>

        <Reveal delay={300}><div className="relative mt-16 w-full">
          <img
            src={globeImg}
            alt="Global crypto network"
            width={1536}
            height={1024}
            className="animate-float mx-auto w-[120%] max-w-none -translate-y-8 select-none object-contain opacity-90 md:w-full"
          />
        </div></Reveal>
      </div>

      {/* Curved transition */}
      <div className="absolute -bottom-px left-0 right-0 z-20">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block h-[80px] w-full md:h-[120px]">
          <path
            d="M0,120 C320,20 720,0 1440,80 L1440,120 L0,120 Z"
            fill="oklch(0.97 0.003 100)"
          />
        </svg>
      </div>
    </section>
  );
}

function Trust() {
  return (
    <section className="relative bg-[oklch(0.97_0.003_100)] px-6 py-20 md:py-32 text-[oklch(0.1_0_0)]">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <span className="rounded-full border border-black/10 bg-white px-4 py-1.5 text-[12px] font-medium">
            Pourquoi Futuria Network
          </span>
          <h2 className="mx-auto mt-6 max-w-3xl text-[36px] md:text-[44px] lg:text-[56px] font-normal leading-[1.05] tracking-tight">
            Conçu pour les investisseurs modernes.
            <br />
            <span className="text-black/40">Mondialement reconnu.</span>
          </h2>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          <Reveal delay={100}>
          <div className="group rounded-[32px] border border-black/5 bg-white p-8 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] hover:border-black/10">
            <ShieldCheck className="h-7 w-7 text-[oklch(0.5_0.13_165)] transition-transform duration-300 group-hover:scale-110" />
            <h3 className="mt-8 text-[22px] font-normal tracking-tight">
              Sécurité institutionnelle
            </h3>
            <p className="mt-3 text-[15px] font-normal leading-relaxed text-black/55">
              Une protection des actifs de niveau militaire et des protocoles de gestion des risques avancés protègent chaque position.
            </p>
          </div>
          </Reveal>
          <Reveal delay={200}>
          <div className="group rounded-[32px] border border-black/5 bg-white p-8 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] hover:border-black/10">
            <Activity className="h-7 w-7 text-[oklch(0.5_0.13_165)] transition-transform duration-300 group-hover:scale-110" />
            <h3 className="mt-8 text-[22px] font-normal tracking-tight">
              Veille de marché 24/7
            </h3>
            <p className="mt-3 text-[15px] font-normal leading-relaxed text-black/55">
              Surveillance continue des opportunités du marché crypto avec des signaux en temps réel de notre bureau de recherche.
            </p>
          </div>
          </Reveal>
          <Reveal delay={300}>
          <div className="group relative overflow-hidden rounded-[32px] bg-[oklch(0.1_0.005_160)] p-8 text-foreground transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_-15px_oklch(0.55_0.18_160_/_0.3)]">
            <div className="absolute -right-10 -top-10 h-40 w-40 glow-emerald opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
            <Users className="h-7 w-7 text-emerald transition-transform duration-300 group-hover:scale-110" />
            <div className="mt-8 text-[56px] font-medium tracking-tight leading-none">
              <AnimatedNumber value={10000} /><span className="text-emerald">+</span>
            </div>
            <p className="mt-3 text-[15px] font-normal text-white/55">
              Investisseurs actifs dans le monde entier faisant confiance à Futuria Network pour leur stratégie crypto.
            </p>
          </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function BentoCard({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal delay={Math.random() * 200} className={`group relative overflow-hidden rounded-[28px] p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.25)] ${className}`}>
      {children}
    </Reveal>
  );
}

function Bento() {
  return (
    <section className="bg-[#f2f4f7] px-6 pb-20 md:pb-32 text-[oklch(0.1_0_0)]">
      <div className="mx-auto max-w-6xl">
        <Reveal><div className="mb-12 flex items-end justify-between">
          <h2 className="max-w-2xl text-[32px] md:text-[44px] lg:text-[52px] font-normal leading-[1.05] tracking-tight">
            Une couche d'intelligence pour chaque partie de votre portefeuille.
          </h2>
          <a href="#insights" className="hidden text-[14px] font-medium text-black/60 hover:text-black md:inline">
            Voir toutes les fonctionnalités →
          </a>
        </div></Reveal>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-6">
          {/* Global Market Access — large dark */}
          <BentoCard className="bg-[oklch(0.09_0.005_160)] text-foreground md:col-span-3 md:row-span-2">
            <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
            <div className="absolute -right-20 -top-20 h-80 w-80 glow-emerald opacity-80" />
            <div className="relative">
              <Globe2 className="h-6 w-6 text-emerald" />
              <h3 className="mt-32 text-[28px] font-normal tracking-tight">
                Global Market Access
              </h3>
              <p className="mt-3 max-w-md text-[15px] font-normal text-white/55">
                Accédez à plus de 80 marchés crypto mondiaux via un portail institutionnel unique avec un routage de liquidité profond.
              </p>
            </div>
          </BentoCard>

          {/* AI Portfolio Insights */}
          <BentoCard className="bg-white md:col-span-3">
            <Brain className="h-6 w-6 text-[oklch(0.5_0.13_165)]" />
            <h3 className="mt-6 text-[22px] font-normal tracking-tight">
              AI Portfolio Insights
            </h3>
            <p className="mt-2 text-[14px] font-normal text-black/55">
              Signaux générés par l'IA à partir de données macro et on-chain.
            </p>
            <div className="mt-6 flex h-20 items-end gap-1.5">
              {[40, 60, 35, 75, 50, 90, 65, 80, 55, 95, 70, 85].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-gradient-to-t from-[oklch(0.5_0.13_165)] to-[oklch(0.7_0.16_160)] opacity-80 animate-volume-bar"
                  style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </BentoCard>

          {/* Risk Management */}
          <BentoCard className="bg-white md:col-span-2">
            <AlertTriangle className="h-6 w-6 text-[oklch(0.5_0.13_165)]" />
            <h3 className="mt-6 text-[18px] font-normal tracking-tight">
              Risk Management
            </h3>
            <p className="mt-2 text-[14px] font-normal text-black/55">
              Contrôles d'exposition en temps réel.
            </p>
          </BentoCard>

          {/* Investment Strategies */}
          <BentoCard className="bg-gradient-to-br from-[oklch(0.5_0.13_165)] to-[oklch(0.35_0.1_165)] text-white md:col-span-2">
            <Target className="h-6 w-6" />
            <h3 className="mt-6 text-[18px] font-normal tracking-tight">
              Investment Strategies
            </h3>
            <p className="mt-2 text-[14px] font-normal text-white/70">
              Sélectionnées par des quants et des analystes macro.
            </p>
          </BentoCard>

          {/* Asset Allocation */}
          <BentoCard className="bg-white md:col-span-2">
            <PieChart className="h-6 w-6 text-[oklch(0.5_0.13_165)]" />
            <h3 className="mt-6 text-[18px] font-normal tracking-tight">
              Asset Allocation
            </h3>
            <p className="mt-2 text-[14px] font-normal text-black/55">
              Équilibrée pour un rendement ajusté au risque.
            </p>
          </BentoCard>

          {/* Market Analytics — dark wide */}
          <BentoCard className="bg-[oklch(0.09_0.005_160)] text-foreground md:col-span-4">
            <div className="flex items-start justify-between">
              <div>
                <LineChart className="h-6 w-6 text-emerald" />
                <h3 className="mt-6 text-[22px] font-normal tracking-tight">
                  Market Analytics
                </h3>
                <p className="mt-2 text-[14px] font-normal text-white/55">
                  Performances en direct et analyses on-chain approfondies dans un seul cockpit.
                </p>
              </div>
              <svg viewBox="0 0 200 80" className="h-20 w-48 opacity-90">
                <path
                  d="M0,60 Q40,55 60,40 T120,30 T200,10"
                  fill="none"
                  stroke="oklch(0.7 0.16 160)"
                  strokeWidth="2"
                  className="animate-draw-line"
                />
                <path
                  d="M0,60 Q40,55 60,40 T120,30 T200,10 L200,80 L0,80 Z"
                  fill="oklch(0.55 0.18 160 / 0.15)"
                  className="animate-pulse-glow"
                />
              </svg>
            </div>
          </BentoCard>

          {/* Crypto Opportunities */}
          <BentoCard className="bg-white md:col-span-2 relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-emerald/15 blur-[40px] animate-pulse-glow" style={{ animationDuration: '4s' }} />
            <Coins className="h-6 w-6 text-[oklch(0.5_0.13_165)] relative z-10" />
            <h3 className="mt-6 text-[18px] font-normal tracking-tight relative z-10">
              Crypto Opportunities
            </h3>
            <p className="mt-2 text-[14px] font-normal text-black/55 relative z-10">
              Accès anticipé à des opportunités validées.
            </p>
          </BentoCard>

          {/* Performance Tracking */}
          <BentoCard className="bg-white md:col-span-6">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <TrendingUp className="h-6 w-6 text-[oklch(0.5_0.13_165)]" />
                <h3 className="mt-6 text-[22px] font-normal tracking-tight">
                  Performance Tracking
                </h3>
                <p className="mt-2 max-w-md text-[14px] font-normal text-black/55">
                  Rapports transparents et prêts pour l'audit sur chaque portefeuille, stratégie et horizon temporel.
                </p>
              </div>
              <div className="flex gap-8">
                {[
                  { label: "Rendement Annuel", value: "+34.2%" },
                  { label: "Ratio de Sharpe", value: "2.14" },
                  { label: "Perte Max", value: "−6.8%" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-[14px] text-black/50">{s.label}</div>
                    <div className="mt-1 text-[28px] font-medium tracking-tight text-[oklch(0.45_0.13_165)]">
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </BentoCard>
        </div>
      </div>
    </section>
  );
}


function Process() {
  const steps = [
    {
      title: "Découverte",
      desc: "Définissez vos objectifs, votre tolérance au risque et votre horizon avec un stratège Futuria Network.",
    },
    {
      title: "Construction",
      desc: "Nos moteurs d'IA construisent un portefeuille crypto multi-actifs sur mesure, soutenu par nos analystes.",
    },
    {
      title: "Surveillance",
      desc: "Surveillance on-chain continue, contrôles des risques 24/7 et rééquilibrage adaptatif.",
    },
    {
      title: "Croissance",
      desc: "Des rapports transparents et une exécution disciplinée font croître votre patrimoine au fil des cycles.",
    },
  ];

  return (
    <section id="strategies" className="relative bg-background px-6 py-20 md:py-32 text-foreground">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="mb-24 flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <span className="text-[12px] font-medium uppercase tracking-widest text-emerald">
                Methodology
              </span>
              <h2 className="mt-4 text-[36px] md:text-[44px] lg:text-[56px] font-normal leading-[1.05] tracking-tight">
                Un chemin discipliné vers la <br className="hidden md:block" />
                <span className="font-medium">richesse à long terme.</span>
              </h2>
            </div>
            <p className="max-w-md text-[16px] font-normal leading-relaxed text-foreground/50 md:pb-2">
              Quatre étapes délibérées qui transforment la complexité du marché en une stratégie claire de croissance.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 80}>
                <div className="group relative h-full overflow-hidden rounded-2xl p-px transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: "linear-gradient(135deg, oklch(0.35 0.03 165), oklch(0.22 0.02 165) 60%, oklch(0.28 0.025 165))"
                  }}
                >
                  {/* Inner card surface */}
                  <div className="relative h-full rounded-[15px] bg-[oklch(0.18_0.01_220)] p-7">
                    {/* Emerald corner glow */}
                    <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[oklch(0.6_0.18_160)] opacity-0 blur-[40px] transition-opacity duration-500 group-hover:opacity-20" />

                    {/* Step number badge */}
                    <div className="mb-6 inline-flex items-center justify-center rounded-xl border border-[oklch(0.55_0.13_165_/_0.35)] bg-[oklch(0.55_0.13_165_/_0.15)] px-3 py-1.5">
                      <span className="text-[11px] font-semibold tracking-widest text-[oklch(0.75_0.16_160)]">
                        0{i + 1}
                      </span>
                    </div>

                    {/* Thin emerald top line */}
                    <div className="absolute left-7 top-0 h-px w-12 bg-gradient-to-r from-[oklch(0.7_0.16_160)] to-transparent opacity-60" />

                    <h3 className="text-[19px] font-semibold tracking-tight text-white">
                      {s.title}
                    </h3>
                    <p className="mt-3 text-[14px] leading-relaxed text-white/50">
                      {s.desc}
                    </p>

                    {/* Bottom connector arrow — hidden on last */}
                    {i < steps.length - 1 && (
                      <ArrowRight className="absolute -right-3 top-1/2 hidden -translate-y-1/2 h-4 w-4 text-[oklch(0.55_0.13_165)] md:block" />
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function AppShowcase() {
  return (
    <section id="portfolio" className="relative bg-[oklch(0.97_0.003_100)] px-6 py-20 md:py-32 text-[oklch(0.1_0_0)]">
      <div className="mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-2">
        <div>
          <Reveal>
            <span className="rounded-full border border-black/10 bg-white px-4 py-1.5 text-[12px] font-medium">
              Application Mobile
            </span>
            <h2 className="mt-6 text-[36px] md:text-[44px] lg:text-[52px] font-normal leading-[1.05] tracking-tight">
              Investissez plus intelligemment avec{" "}
              <span className="text-[oklch(0.45_0.13_165)]">l'IA</span> Insights
            </h2>
            <p className="mt-6 max-w-md text-[16px] font-normal text-black/55">
              Emportez l'intelligence institutionnelle dans votre poche. Suivez chaque position, rééquilibrez en un clic et réagissez aux alertes en direct.
            </p>
          </Reveal>

          <div className="mt-10 space-y-5">
            {[
              { icon: PieChart, t: "Aperçu du tableau de bord", d: "Allocation en direct, P&L et exposition." },
              { icon: LineChart, t: "Suivi des performances", d: "Comparaison avec le BTC et les indices macro." },
              { icon: Sparkles, t: "Alertes de marché", d: "Déclencheurs personnalisés par signaux IA." },
              { icon: Brain, t: "Recommandations de stratégie", d: "Personnalisées selon votre profil de risque." },
            ].map(({ icon: Icon, t, d }, index) => (
              <Reveal key={t} delay={150 + index * 100}>
                <div className="group flex gap-4 rounded-2xl p-3 -mx-3 transition-all duration-300 hover:bg-black/[0.03]">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[oklch(0.5_0.13_165)]/10 text-[oklch(0.45_0.13_165)] transition-all duration-300 group-hover:bg-[oklch(0.5_0.13_165)]/20 group-hover:scale-110">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[15px] font-medium">{t}</div>
                    <div className="mt-0.5 text-[14px] font-normal text-black/55">{d}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={300} className="relative">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 glow-emerald opacity-60" />
          <img
            src={phoneImg}
            alt="Futuria Network mobile app"
            width={1024}
            height={1280}
            loading="lazy"
            className="relative mx-auto w-full max-w-md select-none object-contain"
          />
        </Reveal>
      </div>
    </section>
  );
}

function WhyChoose() {
  const items = [
    {
      icon: BarChart3,
      title: "Analyse Avancée",
      desc: "Modèles multi-facteurs fondés sur des décennies de recherche.",
      accent: "oklch(0.6_0.18_160)",
    },
    {
      icon: BookOpen,
      title: "Recherche Institutionnelle",
      desc: "Notes quotidiennes de nos analystes macro et on-chain.",
      accent: "oklch(0.65_0.15_200)",
    },
    {
      icon: Globe2,
      title: "Opportunités Mondiales",
      desc: "Accès multiplateforme de Singapour à New York.",
      accent: "oklch(0.6_0.18_160)",
    },
    {
      icon: Brain,
      title: "Intelligence Artificielle",
      desc: "Modèles adaptatifs qui apprennent de chaque régime de marché.",
      accent: "oklch(0.65_0.15_200)",
    },
    {
      icon: FileText,
      title: "Rapports Transparents",
      desc: "Relevés de qualité audit avec attribution complète des performances.",
      accent: "oklch(0.6_0.18_160)",
    },
    {
      icon: InfinityIcon,
      title: "Objectif de Richesse à Long Terme",
      desc: "Stratégies conçues pour le prochain cycle, pas le prochain trade.",
      accent: "oklch(0.65_0.15_200)",
    },
  ];

  return (
    <section id="insights" className="bg-[oklch(0.13_0.008_220)] px-6 py-20 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[12px] font-medium text-foreground/80">
            Why Choose Us
          </span>
          <h2 className="mx-auto mt-6 max-w-3xl text-[36px] md:text-[44px] lg:text-[56px] font-normal leading-[1.05] tracking-tight">
            L'avantage institutionnel,
            <br />
            <span className="text-foreground/40">rendu personnel.</span>
          </h2>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {items.map(({ icon: Icon, title, desc, accent }, index) => (
            <Reveal key={title} as="div" delay={index * 80}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.14] bg-gradient-to-b from-[oklch(0.24_0.015_220)] to-[oklch(0.20_0.01_220)] p-px shadow-[0_4px_24px_-4px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.22] hover:shadow-[0_16px_40px_-8px_rgba(0,0,0,0.4)]">
                {/* Inner surface */}
                <div className="relative h-full rounded-[15px] bg-[oklch(0.22_0.012_220)] p-7">

                  {/* Radial glow behind icon */}
                  <div
                    className="pointer-events-none absolute -left-4 -top-4 h-28 w-28 rounded-full opacity-0 blur-[32px] transition-opacity duration-500 group-hover:opacity-30"
                    style={{ background: accent }}
                  />

                  {/* Top accent line */}
                  <div
                    className="absolute inset-x-0 top-0 h-px rounded-t-[15px] opacity-50"
                    style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
                  />

                  {/* Icon container */}
                  <div
                    className="relative mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl border transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_4px_20px_-4px_oklch(0.55_0.13_165_/_0.5)]"
                    style={{
                      background: `linear-gradient(135deg, oklch(0.55_0.13_165_/_0.18), oklch(0.55_0.13_165_/_0.06))`,
                      borderColor: `oklch(0.55_0.13_165_/_0.25)`,
                      boxShadow: `0 4px 16px -4px oklch(0.55_0.13_165_/_0.3)`,
                    }}
                  >
                    <Icon className="h-5 w-5 text-[oklch(0.75_0.16_160)]" />
                  </div>

                  <h3 className="text-[17px] font-semibold tracking-tight text-white">
                    {title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-white/65">
                    {desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const navLinks = [
    { label: "Comment ça marche", href: "#strategies" },
    { label: "Fonctionnalités", href: "#insights" },
    { label: "Application", href: "#portfolio" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <footer className="relative overflow-hidden bg-background border-t border-white/[0.05] px-6 pb-10 pt-16">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-[oklch(0.55_0.13_165)] opacity-[0.04] blur-[80px]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-center md:justify-between">
          <img src={logo} alt="Futuria Network" className="h-9 w-auto opacity-80" />

          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            {navLinks.map(({ label, href }) => (
              <a key={label} href={href} className="text-[14px] text-foreground/50 transition-colors hover:text-foreground/90">
                {label}
              </a>
            ))}
          </nav>

          <div className="flex gap-5">
            {["Confidentialité", "Conditions", "Divulgations"].map((l) => (
              <a key={l} href="#" className="text-[12px] text-foreground/35 transition-colors hover:text-foreground/60">
                {l}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 border-t border-white/[0.05] pt-6 text-center text-[12px] text-foreground/30">
          © {new Date().getFullYear()} Futuria Network. Tous droits réservés. &nbsp;·&nbsp; Les performances passées ne préjugent pas des résultats futurs.
        </div>
      </div>
    </footer>
  );
}

function CTA() {
  return (
    <section className="relative overflow-hidden bg-[oklch(0.97_0.003_100)] px-6 py-32">
      <Reveal>
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[oklch(0.13_0.02_165)] via-[oklch(0.1_0.01_165)] to-[oklch(0.08_0.005_160)] p-12 text-center md:p-20">
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "18px 18px",
            }}
          />
          <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 glow-emerald" />
          <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 glow-emerald opacity-70" />

          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[12px] font-medium text-foreground/80 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-emerald" />
              Intégration limitée — T2 2026
            </span>
            <h2 className="mx-auto mt-6 max-w-3xl text-[44px] font-normal leading-[1.05] tracking-tight md:text-[60px]">
              Commencez à construire votre{" "}
              <span className="bg-gradient-to-br from-[oklch(0.85_0.12_160)] to-[oklch(0.5_0.13_165)] bg-clip-text text-transparent">
                stratégie de richesse crypto
              </span>{" "}
              today.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-[16px] font-normal text-foreground/55">
              Rejoignez plus de 10 000 investisseurs qui utilisent Futuria Network pour naviguer dans la prochaine ère des actifs numériques avec clarté.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => openAuthModal("signup")}
                className="btn-emerald inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-medium hover:scale-105 hover:shadow-[0_0_20px_rgba(20,184,166,0.4)] transition-all duration-300"
              >
                Ouvrir un compte
                <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-[15px] font-medium backdrop-blur transition hover:bg-white/10"
              >
                Parler à un conseiller
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Index() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  useEffect(() => {
    const handler = (e: any) => { setAuthMode(e.detail); setAuthModalOpen(true); };
    window.addEventListener("openAuthModal", handler);
    return () => window.removeEventListener("openAuthModal", handler);
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} initialMode={authMode as "login"|"signup"} />
      <Hero />
      <Trust />
      <Bento />
      <Process />
      <AppShowcase />
      <WhyChoose />
      <CTA />
      <Contact />
      <Footer />
    </main>
  );
}

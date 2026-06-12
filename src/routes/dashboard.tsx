import logo from "../assets/logo.png";
import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, TrendingUp, Activity, PieChart, Globe, LineChart, Cpu, ArrowRight, Bot, Zap, Play, Pause, ArrowUpRight, ArrowDownRight, Brain, Sparkles, Repeat } from "lucide-react";
import { Reveal, Contact, Footer } from "../components/Shared";
import { useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardShowcase,
});

function DashboardLogo() {
  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <a href="#" onClick={scrollToTop} className="flex items-center cursor-pointer">
      <img src={logo} alt="Futuria Network" className="h-9 w-auto" />
    </a>
  );
}

function LoggedInNav() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 pointer-events-none">
      <header
        className={`pointer-events-auto w-full max-w-5xl rounded-2xl border transition-all duration-500 ${
          scrolled
            ? "border-white/10 bg-[rgba(10,10,10,0.75)] shadow-[0_8px_32px_-8px_rgba(0,0,0,0.7)] backdrop-blur-2xl"
            : "border-white/[0.08] bg-[rgba(10,10,10,0.45)] backdrop-blur-xl"
        }`}
      >
        <div className="flex h-14 items-center justify-between px-5">
          <DashboardLogo />
          <button
            onClick={() => navigate({ to: "/" })}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2 text-[14px] font-medium text-white backdrop-blur transition hover:bg-white/10"
          >
            Se déconnecter
          </button>
        </div>
      </header>
    </div>
  );
}

function CandlestickAnimation() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[32px] pointer-events-none opacity-[0.15]">
      <div className="flex items-end justify-between h-full w-full px-4 pb-4">
        {[...Array(14)].map((_, i) => {
          const isUp = i % 2 === 0 || i % 5 === 0;
          const height = 30 + ((i * 13) % 40);
          return (
            <div key={i} className="relative flex flex-col items-center justify-end w-4 h-full">
              <div 
                className={`absolute w-[2px] ${isUp ? 'bg-emerald-500/50' : 'bg-red-500/50'} animate-candle`} 
                style={{ height: '70%', animationDelay: `${i * 0.2}s` }} 
              />
              <div 
                className={`relative w-full rounded-sm ${isUp ? 'bg-emerald-500' : 'bg-red-500'} animate-candle`} 
                style={{ height: `${height}%`, animationDelay: `${i * 0.15}s` }} 
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TradingBotDemo() {
  const [isActive, setIsActive] = useState(true);
  
  const [candles, setCandles] = useState(() => {
    let prevClose = 64000;
    return Array.from({ length: 50 }, (_, i) => {
      const open = prevClose;
      const close = open + (Math.random() - 0.5) * 400;
      const high = Math.max(open, close) + Math.random() * 200;
      const low = Math.min(open, close) - Math.random() * 200;
      prevClose = close;
      return { open, high, low, close };
    });
  });

  const [currentPrice, setCurrentPrice] = useState(candles[candles.length - 1].close);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setCandles(prev => {
        const newCandles = [...prev.slice(1)];
        const last = newCandles[newCandles.length - 1];
        const open = last.close;
        const close = open + (Math.random() - 0.5) * 400;
        const high = Math.max(open, close) + Math.random() * 200;
        const low = Math.min(open, close) - Math.random() * 200;
        const newCandle = { open, high, low, close };
        newCandles.push(newCandle);
        setCurrentPrice(close);
        return newCandles;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [isActive]);

  const minPrice = Math.min(...candles.map(c => c.low));
  const maxPrice = Math.max(...candles.map(c => c.high));
  const priceRange = maxPrice - minPrice || 1;

  const getY = (price: number) => {
    return 100 - ((price - minPrice) / priceRange) * 100;
  };

  return (
    <section className="relative py-32 bg-white text-black overflow-hidden rounded-[40px] md:rounded-[80px] mx-2 mb-2 shadow-[0_0_40px_rgba(0,0,0,0.05)]">
      <div className="absolute inset-0 bg-black/[0.02]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-tr from-emerald-100 to-blue-50 rounded-full blur-[100px] opacity-70 pointer-events-none" />
      
      <div className="mx-auto max-w-6xl px-6 relative z-10">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
             <span className="inline-flex items-center gap-2 rounded-full bg-black/5 px-4 py-1.5 text-[12px] font-medium uppercase tracking-wider text-black">
              Interface de Trading Pro
            </span>
            <h2 className="mt-6 text-[40px] font-normal leading-[1.1] tracking-tight">
              Analyse en <span className="text-emerald-600">Temps Réel</span>
            </h2>
            <p className="mt-4 text-[16px] text-black/60">
              Des graphiques professionnels et une exécution ultra-rapide pour des décisions éclairées.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="relative rounded-[32px] border border-black/10 bg-white/60 backdrop-blur-2xl p-2 shadow-2xl">
             <div className="rounded-[24px] bg-[#0a0a0a] text-white overflow-hidden border border-black/5">
                <div className="flex flex-col md:flex-row md:items-center justify-between p-6 border-b border-white/10 gap-4">
                   <div className="flex flex-wrap items-center gap-6">
                     <div>
                       <div className="flex items-center gap-2">
                         <h3 className="text-2xl font-semibold">BTC/USDT</h3>
                         <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-white/70">PERP</span>
                       </div>
                       <div className="text-white/50 text-sm">Bitcoin</div>
                     </div>
                     <div className="hidden md:block h-10 w-[1px] bg-white/10" />
                     <div>
                       <div className={`text-2xl font-medium ${candles[candles.length - 1].close >= candles[candles.length - 1].open ? 'text-emerald-400' : 'text-red-400'}`}>
                         ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                       </div>
                       <div className="text-emerald-400 text-sm flex items-center gap-1">
                         <ArrowUpRight className="h-4 w-4" /> +2.45% (24h)
                       </div>
                     </div>
                   </div>

                   <div className="flex items-center gap-4">
                     {/* Button removed as requested */}
                   </div>
                </div>

                <div className="relative h-[400px] w-full p-6 flex flex-col justify-end pr-20">
                   <div className="absolute inset-y-6 left-6 right-20 flex flex-col justify-between pointer-events-none opacity-10">
                     {[...Array(5)].map((_, i) => (
                       <div key={i} className="w-full border-b border-white/20 relative">
                         <span className="absolute -right-16 -top-2.5 text-xs text-white/50">{Math.round(maxPrice - (priceRange / 4) * i)}</span>
                       </div>
                     ))}
                   </div>

                   <svg className="w-full h-full relative z-10" preserveAspectRatio="none" viewBox="0 0 1000 100">
                     {candles.map((c, i) => {
                       const isUp = c.close >= c.open;
                       const color = isUp ? "#10b981" : "#ef4444";
                       const candleWidth = 1000 / candles.length;
                       const x = i * candleWidth;
                       const y1 = getY(c.high);
                       const y2 = getY(c.low);
                       const rectY = isUp ? getY(c.close) : getY(c.open);
                       const rectHeight = Math.max(0.5, Math.abs(getY(c.open) - getY(c.close)));

                       return (
                         <g key={i} className="transition-all duration-300">
                           <line 
                             x1={x + candleWidth / 2} 
                             y1={y1} 
                             x2={x + candleWidth / 2} 
                             y2={y2} 
                             stroke={color} 
                             strokeWidth="1" 
                           />
                           <rect 
                             x={x + candleWidth * 0.15} 
                             y={rectY} 
                             width={candleWidth * 0.7} 
                             height={rectHeight} 
                             fill={color} 
                             rx={0.5}
                           />
                         </g>
                       );
                     })}
                   </svg>
                   
                   <div 
                     className="absolute left-6 right-20 border-b border-dashed border-emerald-500/50 transition-all duration-300 z-0 pointer-events-none"
                     style={{ top: `calc(${getY(currentPrice)}% + 1.5rem)` }}
                   >
                     <div className="absolute -right-16 -top-3 bg-emerald-500 text-white text-xs px-2 py-1 rounded">
                       {Math.round(currentPrice)}
                     </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border-t border-white/10 bg-white/[0.02]">
                  <div>
                    <div className="text-white/40 text-xs mb-1">Vol 24h</div>
                    <div className="font-medium">42,105.50 BTC</div>
                  </div>
                  <div>
                    <div className="text-white/40 text-xs mb-1">High 24h</div>
                    <div className="font-medium">${maxPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                  </div>
                  <div>
                    <div className="text-white/40 text-xs mb-1">Low 24h</div>
                    <div className="font-medium">${minPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                  </div>
                  <div>
                    <div className="text-white/40 text-xs mb-1">Algorithme</div>
                    <div className="font-medium text-emerald-400 flex items-center gap-1">
                      <Zap className="h-3 w-3" /> Exécution Active
                    </div>
                  </div>
                </div>
             </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function HighFrequencyBotSection() {
  const [chartData, setChartData] = useState<number[]>(Array.from({ length: 50 }, () => 50 + Math.random() * 20));
  const [trades, setTrades] = useState<{ id: number; action: string; pair: string; profit: number }[]>([
    { id: 1, action: 'ARBITRAGE', pair: 'ETH/USDC', profit: 4.25 },
    { id: 2, action: 'LIQUIDATION', pair: 'SOL/USDT', profit: 12.50 },
    { id: 3, action: 'ARBITRAGE', pair: 'BTC/DAI', profit: 8.10 },
    { id: 4, action: 'LIQUIDATION', pair: 'AVAX/USDT', profit: 1.20 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prev => {
        const newData = [...prev.slice(1)];
        const last = newData[newData.length - 1];
        newData.push(Math.max(10, Math.min(90, last + (Math.random() - 0.5) * 20)));
        return newData;
      });

      if (Math.random() > 0.4) {
        setTrades(prev => {
          const pairs = ['ETH/USDC', 'SOL/USDT', 'BTC/DAI', 'AVAX/USDT', 'LINK/USDT'];
          const newTrades = [...prev];
          const randomIndex = Math.floor(Math.random() * newTrades.length);
          
          newTrades[randomIndex] = {
            ...newTrades[randomIndex],
            action: Math.random() > 0.6 ? 'LIQUIDATION' : 'ARBITRAGE',
            pair: pairs[Math.floor(Math.random() * pairs.length)],
            profit: Number((Math.random() * 15).toFixed(2))
          };
          return newTrades;
        });
      }
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative bg-[#020202] py-32 border-t border-white/5 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-6xl px-6 relative z-10">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          
          <div className="flex-1 w-full md:w-1/2">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-[12px] font-medium uppercase tracking-wider text-blue-400">
                <Activity className="h-4 w-4" /> Haute Fréquence
              </span>
              <h2 className="mt-6 text-[40px] font-normal leading-[1.1] tracking-tight text-white">
                Exécution <span className="text-blue-400">Micro-seconde</span>
              </h2>
              <p className="mt-6 text-[16px] text-white/60 mb-8">
                Notre architecture de trading haute fréquence détecte et exploite les inefficacités du marché en millisecondes. Observez notre réseau de nœuds extraire de la valeur en temps réel.
              </p>

              <div className="space-y-4">
                {trades.map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-4">
                       <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                         <Repeat className="h-4 w-4" />
                       </div>
                       <div className="w-24">
                         <div className="text-sm font-medium text-white">{t.action}</div>
                         <div className="text-xs text-white/50">{t.pair}</div>
                       </div>
                    </div>
                    <div className="text-right w-24">
                       <div className="text-sm font-medium text-emerald-400">+{t.profit.toFixed(2)} USDT</div>
                       <div className="text-xs text-white/50">À l'instant</div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="flex-1 w-full md:w-1/2">
            <Reveal delay={200}>
              <div className="relative h-[450px] w-full rounded-[32px] border border-white/10 bg-[#0a0a0a] p-6 shadow-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px]" />
                
                <div className="flex justify-between items-start mb-8 relative z-10">
                   <div>
                     <div className="text-white/50 text-sm">Volume Traité (24h)</div>
                     <div className="text-3xl font-semibold text-white mt-1">$142.5M</div>
                   </div>
                   <div className="flex items-center gap-2 text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-full text-sm font-medium border border-blue-500/20">
                     <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                     Réseau Actif
                   </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-[250px]">
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 500 100">
                    <defs>
                      <linearGradient id="blueGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    
                    <path 
                      d={`M 0 100 ${chartData.map((y, i) => `L ${i * (500 / 49)} ${100 - y}`).join(' ')} L 500 100 Z`}
                      fill="url(#blueGlow)"
                      className="transition-all duration-[400ms] ease-linear"
                    />
                    <path 
                      d={`M 0 ${100 - chartData[0]} ${chartData.map((y, i) => `L ${i * (500 / 49)} ${100 - y}`).join(' ')}`}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      className="transition-all duration-[400ms] ease-linear"
                    />
                  </svg>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function DashboardShowcase() {
  return (
    <main className="min-h-screen bg-background text-foreground font-sans">
      <LoggedInNav />

      {/* Hero Section - Dark Theme */}
      <section className="relative overflow-hidden pt-40 pb-20">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-emerald/10 opacity-50 blur-[120px]" />
        
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <Reveal>
            <span className="inline-flex items-center rounded-full border border-emerald/20 bg-emerald/10 px-4 py-1.5 text-[12px] font-medium uppercase tracking-wider text-emerald-400">
              Portail Client
            </span>
            <h1 className="mt-8 text-5xl font-normal tracking-tight md:text-7xl">
              Votre Infrastructure <span className="text-emerald">Financière</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/60">
              Naviguez dans l'écosystème des actifs numériques avec une clarté institutionnelle. Nous fournissons l'infrastructure et les analyses approfondies nécessaires pour construire des portefeuilles résilients.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Core Features - White Theme */}
      <section className="relative bg-white py-32 text-black rounded-[40px] md:rounded-[80px] mx-2 mb-2">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-20">
              <h2 className="text-[40px] font-normal leading-[1.1] tracking-tight">
                Gestion Crypto de Qualité <span className="text-emerald">Institutionnelle</span>
              </h2>
              <p className="mt-6 text-[16px] text-black/60">
                Nous comblons le fossé entre la finance traditionnelle et les actifs numériques, offrant un cadre robuste pour le déploiement de capitaux dans le Web3.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "Sécurité Bancaire",
                desc: "Vos actifs sont protégés par des portefeuilles multi-signatures de niveau entreprise et des protocoles de stockage à froid.",
              },
              {
                icon: PieChart,
                title: "Allocation Diversifiée",
                desc: "Nous construisons des portefeuilles équilibrés couvrant les écosystèmes Layer 1, la DeFi et les infrastructures émergentes.",
              },
              {
                icon: Cpu,
                title: "Précision Algorithmique",
                desc: "Exploitation de modèles quantitatifs propriétaires pour exécuter des transactions avec un glissement minimal.",
              },
            ].map((feature, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="group h-full rounded-[32px] border border-black/5 bg-black/[0.02] p-8 transition-all duration-300 hover:bg-white hover:-translate-y-2 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.12)] hover:border-black/8">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald/10 text-emerald transition-all duration-300 group-hover:bg-emerald group-hover:text-white group-hover:scale-110 group-hover:shadow-[0_8px_20px_-4px_oklch(0.55_0.18_160_/_0.4)]">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-8 text-[20px] font-normal">{feature.title}</h3>
                  <p className="mt-4 text-[16px] leading-relaxed text-black/60">
                    {feature.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Market Guidance - Dark Theme */}
      <section className="relative bg-[#0a0a0a] py-32 border-t border-white/5">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-16 md:grid-cols-2">
            <Reveal>
              <h2 className="text-[40px] font-normal leading-[1.1] tracking-tight text-white">
                L'intelligence qui génère de <span className="text-emerald">l'alpha.</span>
              </h2>
              <p className="mt-6 text-[16px] text-white/60">
                Le succès dans les actifs numériques exige des avantages informationnels approfondis. Notre équipe distille les métriques on-chain et les tendances macroéconomiques.
              </p>
              
              <ul className="mt-10 space-y-6">
                {[
                  "Briefings macroéconomiques hebdomadaires",
                  "Analyse fondamentale approfondie des protocoles",
                  "Suivi de la liquidité et des volumes on-chain",
                  "Surveillance du paysage réglementaire"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-[16px] text-white/80">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald/10 text-emerald">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              
              <div className="mt-12">
                 <button className="btn-emerald inline-flex items-center gap-2 rounded-full px-8 py-4 text-[16px] font-medium hover:scale-105 hover:shadow-[0_0_20px_rgba(20,184,166,0.4)] transition-all duration-300">
                  Lire la Dernière Recherche
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </Reveal>

            <Reveal delay={200}>
               <div className="relative rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl overflow-hidden">
                  <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-emerald/20 blur-[60px]" />
                  <CandlestickAnimation />
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center justify-between border-b border-white/10 pb-6">
                      <div className="flex items-center gap-4">
                         <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                           <Globe className="h-6 w-6 text-white" />
                         </div>
                         <div>
                           <div className="font-medium text-white">Marchés Mondiaux</div>
                           <div className="text-[14px] text-white/50">Mise à jour Macro</div>
                         </div>
                      </div>
                      <span className="text-[12px] font-medium text-emerald-400">À l'instant</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-white/10 pb-6">
                      <div className="flex items-center gap-4">
                         <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                           <LineChart className="h-6 w-6 text-white" />
                         </div>
                         <div>
                           <div className="font-medium text-white">Rendements DeFi</div>
                           <div className="text-[14px] text-white/50">Alerte Stratégie</div>
                         </div>
                      </div>
                      <span className="text-[12px] font-medium text-emerald-400">Il y a 2h</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                           <Activity className="h-6 w-6 text-white" />
                         </div>
                         <div>
                           <div className="font-medium text-white">Flux On-Chain</div>
                           <div className="text-[14px] text-white/50">Pic de Volume</div>
                         </div>
                      </div>
                      <span className="text-[12px] font-medium text-emerald-400">Il y a 5h</span>
                    </div>
                  </div>
               </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Trading Bot Demo Section */}
      <TradingBotDemo />

      {/* High Frequency Trading Section */}
      <HighFrequencyBotSection />

      {/* Contact Section included at the bottom as requested */}
      <Contact />
      
      {/* Footer */}
      <Footer />
    </main>
  );
}

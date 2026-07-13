import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Mail, User, Phone, X, CheckCircle2 } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { PhoneInput } from "./PhoneInput";

export function AuthModal({
  open,
  onOpenChange,
  initialMode = "login"
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialMode?: "login" | "signup";
}) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  
  React.useEffect(() => {
    setMode(initialMode);
  }, [initialMode, open]);

  // Login State
  const [lEmail, setLEmail] = useState("");
  const [lLoading, setLLoading] = useState(false);
  const [lError, setLError] = useState("");
  const [lSuccess, setLSuccess] = useState(false);

  // Signup State
  const [sName, setSName] = useState("");
  const [sEmail, setSEmail] = useState("");
  const [sNumber, setSNumber] = useState("");
  const [countryCode, setCountryCode] = useState("CH");
  const [phoneError, setPhoneError] = useState("");
  const [sLoading, setSLoading] = useState(false);
  const [sError, setSError] = useState("");
  const [sSuccess, setSSuccess] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLLoading(true);
    setLError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: lEmail }),
      });

      const text = await res.text();
      if (!text) throw new Error("No response from server. Is the backend running?");

      let data: any;
      try { data = JSON.parse(text); }
      catch { throw new Error("Unexpected server response. Is the backend running?"); }

      if (!res.ok) throw new Error(data.details || data.error || "Login failed");

      setLSuccess(true);
      setTimeout(() => {
        onOpenChange(false);
        navigate({ to: "/dashboard" });
      }, 1000);
    } catch (err: any) {
      const rawMsg = (err?.message || err?.toString() || "");
      if (rawMsg.toLowerCase().includes("already exist") || rawMsg.toLowerCase().includes("already exists")) {
        return;
      }

      setLError(
        err.message === "Failed to fetch"
          ? "Cannot reach server. Please start the backend with: node server.js"
          : err.message
      );
    } finally {
      setLLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSLoading(true);
    setSError("");

    if (!sNumber) {
      setSError("Veuillez entrer un numéro de téléphone");
      setSLoading(false);
      return;
    }

    if (phoneError) {
      setSError(phoneError);
      setSLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: sName, email: sEmail, number: sNumber, countryCode }),
      });

      const text = await res.text();
      if (!text) throw new Error("No response from server. Is the backend running?");

      let data: any;
      try { data = JSON.parse(text); }
      catch { throw new Error("Unexpected server response. Is the backend running?"); }

      if (!res.ok) {
        const errMsg = data.details || data.error || "Signup failed";
        if (errMsg.toLowerCase().includes("already exist")) {
          setSError("Vous nous avez déjà contactés. Veuillez patienter, notre équipe vous contactera bientôt.");
          setSLoading(false);
          return;
        }
        throw new Error(errMsg);
      }

      setSSuccess(true);
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "Lead", {
          content_name: "Signup Modal Form",
          status: "success"
        });
      }
      setTimeout(() => {
        onOpenChange(false);
        navigate({ to: "/dashboard" });
      }, 1500);
    } catch (err: any) {
      const rawMsg = (err?.message || err?.toString() || "");
      if (rawMsg.toLowerCase().includes("already exist") || rawMsg.toLowerCase().includes("already exists")) {
        return;
      }

      setSError(
        err.message === "Failed to fetch"
          ? "Cannot reach server. Please start the backend with: node server.js"
          : err.message
      );
    } finally {
      setSLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm transition-opacity duration-300" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[110] flex w-[calc(100vw-2rem)] sm:w-full max-w-[420px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[24px] border border-white/10 bg-black/95 shadow-2xl backdrop-blur-2xl">
          
          <Dialog.Close className="absolute right-5 top-5 z-20 rounded-full bg-white/5 p-2 text-white/50 transition hover:bg-white/10 hover:text-white">
            <X className="h-4 w-4" />
          </Dialog.Close>

          <div className="flex flex-col p-6 sm:p-10">
            {mode === "login" ? (
              // LOGIN MODE
              <div className="animate-in fade-in zoom-in-95 duration-300">
                <div className="mb-8 flex items-center justify-center">
                  <div className="relative h-10 w-10">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[oklch(0.55_0.13_165)] to-[oklch(0.7_0.16_160)]" />
                    <div className="absolute inset-[6px] rounded-full bg-black" />
                    <div className="absolute inset-[10px] rounded-full bg-gradient-to-br from-[oklch(0.65_0.16_160)] to-[oklch(0.5_0.13_165)]" />
                  </div>
                </div>

                <div className="text-center">
                  <Dialog.Title className="text-2xl font-medium tracking-tight text-white">Bon retour</Dialog.Title>
                  <Dialog.Description className="mt-1.5 text-[15px] text-white/50">Entrez votre e-mail pour vous connecter.</Dialog.Description>
                </div>

                {lSuccess ? (
                  <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-center text-emerald-400">
                    <CheckCircle2 className="mx-auto mb-2 h-6 w-6" />
                    <span className="font-medium">Succès ! Redirection...</span>
                  </div>
                ) : (
                  <form onSubmit={handleLogin} className="mt-8 space-y-4">
                    {lError && (
                      <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center text-[14px] text-red-400">
                        {lError}
                      </div>
                    )}
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                      <input type="email" required value={lEmail} onChange={(e) => setLEmail(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-[15px] outline-none transition focus:border-white/30 focus:bg-white/10" placeholder="Adresse e-mail" />
                    </div>
                    
                    <button disabled={lLoading} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-[15px] font-semibold text-black transition hover:bg-white/90 disabled:opacity-50">
                      {lLoading ? "Connexion..." : "Sign In"}
                    </button>
                  </form>
                )}
                
                <p className="mt-8 text-center text-[14px] text-white/50">
                  Vous n'avez pas de compte ? <button onClick={() => setMode("signup")} className="font-medium text-white transition hover:text-emerald-400">S'inscrire</button>
                </p>
              </div>
            ) : (
              // SIGNUP MODE
              <div className="animate-in fade-in zoom-in-95 duration-300">
                <div className="mb-8 flex items-center justify-center">
                  <div className="relative h-10 w-10">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[oklch(0.55_0.13_165)] to-[oklch(0.7_0.16_160)]" />
                    <div className="absolute inset-[6px] rounded-full bg-black" />
                    <div className="absolute inset-[10px] rounded-full bg-gradient-to-br from-[oklch(0.65_0.16_160)] to-[oklch(0.5_0.13_165)]" />
                  </div>
                </div>

                <div className="text-center">
                  <Dialog.Title className="text-2xl font-medium tracking-tight text-white">S'inscrire</Dialog.Title>
                  <Dialog.Description className="mt-1.5 text-[15px] text-white/50">Créez votre compte.</Dialog.Description>
                </div>

                {sSuccess ? (
                  <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6 text-center text-emerald-400">
                    <CheckCircle2 className="mx-auto mb-3 h-8 w-8" />
                    <span className="block text-lg font-medium">Demande approuvée !</span>
                    <span className="text-[14px] text-emerald-400/70">Connexion en cours...</span>
                  </div>
                ) : (
                  <form onSubmit={handleSignup} className="mt-8 space-y-4">
                    {sError && <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center text-[14px] text-red-400">{sError}</div>}
                    
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                      <input type="text" required value={sName} onChange={(e) => setSName(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-[15px] outline-none transition focus:border-white/30 focus:bg-white/10" placeholder="Nom complet" />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                      <input type="email" required value={sEmail} onChange={(e) => setSEmail(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-[15px] outline-none transition focus:border-white/30 focus:bg-white/10" placeholder="Adresse e-mail" />
                    </div>
                    <PhoneInput hideLabel onChange={(full, code, err) => {
                      setSNumber(full);
                      setCountryCode(code);
                      setPhoneError(err);
                    }} />
                    
                    <button disabled={sLoading} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-[15px] font-semibold text-black transition hover:bg-white/90 disabled:opacity-50">
                      {sLoading ? "Création du compte..." : "Sign Up"}
                    </button>
                  </form>
                )}
                
                <p className="mt-8 text-center text-[14px] text-white/50">
                  Déjà client ? <button onClick={() => setMode("login")} className="font-medium text-white transition hover:text-emerald-400">Se connecter</button>
                </p>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

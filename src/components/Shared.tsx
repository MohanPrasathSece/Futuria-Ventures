import logo from "../assets/logo.png";
import React, { useState, useEffect, useRef } from "react";
import { Check } from "lucide-react";
import { PhoneInput } from "./PhoneInput";
import { trackEvent, trackCustomEvent } from "../lib/pixel";

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-[1400ms] ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function Footer() {
  const navLinks = [
    { label: "Strategies", href: "#strategies" },
    { label: "Insights", href: "#insights" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <footer className="relative overflow-hidden bg-background border-t border-white/[0.05] px-6 pb-8 pt-12 md:pb-10 md:pt-16">
      {/* Subtle glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-[oklch(0.55_0.13_165)] opacity-[0.04] blur-[80px]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-center md:justify-between">
          {/* Logo */}
          <img src={logo} alt="Futuria Network" className="h-9 w-auto opacity-80" />

          {/* Nav links */}
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            {navLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-[14px] text-foreground/50 transition-colors hover:text-foreground/90"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Legal links */}
          <div className="flex gap-5">
            {["Privacy", "Terms", "Disclosures"].map((l) => (
              <a key={l} href="#" className="text-[12px] text-foreground/35 transition-colors hover:text-foreground/60">
                {l}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-10 border-t border-white/[0.05] pt-6 text-center text-[12px] text-foreground/30">
          © {new Date().getFullYear()} Futuria Network. All rights reserved. &nbsp;·&nbsp; Past performance is not indicative of future results.
        </div>
      </div>
    </footer>
  );
}

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", number: "", countryCode: "CH", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [phoneError, setPhoneError] = useState("");

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim() || form.name.length > 100) e.name = "Veuillez entrer votre nom (max 100)";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) || form.email.length > 255)
      e.email = "Entrez un e-mail valide";
    if (form.message.trim() && form.message.length > 1000)
      e.message = "Parlez-nous un peu de vos objectifs (max 1000)";

    if (!form.number) {
      e.number = "Veuillez entrer un numéro de téléphone";
    } else if (phoneError) {
      e.number = phoneError;
    }

    return e;
  };

  const handleFieldFocus = (fieldName: string) => {
    trackCustomEvent("FormFieldFocus", { field: fieldName, form: "Contact Form" });
    trackEvent("Contact", { content_category: "Form Interaction", content_name: `Contact Form - ${fieldName}` });
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    trackEvent("InitiateCheckout", { content_name: "Contact Form Submit Click" });
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length === 0) {
      setLoading(true);
      try {
        await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        setSubmitted(true);
        trackEvent("Lead", {
          content_name: "Contact Form",
          status: "success"
        });
      } catch (err) {
        console.error("Échec de la soumission du formulaire de contact", err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden bg-white px-6 py-20 md:py-32 text-black rounded-t-[40px] md:rounded-t-[80px]">
      <div className="relative mx-auto grid max-w-6xl gap-16 md:grid-cols-2">
        <Reveal>
          <span className="inline-flex items-center rounded-full border border-black/10 bg-black/5 px-4 py-1.5 text-[12px] font-medium uppercase tracking-wider text-black/60">
            Contactez-nous
          </span>
          <h2 className="mt-6 text-[36px] md:text-[44px] lg:text-[56px] font-normal leading-[1.05] tracking-tight">
            Prêt à commencer votre <span className="text-emerald">parcours ?</span>
          </h2>
          <p className="mt-6 max-w-md text-[16px] font-normal text-black/60">
            Notre équipe d'investissement est prête à discuter de vos objectifs. Remplissez le formulaire et nous organiserons un bref appel de présentation.
          </p>


        </Reveal>

        <Reveal delay={120}>
          <form onSubmit={submit} className="relative rounded-[32px] border border-black/5 bg-white p-6 sm:p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald/10">
                  <Check className="h-8 w-8 text-emerald" />
                </div>
                <h3 className="mt-6 text-[22px] font-normal">Demande Reçue</h3>
                <p className="mt-2 text-[15px] text-black/60">Nous vous contacterons sous peu.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="text-[12px] font-medium uppercase tracking-wider text-black/40">Nom</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    onFocus={() => handleFieldFocus("name")}
                    className="mt-2 w-full rounded-xl border border-black/10 bg-black/[0.02] px-4 py-3 text-[15px] outline-none transition focus:border-emerald/50 focus:bg-white"
                  />
                  {errors.name && <p className="mt-1 text-[12px] text-red-500">{errors.name}</p>}
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="text-[12px] font-medium uppercase tracking-wider text-black/40">E-mail</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      onFocus={() => handleFieldFocus("email")}
                      className="mt-2 w-full rounded-xl border border-black/10 bg-black/[0.02] px-4 py-3 text-[15px] outline-none transition focus:border-emerald/50 focus:bg-white"
                    />
                    {errors.email && <p className="mt-1 text-[12px] text-red-500">{errors.email}</p>}
                  </div>
                  <div>
                    <PhoneInput theme="light" onFocus={() => handleFieldFocus("phone")} onChange={(full, code, err) => {
                      setForm({ ...form, number: full, countryCode: code });
                      setPhoneError(err);
                    }} />
                    {errors.number && <p className="mt-1 text-[12px] text-red-500">{errors.number}</p>}
                  </div>
                </div>

                

                <div>
                  <label className="text-[12px] font-medium uppercase tracking-wider text-black/40">Message</label>
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    onFocus={() => handleFieldFocus("message")}
                    className="mt-2 w-full resize-none rounded-xl border border-black/10 bg-black/[0.02] px-4 py-3 text-[15px] outline-none transition focus:border-emerald/50 focus:bg-white"
                  />
                  {errors.message && <p className="mt-1 text-[12px] text-red-500">{errors.message}</p>}
                </div>

                <button disabled={loading} className="btn-emerald hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(20,184,166,0.2)] transition-all duration-300 flex w-full justify-center rounded-xl py-4 text-[15px] font-medium disabled:opacity-50 hover:scale-105 hover:shadow-[0_0_20px_rgba(20,184,166,0.4)] transition-all duration-300">
                  {loading ? "Envoi en cours..." : "Soumettre la demande"}
                </button>
              </div>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}

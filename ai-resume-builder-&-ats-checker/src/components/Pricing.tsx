import React, { useState } from "react";
import { 
  Check, 
  Sparkles, 
  Globe2, 
  CreditCard, 
  HelpCircle, 
  ShieldCheck, 
  Zap, 
  Trophy, 
  ChevronRight,
  Info,
  Loader2
} from "lucide-react";

interface PricingPlan {
  name: string;
  id: string;
  tagline: string;
  icon: React.ReactNode;
  popular: boolean;
  features: string[];
  // Prices per country in standard formats
  priceMonthly: { [country: string]: { value: number; label: string } };
  priceAnnual: { [country: string]: { value: number; label: string } };
}

interface PricingProps {
  subscribedPlanId?: string;
  onSubscribe?: (planId: string) => void;
}

export default function Pricing({ subscribedPlanId = "free", onSubscribe }: PricingProps) {
  const [selectedCountry, setSelectedCountry] = useState<string>("IN");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<PricingPlan | null>(null);
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  
  // Billing details mock state
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerCard, setBuyerCard] = useState("4111 2222 3333 4444");

  const countries = [
    { code: "IN", name: "India (INR 🇮🇳)", currency: "₹" },
    { code: "US", name: "United States (USD 🇺🇸)", currency: "$" },
    { code: "EU", name: "Europe (EUR 🇪🇺)", currency: "€" },
    { code: "UK", name: "United Kingdom (GBP 🇬🇧)", currency: "£" },
    { code: "AU", name: "Australia (AUD 🇦🇺)", currency: "A$" },
    { code: "JP", name: "Japan (JPY 🇯🇵)", currency: "¥" }
  ];

  const plans: PricingPlan[] = [
    {
      name: "Free Creator",
      id: "free",
      tagline: "Essential drafting essentials",
      icon: <Info className="w-5 h-5 text-slate-400" />,
      popular: false,
      priceMonthly: {
        IN: { value: 0, label: "₹0" },
        US: { value: 0, label: "$0" },
        EU: { value: 0, label: "€0" },
        UK: { value: 0, label: "£0" },
        AU: { value: 0, label: "A$0" },
        JP: { value: 0, label: "¥0" }
      },
      priceAnnual: {
        IN: { value: 0, label: "₹0" },
        US: { value: 0, label: "$0" },
        EU: { value: 0, label: "€0" },
        UK: { value: 0, label: "£0" },
        AU: { value: 0, label: "A$0" },
        JP: { value: 0, label: "¥0" }
      },
      features: [
        "1 ATS-Optimized Template Layout",
        "Single-page A4 PDF Export",
        "Basic keyword suggestions",
        "Client side standard autosave",
        "Standard font options"
      ]
    },
    {
      name: "Pro Copilot",
      id: "pro",
      tagline: "The optimal sweet spot for active job seekers",
      icon: <Zap className="w-5 h-5 text-blue-400" />,
      popular: true,
      priceMonthly: {
        IN: { value: 399, label: "₹399" },
        US: { value: 9.99, label: "$9.99" },
        EU: { value: 9.49, label: "€9.49" },
        UK: { value: 7.99, label: "£7.99" },
        AU: { value: 14.99, label: "A$14.99" },
        JP: { value: 1400, label: "¥1,400" }
      },
      priceAnnual: {
        IN: { value: 299, label: "₹299" }, // effectively per mo
        US: { value: 7.49, label: "$7.49" },
        EU: { value: 6.99, label: "€6.99" },
        UK: { value: 5.99, label: "£5.99" },
        AU: { value: 10.99, label: "A$10.99" },
        JP: { value: 1000, label: "¥1,000" }
      },
      features: [
        "Access All 6 Core Template Layouts",
        "Unlimited AI Bullet Phrasing Suggesters",
        "AI action verb enrichment lists",
        "Full ATS checking compliance scorecards",
        "Color scheme, size and font customizers",
        "PDF download priority access"
      ]
    },
    {
      name: "Executive Scale",
      id: "executive",
      tagline: "Maximum positioning for elite professionals",
      icon: <Trophy className="w-5 h-5 text-yellow-400" />,
      popular: false,
      priceMonthly: {
        IN: { value: 999, label: "₹999" },
        US: { value: 24.99, label: "$24.99" },
        EU: { value: 23.99, label: "€23.99" },
        UK: { value: 19.99, label: "£19.99" },
        AU: { value: 37.99, label: "A$37.99" },
        JP: { value: 3500, label: "¥3,500" }
      },
      priceAnnual: {
        IN: { value: 799, label: "₹799" },
        US: { value: 19.99, label: "$19.99" },
        EU: { value: 18.99, label: "€18.99" },
        UK: { value: 15.99, label: "£15.99" },
        AU: { value: 29.99, label: "A$29.99" },
        JP: { value: 2800, label: "¥2,800" }
      },
      features: [
        "Every Pro feature included",
        "Advanced Relational ATS comparative metrics",
        "Section Reordering Custom Control Engine",
        "Priority live-preview rendering clusters",
        "Voucher for 1-on-1 human recruiter resume audit",
        "Remove all brand markings from PDF headers"
      ]
    }
  ];

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !buyerEmail) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setTransactionSuccess(true);
      if (checkoutPlan && onSubscribe) {
        onSubscribe(checkoutPlan.id);
        localStorage.setItem("subscribed_plan_id", checkoutPlan.id);
      }
    }, 1500);
  };

  const resetCheckout = () => {
    setCheckoutPlan(null);
    setTransactionSuccess(false);
    setBuyerName("");
    setBuyerEmail("");
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto print:hidden">
      
      {/* Title section */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h2 className="text-3xl font-extrabold tracking-tight text-white bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
          Direct Subscription Levels
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          Scale your professional placement today. Choose the ideal subscription level that fits your career roadmap. Change plans or cancel at any session interval.
        </p>
      </div>

      {/* Selector controls: Country and billing cycle */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-lg">
        
        {/* Toggle billing cycle */}
        <div className="flex items-center gap-2 bg-black/40 p-1 rounded-full border border-white/5">
          <button
            id="toggle-btn-monthly"
            type="button"
            onClick={() => setBillingCycle("monthly")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              billingCycle === "monthly" 
                ? "bg-blue-500 text-white shadow-md" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            Monthly Commitment
          </button>
          <button
            id="toggle-btn-annual"
            type="button"
            onClick={() => setBillingCycle("annual")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all flex items-center gap-1 cursor-pointer ${
              billingCycle === "annual" 
                ? "bg-blue-500 text-white shadow-md" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>Annual Invoice</span>
            <span className="text-[9px] font-bold uppercase bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full border border-emerald-500/20">
              Save ~20%
            </span>
          </button>
        </div>

        {/* Global country selector */}
        <div className="flex items-center gap-2.5">
          <label className="text-xs text-slate-400 font-medium flex items-center gap-1 shrink-0">
            <Globe2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Select Currency / Region:</span>
          </label>
          <select
            id="pricing-country-select"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="bg-black/50 text-xs border border-white/15 rounded-xl px-3 py-2 text-white font-medium outline-none cursor-pointer focus:border-blue-500 transition-colors"
          >
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isPro = plan.id === "pro";
          const priceObj = billingCycle === "monthly" ? plan.priceMonthly[selectedCountry] : plan.priceAnnual[selectedCountry];
          const actualPrice = priceObj ? priceObj.label : "Custom";
          const subtext = plan.id === "free" ? "Lifetime license" : billingCycle === "monthly" ? "per month" : "billed annually (effective)";
          
          return (
            <div
              key={plan.id}
              className={`relative bg-white/5 backdrop-blur-xl rounded-3xl border text-left flex flex-col justify-between transition-all hover:scale-[1.01] ${
                isPro 
                  ? "border-blue-500/50 shadow-2xl shadow-blue-500/5 ring-1 ring-blue-500/20 md:-translate-y-2" 
                  : "border-white/15 shadow-xl"
              }`}
            >
              {/* Popular ribbon */}
              {isPro && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold text-[10px] uppercase tracking-widest px-4 py-1 rounded-full shadow-md border border-blue-400/20">
                  Most Popular choice
                </span>
              )}

              {/* Top part */}
              <div className="p-6 md:p-8 space-y-5">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white flex items-center gap-1.5">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {plan.tagline}
                    </p>
                  </div>
                  <div className="p-2 bg-white/5 rounded-xl border border-white/5">
                    {plan.icon}
                  </div>
                </div>

                {/* Pricing values */}
                <div className="pt-2 border-t border-white/5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                      {actualPrice}
                    </span>
                    <span className="text-xs text-slate-400">
                      /{billingCycle === "monthly" ? "mo" : "mo"}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-1 uppercase font-semibold">
                    {subtext}
                  </span>
                </div>

                {/* Features Checklist */}
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">
                    Product Features
                  </span>
                  <ul className="space-y-2 text-xs text-slate-350">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex gap-2 items-start leading-relaxed text-slate-300">
                        <Check className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Button section */}
              <div className="p-6 md:p-8 pt-0 border-t border-white/5 mt-auto">
                <button
                  id={`btn-pricing-select-${plan.id}`}
                  type="button"
                  onClick={() => {
                    if (plan.id === subscribedPlanId) {
                      alert(`You are currently enjoying active premium access to the ${plan.name} level.`);
                    } else if (plan.id === "free") {
                      if (window.confirm("Would you like to return to the Free Creator plan?")) {
                        if (onSubscribe) onSubscribe("free");
                        localStorage.setItem("subscribed_plan_id", "free");
                      }
                    } else {
                      setCheckoutPlan(plan);
                    }
                  }}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all duration-350 tracking-wide cursor-pointer flex items-center justify-center gap-1.5 ${
                    plan.id === subscribedPlanId
                      ? "bg-emerald-500/15 border border-emerald-500/35 text-emerald-400"
                      : isPro 
                        ? "bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/10" 
                        : "bg-white/10 hover:bg-white/20 text-white border border-white/15"
                  }`}
                >
                  <span>{plan.id === subscribedPlanId ? "✓ Active Plan Level" : `Upgrade to ${plan.name}`}</span>
                  {plan.id !== subscribedPlanId && <ChevronRight className="w-3 h-3" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Subscription Trust badges */}
      <div className="pt-5 border-t border-white/5 flex flex-wrap justify-center items-center gap-6 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Complete 256-bit secure SSL Gateway encryption</span>
        </div>
        <div className="flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-slate-500" />
          <span>Cancel at any time without extra custom fees</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-blue-400" />
          <span>Immediate premium credit account dispatch</span>
        </div>
      </div>

      {/* INTERACTIVE PAYMENTS SYSTEM SIMULATION MODAL */}
      {checkoutPlan && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121421] border border-white/10 p-6 md:p-8 rounded-3xl max-w-md w-full shadow-2xl relative text-left space-y-6">
            
            {/* Modal Heading header */}
            <div className="flex justify-between items-start border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] text-blue-400 font-bold tracking-widest uppercase block mb-1">
                  Secure Checkout Ingest
                </span>
                <h3 className="text-xl font-bold text-white">Subscribe to {checkoutPlan.name}</h3>
              </div>
              <button
                id="modal-close-pricing"
                type="button"
                onClick={resetCheckout}
                className="text-slate-400 hover:text-white font-bold text-lg select-none px-2 py-1 rounded"
              >
                &times;
              </button>
            </div>

            {/* Content states */}
            {!transactionSuccess ? (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-xs">
                
                {/* Summary Box */}
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1">
                  <div className="flex justify-between font-semibold text-slate-300">
                    <span>Selected Option:</span>
                    <span>{checkoutPlan.name} ({billingCycle === "monthly" ? "Monthly" : "Annual"})</span>
                  </div>
                  <div className="flex justify-between font-black text-white text-sm pt-1 border-t border-white/10">
                    <span>Total Due:</span>
                    <span className="text-blue-450">
                      {billingCycle === "monthly" ? checkoutPlan.priceMonthly[selectedCountry]?.label : checkoutPlan.priceAnnual[selectedCountry]?.label}
                      /{billingCycle === "monthly" ? "mo" : "mo"}
                    </span>
                  </div>
                </div>

                {/* Inputs */}
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Subscriber Full Name</label>
                    <input
                      id="buyer-fullname"
                      type="text"
                      className="w-full bg-black/40 text-white border border-white/10 rounded-xl p-2.5 outline-none focus:border-blue-500"
                      placeholder="e.g. Alex Rivera"
                      required
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">E-mail address</label>
                    <input
                      id="buyer-emailaddress"
                      type="email"
                      className="w-full bg-black/40 text-white border border-white/10 rounded-xl p-2.5 outline-none focus:border-blue-500"
                      placeholder="alex.rivera@email.com"
                      required
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Simulated Card Details</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                      <input
                        id="buyer-cardnumber"
                        type="text"
                        className="w-full bg-black/40 text-white border border-white/10 rounded-xl p-2.5 pl-9 outline-none focus:border-blue-500 font-mono"
                        value={buyerCard}
                        onChange={(e) => setBuyerCard(e.target.value || "")}
                      />
                    </div>
                    <span className="text-[9px] text-slate-500 mt-1 block">Simulation Mode. Standard test metrics activated automatically.</span>
                  </div>
                </div>

                {/* Trigger */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-75 transition-all text-white font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer text-xs"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Validating Transaction Sequence...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-white" />
                      <span>Process Invoice of {billingCycle === "monthly" ? checkoutPlan.priceMonthly[selectedCountry]?.label : checkoutPlan.priceAnnual[selectedCountry]?.label}</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 bg-emerald-500/15 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                  <Check className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-white">Subscription Dispatched!</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Thank you, <strong className="font-bold text-slate-250">{buyerName}</strong>! Your account has been upgraded to <strong className="font-bold text-white">{checkoutPlan.name}</strong>. A verification token was emailed to <span className="font-mono text-blue-300">{buyerEmail}</span>. All features are fully optimized.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetCheckout}
                  className="px-6 py-2 bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white hover:bg-white/15"
                >
                  Return to App Dashboard
                </button>
              </div>
            )}
            
            <p className="text-[9px] text-slate-500 text-center leading-normal">
              Disclaimer: This is a robust mock transaction simulation interface mapped purely to user specification boundaries in India (INR) and Global regions.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}

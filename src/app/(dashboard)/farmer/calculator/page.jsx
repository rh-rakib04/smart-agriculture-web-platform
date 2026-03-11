"use client";

import { useState } from "react";
import {
  Sprout, TrendingUp, Calculator, DollarSign,
  ChevronDown, RotateCcw, Leaf, Package, Droplets,
  FlaskConical, Tractor, ArrowRight, Info,
} from "lucide-react";

/* ── Brand tokens ──────────────────────────────────────────────────── */
const B = {
  primary:      "#2E7D32",
  primaryLight: "#66BB6A",
  highlight:    "#FBC02D",
  accent:       "#8D6E63",
  muted:        "#E8F5E9",
  border:       "#C8E6C9",
  foreground:   "#1B5E20",
  mutedFg:      "#424242",
  card:         "#ffffff",
  red:          "#C62828",
  redBg:        "#FFEBEE",
  redBorder:    "#FFCDD2",
};

/* ── Small helpers ─────────────────────────────────────────────────── */
function StatPill({ label, value, color = B.primary }) {
  return (
    <div style={{ padding: "10px 16px", borderRadius: 12, background: B.muted, border: `1.5px solid ${B.border}`, textAlign: "center" }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: B.mutedFg, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 900, color, fontFamily: "'Space Grotesk', sans-serif" }}>{value}</div>
    </div>
  );
}

function Field({ label, value, onChange, unit, icon: Icon, type = "number", min = 0 }) {
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 700, color: B.foreground, display: "block", marginBottom: 6 }}>{label}</label>
      <div style={{ display: "flex", alignItems: "center", gap: 0, borderRadius: 11, border: `1.5px solid ${B.border}`, background: B.card, overflow: "hidden", transition: "border-color 0.15s" }}
        onFocusCapture={e => e.currentTarget.style.borderColor = B.primary}
        onBlurCapture={e => e.currentTarget.style.borderColor = B.border}>
        {Icon && (
          <div style={{ padding: "0 10px", borderRight: `1px solid ${B.border}`, display: "flex", alignItems: "center", height: 40, background: B.muted }}>
            <Icon size={14} style={{ color: B.primary }} />
          </div>
        )}
        <input
          type={type} min={min} value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{ flex: 1, border: "none", outline: "none", padding: "0 12px", height: 40, fontSize: 14, fontWeight: 700, color: B.foreground, background: "transparent", fontFamily: "'DM Sans', sans-serif" }}
        />
        {unit && (
          <div style={{ padding: "0 12px", fontSize: 11, fontWeight: 800, color: B.mutedFg, whiteSpace: "nowrap" }}>{unit}</div>
        )}
      </div>
    </div>
  );
}

function Select({ label, value, onChange, options, icon: Icon }) {
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 700, color: B.foreground, display: "block", marginBottom: 6 }}>{label}</label>
      <div style={{ position: "relative", borderRadius: 11, border: `1.5px solid ${B.border}`, background: B.card, overflow: "hidden" }}>
        {Icon && (
          <div style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
            <Icon size={14} style={{ color: B.primary }} />
          </div>
        )}
        <select value={value} onChange={e => onChange(e.target.value)}
          style={{ width: "100%", height: 40, paddingLeft: Icon ? 34 : 12, paddingRight: 32, border: "none", outline: "none", background: "transparent", fontSize: 14, fontWeight: 700, color: B.foreground, appearance: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <ChevronDown size={13} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: B.mutedFg, pointerEvents: "none" }} />
      </div>
    </div>
  );
}

function Card({ title, icon: Icon, iconColor = B.primary, children, accent = B.primary }) {
  return (
    <div style={{ background: B.card, borderRadius: 20, border: `1.5px solid ${B.border}`, overflow: "hidden", boxShadow: "0 2px 16px rgba(46,125,50,0.07)" }}>
      {/* Top accent bar */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${accent}, transparent)` }} />
      <div style={{ padding: "20px 22px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{ padding: "8px 9px", borderRadius: 11, background: B.muted, border: `1.5px solid ${B.border}` }}>
            <Icon size={16} style={{ color: iconColor }} />
          </div>
          <span style={{ fontSize: 14, fontWeight: 900, color: B.foreground, fontFamily: "'Space Grotesk', sans-serif" }}>{title}</span>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   CALCULATORS
───────────────────────────────────────────────────────────────────── */

/* 1. Crop Yield Calculator */
function YieldCalculator() {
  const [area, setArea]         = useState(1);
  const [unit, setUnit]         = useState("acre");
  const [crop, setCrop]         = useState("rice");
  const [quality, setQuality]   = useState("good");

  const YIELD_DATA = {
    rice:   { good: 3.5, avg: 2.8, poor: 1.8 },
    wheat:  { good: 4.0, avg: 3.2, poor: 2.2 },
    corn:   { good: 6.0, avg: 4.5, poor: 3.0 },
    potato: { good: 20,  avg: 15,  poor: 10  },
    jute:   { good: 2.5, avg: 1.8, poor: 1.2 },
    mustard:{ good: 1.2, avg: 0.9, poor: 0.6 },
  };

  const areaInAcres = unit === "bigha" ? area * 0.33 : unit === "hectare" ? area * 2.47 : area;
  const yieldPerAcre = YIELD_DATA[crop]?.[quality] || 3;
  const totalYield   = (areaInAcres * yieldPerAcre).toFixed(2);
  const minYield     = (areaInAcres * YIELD_DATA[crop]?.poor).toFixed(2);
  const maxYield     = (areaInAcres * YIELD_DATA[crop]?.good).toFixed(2);

  return (
    <Card title="Crop Yield Estimator" icon={Sprout} accent={B.primary}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
        <Field label="Land Area" value={area} onChange={setArea} icon={Tractor} />
        <Select label="Unit" value={unit} onChange={setUnit} options={[
          { value: "acre", label: "Acre" },
          { value: "bigha", label: "Bigha" },
          { value: "hectare", label: "Hectare" },
        ]} />
        <Select label="Crop Type" value={crop} onChange={setCrop} icon={Sprout} options={[
          { value: "rice", label: "🌾 Rice (Aman/Boro)" },
          { value: "wheat", label: "🌿 Wheat" },
          { value: "corn", label: "🌽 Corn/Maize" },
          { value: "potato", label: "🥔 Potato" },
          { value: "jute", label: "🪢 Jute" },
          { value: "mustard", label: "🟡 Mustard" },
        ]} />
        <Select label="Soil / Input Quality" value={quality} onChange={setQuality} options={[
          { value: "good", label: "✅ Good (high inputs)" },
          { value: "avg", label: "⚡ Average" },
          { value: "poor", label: "⚠️ Poor (low inputs)" },
        ]} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        <StatPill label="Est. Yield" value={`${totalYield} T`} color={B.primary} />
        <StatPill label="Min (poor)" value={`${minYield} T`} color={B.red} />
        <StatPill label="Max (good)" value={`${maxYield} T`} color="#1565C0" />
      </div>
      <p style={{ fontSize: 11, color: B.mutedFg, marginTop: 12, display: "flex", alignItems: "center", gap: 5 }}>
        <Info size={11} /> Estimates based on Bangladesh avg. yield data (tonnes/acre).
      </p>
    </Card>
  );
}

/* 2. Profit / Loss Calculator */
function ProfitCalculator() {
  const [salePrice, setSalePrice]   = useState(2500);
  const [quantity, setQuantity]     = useState(1);
  const [seedCost, setSeedCost]     = useState(800);
  const [fertCost, setFertCost]     = useState(1200);
  const [laborCost, setLaborCost]   = useState(2000);
  const [otherCost, setOtherCost]   = useState(500);
  const [reset, setReset]           = useState(0);

  const totalRevenue = salePrice * quantity;
  const totalCost    = seedCost + fertCost + laborCost + otherCost;
  const profit       = totalRevenue - totalCost;
  const roi          = totalCost > 0 ? ((profit / totalCost) * 100).toFixed(1) : 0;
  const isProfit     = profit >= 0;

  const handleReset = () => {
    setSalePrice(2500); setQuantity(1); setSeedCost(800);
    setFertCost(1200); setLaborCost(2000); setOtherCost(500);
    setReset(r => r + 1);
  };

  return (
    <Card title="Profit & Loss Calculator" icon={TrendingUp} iconColor={B.highlight} accent={B.highlight}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
        <Field label="Sale Price (৳/quintal)" value={salePrice} onChange={setSalePrice} icon={DollarSign} unit="৳" />
        <Field label="Quantity (quintals)" value={quantity} onChange={setQuantity} icon={Package} unit="q" />
      </div>
      <div style={{ fontSize: 11, fontWeight: 800, color: B.foreground, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10, opacity: 0.6 }}>Cost Breakdown</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
        <Field label="Seed Cost (৳)" value={seedCost} onChange={setSeedCost} icon={Sprout} unit="৳" />
        <Field label="Fertilizer (৳)" value={fertCost} onChange={setFertCost} icon={FlaskConical} unit="৳" />
        <Field label="Labour (৳)" value={laborCost} onChange={setLaborCost} icon={Tractor} unit="৳" />
        <Field label="Other Costs (৳)" value={otherCost} onChange={setOtherCost} icon={Package} unit="৳" />
      </div>

      {/* Result bar */}
      <div style={{ borderRadius: 14, background: isProfit ? B.muted : B.redBg, border: `1.5px solid ${isProfit ? B.border : B.redBorder}`, padding: "16px 18px", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: B.mutedFg, textTransform: "uppercase", letterSpacing: "0.1em" }}>{isProfit ? "Net Profit" : "Net Loss"}</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: isProfit ? B.primary : B.red, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.03em" }}>
              {isProfit ? "+" : ""}৳ {Math.abs(profit).toLocaleString()}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <StatPill label="Revenue" value={`৳${totalRevenue.toLocaleString()}`} color="#1565C0" />
            <StatPill label="Total Cost" value={`৳${totalCost.toLocaleString()}`} color={B.red} />
            <StatPill label="ROI" value={`${roi}%`} color={isProfit ? B.primary : B.red} />
            <StatPill label="Margin" value={totalRevenue > 0 ? `${((profit / totalRevenue) * 100).toFixed(1)}%` : "0%"} color={B.accent} />
          </div>
        </div>
      </div>

      <button onClick={handleReset} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 9, border: `1.5px solid ${B.border}`, background: "transparent", color: B.mutedFg, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
        <RotateCcw size={13} /> Reset
      </button>
    </Card>
  );
}

/* 3. Fertilizer & Water Calculator */
function InputCalculator() {
  const [area, setArea]       = useState(1);
  const [unit, setUnit]       = useState("acre");
  const [crop, setCrop]       = useState("rice");
  const [season, setSeason]   = useState("kharif");

  const FERT_DATA = {
    rice:    { N: 80, P: 30, K: 30, water: 1200 },
    wheat:   { N: 120, P: 60, K: 40, water: 450  },
    corn:    { N: 150, P: 75, K: 50, water: 600  },
    potato:  { N: 180, P: 90, K: 120, water: 500 },
    jute:    { N: 60, P: 20, K: 20, water: 700   },
    mustard: { N: 80, P: 40, K: 20, water: 300   },
  };

  const areaInAcres = unit === "bigha" ? area * 0.33 : unit === "hectare" ? area * 2.47 : area;
  const seasonMult  = season === "rabi" ? 0.85 : 1;
  const data        = FERT_DATA[crop] || FERT_DATA.rice;

  const urea  = ((data.N  * areaInAcres * seasonMult) / 0.46).toFixed(1); // 46% N
  const tsp   = ((data.P  * areaInAcres * seasonMult) / 0.20).toFixed(1); // 20% P
  const mop   = ((data.K  * areaInAcres * seasonMult) / 0.60).toFixed(1); // 60% K
  const water = (data.water * areaInAcres * seasonMult).toFixed(0);

  return (
    <Card title="Fertilizer & Water Guide" icon={FlaskConical} iconColor="#1565C0" accent="#1565C0">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
        <Field label="Land Area" value={area} onChange={setArea} icon={Tractor} />
        <Select label="Unit" value={unit} onChange={setUnit} options={[
          { value: "acre", label: "Acre" },
          { value: "bigha", label: "Bigha" },
          { value: "hectare", label: "Hectare" },
        ]} />
        <Select label="Crop" value={crop} onChange={setCrop} icon={Sprout} options={[
          { value: "rice", label: "🌾 Rice" },
          { value: "wheat", label: "🌿 Wheat" },
          { value: "corn", label: "🌽 Corn" },
          { value: "potato", label: "🥔 Potato" },
          { value: "jute", label: "🪢 Jute" },
          { value: "mustard", label: "🟡 Mustard" },
        ]} />
        <Select label="Season" value={season} onChange={setSeason} options={[
          { value: "kharif", label: "☀️ Kharif (Summer)" },
          { value: "rabi", label: "❄️ Rabi (Winter)" },
        ]} />
      </div>

      {/* Fertilizer results */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
        <div style={{ textAlign: "center", padding: "12px 8px", borderRadius: 12, background: "#E3F2FD", border: "1.5px solid #BBDEFB" }}>
          <div style={{ fontSize: 9, fontWeight: 800, color: "#1565C0", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Urea</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#1565C0", fontFamily: "'Space Grotesk', sans-serif" }}>{urea}</div>
          <div style={{ fontSize: 9, color: "#1565C0", fontWeight: 600 }}>kg</div>
        </div>
        <div style={{ textAlign: "center", padding: "12px 8px", borderRadius: 12, background: "#F3E5F5", border: "1.5px solid #E1BEE7" }}>
          <div style={{ fontSize: 9, fontWeight: 800, color: "#6A1B9A", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>TSP</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#6A1B9A", fontFamily: "'Space Grotesk', sans-serif" }}>{tsp}</div>
          <div style={{ fontSize: 9, color: "#6A1B9A", fontWeight: 600 }}>kg</div>
        </div>
        <div style={{ textAlign: "center", padding: "12px 8px", borderRadius: 12, background: "#FFF8E1", border: "1.5px solid #FFE082" }}>
          <div style={{ fontSize: 9, fontWeight: 800, color: "#E65100", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>MOP</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#E65100", fontFamily: "'Space Grotesk', sans-serif" }}>{mop}</div>
          <div style={{ fontSize: 9, color: "#E65100", fontWeight: 600 }}>kg</div>
        </div>
        <div style={{ textAlign: "center", padding: "12px 8px", borderRadius: 12, background: B.muted, border: `1.5px solid ${B.border}` }}>
          <div style={{ fontSize: 9, fontWeight: 800, color: B.foreground, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Water</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: B.primary, fontFamily: "'Space Grotesk', sans-serif" }}>{Number(water).toLocaleString()}</div>
          <div style={{ fontSize: 9, color: B.primary, fontWeight: 600 }}>mm/season</div>
        </div>
      </div>
      <p style={{ fontSize: 11, color: B.mutedFg, marginTop: 12, display: "flex", alignItems: "center", gap: 5 }}>
        <Info size={11} /> Based on DAE Bangladesh recommended doses. Adjust based on soil test.
      </p>
    </Card>
  );
}

/* ── Main Page ────────────────────────────────────────────────────── */
export default function CalculatorPage() {
  const [activeTab, setActiveTab] = useState("yield");

  const tabs = [
    { id: "yield",  label: "Yield Estimator",  icon: Sprout       },
    { id: "profit", label: "Profit & Loss",     icon: TrendingUp   },
    { id: "input",  label: "Fertilizer Guide",  icon: FlaskConical },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", maxWidth: 900, margin: "0 auto" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800;900&family=Space+Grotesk:wght@700;800;900&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px);} to{opacity:1;transform:translateY(0);} }
        .calc-tab { transition: background 0.15s, color 0.15s, box-shadow 0.15s, transform 0.1s; }
        .calc-tab:hover { transform: translateY(-1px); }
        .calc-tab:active { transform: scale(0.97); }
        input[type=number]::-webkit-inner-spin-button { opacity:0.4; }
        select option { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* ── Page header ────────────────────────────────────────────── */}
      <div style={{ marginBottom: 28, animation: "fadeUp 0.4s ease both" }}>
        {/* Live badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "4px 14px", borderRadius: 20, background: B.muted, border: `1.5px solid ${B.border}`, marginBottom: 12 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: B.primaryLight, animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: 10, fontWeight: 800, color: B.primary, textTransform: "uppercase", letterSpacing: "0.16em" }}>
            Farmer · Tools
          </span>
        </div>

        <h1 style={{ fontSize: 30, fontWeight: 900, color: B.foreground, letterSpacing: "-0.03em", margin: "0 0 6px", fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.15 }}>
          Farm{" "}
          <span style={{ color: B.primary, position: "relative", display: "inline-block" }}>
            Calculator
            <span style={{ position: "absolute", bottom: -2, left: 0, right: 0, height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${B.highlight}, transparent)` }} />
          </span>
        </h1>
        <p style={{ fontSize: 14, color: B.mutedFg, fontWeight: 500, margin: 0 }}>
          Estimate yields, calculate profits, and get input recommendations for your crops.
        </p>
      </div>

      {/* ── Tabs ───────────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, padding: "6px", borderRadius: 16, background: B.muted, border: `1.5px solid ${B.border}`, width: "fit-content" }}>
        {tabs.map(tab => {
          const Icon   = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button key={tab.id} className="calc-tab"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "9px 18px", borderRadius: 11, border: "none", cursor: "pointer",
                background:  active ? B.primary : "transparent",
                color:       active ? "#fff" : B.mutedFg,
                fontSize:    13, fontWeight: 800,
                boxShadow:   active ? `0 4px 14px rgba(46,125,50,0.28)` : "none",
                fontFamily:  "'DM Sans', sans-serif",
              }}>
              <Icon size={14} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Active calculator ──────────────────────────────────────── */}
      <div style={{ animation: "fadeUp 0.35s ease both" }} key={activeTab}>
        {activeTab === "yield"  && <YieldCalculator />}
        {activeTab === "profit" && <ProfitCalculator />}
        {activeTab === "input"  && <InputCalculator />}
      </div>

      {/* ── Quick tip ──────────────────────────────────────────────── */}
      <div style={{ marginTop: 24, padding: "14px 18px", borderRadius: 14, background: `linear-gradient(135deg, ${B.muted}, #fff)`, border: `1.5px solid ${B.border}`, display: "flex", alignItems: "flex-start", gap: 12, animation: "fadeUp 0.5s ease both" }}>
        <div style={{ padding: "7px 8px", borderRadius: 9, background: B.primary, flexShrink: 0 }}>
          <Leaf size={14} style={{ color: "#fff" }} />
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: B.foreground, marginBottom: 3 }}>💡 Pro Tip</div>
          <div style={{ fontSize: 12, color: B.mutedFg, lineHeight: 1.6 }}>
            For better accuracy, get a <strong>soil test</strong> done before applying fertilizers. Visit your nearest Upazila Agriculture Office for free soil testing services.
          </div>
        </div>
        <ArrowRight size={14} style={{ color: B.primary, flexShrink: 0, marginTop: 2 }} />
      </div>
    </div>
  );
}
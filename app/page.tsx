"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

/* ─── tokens ─────────────────────────────────────────────── */
const C = {
    black:       "#0A0A0A",
    blackSoft:   "#111111",
    surface:     "#161616",
    border:      "#222222",
    borderMid:   "#2E2E2E",
    white:       "#FFFFFF",
    whiteMuted:  "rgba(255,255,255,0.45)",
    whiteSubtle: "rgba(255,255,255,0.12)",
    orange:      "#E8621A",
    orangeDim:   "rgba(232,98,26,0.12)",
    green:       "#2EAA4A",
    greenDim:    "rgba(46,170,74,0.12)",
    greenDark:   "#1D7A33",
} as const;

/* ─── tiny hook: intersection observer ───────────────────── */
function useVisible(threshold = 0.15) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { threshold }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [threshold]);
    return { ref, visible };
}

/* ─── sub-components ─────────────────────────────────────── */

function Hero() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    useEffect(() => {
        const timers = [
            setTimeout(() => setStep(1), 300),
            setTimeout(() => setStep(2), 700),
            setTimeout(() => setStep(3), 1050),
            setTimeout(() => setStep(4), 1350),
            setTimeout(() => setStep(5), 1650),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    const words: { text: string; color: string }[] = [
        { text: "Sign.", color: C.orange },
        { text: "Speak.", color: C.white },
        { text: "Bridge.", color: C.green },
    ];

    return (
        <section style={{
            background: C.black,
            minHeight: "88vh",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            textAlign: "center", padding: "5rem 2rem 7rem",
            position: "relative", overflow: "hidden",
        }}>
            {/* subtle grid overlay */}
            <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`,
                backgroundSize: "60px 60px", opacity: 0.3,
            }} />
            {/* glow blobs */}
            <div style={{
                position: "absolute", top: "-100px", left: "50%", transform: "translateX(-50%)",
                width: "500px", height: "500px", borderRadius: "50%",
                background: `radial-gradient(circle, ${C.greenDim} 0%, transparent 70%)`,
                pointerEvents: "none",
            }} />
            <div style={{
                position: "absolute", bottom: "-60px", right: "12%",
                width: "340px", height: "340px", borderRadius: "50%",
                background: `radial-gradient(circle, ${C.orangeDim} 0%, transparent 70%)`,
                pointerEvents: "none",
            }} />

            {/* logo pop */}
            <div style={{
                opacity: step >= 1 ? 1 : 0,
                transform: step >= 1 ? "scale(1)" : "scale(0.75)",
                transition: "opacity 0.5s cubic-bezier(0.34,1.56,0.64,1), transform 0.5s cubic-bezier(0.34,1.56,0.64,1)",
                marginBottom: "2rem",
            }}>
                <Image src="/logo.jpg" alt="Vāksetu" width={320} height={90}
                       style={{ borderRadius: "22px", objectFit: "cover", display: "block" }} />
            </div>

            {/* mono label */}
            <div style={{
                fontFamily: "monospace", fontSize: "0.7rem",
                color: C.whiteMuted, letterSpacing: "0.14em",
                textTransform: "uppercase", marginBottom: "1.25rem",
                opacity: step >= 2 ? 1 : 0,
                transform: step >= 2 ? "translateY(0)" : "translateY(10px)",
                transition: "opacity 0.4s ease, transform 0.4s ease",
            }}>वाक् + सेतु &nbsp;·&nbsp; voice, bridged</div>

            {/* headline */}
            <h1 style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(3rem, 7vw, 5.5rem)",
                lineHeight: 1.06, letterSpacing: "-0.025em",
                margin: "0 0 1.5rem", maxWidth: "720px",
                display: "flex", gap: "0.3em", flexWrap: "wrap", justifyContent: "center",
            }}>
                {words.map((w, i) => (
                    <span key={w.text} style={{
                        color: w.color,
                        opacity: step >= 3 + i ? 1 : 0,
                        transform: step >= 3 + i ? "translateY(0)" : "translateY(20px)",
                        transition: "opacity 0.45s ease, transform 0.45s ease",
                        display: "inline-block",
                    }}>{w.text}</span>
                ))}
            </h1>

            {/* sub */}
            <p style={{
                fontSize: "1rem", color: C.whiteMuted, maxWidth: "420px",
                lineHeight: 1.75, margin: "0 0 2.75rem",
                opacity: step >= 5 ? 1 : 0,
                transform: step >= 5 ? "translateY(0)" : "translateY(12px)",
                transition: "opacity 0.45s ease, transform 0.45s ease",
            }}>
                Sign with your hands. Speak in your language.<br />
                Vāksetu makes sure nothing gets lost between the two.
            </p>

            {/* CTAs */}
            <div style={{
                display: "flex", gap: "0.75rem", alignItems: "center",
                opacity: step >= 5 ? 1 : 0,
                transition: "opacity 0.45s ease 0.1s",
            }}>
                <button
                    onClick={() => router.push("/home")}
                    style={{
                    background: C.green, color: C.white, border: "none",
                    padding: "0.7rem 1.75rem", borderRadius: "4px",
                    fontSize: "0.875rem", fontWeight: 500, cursor: "pointer",
                    fontFamily: "inherit", transition: "background 0.15s, transform 0.12s",
                }}
                        onMouseEnter={e => { e.currentTarget.style.background = C.greenDark; e.currentTarget.style.transform = "translateY(-1px)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = C.green; e.currentTarget.style.transform = "translateY(0)"; }}
                >Start translating →</button>
            </div>
        </section>
    );
}

function Divider() {
    return (
        <div style={{
            width: "1px", height: "64px", margin: "0 auto",
            background: `linear-gradient(to bottom, transparent, ${C.borderMid}, transparent)`,
        }} />
    );
}

function Bridge() {
    const { ref, visible } = useVisible();
    return (
        <div ref={ref} style={{
            padding: "6rem 2rem", maxWidth: "760px", margin: "0 auto", textAlign: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(28px)",
            transition: "opacity 0.75s ease, transform 0.75s ease",
        }}>
            <div style={{
                fontFamily: "monospace", fontSize: "0.65rem",
                color: C.orange, letterSpacing: "0.14em",
                textTransform: "uppercase", marginBottom: "1.5rem",
            }}>The name, the idea</div>
            <p style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(1.7rem, 3.5vw, 2.8rem)",
                color: C.white, lineHeight: 1.3, letterSpacing: "-0.01em",
            }}>
                <em style={{ color: C.orange, fontStyle: "italic" }}>Vāk</em> is voice.<br />
                <span style={{ color: C.green }}>Setu</span> is bridge.<br />
                We built the one that was missing.
            </p>
        </div>
    );
}

const FEATURES = [
    {
        icon: "🤝",
        title: "Sign to text",
        body: "Sign into your webcam. Vāksetu reads each gesture and composes a fluent English sentence — live, with no typing needed.",
        tag: "Live · Webcam",
        accent: C.orange,
        accentDim: C.orangeDim,
    },
    {
        icon: "🎤",
        title: "Speech to sign",
        body: "Speak naturally in any language. A 3D avatar signs back every word in Indian Sign Language — so conversations flow both ways.",
        tag: "Avatar · ISL",
        accent: C.green,
        accentDim: C.greenDim,
    },
    {
        icon: "🌏",
        title: "10+ Indian languages",
        body: "Translate and speak in Hindi, Tamil, Telugu, Bengali, and more — with a natural voice powered by Sarvam AI.",
        tag: "Multilingual · TTS",
        accent: C.white,
        accentDim: C.whiteSubtle,
    },
];

function Features() {
    const { ref, visible } = useVisible(0.1);
    return (
        <section style={{ padding: "4rem 2rem 7rem", maxWidth: "1060px", margin: "0 auto" }}>
            <div style={{
                fontFamily: "monospace", fontSize: "0.65rem",
                color: C.whiteMuted, letterSpacing: "0.14em",
                textTransform: "uppercase", textAlign: "center", marginBottom: "3rem",
            }}>What Vāksetu does</div>

            <div ref={ref} style={{
                display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
                border: `1px solid ${C.border}`, borderRadius: "8px", overflow: "hidden",
            }}>
                {FEATURES.map((f, i) => (
                    <div key={f.title} style={{
                        padding: "2.25rem 1.75rem",
                        borderLeft: i > 0 ? `1px solid ${C.border}` : "none",
                        background: C.surface,
                        opacity: visible ? 1 : 0,
                        transform: visible ? "translateY(0)" : "translateY(18px)",
                        transition: `opacity 0.5s ease ${i * 0.12}s, transform 0.5s ease ${i * 0.12}s, background 0.2s`,
                    }}
                         onMouseEnter={e => (e.currentTarget.style.background = "#1C1C1C")}
                         onMouseLeave={e => (e.currentTarget.style.background = C.surface)}
                    >
                        <div style={{
                            width: "38px", height: "38px", borderRadius: "6px",
                            background: f.accentDim, border: `1px solid ${f.accent}22`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "1.1rem", marginBottom: "1.25rem",
                        }}>{f.icon}</div>
                        <h3 style={{
                            fontFamily: "'DM Serif Display', serif",
                            fontSize: "1.2rem", color: C.white,
                            marginBottom: "0.6rem", lineHeight: 1.2,
                        }}>{f.title}</h3>
                        <p style={{ fontSize: "0.85rem", color: C.whiteMuted, lineHeight: 1.7 }}>{f.body}</p>
                        <span style={{
                            display: "inline-block", marginTop: "1.1rem",
                            fontFamily: "monospace", fontSize: "0.65rem",
                            color: f.accent, letterSpacing: "0.05em",
                        }}>{f.tag}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}

const STATS = [
    { num: "4.5M+", label: "deaf and hard-of-hearing people in India alone", color: C.orange },
    { num: "10+",  label: "Indian languages for real-time voice output",     color: C.green },
    { num: "<5s",  label: "average latency from gesture to text",             color: C.white },
];

function Stats() {
    const { ref, visible } = useVisible();
    return (
        <div ref={ref} style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1px", background: C.border,
            border: `1px solid ${C.border}`, borderRadius: "8px",
            margin: "0 2rem 5rem", overflow: "hidden",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(22px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
        }}>
            {STATS.map(s => (
                <div key={s.num} style={{
                    background: C.surface, padding: "2.5rem 2rem", textAlign: "center",
                }}>
                    <div style={{
                        fontFamily: "'DM Serif Display', serif",
                        fontSize: "2.75rem", color: s.color,
                        lineHeight: 1, letterSpacing: "-0.02em", marginBottom: "0.6rem",
                    }}>{s.num}</div>
                    <div style={{ fontSize: "0.8rem", color: C.whiteMuted, lineHeight: 1.6 }}>{s.label}</div>
                </div>
            ))}
        </div>
    );
}

function CtaSection() {
    const router = useRouter();
    const { ref, visible } = useVisible();
    return (
        <div ref={ref} style={{
            margin: "0 2rem 5rem",
            border: `1px solid ${C.border}`, borderRadius: "8px",
            overflow: "hidden",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(22px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
        }}>
            <div style={{
                background: C.blackSoft,
                padding: "5rem 3rem", textAlign: "center", position: "relative", overflow: "hidden",
            }}>
                {/* grid overlay */}
                <div style={{
                    position: "absolute", inset: 0, pointerEvents: "none",
                    backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`,
                    backgroundSize: "40px 40px", opacity: 0.4,
                }} />
                <div style={{
                    position: "absolute", top: "-80px", left: "50%", transform: "translateX(-50%)",
                    width: "400px", height: "300px",
                    background: `radial-gradient(ellipse, ${C.greenDim} 0%, transparent 70%)`,
                    pointerEvents: "none",
                }} />

                <Image src="/logo.jpg" alt="Vāksetu" width={180} height={52}
                       style={{ borderRadius: "14px", objectFit: "cover", marginBottom: "1.5rem", position: "relative" }} />

                <h2 style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
                    color: C.white, letterSpacing: "-0.02em",
                    marginBottom: "0.75rem", position: "relative",
                }}>
                    Every conversation deserves<br />
                    to be <span style={{ color: C.green }}>understood</span>.
                </h2>
                <p style={{
                    color: C.whiteMuted, fontSize: "0.9rem",
                    lineHeight: 1.7, marginBottom: "2.25rem", position: "relative",
                }}>
                    Open Vāksetu and start bridging sign and speech — free, right now.
                </p>
                <button
                    onClick={() => router.push("/home")}
                    style={{
                    background: C.white, color: C.black, border: "none",
                    padding: "0.8rem 2.25rem", borderRadius: "4px",
                    fontSize: "0.9rem", fontWeight: 600, cursor: "pointer",
                    fontFamily: "inherit", position: "relative",
                    transition: "opacity 0.15s, transform 0.12s",
                }}
                        onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                        onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
                >Open Vāksetu →</button>
            </div>
        </div>
    );
}

function Footer() {
    return (
        <footer style={{
            padding: "1.5rem 2.5rem",
            borderTop: `1px solid ${C.border}`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: C.black,
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Image src="/logo.jpg" alt="Vāksetu" width={22} height={22}
                       style={{ borderRadius: "4px", objectFit: "cover" }} />
                <span style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: "0.9rem", color: C.whiteMuted,
                }}>Vāksetu</span>
            </div>
            <span style={{
                fontFamily: "monospace", fontSize: "0.65rem",
                color: C.whiteMuted, letterSpacing: "0.08em", fontStyle: "italic",
            }}>वाक् + सेतु — voice, bridged.</span>
        </footer>
    );
}

/* ─── page ───────────────────────────────────────────────── */
export default function LandingPage() {
    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #0A0A0A; font-family: Inter, system-ui, sans-serif; }
        @media (max-width: 680px) {
          .feat-grid { grid-template-columns: 1fr !important; }
          .stat-grid { grid-template-columns: 1fr !important; }
          .nav-links { display: none !important; }
        }
      `}</style>
            <div style={{ background: C.black, minHeight: "100vh", color: C.white }}>
                <Hero />
                <Divider />
                <Bridge />
                <Divider />
                <Features />
                <Stats />
                <CtaSection />
                <Footer />
            </div>
        </>
    );
}
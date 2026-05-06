"use client";

import { useState, useEffect, useCallback } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Guest } from "@/types/rsvp";

const WEDDING_DATE = new Date("2026-06-13T18:00:00");
const MAPS_URL = "https://maps.app.goo.gl/RhMK7Lg8gLvHmxhR9";

type Petal = { id: number; left: string; delay: string; duration: string; size: string; rotate: string; drift: string; isGreen: boolean; };

function randomPetals(): Petal[] {
  return Array.from({ length: 24 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 12}s`,
    duration: `${7 + Math.random() * 9}s`,
    size: `${7 + Math.random() * 13}px`,
    rotate: `${Math.random() * 360}deg`,
    drift: `${(Math.random() - 0.5) * 260}px`,
    isGreen: Math.random() > 0.5,
  }));
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function useCountdown(target: number) {
  const [diff, setDiff] = useState(target - Date.now());
  useEffect(() => {
    const id = setInterval(() => setDiff(target - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);
  const t = Math.max(0, diff);
  return {
    days:  Math.floor(t / 86400000),
    hours: Math.floor((t % 86400000) / 3600000),
    mins:  Math.floor((t % 3600000) / 60000),
    secs:  Math.floor((t % 60000) / 1000),
  };
}

// Single observer for all [data-reveal] elements
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

// helper so JSX stays clean
const r = (delay?: number) =>
  ({ "data-reveal": "", ...(delay ? { "data-delay": String(delay) } : {}) } as Record<string, string>);

export default function InvitationPage() {
  useScrollReveal();

  const [petals, setPetals] = useState<Petal[]>([]);
  useEffect(() => { setPetals(randomPetals()); }, []);

  const [attending, setAttending]   = useState<"yes" | "no" | null>(null);
  const [firstName, setFirstName]   = useState("");
  const [lastName, setLastName]     = useState("");
  const [guests, setGuests]         = useState<Guest[]>([]);
  const [submitted, setSubmitted]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState("");

  const { days, hours, mins, secs } = useCountdown(WEDDING_DATE.getTime());

  const addGuest = useCallback(() => {
    setGuests(prev => [...prev, { id: crypto.randomUUID(), firstName: "", lastName: "" }]);
  }, []);

  const removeGuest = useCallback((id: string) => {
    setGuests(prev => prev.filter(g => g.id !== id));
  }, []);

  const updateGuest = useCallback((id: string, field: "firstName" | "lastName", value: string) => {
    setGuests(prev => prev.map(g => g.id === id ? { ...g, [field]: value } : g));
  }, []);

  const canSubmit =
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    attending !== null &&
    (attending === "no" || guests.every(g => g.firstName.trim() !== "" && g.lastName.trim() !== ""));

  async function handleSubmit() {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      await addDoc(collection(db, "rsvps"), {
        id: crypto.randomUUID(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        attending: attending === "yes",
        guests: attending === "yes"
          ? guests.map(g => ({ id: g.id, firstName: g.firstName.trim(), lastName: g.lastName.trim() }))
          : [],
        submittedAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {petals.map(p => (
        <div
          key={p.id}
          className={`petal ${p.isGreen ? "green" : "blue"}`}
          style={{
            left: p.left, width: p.size, height: p.size,
            animationDelay: p.delay, animationDuration: p.duration,
            ["--pd" as string]: p.drift,
            transform: `rotate(${p.rotate})`,
          }}
        />
      ))}

      <div className="page">

        {/* ── Hero (CSS animations, no observer needed) ── */}
        <section className="hero">
          <p className="invite-label">You Are Cordially Invited</p>
          <div>
            <div className="couple-names n1">Taleh</div>
            <span className="couple-amp">&amp;</span>
            <div className="couple-names n2">Alaviyya</div>
          </div>
          <div className="hero-divider">
            <div className="divider-dot" /><div className="divider-dot" /><div className="divider-dot" />
          </div>
          <div className="hero-date-block">
            <span className="hero-date-main">13 June 2026</span>
            <span className="hero-date-time">Saturday · 6:00 PM</span>
          </div>
          <p className="hero-venue">Mala Praga · Babek Avenue 56 · Baku</p>
          <div className="scroll-hint">Scroll</div>
        </section>

        {/* ── Countdown ── */}
        <div className="section">
          <p className="section-eyebrow" {...r()}>Time Remaining</p>
          <h2 className="section-title" {...r(1)}>Until We Say &ldquo;I Do&rdquo;</h2>
          <div className="countdown">
            <div className="cd-unit" {...r(2)}>
              <div className="cd-flip"><span key={days}  className="cd-number d">{pad(days)}</span></div>
              <span className="cd-label">Days</span>
            </div>
            <div className="cd-unit" {...r(3)}>
              <div className="cd-flip"><span key={hours} className="cd-number h">{pad(hours)}</span></div>
              <span className="cd-label">Hours</span>
            </div>
            <div className="cd-unit" {...r(4)}>
              <div className="cd-flip"><span key={mins}  className="cd-number m">{pad(mins)}</span></div>
              <span className="cd-label">Minutes</span>
            </div>
            <div className="cd-unit" {...r(5)}>
              <div className="cd-flip"><span key={secs}  className="cd-number s">{pad(secs)}</span></div>
              <span className="cd-label">Seconds</span>
            </div>
          </div>
        </div>

        {/* ── Venue ── */}
        <div className="section">
          <p className="section-eyebrow" {...r()}>Location · Baku, Azerbaijan</p>
          <h2 className="section-title" style={{ marginBottom: 16 }} {...r(1)}>Mala Praga Restaurant</h2>
          <p className="venue-addr" {...r(2)}>
            Babek Avenue 56, Baku, Azerbaijan — a landmark of elegance with warm banquet halls
            and open terraces, the perfect setting for an unforgettable evening.
          </p>
          <div {...r(3)}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1224.6015997405939!2d49.94108782860441!3d40.392168398207765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x403063160f74f4e7%3A0xa9bfff29fc4eefcb!2sMala%20Praga%20restoran%C4%B1!5e0!3m2!1sen!2saz!4v1778092417350!5m2!1sen!2saz"
              className="venue-map"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mala Praga Restaurant"
            />
          </div>
          <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="venue-map-btn" {...r(4)}>
            Open in Google Maps
          </a>
        </div>

        {/* ── RSVP ── */}
        <div className="section">
          <p className="section-eyebrow" {...r()}>Kindly Reply By 1 June 2026</p>
          <h2 className="section-title" {...r(1)}>RSVP</h2>

          {!submitted ? (
            <>
              <p className="rsvp-notice" {...r(2)}>
                Your confirmation is important to us — it helps us prepare the guest list
                and ensure a place for you on this special day.
              </p>

              <div className="field-row" {...r(3)}>
                <div>
                  <label className="field-label">First Name</label>
                  <input className="field-input" placeholder="First name" value={firstName} onChange={e => setFirstName(e.target.value)} />
                </div>
                <div>
                  <label className="field-label">Last Name</label>
                  <input className="field-input" placeholder="Last name" value={lastName} onChange={e => setLastName(e.target.value)} />
                </div>
              </div>

              <div className="field" {...r(4)}>
                <label className="field-label">Will you attend?</label>
                <div className="attend-toggle">
                  <button className={`attend-btn yes ${attending === "yes" ? "active" : ""}`} onClick={() => setAttending("yes")}>
                    Joyfully Accepts
                  </button>
                  <button className={`attend-btn no ${attending === "no" ? "active" : ""}`} onClick={() => { setAttending("no"); setGuests([]); }}>
                    Regretfully Declines
                  </button>
                </div>
              </div>

              {attending === "yes" && (
                <div className="guests-area" data-reveal data-delay="5">
                  <div className="guests-top">
                    <span className="guests-heading">Additional Guests</span>
                    <button className="add-guest-btn" onClick={addGuest}>+ Add Guest</button>
                  </div>
                  {guests.length === 0 && <p className="guests-empty">Coming alone? Leave this empty.</p>}
                  {guests.map((g, i) => (
                    <div key={g.id} className="guest-entry">
                      <div>
                        <label className="field-label">Guest {i + 1} · First</label>
                        <input className="field-input" placeholder="First name" value={g.firstName} onChange={e => updateGuest(g.id, "firstName", e.target.value)} />
                      </div>
                      <div>
                        <label className="field-label">Last Name</label>
                        <input className="field-input" placeholder="Last name" value={g.lastName} onChange={e => updateGuest(g.id, "lastName", e.target.value)} />
                      </div>
                      <button className="remove-guest" onClick={() => removeGuest(g.id)}>×</button>
                    </div>
                  ))}
                </div>
              )}

              {error && <p className="form-error">{error}</p>}

              <div {...r(5)}>
                <button className="submit-btn" onClick={handleSubmit} disabled={!canSubmit || submitting}>
                  {submitting ? "Sending..." : "Send Response"}
                </button>
              </div>
            </>
          ) : (
            <div className="confirmation" data-reveal>
              <span className="confirmation-icon">{attending === "yes" ? "🎉" : "🌹"}</span>
              <span className={`confirmation-title ${attending === "yes" ? "yes" : "no"}`}>
                {attending === "yes" ? `See You There, ${firstName}!` : `Thank You, ${firstName}`}
              </span>
              <p className="confirmation-body">
                {attending === "yes"
                  ? `We are so excited to celebrate with you${guests.length > 0 ? ` and your ${guests.length === 1 ? "guest" : `${guests.length} guests`}` : ""} on June 13th at Mala Praga.`
                  : "We are sorry you cannot make it. You will be in our hearts on this beautiful day."}
              </p>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <footer className="footer">
          <span className="footer-names" {...r()}>With All Our Love</span>
          <span className="footer-detail" {...r(1)}>Taleh &amp; Alaviyya · 13 June 2026 · Mala Praga, Baku</span>
        </footer>

      </div>
    </>
  );
}

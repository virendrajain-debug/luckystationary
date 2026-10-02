import { useState } from "react";

const PHONE = "919424068398";

const TOPICS = [
  "School / Office Supplies",
  "Pens, Pencils & Files",
  "Art & Craft Materials",
  "Sports Gear (balls, rackets…)",
  "Games, Toys & Gifts",
  "Bulk / Wholesale Order",
  "Something else",
];

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    topic: TOPICS[0],
    message: "",
  });
  const [err, setErr] = useState("");
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = form.name.trim();
    const phone = form.phone.replace(/\D/g, "");
    const message = form.message.trim();

    if (name.length < 2) return setErr("Please enter your name.");
    if (phone.length < 10) return setErr("Please enter a valid 10-digit phone number.");
    if (message.length < 3) return setErr("Please tell us what you need.");

    setErr("");

    const text = [
      `Hi Lucky Stationery & Sports! 👋`,
      ``,
      `*Name:* ${name}`,
      `*Phone:* ${form.phone.trim()}`,
      `*Needed:* ${form.topic}`,
      ``,
      `*Query:* ${message}`,
    ].join("\n");

    setSent(true);
    window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  };

  if (sent) {
    return (
      <div className="card p-8 text-center" role="status" aria-live="polite">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-wa/15 text-wa-deep">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="mt-5 text-2xl font-extrabold">WhatsApp is opening…</h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
          Your message is ready and pre-filled. Just hit send in WhatsApp and we'll
          get back to you shortly.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button type="button" className="btn btn-ghost" onClick={() => setSent(false)}>
            Send another query
          </button>
          <a
            className="btn btn-wa"
            href={`https://wa.me/${PHONE}`}
            target="_blank"
            rel="noopener"
          >
            Open WhatsApp manually
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card p-6 sm:p-8" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="lbl">Your name</span>
          <input
            className="inp"
            type="text"
            name="name"
            autoComplete="name"
            placeholder="e.g. Rahul Sharma"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            required
          />
        </label>

        <label className="block">
          <span className="lbl">Phone number</span>
          <input
            className="inp"
            type="tel"
            name="phone"
            inputMode="tel"
            autoComplete="tel"
            placeholder="10-digit mobile number"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            required
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="lbl">What do you need?</span>
        <select
          className="inp"
          name="topic"
          value={form.topic}
          onChange={(e) => set("topic", e.target.value)}
        >
          {TOPICS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>

      <label className="mt-4 block">
        <span className="lbl">Your query</span>
        <textarea
          className="inp min-h-32 resize-y"
          name="message"
          rows={4}
          placeholder="Tell us the items, quantity, brand or anything else…"
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          required
        />
      </label>

      {err && (
        <p className="mt-3 rounded-xl bg-coral/10 px-4 py-2.5 text-sm font-semibold text-coral" role="alert">
          {err}
        </p>
      )}

      <button type="submit" className="btn btn-wa mt-6 w-full !py-4 text-base">
        <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.3-.7.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4 0-.5.2-.7l.4-.5c.1-.2.1-.3 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2.1 3.2 5 4.4.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2l-.4-.4z" />
        </svg>
        Send query on WhatsApp
      </button>

      <p className="mt-3 text-center text-xs text-ink-faint">
        We reply fast during shop hours · 9:00 AM – 9:00 PM, all week
      </p>

      <style>{`
        .lbl {
          display: block;
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-ink-faint);
          margin-bottom: 0.45rem;
        }
        .inp {
          width: 100%;
          border-radius: 0.95rem;
          border: 1.5px solid rgb(15 23 42 / 0.1);
          background: rgb(255 255 255 / 0.9);
          padding: 0.85rem 1rem;
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--color-ink);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          outline: none;
        }
        .inp::placeholder { color: var(--color-ink-faint); font-weight: 400; }
        .inp:focus {
          border-color: var(--color-royal);
          box-shadow: 0 0 0 4px rgb(37 99 235 / 0.14);
        }
        select.inp {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          padding-right: 2.6rem;
        }
      `}</style>
    </form>
  );
}

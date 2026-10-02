import { useId, useState } from "react";

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

type Errors = { name?: string; phone?: string; message?: string };

export default function ContactForm() {
  const uid = useId();
  const [form, setForm] = useState({ name: "", phone: "", topic: TOPICS[0], message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const set = (k: keyof typeof form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (form.name.trim().length < 2) e.name = "Please enter your name (2+ characters).";
    if (form.phone.replace(/\D/g, "").length < 10)
      e.phone = "Enter a valid 10-digit mobile number.";
    if (form.message.trim().length < 3)
      e.message = "Tell us what you need — a few words is enough.";
    return e;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) {
      // move focus to first invalid field
      const first = Object.keys(e)[0];
      document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }

    const text = [
      "Hello Lucky Stationery & Sports!",
      "",
      `Name: ${form.name.trim()}`,
      `Phone: ${form.phone.trim()}`,
      `Needed: ${form.topic}`,
      "",
      `Query: ${form.message.trim()}`,
    ].join("\n");

    setStatus("sending");
    const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`;

    // brief "sending" state so the action reads as intentional, then hand off
    window.setTimeout(() => {
      setStatus("sent");
      window.open(url, "_blank", "noopener");
    }, 600);
  };

  /* ---------------- empty / sent state ---------------- */
  if (status === "sent") {
    return (
      <div className="card p-6 sm:p-8" role="status" aria-live="polite">
        <div className="flex items-start gap-3 border-b-2 border-ink pb-5">
          <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center border-[1.5px] border-ink bg-wa font-mono text-sm font-bold">
            ✓
          </span>
          <div>
            <h3 className="font-display text-xl leading-tight font-extrabold">
              WhatsApp is opening…
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
              Your query is pre-filled and addressed to{" "}
              <span className="font-mono font-bold">+91 94240 68398</span>. Press send
              in WhatsApp and we'll reply during shop hours.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => {
              setForm({ name: "", phone: "", topic: TOPICS[0], message: "" });
              setStatus("idle");
            }}
          >
            Write another query
          </button>
          <a
            className="btn btn-wa btn-sm"
            href={`https://wa.me/${PHONE}`}
            target="_blank"
            rel="noopener"
          >
            Open WhatsApp manually
          </a>
        </div>

        <p className="mt-5 font-mono text-[11px] tracking-widest text-ink-faint uppercase">
          Didn't see WhatsApp? Disable popup blocking for this page.
        </p>
      </div>
    );
  }

  /* ---------------- form ---------------- */
  const errList = Object.entries(errors).filter(([, v]) => v) as [string, string][];

  return (
    <form onSubmit={submit} className="card p-6 sm:p-8" noValidate aria-describedby={errList.length ? `${uid}-errors` : undefined}>
      <div className="flex items-baseline justify-between gap-3 border-b-2 border-ink pb-4">
        <h3 className="font-display text-xl font-extrabold">Query form</h3>
        <span className="label">→ WhatsApp</span>
      </div>

      {/* error summary */}
      {errList.length > 0 && (
        <div
          id={`${uid}-errors`}
          role="alert"
          className="mt-5 border-l-4 border-signal bg-signal/8 px-4 py-3"
        >
          <p className="font-mono text-[11px] font-bold tracking-widest text-signal uppercase">
            {errList.length} field{errList.length > 1 ? "s" : ""} need{errList.length > 1 ? "" : "s"} attention
          </p>
          <ul className="mt-1.5 space-y-0.5 text-sm font-semibold">
            {errList.map(([k, v]) => (
              <li key={k}>— {v}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label block" htmlFor={`${uid}-name`}>
            Your name <span className="text-signal">*</span>
          </label>
          <input
            id={`${uid}-name`}
            className="field mt-1"
            type="text"
            name="name"
            autoComplete="name"
            placeholder="e.g. Rahul Sharma"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            aria-invalid={errors.name ? "true" : "false"}
            aria-describedby={errors.name ? `${uid}-name-err` : undefined}
            required
          />
          {errors.name && (
            <p id={`${uid}-name-err`} className="mt-1.5 font-mono text-[11px] font-bold text-signal">
              ↳ {errors.name}
            </p>
          )}
        </div>

        <div>
          <label className="label block" htmlFor={`${uid}-phone`}>
            Phone number <span className="text-signal">*</span>
          </label>
          <input
            id={`${uid}-phone`}
            className="field mt-1"
            type="tel"
            name="phone"
            inputMode="tel"
            autoComplete="tel"
            placeholder="10-digit mobile"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            aria-invalid={errors.phone ? "true" : "false"}
            aria-describedby={errors.phone ? `${uid}-phone-err` : undefined}
            required
          />
          {errors.phone && (
            <p id={`${uid}-phone-err`} className="mt-1.5 font-mono text-[11px] font-bold text-signal">
              ↳ {errors.phone}
            </p>
          )}
        </div>
      </div>

      <div className="mt-5">
        <label className="label block" htmlFor={`${uid}-topic`}>
          What do you need?
        </label>
        <select
          id={`${uid}-topic`}
          className="field mt-1"
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
      </div>

      <div className="mt-5">
        <label className="label block" htmlFor={`${uid}-message`}>
          Your query <span className="text-signal">*</span>
        </label>
        <textarea
          id={`${uid}-message`}
          className="field mt-1 min-h-28 resize-y"
          name="message"
          rows={4}
          placeholder="Items, quantity, brand… e.g. “12 Classmate notebooks + 4 setStatein pens”"
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          aria-invalid={errors.message ? "true" : "false"}
          aria-describedby={errors.message ? `${uid}-message-err` : undefined}
          required
        />
        {errors.message && (
          <p id={`${uid}-message-err`} className="mt-1.5 font-mono text-[11px] font-bold text-signal">
            ↳ {errors.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-wa btn-block mt-7 !py-4 text-[15px]"
        disabled={status === "sending"}
        aria-busy={status === "sending"}
      >
        {status === "sending" ? (
          <>
            <span className="spinner" aria-hidden="true" />
            Opening WhatsApp…
          </>
        ) : (
          <>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.3-.7.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4 0-.5.2-.7l.4-.5c.1-.2.1-.3 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2.1 3.2 5 4.4.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2l-.4-.4z" />
            </svg>
            Send query on WhatsApp
          </>
        )}
      </button>

      <p className="mt-3 text-center font-mono text-[11px] tracking-wide text-ink-faint uppercase">
        Replies within shop hours · 09:00–21:00 daily
      </p>
    </form>
  );
}

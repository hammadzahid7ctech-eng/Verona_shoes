import { useState } from 'react';
import {
  Mail, Phone, MapPin, MessageSquare, Send, Clock, Loader2, CheckCircle2,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { PageHeader } from '@/components/SectionHeader';
import { BRAND } from '@/lib/siteData';
import { classNames } from '@/lib/format';

export function ContactPage() {
  const { showToast } = useStore();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const setField = (k: string, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: '' }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.subject.trim()) errs.subject = 'Subject is required';
    if (!form.message.trim()) errs.message = 'Message is required';
    else if (form.message.trim().length < 10) errs.message = 'Message is too short';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      setSent(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      showToast('Message sent! We will get back to you soon.', 'success');
    }, 1200);
  };

  const contactCards = [
    { icon: Phone, label: 'Call Us', value: BRAND.phone, sub: 'Mon - Sat, 9am to 8pm' },
    { icon: Mail, label: 'Email Us', value: BRAND.email, sub: 'We reply within 24 hours' },
    { icon: MapPin, label: 'Visit Us', value: BRAND.address, sub: 'Liberty Market, Lahore' },
  ];

  return (
    <div>
      <PageHeader title="Get in Touch" subtitle="Questions about an order, sizing, or anything else? We're here to help.">
        <div className="mb-4"><Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Contact' }]} /></div>
      </PageHeader>

      <div className="mx-auto max-w-8xl px-4 py-12 lg:px-8">
        {/* Contact cards */}
        <div className="grid gap-5 sm:grid-cols-3">
          {contactCards.map((c, i) => (
            <div
              key={c.label}
              className="rounded-2xl bg-white p-6 text-center ring-1 ring-ink-200/70 transition hover:shadow-lg animate-fadeUp"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-ink-950 text-gold-400">
                <c.icon size={24} />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-ink-950">{c.label}</h3>
              <p className="mt-1 text-sm font-medium text-ink-800">{c.value}</p>
              <p className="mt-0.5 text-xs text-ink-500">{c.sub}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* Form */}
          <div className="rounded-2xl bg-white p-6 ring-1 ring-ink-200/70 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <MessageSquare size={24} className="text-gold-600" />
              <h2 className="font-display text-2xl font-bold text-ink-950">Send us a message</h2>
            </div>

            {sent ? (
              <div className="flex flex-col items-center py-12 text-center animate-scaleIn">
                <div className="grid h-20 w-20 place-items-center rounded-full bg-accent-100 text-accent-600">
                  <CheckCircle2 size={44} />
                </div>
                <h3 className="mt-5 font-display text-2xl font-bold text-ink-950">Message Sent!</h3>
                <p className="mt-2 max-w-sm text-ink-600">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                <button
                  onClick={() => setSent(false)}
                  className="btn btn-outline mt-6 px-6 py-3"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="label">Your Name</label>
                    <input
                      value={form.name}
                      onChange={(e) => setField('name', e.target.value)}
                      className={classNames('input', errors.name && 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/10')}
                      placeholder="e.g. Ayesha Khan"
                    />
                    {errors.name && <p className="mt-1 text-xs text-danger-600">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="label">Email Address</label>
                    <input
                      value={form.email}
                      onChange={(e) => setField('email', e.target.value)}
                      className={classNames('input', errors.email && 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/10')}
                      placeholder="you@example.com"
                    />
                    {errors.email && <p className="mt-1 text-xs text-danger-600">{errors.email}</p>}
                  </div>
                </div>
                <div>
                  <label className="label">Subject</label>
                  <input
                    value={form.subject}
                    onChange={(e) => setField('subject', e.target.value)}
                    className={classNames('input', errors.subject && 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/10')}
                    placeholder="How can we help?"
                  />
                  {errors.subject && <p className="mt-1 text-xs text-danger-600">{errors.subject}</p>}
                </div>
                <div>
                  <label className="label">Message</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setField('message', e.target.value)}
                    rows={5}
                    className={classNames('input resize-none', errors.message && 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/10')}
                    placeholder="Tell us more…"
                  />
                  {errors.message && <p className="mt-1 text-xs text-danger-600">{errors.message}</p>}
                </div>
                <button type="submit" disabled={sending} className="btn btn-primary px-8 py-3.5">
                  {sending ? (<><Loader2 size={18} className="animate-spin" /> Sending…</>) : (<><Send size={16} /> Send Message</>)}
                </button>
              </form>
            )}
          </div>

          {/* Side: hours + FAQ */}
          <div className="space-y-6">
            <div className="rounded-2xl bg-ink-950 p-6 text-white">
              <h3 className="flex items-center gap-2 font-display text-lg font-bold">
                <Clock size={20} className="text-gold-400" /> Business Hours
              </h3>
              <div className="mt-4 space-y-2.5 text-sm">
                {[
                  ['Monday - Friday', '9:00 AM - 8:00 PM'],
                  ['Saturday', '10:00 AM - 6:00 PM'],
                  ['Sunday', 'Closed'],
                ].map(([d, h]) => (
                  <div key={d} className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-ink-300">{d}</span>
                    <span className="font-medium">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 ring-1 ring-ink-200/70">
              <h3 className="font-display text-lg font-bold text-ink-950">Quick Questions</h3>
              <div className="mt-4 space-y-4">
                {[
                  { q: 'How long does delivery take?', a: '3-5 business days across Pakistan.' },
                  { q: 'What is your return policy?', a: '7-day easy returns on unworn shoes.' },
                  { q: 'Do you offer Cash on Delivery?', a: 'Yes, COD is available nationwide.' },
                  { q: 'How do I track my order?', a: 'Visit the My Orders page to see live status.' },
                ].map((f) => (
                  <details key={f.q} className="group">
                    <summary className="flex cursor-pointer items-center justify-between text-sm font-medium text-ink-900">
                      {f.q}
                      <span className="text-ink-400 transition group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-2 text-sm text-ink-600">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

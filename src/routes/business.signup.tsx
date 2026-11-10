import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { StatusBadge } from "@/components/corp/corp-shell";
import { BUSINESS_TYPES, COUNTRIES, verificationDocs } from "@/lib/rimbers-data";
import { useBusinessProfile } from "@/lib/use-business-profile";
import { supabase } from "@/lib/supabase";
import { Check, Clock, FileText, MapPin, ShieldAlert, Upload, XCircle } from "lucide-react";

export const Route = createFileRoute("/business/signup")({
  head: () => ({
    meta: [
      { title: "Corporate Sign Up — Register your business on Rimbers Trip" },
      {
        name: "description",
        content:
          "Four-step corporate registration for Rimbers Trip: business account, business information, location and document verification.",
      },
      { property: "og:title", content: "Corporate Sign Up — Rimbers Trip" },
      {
        property: "og:description",
        content: "Register your travel business in four guided steps.",
      },
    ],
  }),
  ssr: false,
  component: SignupPage,
});

const STEPS = ["Business Account", "Business Information", "Business Location", "Verification"];

function StatusScreen({
  icon,
  title,
  body,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="surface-card w-full max-w-md p-8 text-center">
          {icon}
          <h1 className="mt-4 text-xl font-bold">{title}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
          {action}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function SignInGate() {
  const redirectTarget =
    typeof window !== "undefined"
      ? window.location.pathname + window.location.search
      : "/business/signup";

  return (
    <StatusScreen
      icon={<div className="mx-auto h-10 w-10 rounded-full bg-primary/10" />}
      title="Sign in to list your business"
      body="Create your account first, then register your travel business."
      action={
        <Button asChild size="lg" className="mt-6 w-full">
          <a href={`/sign-in?redirect=${encodeURIComponent(redirectTarget)}&intent=business`}>
            Sign in to continue
          </a>
        </Button>
      }
    />
  );
}

function AlreadyInUseScreen() {
  async function useDifferentAccount() {
    await supabase.auth.signOut();
    window.location.assign(
      `/sign-in?redirect=${encodeURIComponent("/business/signup")}&intent=business`,
    );
  }

  return (
    <StatusScreen
      icon={<ShieldAlert className="mx-auto h-10 w-10 text-destructive" />}
      title="This account is already in use"
      body="You're signed in with a Google account that's already registered as a customer. Business accounts need a separate Google account — please sign in with a different one."
      action={
        <Button size="lg" className="mt-6 w-full" onClick={useDifferentAccount}>
          Use a different account
        </Button>
      }
    />
  );
}

function PendingReviewScreen() {
  return (
    <StatusScreen
      icon={<Clock className="mx-auto h-10 w-10 text-primary" />}
      title="Your business is under review"
      body="Thanks for registering! Our team is reviewing your submission. You'll be able to manage your listings here as soon as an admin approves your account."
    />
  );
}

function RejectedScreen() {
  return (
    <StatusScreen
      icon={<XCircle className="mx-auto h-10 w-10 text-destructive" />}
      title="Registration not approved"
      body="Your business registration wasn't approved. If you think this is a mistake, please contact Rimbers Trip support."
    />
  );
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function Native({
  options,
  ...props
}: { options: string[] } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <option value="">Select…</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

type FormState = {
  businessName: string;
  contactEmail: string;
  phone: string;
  accountCountry: string;
  businessType: string;
  legalName: string;
  displayName: string;
  category: string;
  licenseNumber: string;
  taxInfo: string;
  website: string;
  businessPhone: string;
  businessEmail: string;
  description: string;
  country: string;
  city: string;
  address: string;
  postalCode: string;
  mapLink: string;
  latitude: string;
  longitude: string;
  consent: boolean;
};

const EMPTY_FORM: FormState = {
  businessName: "",
  contactEmail: "",
  phone: "",
  accountCountry: "",
  businessType: "hotel",
  legalName: "",
  displayName: "",
  category: "",
  licenseNumber: "",
  taxInfo: "",
  website: "",
  businessPhone: "",
  businessEmail: "",
  description: "",
  country: "",
  city: "",
  address: "",
  postalCode: "",
  mapLink: "",
  latitude: "",
  longitude: "",
  consent: false,
};

function RegistrationForm({ ownerId, onSubmitted }: { ownerId: string; onSubmitted: () => void }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit() {
    if (!form.businessName.trim()) {
      setError("Business name is required.");
      setStep(0);
      return;
    }
    if (!form.consent) {
      setError("Please confirm the authorisation checkbox before submitting.");
      return;
    }

    setError(null);
    setSubmitting(true);

    const { error: profileError } = await supabase
      .from("profiles")
      .insert({ user_id: ownerId, role: "business" });

    if (profileError) {
      setError(profileError.message);
      setSubmitting(false);
      return;
    }

    const { error: businessError } = await supabase.from("businesses").insert({
      owner_id: ownerId,
      business_name: form.businessName.trim(),
      business_email: form.businessEmail.trim() || form.contactEmail.trim() || null,
      phone: form.businessPhone.trim() || form.phone.trim() || null,
      country: form.country || form.accountCountry || null,
      business_type: form.businessType || null,
      legal_name: form.legalName.trim() || null,
      display_name: form.displayName.trim() || null,
      category: form.category || null,
      license_number: form.licenseNumber.trim() || null,
      tax_info: form.taxInfo.trim() || null,
      website: form.website.trim() || null,
      description: form.description.trim() || null,
      address: form.address.trim() || null,
      city: form.city.trim() || null,
      postal_code: form.postalCode.trim() || null,
      map_link: form.mapLink.trim() || null,
      latitude: form.latitude.trim() || null,
      longitude: form.longitude.trim() || null,
    });

    setSubmitting(false);

    if (businessError) {
      setError(businessError.message);
      return;
    }

    onSubmitted();
  }

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Register a business account</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Step {step + 1} of 4 — {STEPS[step]}
      </p>

      <ol className="mt-6 grid gap-2 sm:grid-cols-4">
        {STEPS.map((s, i) => (
          <li
            key={s}
            className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${
              i === step
                ? "border-primary bg-accent font-medium text-accent-foreground"
                : i < step
                  ? "border-success/40 bg-success/10 text-success"
                  : "text-muted-foreground"
            }`}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full border text-xs">
              {i < step ? <Check className="h-3 w-3" /> : i + 1}
            </span>
            {s}
          </li>
        ))}
      </ol>

      <div className="surface-card mt-6 p-6">
        {step === 0 ? (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Business name">
              <Input
                placeholder="Rimbers Hospitality Group"
                value={form.businessName}
                onChange={(e) => update("businessName", e.target.value)}
              />
            </Field>
            <Field label="Business email">
              <Input
                type="email"
                placeholder="corporate@yourbusiness.com"
                value={form.contactEmail}
                onChange={(e) => update("contactEmail", e.target.value)}
              />
            </Field>
            <Field label="Phone number">
              <Input
                placeholder="+92 300 0000000"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
            </Field>
            <Field label="Country">
              <Native
                options={[...COUNTRIES]}
                value={form.accountCountry}
                onChange={(e) => update("accountCountry", e.target.value)}
              />
            </Field>
            <div className="sm:col-span-2">
              <Label className="text-sm">Business type</Label>
              <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {BUSINESS_TYPES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => update("businessType", t.id)}
                    className={`rounded-lg border p-3 text-left text-sm transition-colors ${
                      form.businessType === t.id
                        ? "border-primary bg-accent ring-1 ring-primary"
                        : "hover:border-primary/50"
                    }`}
                  >
                    <span className="font-medium">{t.label}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{t.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Legal business name">
              <Input
                placeholder="Rimbers Hospitality (Pvt) Ltd"
                value={form.legalName}
                onChange={(e) => update("legalName", e.target.value)}
              />
            </Field>
            <Field label="Business display name" hint="Shown to travellers on your public profile.">
              <Input
                placeholder="Rimbers Hospitality"
                value={form.displayName}
                onChange={(e) => update("displayName", e.target.value)}
              />
            </Field>
            <Field label="Business category">
              <Native
                options={BUSINESS_TYPES.map((t) => t.label)}
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
              />
            </Field>
            <Field label="Business registration / license number">
              <Input
                placeholder="SECP-0099231"
                value={form.licenseNumber}
                onChange={(e) => update("licenseNumber", e.target.value)}
              />
            </Field>
            <Field label="Tax information (NTN / VAT)">
              <Input
                placeholder="1234567-8"
                value={form.taxInfo}
                onChange={(e) => update("taxInfo", e.target.value)}
              />
            </Field>
            <Field label="Website">
              <Input
                placeholder="https://yourbusiness.com"
                value={form.website}
                onChange={(e) => update("website", e.target.value)}
              />
            </Field>
            <Field label="Business phone">
              <Input
                placeholder="+92 51 111 0000"
                value={form.businessPhone}
                onChange={(e) => update("businessPhone", e.target.value)}
              />
            </Field>
            <Field label="Business email">
              <Input
                type="email"
                placeholder="reservations@yourbusiness.com"
                value={form.businessEmail}
                onChange={(e) => update("businessEmail", e.target.value)}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Business description">
                <Textarea
                  rows={5}
                  placeholder="Tell travellers what makes your business special…"
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                />
              </Field>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Country">
              <Native
                options={[...COUNTRIES]}
                value={form.country}
                onChange={(e) => update("country", e.target.value)}
              />
            </Field>
            <Field label="City">
              <Input
                placeholder="Islamabad"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Address">
                <Input
                  placeholder="Street 12, F-7 Markaz"
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                />
              </Field>
            </div>
            <Field label="Postal code">
              <Input
                placeholder="44000"
                value={form.postalCode}
                onChange={(e) => update("postalCode", e.target.value)}
              />
            </Field>
            <Field label="Map location link">
              <Input
                placeholder="https://maps.google.com/…"
                value={form.mapLink}
                onChange={(e) => update("mapLink", e.target.value)}
              />
            </Field>
            <Field label="Latitude">
              <Input
                placeholder="33.7215"
                value={form.latitude}
                onChange={(e) => update("latitude", e.target.value)}
              />
            </Field>
            <Field label="Longitude">
              <Input
                placeholder="73.0433"
                value={form.longitude}
                onChange={(e) => update("longitude", e.target.value)}
              />
            </Field>
            <div className="sm:col-span-2">
              <Label className="text-sm">Location preview</Label>
              <div className="relative mt-2 h-64 overflow-hidden rounded-lg border bg-muted">
                <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)] [background-size:32px_32px]" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
                  <MapPin className="h-8 w-8 text-primary drop-shadow" />
                </div>
                <span className="absolute bottom-3 left-3 rounded bg-card px-2 py-1 text-xs text-muted-foreground shadow">
                  {form.latitude && form.longitude ? `${form.latitude}, ${form.longitude}` : "—"}
                  {form.city ? ` · ${form.city}` : ""}
                  {form.country ? `, ${form.country}` : ""}
                </span>
              </div>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-muted/40 p-4">
              <span className="text-sm font-medium">Verification status</span>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <StatusBadge status="Pending" /> → <StatusBadge status="Under Review" /> →{" "}
                <StatusBadge status="Verified" /> / <StatusBadge status="Rejected" />
              </div>
            </div>
            {verificationDocs.map((d) => (
              <div key={d.name} className="flex flex-wrap items-center gap-3 rounded-lg border p-4">
                <FileText className="h-5 w-5 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{d.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {d.file ?? "No file uploaded yet"}
                  </p>
                </div>
                <StatusBadge status={d.status} />
                <Button variant="outline" size="sm">
                  <Upload className="mr-1.5 h-3.5 w-3.5" /> Upload
                </Button>
              </div>
            ))}
            <label className="flex items-start gap-3 text-sm text-muted-foreground">
              <Checkbox
                className="mt-0.5"
                checked={form.consent}
                onCheckedChange={(checked) => update("consent", checked === true)}
              />
              <span>
                I confirm the documents provided are authentic and I am authorised to represent this
                business on Rimbers Trip.
              </span>
            </label>
          </div>
        ) : null}

        {error ? (
          <p className="mt-5 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <div className="mt-8 flex items-center justify-between gap-3 border-t pt-5">
          <Button
            variant="outline"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            Back
          </Button>
          {step < 3 ? (
            <Button onClick={() => setStep((s) => Math.min(3, s + 1))}>Continue</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Submitting…" : "Submit for review"}
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}

function SignupPage() {
  const { user, profile, business, loading, refresh } = useBusinessProfile();

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (!user) {
    return <SignInGate />;
  }

  if (profile?.role === "customer") {
    return <AlreadyInUseScreen />;
  }

  if (profile?.role === "business") {
    if (business?.status === "approved") {
      window.location.assign("/corporate");
      return null;
    }
    if (business?.status === "rejected") {
      return <RejectedScreen />;
    }
    return <PendingReviewScreen />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <RegistrationForm ownerId={user.id} onSubmitted={refresh} />
      <SiteFooter />
    </div>
  );
}

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { ArrowLeft, Save, X, IdCard, Briefcase, MapPin, FolderOpen, Mail, Phone, MessageSquare, Settings, Upload, FileCheck2 } from "lucide-react";

export const Route = createFileRoute("/customers/$id")({
  component: CustomerDetail,
  head: () => ({ meta: [{ title: "Customer Detail — AdminPanel" }] }),
});

const labelCls = "block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5";
const inputCls = "w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring";

const SERVICE_TYPES = ["Website Development", "SMM", "Passport", "Real Estate", "Training", "Travel"];
const SUB_SERVICE_TYPES = ["consultancy", "short term training", "Drop shipping", "Social media management", "master card& related services", "social media Ads", "Graphics/video", "Web Development", "Foreign payment  & related", "Hotel booking", "Sahara/Elmis services", "Edu support services", "Wafid & related", "Passport info services", "Passport Appt", "Embassy Appt", "Ticket", "Visa", "Property management", "Land", "Rental", "House sales", "Others"];
const PASSPORT_TYPES = ["New passport", "Expired passport", "Damaged passport", "Lost/Stolen passport", "Change of passport data", "Applicant is under 18"];
const APPOINTMENT_TYPES = ["Regular", "Urgent 2 days", "Urgent 5 days"];
const ORDER_STATUSES = ["Not started", "New", "In progress", "Done"];
const IMMIGRATION_BRANCHES = ["Addis Ababa", "Bule Hora", "Woldia", "Bahir Dar", "Dessie", "Mizan Tepi", "Dire Dawa", "Semera", "Bale Robe", "Wolaita Sodo", "Hawassa", "Debre Birhan", "Arba Minch", "Hosana", "Gondar", "Adama", "Jimma"];
const WEEKS = [
  { label: "Week-1", value: 1 },
  { label: "Week-2", value: 2 },
  { label: "Week-3", value: 3 },
  { label: "Week-4", value: 4 },
];
const MONTHS_AM = ["ሀምሌ", "ነሀሴ", "መስከረም", "ጥቅምት", "ህዳር", "ታህሳስ", "ጥር", "የካቲት", "መጋቢት", "ሚያዝያ", "ግንቦት", "ሰኔ"];
const YEARS = Array.from({ length: 10 }, (_, i) => String(2013 + i));
const COMING_PLATFORMS = ["Direct office", "Friend/ relatives related", "Freelancer/ Affiliate Marketing", "Referral", "Telegram", "TikTok", "Facebook/ Instagram/ WhatsApp", "paid Ads(paid advertising)"];
const CONTACTED_BY = ["Sadam", "Hussain", "Seada", "Wegagen", "Eman Banchi"];

const DOC_FIELDS: [string, string][] = [
  ["Birth Certificate", "birth_certificate_url"],
  ["Kebele ID", "kebele_id_url"],
  ["National ID", "national_id_url"],
  ["Reciept Passport Picture", "receipt_passport_picture_url"],
  ["Appointment Paper", "appointment_paper_url"],
  ["Photo", "photo_url"],
  ["Passport", "passport_url"],
  ["Court Document", "court_document_url"],
  ["Police Report", "police_report_url"],
  ["Reciept", "receipt_url"],
];

function DocUpload({ label, value, onChange, userId }: { label: string; value: string; onChange: (url: string) => void; userId: string | undefined }) {
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState("");
  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    setUploading(true);
    const path = `${userId}/${Date.now()}-${file.name.replace(/[^\w.\-]/g, "_")}`;
    const { error } = await supabase.storage.from("customer-documents").upload(path, file, { upsert: false });
    if (!error) {
      const { data } = supabase.storage.from("customer-documents").getPublicUrl(path);
      onChange(data.publicUrl);
      setName(file.name);
    }
    setUploading(false);
  };
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-input rounded-lg px-3 py-4 text-center text-sm text-muted-foreground bg-muted/30 hover:bg-muted/50 cursor-pointer transition">
        {value ? (
          <>
            <FileCheck2 className="h-5 w-5 text-success" />
            <a href={value} target="_blank" rel="noreferrer" className="text-xs font-medium text-primary underline truncate max-w-[180px]" onClick={(e) => e.stopPropagation()}>{name || "View file"}</a>
            <span className="text-[11px] text-primary underline">Replace file</span>
          </>
        ) : (
          <>
            <Upload className="h-5 w-5" />
            <span className="text-xs">{uploading ? "Uploading…" : "Click to upload"}</span>
            <span className="text-[10px]">PDF, JPG, PNG</span>
          </>
        )}
        <input type="file" accept=".pdf,image/*" className="hidden" onChange={handle} disabled={uploading} />
      </label>
    </div>
  );
}

function CustomerDetail() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [c, setC] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("customers").select("*").eq("id", id).maybeSingle().then(({ data }) => {
      if (!data) {
        // Either the row doesn't exist, or RLS silently excluded it because
        // this account doesn't own it and isn't the admin.
        setNotFound(true);
      } else {
        setC(data);
      }
    });
  }, [id]);

  if (notFound) {
    return (
      <AdminLayout title="Customer Detail View">
        <div className="max-w-[1200px] mx-auto text-center py-20">
          <h2 className="text-xl font-semibold mb-2">Customer not found</h2>
          <p className="text-sm text-muted-foreground mb-6">
            This customer doesn't exist, or you don't have access to it.
          </p>
          <Link to="/customers" className="text-primary font-semibold hover:underline">
            Back to Customer List
          </Link>
        </div>
      </AdminLayout>
    );
  }

  if (!c) return <AdminLayout title="Customer Detail View"><div className="text-muted-foreground">Loading…</div></AdminLayout>;

  const set = (k: string, v: any) => setC((p: any) => ({ ...p, [k]: v }));

  const save = async () => {
    setSaving(true);
    const { id: _id, created_at, updated_at, created_by, created_by_name, ...rest } = c;
    await supabase.from("customers").update(rest).eq("id", id);
    setSaving(false);
  };

  const Section = ({ title, icon: Icon, children }: any) => (
    <section className="bg-card rounded-2xl border p-6">
      <div className="flex items-center gap-2 font-semibold mb-5"><Icon className="h-5 w-5 text-primary" />{title}</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{children}</div>
    </section>
  );

  return (
    <AdminLayout title="Customer Detail View">
      <div className="max-w-[1200px] mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/customers" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Customer Lists
          </Link>
          <div className="flex gap-2">
            <button onClick={() => navigate({ to: "/customers" })} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-input bg-card text-sm font-medium hover:bg-accent"><X className="h-4 w-4" /> Cancel</button>
            <button onClick={save} disabled={saving} className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90"><Save className="h-4 w-4" /> {saving ? "Saving…" : "Save Changes"}</button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">{c.full_name?.[0] ?? "?"}</div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{c.full_name}</h1>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-success/15 text-success">{c.account_status ?? "Active"}</span>
            </div>
            <p className="text-sm text-muted-foreground">Customer ID: <span className="font-mono">#{c.customer_code}</span></p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-6">
            <Section title="Customer Information" icon={IdCard}>
              <div><label className={labelCls}>Customer Code</label><input className={inputCls} value={c.customer_code ?? ""} onChange={(e) => set("customer_code", e.target.value)} /></div>
              <div className="md:col-span-2"><label className={labelCls}>Full Name</label><input className={inputCls} value={c.full_name ?? ""} onChange={(e) => set("full_name", e.target.value)} /></div>
              <div><label className={labelCls}>Service Type</label>
                <select className={inputCls} value={c.service_type ?? ""} onChange={(e) => set("service_type", e.target.value)}>
                  <option value="">—</option>
                  {SERVICE_TYPES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div><label className={labelCls}>Sub Service Type</label>
                <select className={inputCls} value={c.sub_service_type ?? ""} onChange={(e) => set("sub_service_type", e.target.value)}>
                  <option value="">—</option>
                  {SUB_SERVICE_TYPES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div><label className={labelCls}>Passport Type</label>
                <select className={inputCls} value={c.passport_type ?? ""} onChange={(e) => set("passport_type", e.target.value)}>
                  <option value="">—</option>
                  {PASSPORT_TYPES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div><label className={labelCls}>Appointment Type</label>
                <select className={inputCls} value={c.appointment_type ?? ""} onChange={(e) => set("appointment_type", e.target.value)}>
                  <option value="">—</option>
                  {APPOINTMENT_TYPES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div><label className={labelCls}>Appointment Date</label><input type="date" className={inputCls} value={c.appointment_date ?? ""} onChange={(e) => set("appointment_date", e.target.value)} /></div>
              <div><label className={labelCls}>Birth Date</label><input type="date" className={inputCls} value={c.birth_date ?? ""} onChange={(e) => set("birth_date", e.target.value)} /></div>
              <div><label className={labelCls}>Birth Place</label><input className={inputCls} value={c.birth_place ?? ""} onChange={(e) => set("birth_place", e.target.value)} /></div>
              <div><label className={labelCls}>Week</label>
                <select className={inputCls} value={c.week ?? ""} onChange={(e) => set("week", e.target.value ? Number(e.target.value) : null)}>
                  <option value="">—</option>
                  {WEEKS.map((w) => <option key={w.value} value={w.value}>{w.label}</option>)}
                </select>
              </div>
              <div><label className={labelCls}>Month</label>
                <select className={inputCls} value={c.month ?? ""} onChange={(e) => set("month", e.target.value)}>
                  <option value="">—</option>
                  {MONTHS_AM.map((m) => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div><label className={labelCls}>Year</label>
                <select className={inputCls} value={c.year ?? ""} onChange={(e) => set("year", Number(e.target.value) || null)}>
                  <option value="">—</option>
                  {YEARS.map((y) => <option key={y}>{y}</option>)}
                </select>
              </div>
              <div><label className={labelCls}>Gender</label>
                <div className="flex items-center gap-6 h-[38px]">
                  <label className="flex items-center gap-2 text-sm"><input type="radio" checked={c.gender === "Male"} onChange={() => set("gender", "Male")} /> Male</label>
                  <label className="flex items-center gap-2 text-sm"><input type="radio" checked={c.gender === "Female"} onChange={() => set("gender", "Female")} /> Female</label>
                </div>
              </div>
            </Section>

            <Section title="Contact & Financial Details" icon={Phone}>
              <div><label className={labelCls}>Phone Number</label><input className={inputCls} value={c.phone_number ?? ""} onChange={(e) => set("phone_number", e.target.value)} /></div>
              <div className="md:col-span-2"><label className={labelCls}>Email Address</label><input className={inputCls} value={c.email ?? ""} onChange={(e) => set("email", e.target.value)} /></div>
              <div><label className={labelCls}>Application Number</label><input className={inputCls} value={c.application_no ?? ""} onChange={(e) => set("application_no", e.target.value)} /></div>
              <div><label className={labelCls}>Reference Number</label><input type="text" className={inputCls} value={c.reference_number ?? ""} onChange={(e) => set("reference_number", e.target.value || null)} /></div>
              <div><label className={labelCls}>Reciept Passport Number</label><input className={inputCls} value={c.receipt_passport_number ?? ""} onChange={(e) => set("receipt_passport_number", e.target.value)} /></div>
              <div><label className={labelCls}>Amount Paid</label><input type="number" className={inputCls} value={c.amount_paid ?? 0} onChange={(e) => set("amount_paid", Number(e.target.value))} /></div>
              <div><label className={labelCls}>Date of Issue</label><input type="date" className={inputCls} value={c.date_of_issue ?? ""} onChange={(e) => set("date_of_issue", e.target.value)} /></div>
              <div><label className={labelCls}>URL</label><input className={inputCls} value={c.url ?? ""} onChange={(e) => set("url", e.target.value)} /></div>
            </Section>

            <Section title="Professional & Civil Status" icon={Briefcase}>
              <div><label className={labelCls}>Contacted By</label>
                <select className={inputCls} value={c.served_by ?? ""} onChange={(e) => set("served_by", e.target.value)}>
                  <option value="">—</option>
                  {CONTACTED_BY.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div><label className={labelCls}>Marital Status</label><input className={inputCls} value={c.marital_status ?? ""} onChange={(e) => set("marital_status", e.target.value)} /></div>
              <div><label className={labelCls}>Customers Work Type</label><input className={inputCls} value={c.work_type ?? ""} onChange={(e) => set("work_type", e.target.value)} /></div>
              <div><label className={labelCls}>Immigration Branch</label>
                <select className={inputCls} value={c.immigration_place ?? ""} onChange={(e) => set("immigration_place", e.target.value)}>
                  <option value="">Select branch…</option>
                  {IMMIGRATION_BRANCHES.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div><label className={labelCls}>Coming Platform</label>
                <select className={inputCls} value={c.coming_platform ?? ""} onChange={(e) => set("coming_platform", e.target.value)}>
                  <option value="">—</option>
                  {COMING_PLATFORMS.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div><label className={labelCls}>If Referral (Affiliate Details)</label><input className={inputCls} value={c.referral_details ?? ""} onChange={(e) => set("referral_details", e.target.value)} /></div>
            </Section>

            <Section title="Address & Remarks" icon={MapPin}>
              <div className="md:col-span-3"><label className={labelCls}>Street Address</label><input className={inputCls} value={c.address ?? ""} onChange={(e) => set("address", e.target.value)} /></div>
              <div className="md:col-span-3"><label className={labelCls}>Remarks</label><textarea className={inputCls + " min-h-[80px]"} value={c.remarks ?? ""} onChange={(e) => set("remarks", e.target.value)} /></div>
            </Section>

            <Section title="Attached Documents" icon={FolderOpen}>
              {DOC_FIELDS.map(([label, key]) => (
                <DocUpload
                  key={key}
                  label={label}
                  value={(c as any)[key] ?? ""}
                  onChange={(url) => set(key, url)}
                  userId={user?.id}
                />
              ))}
            </Section>
          </div>

          <aside className="space-y-6">
            <div className="bg-card rounded-2xl border overflow-hidden">
              <div className="bg-gradient-to-br from-primary to-sidebar h-24" />
              <div className="px-6 pb-6 -mt-10 text-center">
                <div className="h-20 w-20 rounded-full bg-card border-4 border-card mx-auto flex items-center justify-center text-2xl font-bold text-primary">{c.full_name?.[0] ?? "?"}</div>
                <h3 className="font-bold mt-3">{c.full_name}</h3>
                <p className="text-xs text-muted-foreground">{c.membership_level ? `${c.membership_level} Client` : "Client"}</p>
                <div className="flex justify-center gap-3 mt-3 text-muted-foreground">
                  <button className="h-8 w-8 rounded-full bg-accent flex items-center justify-center hover:text-primary"><Mail className="h-4 w-4" /></button>
                  <button className="h-8 w-8 rounded-full bg-accent flex items-center justify-center hover:text-primary"><Phone className="h-4 w-4" /></button>
                  <button className="h-8 w-8 rounded-full bg-accent flex items-center justify-center hover:text-primary"><MessageSquare className="h-4 w-4" /></button>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl border p-6 space-y-4">
              <div className="flex items-center gap-2 font-semibold"><Settings className="h-5 w-5 text-primary" /> Account Settings</div>
              <div><label className={labelCls}>Membership Level</label>
                <select className={inputCls} value={c.membership_level ?? ""} onChange={(e) => set("membership_level", e.target.value)}>
                  <option value="">—</option><option>Standard</option><option>Premium Elite</option>
                </select>
              </div>
              <div><label className={labelCls}>Order Status</label>
                <select className={inputCls} value={c.passport_status ?? ""} onChange={(e) => set("passport_status", e.target.value)}>
                  {ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Account Status</label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-sm"><input type="radio" checked={c.account_status === "Active"} onChange={() => set("account_status", "Active")} /> Active</label>
                  <label className="flex items-center gap-2 text-sm"><input type="radio" checked={c.account_status === "Suspended"} onChange={() => set("account_status", "Suspended")} /> Suspended</label>
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm pt-2"><input type="checkbox" checked={!!c.smart_services_needed} onChange={(e) => set("smart_services_needed", e.target.checked)} /> Smart Services Needed</label>
            </div>
          </aside>
        </div>
      </div>
    </AdminLayout>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Download, UserPlus, Pencil, Trash2, Upload, FileCheck2 } from "lucide-react";

export const Route = createFileRoute("/")({
  component: DashboardRoute,
  head: () => ({ meta: [{ title: "Registration Dashboard — AdminPanel" }] }),
});

type Customer = {
  id: string;
  customer_code: string;
  full_name: string;
  service_type: string | null;
  passport_type: string | null;
  appointment_date: string | null;
  birth_date: string | null;
  week: string | null;
  month: string | null;
  year: number | null;
  phone_number: string | null;
  email: string | null;
  passport_status: string | null;
  application_no: string | null;
  amount_paid: number | null;
  date_of_issue: string | null;
  gender: string | null;
  served_by: string | null;
  marital_status: string | null;
  immigration_place: string | null;
  work_type: string | null;
  address: string | null;
  remarks: string | null;
  birth_certificate_url: string | null;
  kebele_id_url: string | null;
  national_id_url: string | null;
  smart_services_needed: boolean | null;
  account_status: string | null;
  membership_level: string | null;
  created_by: string | null;
  created_at: string | null;
  updated_at: string | null;
  birth_place: string | null;
  reference_number: string | null;
  referral_details: string | null;
  appointment_type: string | null;
  coming_platform: string | null;
  url: string | null;
  sub_service_type: string | null;
  receipt_passport_number_url: string | null;
  receipt_passport_picture_url: string | null;
  appointment_paper_url: string | null;
  photo_url: string | null;
  passport_url: string | null;
  court_document_url: string | null;
  police_report_url: string | null;
  receipt_url: string | null;
  receipt_passport_number: string | null;
  created_by_name: string | null;
};

function DashboardRoute() {
  return (
    <AdminLayout title="Customer Management">
      <Dashboard />
    </AdminLayout>
  );
}

const labelCls = "block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5";
const inputCls =
  "w-full px-3 py-2 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring";

const SERVICE_TYPES = ["Website Development", "SMM", "Passport", "Real Estate", "Training", "Travel"];
const SUB_SERVICE_TYPES = ["consultancy", "short term training", "Drop shipping", "Social media management", "master card& related services", "social media Ads", "Graphics/video", "Web Development", "Foreign payment  & related", "Hotel booking", "Sahara/Elmis services", "Edu support services", "Wafid & related", "Passport info services", "Passport Appt", "Embassy Appt", "Ticket", "Visa", "Property management", "Land", "Rental", "House sales", "Others"];
const PASSPORT_TYPES = ["New passport", "Expired passport", "Damaged passport", "Lost/Stolen passport", "Change of passport data", "Applicant is under 18"];
const APPOINTMENT_TYPES = ["Regular", "Urgent 2 days", "Urgent 5 days"];
const ORDER_STATUSES = ["Not started", "New", "In progress", "Done"];
const IMMIGRATION_BRANCHES = ["Addis Ababa", "Bule Hora", "Woldia", "Bahir Dar", "Dessie", "Mizan Tepi", "Dire Dawa", "Semera", "Bale Robe", "Wolaita Sodo", "Hawassa", "Debre Birhan", "Arba Minch", "Hosana", "Gondar", "Adama", "Jimma",  "Akaki Kality", "Metu", "Mizanaman", "jigjiga", "Gode"];
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

const emptyForm = {
  customer_code: "",
  full_name: "",

  service_type: "",
  sub_service_type: "",
  passport_type: "",
  appointment_type: "",

  appointment_date: "",
  birth_date: "",
  birth_place: "",

  week: "",
  month: "",
  year: "",

  phone_number: "",
  email: "",
  passport_status: "",

  application_no: "",
  reference_number: "",
  receipt_passport_number: "",
  amount_paid: "",
  date_of_issue: "",

  gender: "",

  served_by: "",
  marital_status: "",
  immigration_place: "",
  work_type: "",

  coming_platform: "",
  referral_details: "",
  url: "",

  address: "",
  remarks: "",
  smart_services_needed: false,

  birth_certificate_url: "",
  kebele_id_url: "",
  national_id_url: "",
  receipt_passport_picture_url: "",
  appointment_paper_url: "",
  photo_url: "",
  passport_url: "",
  court_document_url: "",
  police_report_url: "",
  receipt_url: "",

  created_by_name: "",
};

const DOC_FIELDS: { key: string; label: string }[] = [
  { key: "birth_certificate_url", label: "Birth Certificate" },
  { key: "kebele_id_url", label: "Kebele ID" },
  { key: "national_id_url", label: "National ID" },
  { key: "receipt_passport_picture_url", label: "Reciept Passport Picture" },
  { key: "appointment_paper_url", label: "Appointment Paper" },
  { key: "photo_url", label: "Photo" },
  { key: "passport_url", label: "Passport" },
  { key: "court_document_url", label: "Court Document" },
  { key: "police_report_url", label: "Police Report" },
  { key: "receipt_url", label: "Reciept" },
];

function FileUpload({
  label, value, onChange, userId,
}: { label: string; value: string; onChange: (url: string) => void; userId: string | undefined }) {
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
      <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-input rounded-lg px-4 py-5 text-center text-sm text-muted-foreground bg-muted/30 hover:bg-muted/50 cursor-pointer transition">
        {value ? (
          <>
            <FileCheck2 className="h-6 w-6 text-success" />
            <span className="text-xs font-medium text-foreground truncate max-w-[180px]">{name || "File uploaded"}</span>
            <span className="text-[11px] text-primary underline">Replace file</span>
          </>
        ) : (
          <>
            <Upload className="h-6 w-6" />
            <span className="text-xs">{uploading ? "Uploading…" : "Click to upload"}</span>
            <span className="text-[10px]">PDF, JPG, PNG</span>
          </>
        )}
        <input type="file" accept=".pdf,image/*" className="hidden" onChange={handle} disabled={uploading} />
      </label>
    </div>
  );
}

function Dashboard() {
  const { user, profile } = useAuth();
  const isAdmin = profile?.role === "admin";
  const [form, setForm] = useState(emptyForm);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filter, setFilter] = useState({
    name: "",
    phone: "",
    dob: "",
    appt: "",
    issueDate: "",
    week: "",
    month: "",
    year: "",
    passportType: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");

  const load = async () => {
    const { data } = await supabase
      .from("customers")
      .select("id,customer_code,full_name,service_type,passport_type,appointment_date,birth_date,week,month,year,phone_number,email,passport_status,application_no,amount_paid,date_of_issue,gender,served_by,marital_status,immigration_place,work_type,address,remarks,birth_certificate_url,kebele_id_url,national_id_url,smart_services_needed,account_status,membership_level,created_by,created_by_name,created_at,updated_at,birth_place,reference_number,referral_details,appointment_type,coming_platform,url,sub_service_type,receipt_passport_number_url,receipt_passport_picture_url,appointment_paper_url,photo_url,passport_url,court_document_url,police_report_url,receipt_url,receipt_passport_number")
      .order("created_at", { ascending: false })
      .limit(50);
    setCustomers(data ?? []);
  };

  useEffect(() => { load(); }, []);

  // Default "Created By" to the signed-in user's name once their profile loads.
  useEffect(() => {
    if (profile?.full_name) {
      setForm((f) => ({ ...f, created_by_name: profile.full_name }));
    }
  }, [profile?.full_name]);

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true); setMsg("");
    const payload: any = {
      ...form,
      created_by: user.id,
      created_by_name: form.created_by_name || profile?.full_name || "",
    };
    ["appointment_date", "birth_date", "date_of_issue"].forEach((k) => { if (!payload[k]) payload[k] = null; });
    payload.amount_paid = payload.amount_paid ? Number(payload.amount_paid) : 0;

    payload.year = payload.year ? Number(payload.year) : null;
    payload.week = payload.week ? Number(payload.week) : null;
    const { error } = await supabase.from("customers").insert(payload);
    setSubmitting(false);
    if (error) { setMsg(error.message); return; }
    setMsg("Customer registered ✓");
    setForm(emptyForm);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this customer?")) return;
    await supabase.from("customers").delete().eq("id", id);
    load();
  };

const exportCsv = () => {
    const headers = [
      "Customer Code", "Full Name", "Service Type", "Passport Type", "Appointment Date", "Birth Date",
      "Week", "Month", "Year", "Phone Number", "Email", "Passport Status", "Application No", "Amount Paid",
      "Date of Issue", "Gender", "Served By", "Marital Status", "Immigration Place", "Work Type", "Address",
      "Remarks", "Birth Certificate URL", "Kebele ID URL", "National ID URL", "Smart Services Needed",
      "Account Status", "Membership Level", "Created By", "Created At", "Updated At", "Birth Place",
      "Reference Number", "Referral Details", "Appointment Type", "Coming Platform", "URL", "Sub Service Type",
      "Receipt Passport Number URL", "Receipt Passport Picture URL", "Appointment Paper URL", "Photo URL",
      "Passport URL", "Court Document URL", "Police Report URL", "Receipt URL", "Receipt Passport Number",
      "Created By"
    ];

    const rows = [
      headers,
      ...customers.map((c) => [
        c.customer_code, c.full_name, c.service_type, c.passport_type, c.appointment_date, c.birth_date,
        c.week, c.month, c.year, c.phone_number, c.email, c.passport_status, c.application_no, c.amount_paid,
        c.date_of_issue, c.gender, c.served_by, c.marital_status, c.immigration_place, c.work_type, c.address,
        c.remarks, c.birth_certificate_url, c.kebele_id_url, c.national_id_url, c.smart_services_needed,
        c.account_status, c.membership_level, c.created_by, c.created_at, c.updated_at, c.birth_place,
        c.reference_number, c.referral_details, c.appointment_type, c.coming_platform, c.url, c.sub_service_type,
        c.receipt_passport_number_url, c.receipt_passport_picture_url, c.appointment_paper_url, c.photo_url,
        c.passport_url, c.court_document_url, c.police_report_url, c.receipt_url, c.receipt_passport_number,
        c.created_by_name
      ]),
    ];

    const csv = rows.map((r) => r.map((v) => `"${(v ?? "").toString().replace(/"/g, '""')}"`).join(",")).join("\n");
    // Prepend a UTF-8 BOM so apps like Excel render non-Latin scripts (e.g. Amharic) correctly
    // instead of showing garbled characters.
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "customers.csv"; a.click();
    URL.revokeObjectURL(url);
};

  const filtered = customers.filter((c) =>
    (!filter.name || c.full_name.toLowerCase().includes(filter.name.toLowerCase())) &&
    (!filter.phone || (c.phone_number ?? "").includes(filter.phone)) &&
    (!filter.dob || c.birth_date === filter.dob) &&
    (!filter.appt || c.appointment_date === filter.appt) &&
    (!filter.issueDate || c.date_of_issue === filter.issueDate) &&
    (!filter.week || String(c.week ?? "") === filter.week) &&
    (!filter.month || c.month === filter.month) &&
    (!filter.year || String(c.year ?? "") === filter.year) &&
    (!filter.passportType || c.passport_type === filter.passportType)
  );

  const statusBadge = (s: string | null) => {
    const map: Record<string, string> = {
      "Done": "bg-success/15 text-success",
      "In progress": "bg-info/15 text-info",
      "Not started": "bg-warning/15 text-warning-foreground",
    };
    return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${map[s ?? ""] ?? "bg-muted text-muted-foreground"}`}>● {s ?? "—"}</span>;
  };

  const serviceBadge = (s: string | null) => {
    const map: Record<string, string> = {
      "Passport": "bg-primary/10 text-primary",
      "Website Dev": "bg-info/10 text-info",
      "SMM": "bg-warning/15 text-warning-foreground",
    };
    return <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase ${map[s ?? ""] ?? "bg-muted text-muted-foreground"}`}>{s ?? "—"}</span>;
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Registration Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage customer entry and passport service workflows.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCsv} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-input bg-card text-sm font-medium hover:bg-accent">
            <Download className="h-4 w-4" /> Export CSV
          </button>
        </div>
      </div>

      <form onSubmit={submit} className="bg-card rounded-2xl shadow-sm border p-6">
        <div className="flex items-center gap-2 text-primary font-semibold mb-5">
          <UserPlus className="h-5 w-5" /> New Entry Form
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label className={labelCls}>Customer Code</label><input className={inputCls} placeholder="E.g. CUST-2024-001" value={form.customer_code} onChange={(e) => set("customer_code", e.target.value)} required /></div>
          <div><label className={labelCls}>Full Name</label><input className={inputCls} placeholder="Enter complete name" value={form.full_name} onChange={(e) => set("full_name", e.target.value)} required /></div>
          <div><label className={labelCls}>Service Type</label>
            <select
  className={inputCls}
  value={form.service_type}
  onChange={(e) => set("service_type", e.target.value)}
>
  <option value="">Select Service Type</option>
  {SERVICE_TYPES.map((s) => (
    <option key={s} value={s}>
      {s}
    </option>
  ))}
</select>
          </div>

          <div><label className={labelCls}>Passport Type</label>
            <select
  className={inputCls}
  value={form.passport_type}
  onChange={(e) => set("passport_type", e.target.value)}
>
  <option value="">Select Passport Type</option>
  {PASSPORT_TYPES.map((s) => (
    <option key={s} value={s}>
      {s}
    </option>
  ))}
</select>
          </div>
          <div><label className={labelCls}>Appointment Type</label>
            <select
  className={inputCls}
  value={form.appointment_type}
  onChange={(e) => set("appointment_type", e.target.value)}
>
  <option value="">Select Appointment Type</option>
  {APPOINTMENT_TYPES.map((s) => (
    <option key={s} value={s}>
      {s}
    </option>
  ))}
</select>
          </div>
          <div><label className={labelCls}>Sub Service Type</label>
            <select className={inputCls} value={form.sub_service_type} onChange={(e) => set("sub_service_type", e.target.value)}>
              <option value="">Select…</option>
              {SUB_SERVICE_TYPES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div><label className={labelCls}>Appointment Date</label><input type="date" className={inputCls} value={form.appointment_date} onChange={(e) => set("appointment_date", e.target.value)} /></div>
          <div><label className={labelCls}>Birth Date</label><input type="date" className={inputCls} value={form.birth_date} onChange={(e) => set("birth_date", e.target.value)} /></div>
          <div><label className={labelCls}>Birth Place</label><input className={inputCls} placeholder="City / town" value={form.birth_place} onChange={(e) => set("birth_place", e.target.value)} /></div>

          <div className="grid grid-cols-3 gap-2 md:col-span-3">
            <div><label className={labelCls}>Week</label>
              <select
  className={inputCls}
  value={form.week}
  onChange={(e) => set("week", e.target.value)}
>
  <option value="">Select Week</option>
  {WEEKS.map((w) => (
    <option key={w.value} value={w.value}>
      {w.label}
    </option>
  ))}
</select>
            </div>
            <div><label className={labelCls}>Month</label>
             <select
  className={inputCls}
  value={form.month}
  onChange={(e) => set("month", e.target.value)}
>
  <option value="">Select Month</option>
  {MONTHS_AM.map((m) => (
    <option key={m} value={m}>
      {m}
    </option>
  ))}
</select>
            </div>
            <div><label className={labelCls}>Year</label>
             <select
  className={inputCls}
  value={form.year}
  onChange={(e) => set("year", e.target.value)}
>
  <option value="">Select Year</option>
  {YEARS.map((y) => (
    <option key={y} value={y}>
      {y}
    </option>
  ))}
</select>
            </div>
          </div>

          <div><label className={labelCls}>Phone Number</label><input className={inputCls} placeholder="+251 …" value={form.phone_number} onChange={(e) => set("phone_number", e.target.value)} /></div>
          <div><label className={labelCls}>Email Address</label><input type="email" className={inputCls} placeholder="example@domain.com" value={form.email} onChange={(e) => set("email", e.target.value)} /></div>
          <div><label className={labelCls}>Order Status</label>
            <select
  className={inputCls}
  value={form.passport_status}
  onChange={(e) => set("passport_status", e.target.value)}
>
  <option value="">Select Status</option>
  {ORDER_STATUSES.map((s) => (
    <option key={s} value={s}>
      {s}
    </option>
  ))}
</select>
          </div>

          <div>
            <label className={labelCls}>Created By</label>
            <input
              className={inputCls + " bg-muted/50 cursor-not-allowed"}
              value={form.created_by_name}
              readOnly
              title="Automatically set to your account name"
            />
          </div>
          <div><label className={labelCls}>Application No.</label><input className={inputCls} placeholder="APP-998822" value={form.application_no} onChange={(e) => set("application_no", e.target.value)} /></div>
          <div><label className={labelCls}>Reference Number</label><input type="text" className={inputCls} placeholder="Enter reference" value={form.reference_number} onChange={(e) => set("reference_number", e.target.value)} /></div>
          <div><label className={labelCls}>Reciept Passport Number</label><input className={inputCls} placeholder="Enter receipt passport number" value={form.receipt_passport_number} onChange={(e) => set("receipt_passport_number", e.target.value)} /></div>
          <div><label className={labelCls}>Amount Paid</label><input type="number" step="0.01" className={inputCls} placeholder="$ 0.00" value={form.amount_paid} onChange={(e) => set("amount_paid", e.target.value)} /></div>

          <div><label className={labelCls}>Date of Issue</label><input type="date" className={inputCls} value={form.date_of_issue} onChange={(e) => set("date_of_issue", e.target.value)} /></div>
          <div><label className={labelCls}>Contacted By</label>
            <select
  className={inputCls}
  value={form.served_by}
  onChange={(e) => set("served_by", e.target.value)}
>
  <option value="" disabled>Select Contacted By</option>
  {CONTACTED_BY.map((s) => (
    <option key={s} value={s}>
      {s}
    </option>
  ))}
</select>
          </div>
          <div><label className={labelCls}>Marital Status</label>
           <select
  className={inputCls}
  value={form.marital_status}
  onChange={(e) => set("marital_status", e.target.value)}
>
  <option value="">Select Marital Status</option>
  <option value="Single">Single</option>
  <option value="Married">Married</option>
  <option value="Divorced">Divorced</option>
  <option value="Widowed">Widowed</option>
</select>
          </div>

          <div><label className={labelCls}>Gender</label>
            <div className="flex items-center gap-6 h-[38px]">
              <label className="flex items-center gap-2 text-sm"><input type="radio" name="gender" checked={form.gender === "Male"} onChange={() => set("gender", "Male")} /> Male</label>
              <label className="flex items-center gap-2 text-sm"><input type="radio" name="gender" checked={form.gender === "Female"} onChange={() => set("gender", "Female")} /> Female</label>
            </div>
          </div>
          <div><label className={labelCls}>Immigration Branch</label>
            <select className={inputCls} value={form.immigration_place} onChange={(e) => set("immigration_place", e.target.value)}>
              <option value="">Select branch…</option>
              {IMMIGRATION_BRANCHES.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div><label className={labelCls}>Customers Work Type</label><input className={inputCls} placeholder="Occupation" value={form.work_type} onChange={(e) => set("work_type", e.target.value)} /></div>

          <div><label className={labelCls}>Coming Platform</label>
            <select className={inputCls} value={form.coming_platform} onChange={(e) => set("coming_platform", e.target.value)}>
              <option value="">Select…</option>
              {COMING_PLATFORMS.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div><label className={labelCls}>If Referral (Affiliate Details)</label><input className={inputCls} placeholder="Affiliate name / details" value={form.referral_details} onChange={(e) => set("referral_details", e.target.value)} /></div>
          <div><label className={labelCls}>URL</label><input className={inputCls} placeholder="https://…" value={form.url} onChange={(e) => set("url", e.target.value)} /></div>

          <div className="md:col-span-2"><label className={labelCls}>Address</label><input className={inputCls} placeholder="Full residential address" value={form.address} onChange={(e) => set("address", e.target.value)} /></div>
          <div><label className={labelCls}>Remarks</label><input className={inputCls} placeholder="Additional notes…" value={form.remarks} onChange={(e) => set("remarks", e.target.value)} /></div>
          <div className="md:col-span-3 mt-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
              <Upload className="h-4 w-4 text-primary" /> Attached Documents
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {DOC_FIELDS.map((d) => (
                <FileUpload
                  key={d.key}
                  label={d.label}
                  value={(form as any)[d.key]}
                  onChange={(url) => set(d.key, url)}
                  userId={user?.id}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 bg-info/5 border border-info/20 rounded-lg px-4 py-3 flex items-center gap-2">
          <input type="checkbox" checked={form.smart_services_needed} onChange={(e) => set("smart_services_needed", e.target.checked)} />
          <span className="text-sm">Need Other Smart Services (Digital ID, Notary, etc.)</span>
        </div>

        {msg && <p className="text-sm mt-3 text-muted-foreground">{msg}</p>}

        <div className="flex items-center justify-end gap-3 mt-6">
          <button type="button" onClick={() => setForm(emptyForm)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Reset Form</button>
          <button type="submit" disabled={submitting} className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-60">
            {submitting ? "Saving…" : "Register Customer"}
          </button>
        </div>
      </form>

      <div className="bg-card rounded-2xl border p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <div><label className={labelCls}>Filter By Name</label><input className={inputCls} placeholder="Search names…" value={filter.name} onChange={(e) => setFilter({ ...filter, name: e.target.value })} /></div>
        <div><label className={labelCls}>Phone Number</label><input className={inputCls} placeholder="Search phone…" value={filter.phone} onChange={(e) => setFilter({ ...filter, phone: e.target.value })} /></div>
        <div><label className={labelCls}>Date of Birth</label><input type="date" className={inputCls} value={filter.dob} onChange={(e) => setFilter({ ...filter, dob: e.target.value })} /></div>
        <div><label className={labelCls}>Appointment Date</label><input type="date" className={inputCls} value={filter.appt} onChange={(e) => setFilter({ ...filter, appt: e.target.value })} /></div>

        <div><label className={labelCls}>Date of Issue</label><input type="date" className={inputCls} value={filter.issueDate} onChange={(e) => setFilter({ ...filter, issueDate: e.target.value })} /></div>
        <div><label className={labelCls}>Week</label>
          <select className={inputCls} value={filter.week} onChange={(e) => setFilter({ ...filter, week: e.target.value })}>
            <option value="">All Weeks</option>
            {WEEKS.map((w) => <option key={w.value} value={w.value}>{w.label}</option>)}
          </select>
        </div>
        <div><label className={labelCls}>Month</label>
          <select className={inputCls} value={filter.month} onChange={(e) => setFilter({ ...filter, month: e.target.value })}>
            <option value="">All Months</option>
            {MONTHS_AM.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div><label className={labelCls}>Year</label>
          <select className={inputCls} value={filter.year} onChange={(e) => setFilter({ ...filter, year: e.target.value })}>
            <option value="">All Years</option>
            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div><label className={labelCls}>Passport Type</label>
          <select className={inputCls} value={filter.passportType} onChange={(e) => setFilter({ ...filter, passportType: e.target.value })}>
            <option value="">All Passport Types</option>
            {PASSPORT_TYPES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-card rounded-2xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-6 py-3 font-semibold">Customer</th>
              <th className="text-left px-6 py-3 font-semibold">Contact</th>
              <th className="text-left px-6 py-3 font-semibold">Date of Birth</th>
              <th className="text-left px-6 py-3 font-semibold">Appointment</th>
              <th className="text-left px-6 py-3 font-semibold">Service</th>
              <th className="text-left px-6 py-3 font-semibold">Status</th>
              {isAdmin && <th className="text-left px-6 py-3 font-semibold">Created By</th>}
              <th className="text-right px-6 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={isAdmin ? 8 : 7} className="text-center py-10 text-muted-foreground">No customers yet. Register your first above.</td></tr>
            )}
            {filtered.map((c) => (
              <tr key={c.id} className="border-t hover:bg-accent/30">
                <td className="px-6 py-4">
                  <div className="font-semibold">{c.full_name}</div>
                  <div className="text-xs text-muted-foreground">{c.customer_code}</div>
                </td>
                <td className="px-6 py-4">
                  <div>{c.phone_number ?? "—"}</div>
                  <div className="text-xs text-muted-foreground">{c.email ?? ""}</div>
                </td>
                <td className="px-6 py-4">{c.birth_date ?? "—"}</td>
                <td className="px-6 py-4">{c.appointment_date ?? "—"}</td>
                <td className="px-6 py-4">{serviceBadge(c.service_type)}</td>
                <td className="px-6 py-4">{statusBadge(c.passport_status)}</td>
                {isAdmin && <td className="px-6 py-4 text-muted-foreground">{c.created_by_name || "—"}</td>}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2 text-muted-foreground">
                    <Link to="/customers/$id" params={{ id: c.id }} className="hover:text-primary"><Pencil className="h-4 w-4" /></Link>
                    <button onClick={() => remove(c.id)} className="hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-6 py-3 text-xs text-muted-foreground border-t flex items-center justify-between">
          <span>Showing {filtered.length} of {customers.length} customers</span>
        </div>
      </div>
    </div>
  );
}

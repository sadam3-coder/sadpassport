import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Pencil, Trash2 } from "lucide-react";

export const Route = createFileRoute("/customers/")({
  component: CustomersList,
  head: () => ({ meta: [{ title: "Customers — AdminPanel" }] }),
});

function CustomersList() {
  const [rows, setRows] = useState<any[]>([]);

  const load = async () => {
    const { data } = await supabase.from("customers").select("*").order("created_at", { ascending: false });
    setRows(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    if (!confirm("Delete this customer?")) return;
    await supabase.from("customers").delete().eq("id", id);
    load();
  };

  return (
    <AdminLayout title="Customer Management">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-3xl font-bold mb-6">All Customers</h1>
        <div className="bg-card rounded-2xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-6 py-3">Customer</th>
                <th className="text-left px-6 py-3">Contact</th>
                <th className="text-left px-6 py-3">Service</th>
                <th className="text-left px-6 py-3">Status</th>
                <th className="text-right px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} className="border-t hover:bg-accent/30">
                  <td className="px-6 py-4"><div className="font-semibold">{c.full_name}</div><div className="text-xs text-muted-foreground">{c.customer_code}</div></td>
                  <td className="px-6 py-4">{c.phone_number}<div className="text-xs text-muted-foreground">{c.email}</div></td>
                  <td className="px-6 py-4">{c.service_type}</td>
                  <td className="px-6 py-4">{c.passport_status}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2 text-muted-foreground">
                      <Link to="/customers/$id" params={{ id: c.id }} className="hover:text-primary"><Pencil className="h-4 w-4" /></Link>
                      <button onClick={() => remove(c.id)} className="hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan={5} className="text-center py-10 text-muted-foreground">No customers yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

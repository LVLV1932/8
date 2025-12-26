import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

export function RegistrationsTab() {
  const { toast } = useToast();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [rejectReason, setRejectReason] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/registrations", { credentials: "include" });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast({ variant: "destructive", title: "خطأ", description: payload?.message || "تعذر تحميل الطلبات" });
        return;
      }
      setRegistrations(payload?.pending || []);
    })();
  }, [toast]);

  const handleApprove = async (id: string) => {
    const res = await fetch(`/api/admin/registrations/${id}/approve`, {
      method: "POST",
      credentials: "include",
    });
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) {
      toast({ variant: "destructive", title: "خطأ", description: payload?.message || "تعذر قبول الطلب" });
      return;
    }
    setRegistrations((prev) => prev.filter((r) => r.id !== id));
    toast({ title: "تم قبول الطلب" });
  };

  const handleReject = async (id: string) => {
    if (!rejectReason.trim()) {
      toast({ variant: "destructive", title: "خطأ", description: "يرجى كتابة سبب الرفض" });
      return;
    }

    const res = await fetch(`/api/admin/registrations/${id}/reject`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: rejectReason }),
    });
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) {
      toast({ variant: "destructive", title: "خطأ", description: payload?.message || "تعذر رفض الطلب" });
      return;
    }
    setRegistrations((prev) => prev.filter((r) => r.id !== id));
    setRejectReason("");
    setSelectedId(null);
    toast({ title: "تم رفض الطلب" });
  };

  const filtered = registrations.filter(r => {
    if (filterRole !== "all" && r.role !== filterRole) return false;
    // server returns only pending here
    if (filterStatus !== "all" && filterStatus !== "pending") return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex gap-4 flex-wrap">
        <div className="space-y-2">
          <label className="text-sm font-bold">فلتر الدور</label>
          <select 
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="border rounded-lg p-2"
          >
            <option value="all">الجميع</option>
            <option value="student">طالب</option>
            <option value="teacher">معلم</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold">الحالة</label>
          <div className="border rounded-lg p-2 text-sm text-muted-foreground">في الانتظار</div>
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <Card className="border-none bg-muted/50">
            <CardContent className="p-8 text-center">لا توجد طلبات</CardContent>
          </Card>
        ) : (
          filtered.map((reg) => (
            <motion.div key={reg.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="border-none hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-primary">@{reg.username}</h3>
                      <p className="text-sm text-muted-foreground">طلب إنشاء حساب جديد</p>
                    </div>
                    
                    <div className="flex flex-col gap-2 items-end">
                      {reg.role === "student" && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">🎓 طالب</span>}
                      {reg.role === "teacher" && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">👨‍🏫 معلم</span>}
                      
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded flex items-center gap-1"><Clock size={12} /> في الانتظار</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                      {selectedId === reg.id ? (
                        <div className="space-y-3 bg-red-50 p-3 rounded-lg border border-red-200">
                          <Textarea 
                            placeholder="سبب الرفض..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            className="text-right"
                          />
                          <div className="flex gap-2">
                            <Button size="sm" variant="destructive" onClick={() => handleReject(reg.id)}>
                              تأكيد الرفض
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => {
                              setSelectedId(null);
                              setRejectReason("");
                            }}>
                              إلغاء
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700 gap-1"
                            onClick={() => handleApprove(reg.id)}
                          >
                            <CheckCircle size={16} /> قبول
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => setSelectedId(reg.id)}
                          >
                            <XCircle size={16} /> رفض
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function RegistrationsTab() {
  const { toast } = useToast();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [rejectReason, setRejectReason] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    const regs = JSON.parse(localStorage.getItem("registrations") || "[]");
    setRegistrations(regs);
  }, []);

  const handleApprove = (id: number) => {
    const reg = registrations.find(r => r.id === id);
    if (!reg) return;

    // Move to users
    const users: any[] = JSON.parse(localStorage.getItem("users") || "[]");
    users.push({
      ...reg,
      status: "approved"
    });
    localStorage.setItem("users", JSON.stringify(users));

    // Update registration
    const updated = registrations.map(r => 
      r.id === id ? { ...r, status: "approved" } : r
    );
    setRegistrations(updated);
    localStorage.setItem("registrations", JSON.stringify(updated));

    toast({ title: `✓ تم قبول طلب ${reg.fullName}` });
  };

  const handleReject = (id: number) => {
    if (!rejectReason.trim()) {
      toast({ variant: "destructive", title: "خطأ", description: "يرجى كتابة سبب الرفض" });
      return;
    }

    const updated = registrations.map(r => 
      r.id === id ? { ...r, status: "rejected", rejectionReason: rejectReason } : r
    );
    setRegistrations(updated);
    localStorage.setItem("registrations", JSON.stringify(updated));
    
    setRejectReason("");
    setSelectedId(null);
    toast({ title: "تم رفض الطلب" });
  };

  const filtered = registrations.filter(r => {
    if (filterRole !== "all" && r.role !== filterRole) return false;
    if (filterStatus !== "all" && r.status !== filterStatus) return false;
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
          <label className="text-sm font-bold">فلتر الحالة</label>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border rounded-lg p-2"
          >
            <option value="all">الجميع</option>
            <option value="pending">في الانتظار</option>
            <option value="approved">موافق عليها</option>
            <option value="rejected">مرفوضة</option>
          </select>
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
                      <h3 className="font-bold text-lg text-primary">{reg.fullName}</h3>
                      <p className="text-sm text-muted-foreground">@{reg.username} | {reg.email}</p>
                      <p className="text-sm text-muted-foreground mt-1">📞 {reg.phone}</p>
                      <p className="text-xs text-muted-foreground mt-2">انشئ في: {reg.createdAt}</p>
                    </div>
                    
                    <div className="flex flex-col gap-2 items-end">
                      {reg.role === "student" && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">🎓 طالب</span>}
                      {reg.role === "teacher" && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">👨‍🏫 معلم</span>}
                      
                      {reg.status === "pending" && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded flex items-center gap-1"><Clock size={12} /> في الانتظار</span>}
                      {reg.status === "approved" && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded flex items-center gap-1"><CheckCircle size={12} /> موافق</span>}
                      {reg.status === "rejected" && <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded flex items-center gap-1"><XCircle size={12} /> مرفوض</span>}
                    </div>
                  </div>

                  {reg.status === "rejected" && (
                    <div className="bg-red-50 p-3 rounded-lg mb-4 border border-red-200">
                      <p className="text-xs text-red-700"><strong>سبب الرفض:</strong> {reg.rejectionReason}</p>
                    </div>
                  )}

                  {reg.status === "pending" && (
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
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

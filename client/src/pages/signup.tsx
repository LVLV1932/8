import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useSchool } from "@/lib/store";
import { UserPlus } from "lucide-react";

export default function Signup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { registerUser, getAvailableCodes } = useSchool();
  const { register, handleSubmit } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 500));

    if (!data.email || !data.code) {
      toast({ variant: "destructive", title: "خطأ", description: "يرجى ملء جميع الحقول" });
      setIsLoading(false);
      return;
    }

    const codes = getAvailableCodes();
    const codeObj = codes.find(c => c.code === data.code);

    if (!codeObj) {
      toast({ variant: "destructive", title: "خطأ", description: "الكود غير صحيح أو مستخدم بالفعل" });
      setIsLoading(false);
      return;
    }

    if (registerUser({
      name: codeObj.assignedTo || "مستخدم جديد",
      email: data.email,
      password: "default123",
      role: "student",
      grade: codeObj.grade,
      assignedCode: data.code
    })) {
      toast({ title: "تم إنشاء الحساب بنجاح" });
      setTimeout(() => setLocation("/"), 1000);
    } else {
      toast({ variant: "destructive", title: "خطأ", description: "البريد مسجل بالفعل" });
    }
    setIsLoading(false);
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center bg-muted/30 py-12 px-4">
        <Card className="w-full max-w-md shadow-2xl border-none">
          <CardHeader className="text-center bg-gradient-to-r from-primary to-secondary text-white rounded-t-lg">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <UserPlus size={28} />
            </div>
            <CardTitle className="text-2xl font-bold">تسجيل جديد</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label>البريد الإلكتروني</Label>
                <Input {...register("email")} type="email" placeholder="your@email.com" className="text-right" required />
              </div>

              <div className="space-y-2">
                <Label>كود الدخول</Label>
                <Input {...register("code")} placeholder="الكود من الإدارة" className="text-right" required />
                <p className="text-xs text-muted-foreground">اطلب الكود من الإدارة</p>
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 font-bold" disabled={isLoading}>
                {isLoading ? "جاري..." : "تسجيل"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

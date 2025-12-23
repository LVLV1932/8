import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, User, LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { motion } from "framer-motion";

export default function LoginNew() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { register, handleSubmit } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onLogin = async (data: any) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 500));

    // Get approved users and registrations
    const users: any[] = JSON.parse(localStorage.getItem("users") || "[]");
    const registrations: any[] = JSON.parse(localStorage.getItem("registrations") || "[]");

    // Check if user exists and approved
    const user = users.find((u: any) => (u.username === data.username || u.email === data.username) && u.password === data.password);

    // If not approved, check if pending
    if (!user) {
      const pendingReg = registrations.find((r: any) => 
        (r.username === data.username || r.email === data.username) && r.password === data.password
      );

      if (pendingReg) {
        setIsLoading(false);
        
        if (pendingReg.status === "pending") {
          // Save pending status for /pending page
          localStorage.setItem("currentPending", JSON.stringify(pendingReg));
          setLocation("/pending");
          return;
        } else if (pendingReg.status === "rejected") {
          toast({ 
            variant: "destructive", 
            title: "تم رفض طلبك", 
            description: pendingReg.rejectionReason || "لم يتم قبول طلبك" 
          });
          return;
        }
      }

      toast({ variant: "destructive", title: "خطأ", description: "اسم المستخدم أو كلمة المرور غير صحيحة" });
      setIsLoading(false);
      return;
    }

    // Save user session
    const session = {
      ...user,
      loginTime: new Date().toLocaleString('ar-EG'),
      rememberMe: data.rememberMe || false,
    };

    localStorage.setItem("currentUser", JSON.stringify(session));
    
    if (data.rememberMe) {
      localStorage.setItem("rememberMe", "true");
    }

    toast({ title: "تم تسجيل الدخول بنجاح" });
    
    // Navigate based on role
    if (user.role === "student") {
      setLocation("/student-portal");
    } else if (user.role === "teacher") {
      setLocation("/teacher-portal");
    } else if (user.role === "admin") {
      setLocation("/admin");
    }

    setIsLoading(false);
  };

  return (
    <Layout>
      <div className="min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 py-12 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <Card className="border-none shadow-2xl">
            <CardHeader className="text-center bg-gradient-to-r from-primary to-secondary text-white rounded-t-lg">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <LogIn size={28} />
              </div>
              <CardTitle className="text-2xl font-bold">دخول الموقع</CardTitle>
              <CardDescription className="text-white/80">ثانوية الزبير للمتفوقين</CardDescription>
            </CardHeader>

            <CardContent className="pt-8">
              <form onSubmit={handleSubmit(onLogin)} className="space-y-5">
                <div className="space-y-2">
                  <Label>اسم المستخدم أو البريد الإلكتروني</Label>
                  <div className="relative">
                    <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input {...register("username")} placeholder="mohammed.ahmed أو email@example.com" className="pr-10 text-right" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>كلمة المرور</Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input type="password" {...register("password")} placeholder="••••••••" className="pr-10 text-right" required />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" {...register("rememberMe")} id="rememberMe" className="w-4 h-4" />
                  <label htmlFor="rememberMe" className="text-sm">تذكرني لمدة 30 يوم</label>
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 font-bold text-base" disabled={isLoading}>
                  {isLoading ? "جاري الدخول..." : "دخول"}
                </Button>

                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border-2 border-blue-300 text-xs text-blue-900 space-y-2">
                  <p className="font-bold">🔐 حساب الإدارة (جاهز مباشرة):</p>
                  <div className="bg-white/60 p-2 rounded font-mono text-blue-800">
                    <p>👤 اسم المستخدم: <span className="font-bold">admin</span></p>
                    <p>🔑 كلمة المرور: <span className="font-bold">admin123</span></p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-center text-muted-foreground mb-3">أو</p>
                  <Button 
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setLocation("/register")}
                  >
                    إنشاء حساب جديد
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
}

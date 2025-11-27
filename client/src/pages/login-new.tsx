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
import { useSchool } from "@/lib/store";
import { motion } from "framer-motion";

export default function LoginNew() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { loginUser, registerUser, getAvailableCodes } = useSchool();
  const { register, handleSubmit, reset } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  const onLogin = async (data: any) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 500));

    if (loginUser(data.email, data.password)) {
      toast({ title: "تم تسجيل الدخول بنجاح" });
      setLocation("/");
    } else {
      toast({ variant: "destructive", title: "خطأ", description: "البريد أو كلمة المرور غير صحيحة" });
    }
    setIsLoading(false);
  };

  const onRegister = async (data: any) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 500));

    if (!data.email || !data.password || !data.name || !data.code || !data.role) {
      toast({ variant: "destructive", title: "خطأ", description: "يرجى ملء جميع الحقول" });
      setIsLoading(false);
      return;
    }

    const availableCodes = getAvailableCodes();
    const codeObj = availableCodes.find(c => c.code === data.code);

    if (!codeObj) {
      toast({ variant: "destructive", title: "خطأ", description: "الكود غير صحيح أو تم استخدامه بالفعل" });
      setIsLoading(false);
      return;
    }

    if (registerUser({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      grade: data.role === "student" ? codeObj.grade : undefined,
      subject: data.role === "teacher" ? data.subject : undefined,
      assignedCode: data.code
    })) {
      toast({ title: "تم إنشاء الحساب بنجاح!", description: "جاري التحويل..." });
      setTimeout(() => setLocation("/"), 1500);
    } else {
      toast({ variant: "destructive", title: "خطأ", description: "البريد مسجل بالفعل" });
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
              <CardTitle className="text-2xl font-bold">الوصول إلى النظام</CardTitle>
              <CardDescription className="text-white/80">ثانوية الزبير للمتفوقين</CardDescription>
            </CardHeader>

            <CardContent className="pt-8">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">دخول</TabsTrigger>
                  <TabsTrigger value="register">إنشاء حساب</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleSubmit(onLogin)} className="space-y-5">
                    <div className="space-y-2">
                      <Label>البريد الإلكتروني</Label>
                      <div className="relative">
                        <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input {...register("email")} placeholder="your@email.com" className="pr-10 text-right" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>كلمة المرور</Label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input type="password" {...register("password")} placeholder="••••••••" className="pr-10 text-right" required />
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 font-bold" disabled={isLoading}>
                      {isLoading ? "جاري الدخول..." : "دخول"}
                    </Button>

                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-xs text-blue-800">
                      <p className="font-bold mb-1">بيانات تجريبية:</p>
                      <p>admin@school.iq / admin123</p>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="register">
                  <form onSubmit={handleSubmit(onRegister)} className="space-y-4">
                    <div className="space-y-2">
                      <Label>الاسم الكامل</Label>
                      <Input {...register("name")} placeholder="محمد أحمد" className="text-right" required />
                    </div>

                    <div className="space-y-2">
                      <Label>البريد الإلكتروني</Label>
                      <Input type="email" {...register("email")} placeholder="your@email.com" className="text-right" required />
                    </div>

                    <div className="space-y-2">
                      <Label>كلمة المرور</Label>
                      <Input type="password" {...register("password")} placeholder="••••••••" className="text-right" required />
                    </div>

                    <div className="space-y-2">
                      <Label>نوع الحساب</Label>
                      <select {...register("role")} className="w-full border rounded-lg p-2 text-right" required>
                        <option value="">اختر...</option>
                        <option value="student">طالب</option>
                        <option value="teacher">معلم</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label>الكود المعين</Label>
                      <Input {...register("code")} placeholder="مثال: ZUBAIR-6001" className="text-right" required />
                      <p className="text-xs text-muted-foreground">اطلب الكود من الإدارة</p>
                    </div>

                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 font-bold" disabled={isLoading}>
                      {isLoading ? "جاري الإنشاء..." : "إنشاء الحساب"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
}

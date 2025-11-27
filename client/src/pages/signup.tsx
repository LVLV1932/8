import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useSchool } from "@/lib/store";

export default function Signup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { registerStudent, loginStudent, classCodes } = useSchool();
  const { register, handleSubmit, watch } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const selectedCode = watch("classCode");

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    
    if (!data.name || !data.email || !data.classCode) {
      toast({ variant: "destructive", title: "خطأ", description: "يرجى ملء جميع الحقول" });
      setIsLoading(false);
      return;
    }

    const classCode = classCodes.find(c => c.code === data.classCode);
    if (!classCode) {
      toast({ variant: "destructive", title: "خطأ", description: "كود الصف غير صحيح" });
      setIsLoading(false);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 800));
    
    registerStudent({
      name: data.name,
      email: data.email,
      grade: classCode.grade,
      classCode: data.classCode
    });

    if (loginStudent(data.email, data.classCode)) {
      setSuccess(true);
      toast({ title: "مرحباً بك!", description: "تم إنشاء حسابك بنجاح" });
      setTimeout(() => setLocation("/student-dashboard"), 1500);
    }
    setIsLoading(false);
  };

  if (success) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-accent/20 to-secondary/20 py-12 px-4">
          <Card className="w-full max-w-md shadow-2xl border-none text-center">
            <CardContent className="pt-12 pb-12">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={48} />
              </div>
              <h2 className="text-2xl font-bold text-primary mb-2">تم التسجيل بنجاح!</h2>
              <p className="text-muted-foreground mb-6">جاري تحويلك إلى لوحة التحكم...</p>
              <div className="flex justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center bg-muted/30 py-12 px-4">
        <Card className="w-full max-w-lg shadow-2xl border-none">
          <CardHeader className="text-center space-y-4 pb-8 bg-gradient-to-r from-primary to-secondary/80 text-white rounded-t-lg">
            <div className="w-16 h-16 bg-white/20 text-white rounded-full flex items-center justify-center mx-auto">
              <UserPlus size={32} />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-white">إنشاء حساب طالب</CardTitle>
              <CardDescription className="text-white/80">سجل الآن للوصول إلى منصة الطلاب الخاصة</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 font-medium mb-2">📌 الخطوات:</p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>✓ أدخل اسمك الكامل</li>
                  <li>✓ أدخل بريدك الإلكتروني</li>
                  <li>✓ اختر كود صفك من القائمة</li>
                  <li>✓ اضغط تسجيل للدخول</li>
                </ul>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">الاسم الكامل</Label>
                <Input 
                  id="name" 
                  placeholder="محمد أحمد علي" 
                  {...register("name")} 
                  required 
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="student@alzubair.edu.iq" 
                  {...register("email")} 
                  required 
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="classCode">كود الصف</Label>
                <Select defaultValue="">
                  <SelectTrigger>
                    <SelectValue placeholder="اختر صفك" />
                  </SelectTrigger>
                  <SelectContent>
                    {classCodes.map(cc => (
                      <SelectItem key={cc.id} value={cc.code}>
                        {cc.grade} - {cc.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input type="hidden" {...register("classCode")} value={selectedCode} />
              </div>

              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                <p className="text-xs text-amber-800">
                  💡 تلميح: اطلب كود صفك من معلمك أو الإدارة
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 gap-2 font-bold text-base"
                disabled={isLoading}
              >
                {isLoading ? "جاري التسجيل..." : "تسجيل الدخول"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                هل أنت موظف؟ <Button variant="link" className="p-0 h-auto" onClick={() => setLocation("/login")}>دخول الإدارة</Button>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

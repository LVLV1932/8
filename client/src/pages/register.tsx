import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch("password");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setLoading(true);

    if (!data.terms) {
      toast({ variant: "destructive", title: "خطأ", description: "يجب قبول الشروط والأحكام" });
      setLoading(false);
      return;
    }

    // Get existing registrations and users
    const registrations: any[] = JSON.parse(localStorage.getItem("registrations") || "[]");
    const users: any[] = JSON.parse(localStorage.getItem("users") || "[]");

    // Check for duplicate username or email
    if (users.some((u: any) => u.username === data.username) || registrations.some((r: any) => r.username === data.username)) {
      toast({ variant: "destructive", title: "خطأ", description: "اسم المستخدم موجود بالفعل" });
      setLoading(false);
      return;
    }

    if (users.some((u: any) => u.email === data.email) || registrations.some((r: any) => r.email === data.email)) {
      toast({ variant: "destructive", title: "خطأ", description: "البريد الإلكتروني مستخدم بالفعل" });
      setLoading(false);
      return;
    }

    // Create registration request
    const newRegistration = {
      id: Date.now(),
      fullName: data.fullName,
      username: data.username,
      email: data.email,
      phone: data.phone,
      password: data.password,
      role: data.role,
      gender: data.gender || null,
      dob: data.dob || null,
      address: data.address || null,
      status: "pending",
      createdAt: new Date().toLocaleString('ar-EG'),
      rejectionReason: null,
    };

    registrations.push(newRegistration);
    localStorage.setItem("registrations", JSON.stringify(registrations));

    toast({ 
      title: "تم إرسال الطلب بنجاح", 
      description: "تم إرسال بياناتك للإدارة للمراجعة. يمكنك متابعة حالة الطلب هنا." 
    });
    
    // Save to current pending for viewing
    localStorage.setItem("currentPending", JSON.stringify(newRegistration));
    
    await new Promise(r => setTimeout(r, 1500));
    setLocation("/pending");
    setLoading(false);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 py-12 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
          <Card className="border-none shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-primary to-secondary text-white rounded-t-lg">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <UserPlus size={28} />
              </div>
              <CardTitle className="text-3xl font-bold text-center">إنشاء حساب جديد</CardTitle>
            </CardHeader>

            <CardContent className="p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label className="font-bold">الاسم الكامل *</Label>
                  <Input 
                    {...register("fullName", { required: "الاسم الكامل مطلوب" })}
                    placeholder="محمد أحمد علي"
                    className="text-right"
                  />
                  {errors.fullName && <p className="text-red-500 text-sm">{String(errors.fullName?.message)}</p>}
                </div>

                {/* Username */}
                <div className="space-y-2">
                  <Label className="font-bold">اسم المستخدم *</Label>
                  <Input 
                    {...register("username", { 
                      required: "اسم المستخدم مطلوب",
                      minLength: { value: 4, message: "يجب أن يكون 4 أحرف على الأقل" }
                    })}
                    placeholder="mohammed.ahmed"
                    className="text-right"
                  />
                  {errors.username && <p className="text-red-500 text-sm">{String(errors.username?.message)}</p>}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label className="font-bold">البريد الإلكتروني *</Label>
                  <Input 
                    type="email"
                    {...register("email", { required: "البريد الإلكتروني مطلوب" })}
                    placeholder="mohammed@example.com"
                    className="text-right"
                  />
                  {errors.email && <p className="text-red-500 text-sm">{String(errors.email?.message)}</p>}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label className="font-bold">رقم الهاتف *</Label>
                  <Input 
                    {...register("phone", { required: "رقم الهاتف مطلوب" })}
                    placeholder="+964 770 123 4567"
                    className="text-right"
                  />
                  {errors.phone && <p className="text-red-500 text-sm">{String(errors.phone?.message)}</p>}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label className="font-bold">كلمة المرور *</Label>
                  <Input 
                    type="password"
                    {...register("password", { 
                      required: "كلمة المرور مطلوبة",
                      minLength: { value: 6, message: "يجب أن تكون 6 أحرف على الأقل" }
                    })}
                    placeholder="••••••••"
                    className="text-right"
                  />
                  {errors.password && <p className="text-red-500 text-sm">{String(errors.password?.message)}</p>}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label className="font-bold">تأكيد كلمة المرور *</Label>
                  <Input 
                    type="password"
                    {...register("confirmPassword", { 
                      required: "تأكيد كلمة المرور مطلوب",
                      validate: (value) => value === password || "كلمات المرور غير متطابقة"
                    })}
                    placeholder="••••••••"
                    className="text-right"
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-sm">{String(errors.confirmPassword?.message)}</p>}
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <Label className="font-bold">الدور المطلوب *</Label>
                  <select 
                    {...register("role", { required: "الدور مطلوب" })}
                    className="w-full border rounded-lg p-3 text-right"
                  >
                    <option value="">اختر الدور</option>
                    <option value="student">طالب</option>
                    <option value="teacher">معلم</option>
                  </select>
                  {errors.role && <p className="text-red-500 text-sm">{String(errors.role?.message)}</p>}
                </div>

                {/* Gender (Optional) */}
                <div className="space-y-2">
                  <Label>النوع (اختياري)</Label>
                  <select {...register("gender")} className="w-full border rounded-lg p-3 text-right">
                    <option value="">--</option>
                    <option value="male">ذكر</option>
                    <option value="female">أنثى</option>
                  </select>
                </div>

                {/* DOB (Optional) */}
                <div className="space-y-2">
                  <Label>تاريخ الميلاد (اختياري)</Label>
                  <Input type="date" {...register("dob")} className="text-right" />
                </div>

                {/* Address (Optional) */}
                <div className="space-y-2">
                  <Label>العنوان (اختياري)</Label>
                  <Input {...register("address")} placeholder="البصرة، قضاء الزبير" className="text-right" />
                </div>

                {/* Terms */}
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <Checkbox {...register("terms")} />
                  <label className="text-sm text-right flex-1 cursor-pointer">
                    أوافق على الشروط والأحكام والسياسات
                  </label>
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 font-bold text-lg py-6" disabled={loading}>
                  {loading ? "جاري الإنشاء..." : "إنشاء الحساب"}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  لديك حساب بالفعل؟ <a href="/login-new" className="text-primary font-bold hover:underline">تسجيل دخول</a>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
}

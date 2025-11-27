import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { register, handleSubmit } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    // Mock authentication
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (data.username === "admin" && data.password === "Zubair@2025#Secure") {
      toast({ title: "تم تسجيل الدخول بنجاح" });
      setLocation("/admin");
    } else {
      toast({ 
        variant: "destructive",
        title: "فشل تسجيل الدخول",
        description: "اسم المستخدم أو كلمة المرور غير صحيحة" 
      });
    }
    setIsLoading(false);
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center bg-muted/30 py-12 px-4">
        <Card className="w-full max-w-md shadow-2xl border-none">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
              <Lock />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-primary">تسجيل الدخول</CardTitle>
              <CardDescription>لوحة التحكم الخاصة بالإدارة</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-yellow-50 text-yellow-800 p-3 rounded-md text-xs mb-6 border border-yellow-200">
              <p className="font-bold mb-1">بيانات تجريبية:</p>
              <p>المستخدم: admin</p>
              <p>كلمة المرور: Zubair@2025#Secure</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">اسم المستخدم</Label>
                <div className="relative">
                  <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="username" className="pr-10" {...register("username")} required />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="password" type="password" className="pr-10" {...register("password")} required />
                </div>
              </div>
              
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? "جاري التحقق..." : "دخول"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

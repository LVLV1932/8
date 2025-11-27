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
  const { loginUser } = useSchool();
  const { register, handleSubmit } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onLogin = async (data: any) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 500));

    if (loginUser(data.email, data.password)) {
      toast({ title: "تم تسجيل الدخول بنجاح" });
      setLocation("/portal");
    } else {
      toast({ variant: "destructive", title: "خطأ", description: "البريد أو كلمة المرور غير صحيحة" });
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
                  <Label>البريد الإلكتروني</Label>
                  <div className="relative">
                    <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input {...register("email")} type="email" placeholder="admin@school.iq" className="pr-10 text-right" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>كلمة المرور</Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input type="password" {...register("password")} placeholder="••••••••" className="pr-10 text-right" required />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 font-bold text-base" disabled={isLoading}>
                  {isLoading ? "جاري الدخول..." : "دخول"}
                </Button>

                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-xs text-blue-800">
                  <p className="font-bold mb-1">🔑 الحسابات التجريبية:</p>
                  <p>admin@school.iq / admin123</p>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-center text-muted-foreground mb-3">أو</p>
                  <Button 
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setLocation("/signup")}
                  >
                    تسجيل جديد بكود
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

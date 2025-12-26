import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Clock, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Pending() {
  const [, setLocation] = useLocation();
  const [registration, setRegistration] = useState<any>(null);

  useEffect(() => {
    const pending = localStorage.getItem("currentPending");
    if (pending) {
      setRegistration(JSON.parse(pending));
      return;
    }
  }, []);

  if (!registration) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="max-w-md w-full">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">لم يتم العثور على طلب</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full">
          <Card className="border-2 border-yellow-300 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-t-lg">
              <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock size={32} />
              </div>
              <CardTitle className="text-center text-2xl">طلبك قيد الانتظار</CardTitle>
            </CardHeader>

            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="bg-yellow-50 p-6 rounded-lg border-2 border-yellow-200">
                  <p className="text-muted-foreground mb-2">تم إنشاء طلبك بنجاح</p>
                  <p className="font-bold text-lg text-primary">{registration.username}</p>
                  <p className="text-sm text-muted-foreground mt-2">سيتم تفعيل حسابك بعد موافقة الإدارة.</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700">
                    ⏳ سيتم مراجعة طلبك من قبل الإدارة قريباً
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  <p className="font-bold text-primary">📋 الحالة الحالية:</p>
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="text-yellow-600" size={20} />
                    <span className="font-bold text-yellow-600">في الانتظار</span>
                  </div>
                </div>

                <div className="animate-spin">
                  <Clock className="text-yellow-600" size={32} />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setLocation("/login")}
                  className="w-full"
                >
                  الرجوع لتسجيل الدخول
                </Button>
              </div>

              <div className="mt-8 pt-6 border-t text-xs text-muted-foreground text-center">
                <p>إذا تأخر التفعيل، تواصل مع الإدارة.</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
}

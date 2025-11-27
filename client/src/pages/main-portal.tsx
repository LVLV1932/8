import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSchool } from "@/lib/store";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { BookOpen, Users, MessageSquare, LogOut, BarChart3, Bell, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function MainPortal() {
  const [, setLocation] = useLocation();
  const { currentUser, logoutUser, getUserNotifications } = useSchool();
  const { toast } = useToast();

  if (!currentUser) {
    setLocation("/login-new");
    return null;
  }

  const notifications = getUserNotifications(currentUser.id);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logoutUser();
    toast({ title: "تم تسجيل الخروج" });
    setLocation("/");
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: "مدير المدرسة",
      teacher: "معلم",
      student: "طالب"
    };
    return labels[role] || role;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-accent/5 to-secondary/5">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary/80 text-white pt-12 pb-8">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold mb-2">مرحباً {currentUser.name} 👋</h1>
                <p className="text-white/80 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-white rounded-full"></span>
                  {getRoleLabel(currentUser.role)} | {currentUser.grade || currentUser.subject || "الإدارة"}
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="gap-2"
                  onClick={handleLogout}
                >
                  <LogOut size={16} /> تسجيل الخروج
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Notifications Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="border-none shadow-lg bg-white hover:shadow-xl transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">الإشعارات</p>
                      <p className="text-3xl font-bold text-primary">{unreadCount}</p>
                      <p className="text-xs text-muted-foreground mt-1">غير مقروء</p>
                    </div>
                    <div className="bg-primary/10 p-4 rounded-lg text-primary relative">
                      <Bell size={28} />
                      {unreadCount > 0 && (
                        <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Stats Cards */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="border-none shadow-lg bg-gradient-to-br from-secondary/10 to-accent/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">الحالة</p>
                      <p className="text-2xl font-bold text-secondary">نشط ✓</p>
                    </div>
                    <div className="bg-secondary/10 p-4 rounded-lg text-secondary">
                      <BarChart3 size={28} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="border-none shadow-lg bg-gradient-to-br from-accent/10 to-primary/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">تاريخ الانضمام</p>
                      <p className="text-lg font-bold text-accent">{currentUser.joinDate}</p>
                    </div>
                    <div className="bg-accent/10 p-4 rounded-lg text-accent">
                      <Users size={28} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <h2 className="text-2xl font-bold text-primary mb-6">الخيارات المتاحة</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {currentUser.role === "admin" && (
                <>
                  <Card className="border-none shadow-lg hover:shadow-xl transition-all cursor-pointer group">
                    <CardHeader onClick={() => setLocation("/admin")} className="group-hover:bg-primary/5 transition-colors">
                      <CardTitle className="flex items-center gap-3 text-primary">
                        <Settings className="text-secondary" size={24} /> لوحة التحكم
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground text-sm">إدارة المحتوى والمستخدمين والإعدادات</CardContent>
                  </Card>

                  <Card className="border-none shadow-lg hover:shadow-xl transition-all cursor-pointer group">
                    <CardHeader onClick={() => alert("الإشعارات قيد التطوير")} className="group-hover:bg-primary/5 transition-colors">
                      <CardTitle className="flex items-center gap-3 text-primary">
                        <Bell className="text-secondary" size={24} /> إرسال إشعارات
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground text-sm">إرسال إشعارات للمستخدمين</CardContent>
                  </Card>
                </>
              )}

              {currentUser.role === "teacher" && (
                <>
                  <Card className="border-none shadow-lg hover:shadow-xl transition-all cursor-pointer group">
                    <CardHeader className="group-hover:bg-primary/5 transition-colors">
                      <CardTitle className="flex items-center gap-3 text-primary">
                        <BookOpen className="text-secondary" size={24} /> فصولي
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground text-sm">إدارة الفصول والطلاب</CardContent>
                  </Card>

                  <Card className="border-none shadow-lg hover:shadow-xl transition-all cursor-pointer group">
                    <CardHeader className="group-hover:bg-primary/5 transition-colors">
                      <CardTitle className="flex items-center gap-3 text-primary">
                        <Users className="text-secondary" size={24} /> الطلاب
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground text-sm">عرض وإدارة بيانات الطلاب</CardContent>
                  </Card>
                </>
              )}

              {currentUser.role === "student" && (
                <>
                  <Card className="border-none shadow-lg hover:shadow-xl transition-all cursor-pointer group">
                    <CardHeader className="group-hover:bg-primary/5 transition-colors">
                      <CardTitle className="flex items-center gap-3 text-primary">
                        <BookOpen className="text-secondary" size={24} /> دروسي
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground text-sm">عرض الدروس والمواد التعليمية</CardContent>
                  </Card>

                  <Card className="border-none shadow-lg hover:shadow-xl transition-all cursor-pointer group">
                    <CardHeader className="group-hover:bg-primary/5 transition-colors">
                      <CardTitle className="flex items-center gap-3 text-primary">
                        <MessageSquare className="text-secondary" size={24} /> أسئلتي
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground text-sm">اطرح أسئلتك والتواصل مع المعلمين</CardContent>
                  </Card>
                </>
              )}

              <Card className="border-none shadow-lg hover:shadow-xl transition-all cursor-pointer group">
                <CardHeader className="group-hover:bg-primary/5 transition-colors">
                  <CardTitle className="flex items-center gap-3 text-primary">
                    <Bell className="text-secondary" size={24} /> الإشعارات
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground text-sm">عرض جميع الإشعارات والتنبيهات</CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Recent Notifications */}
          {notifications.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-12">
              <h3 className="text-xl font-bold text-primary mb-4">آخر الإشعارات</h3>
              <div className="space-y-3">
                {notifications.slice(0, 5).map((notif) => (
                  <Card key={notif.id} className="border-none shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-bold text-primary text-sm">{notif.title}</p>
                          <p className="text-sm text-muted-foreground">{notif.message}</p>
                        </div>
                        {!notif.read && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}

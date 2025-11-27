import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSchool } from "@/lib/store";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { BookOpen, MessageSquare, LogOut, User, FileText, Clock, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function StudentDashboard() {
  const [, setLocation] = useLocation();
  const { currentStudent, logoutStudent, articles, questions } = useSchool();
  const { toast } = useToast();

  if (!currentStudent) {
    setLocation("/signup");
    return null;
  }

  const studentArticles = articles.filter(a => a.forStudents);
  const answeredQuestions = questions.filter(q => q.answered);

  const handleLogout = () => {
    logoutStudent();
    toast({ title: "تم تسجيل الخروج" });
    setLocation("/");
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-accent/5 to-secondary/5">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary/80 text-white pt-12 pb-8">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl font-bold mb-2">مرحباً بك {currentStudent.name}</h1>
                <p className="text-white/80">الصف: {currentStudent.grade}</p>
              </motion.div>
            </div>
            <Button 
              variant="secondary" 
              size="sm" 
              className="gap-2"
              onClick={handleLogout}
            >
              <LogOut size={16} /> تسجيل الخروج
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="border-none shadow-md bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">أخبار الطلاب</p>
                      <p className="text-3xl font-bold text-primary">{studentArticles.length}</p>
                    </div>
                    <div className="bg-primary/10 p-3 rounded-lg text-primary">
                      <FileText size={24} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="border-none shadow-md bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">الأسئلة المجابة</p>
                      <p className="text-3xl font-bold text-secondary">{answeredQuestions.length}</p>
                    </div>
                    <div className="bg-secondary/10 p-3 rounded-lg text-secondary">
                      <MessageSquare size={24} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="border-none shadow-md bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">تاريخ الانضمام</p>
                      <p className="text-lg font-bold text-primary">{currentStudent.joinDate}</p>
                    </div>
                    <div className="bg-accent/10 p-3 rounded-lg text-accent">
                      <Clock size={24} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="border-none shadow-md bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">حالتك</p>
                      <p className="text-lg font-bold text-green-600">نشط ✓</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-lg text-green-600">
                      <Award size={24} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Content Sections */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Student News */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <Card className="border-none shadow-lg bg-white h-full">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
                  <CardTitle className="flex items-center gap-2">
                    <FileText size={20} className="text-primary" />
                    أخبار خاصة بطلاب {currentStudent.grade}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {studentArticles.length > 0 ? (
                      studentArticles.map((article, idx) => (
                        <motion.div 
                          key={article.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 + idx * 0.1 }}
                          className="p-4 border border-primary/10 rounded-lg hover:bg-primary/5 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-bold text-primary">{article.title}</h3>
                            <span className="text-xs text-muted-foreground">{article.date}</span>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-3">{article.content}</p>
                          <Button variant="ghost" size="sm" className="mt-2 text-primary">اقرأ المزيد</Button>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="w-12 h-12 mx-auto mb-2 opacity-20" />
                        <p>لا توجد أخبار خاصة حالياً</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Links & Information */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <div className="space-y-8">
                {/* Information Card */}
                <Card className="border-none shadow-lg bg-gradient-to-br from-accent/10 to-secondary/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen size={20} className="text-accent" />
                      معلومات مهمة
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-white rounded-lg border border-accent/20">
                      <p className="text-sm font-medium text-primary mb-1">📚 البرامج الأكاديمية</p>
                      <p className="text-xs text-muted-foreground">اطلع على البرامج المتاحة في مدرستك</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-accent/20">
                      <p className="text-sm font-medium text-primary mb-1">👥 الهيئة التدريسية</p>
                      <p className="text-xs text-muted-foreground">تعرف على معلميك وتخصصاتهم</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-accent/20">
                      <p className="text-sm font-medium text-primary mb-1">📞 تواصل مع الإدارة</p>
                      <p className="text-xs text-muted-foreground">اطرح أسئلتك والإدارة ستجيب عليها</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="border-none shadow-lg bg-white">
                  <CardHeader>
                    <CardTitle>إجراءات سريعة</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      className="w-full gap-2 justify-start bg-primary hover:bg-primary/90"
                      onClick={() => setLocation("/student-qa")}
                    >
                      <MessageSquare size={18} /> اطرح سؤالاً
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full gap-2 justify-start"
                      onClick={() => setLocation("/programs")}
                    >
                      <BookOpen size={18} /> البرامج الأكاديمية
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full gap-2 justify-start"
                      onClick={() => setLocation("/teachers")}
                    >
                      <User size={18} /> الهيئة التدريسية
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSchool } from "@/lib/store";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { BookOpen, Award, MessageSquare, LogOut, BarChart3, Bell, Users, Clock, Target, Zap, TrendingUp, Calendar, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function StudentPortal() {
  const [, setLocation] = useLocation();
  const { currentUser, logoutUser, getUserNotifications, questions } = useSchool();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");

  if (!currentUser || currentUser.role !== "student") {
    setLocation("/login-new");
    return null;
  }

  const notifications = getUserNotifications(currentUser.id);
  const studentQuestions = questions.filter(q => q.studentEmail === currentUser.email);

  const handleLogout = () => {
    logoutUser();
    toast({ title: "تم تسجيل الخروج" });
    setLocation("/");
  };

  // Mock data for student
  const subjects = [
    { id: 1, name: "الرياضيات", teacher: "أحمد علي", progress: 85, icon: "Calculator" },
    { id: 2, name: "الفيزياء", teacher: "فاطمة حسين", progress: 72, icon: "Zap" },
    { id: 3, name: "الكيمياء", teacher: "محمد حسن", progress: 90, icon: "Beaker" },
    { id: 4, name: "اللغة الإنجليزية", teacher: "زينب كاظم", progress: 78, icon: "BookOpen" },
  ];

  const schedule = [
    { day: "السبت", time: "09:00 - 10:30", subject: "الرياضيات", room: "102" },
    { day: "السبت", time: "11:00 - 12:30", subject: "الفيزياء", room: "201" },
    { day: "الأحد", time: "09:00 - 10:30", subject: "الكيمياء", room: "305" },
    { day: "الأحد", time: "14:00 - 15:30", subject: "اللغة الإنجليزية", room: "107" },
  ];

  const achievements = [
    { id: 1, title: "نجم الرياضيات", description: "حصلت على 95% في اختبار الرياضيات", icon: "⭐", date: "2024-05-10" },
    { id: 2, title: "متفوق متسلسل", description: "3 أسابيع بدون غياب", icon: "🎯", date: "2024-05-05" },
    { id: 3, title: "صاحب الفضول", description: "طرحت 10 أسئلة هذا الشهر", icon: "🤔", date: "2024-04-28" },
  ];

  const recentLessons = [
    { id: 1, subject: "الرياضيات", title: "الدوال والمعادلات", date: "2024-05-15", files: 3 },
    { id: 2, subject: "الفيزياء", title: "الحركة والقوة", date: "2024-05-14", files: 2 },
    { id: 3, subject: "الكيمياء", title: "التفاعلات الكيميائية", date: "2024-05-13", files: 4 },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-accent/10 via-secondary/5 to-primary/5">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-accent via-secondary to-primary text-white pt-12 pb-20">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-start">
              <div>
                <h1 className="text-5xl font-bold mb-3">مرحباً بك، {currentUser.name} 🎓</h1>
                <div className="flex items-center gap-3 text-white/80">
                  <span className="inline-block w-3 h-3 bg-white rounded-full"></span>
                  <p>الصف: {currentUser.grade} | انضممت في: {currentUser.joinDate}</p>
                </div>
              </div>
              <Button 
                variant="secondary" 
                size="lg" 
                className="gap-2 bg-white/20 hover:bg-white/30 border border-white/30"
                onClick={handleLogout}
              >
                <LogOut size={18} /> خروج
              </Button>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* Quick Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-blue-100/50 hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">المعدل العام</p>
                    <p className="text-3xl font-bold text-blue-600">81%</p>
                  </div>
                  <div className="bg-blue-200/50 p-3 rounded-lg text-blue-600">
                    <TrendingUp size={28} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-gradient-to-br from-green-50 to-green-100/50 hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">الإنجازات</p>
                    <p className="text-3xl font-bold text-green-600">{achievements.length}</p>
                  </div>
                  <div className="bg-green-200/50 p-3 rounded-lg text-green-600">
                    <Award size={28} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-gradient-to-br from-purple-50 to-purple-100/50 hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">الدروس الجديدة</p>
                    <p className="text-3xl font-bold text-purple-600">{recentLessons.length}</p>
                  </div>
                  <div className="bg-purple-200/50 p-3 rounded-lg text-purple-600">
                    <BookOpen size={28} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-gradient-to-br from-orange-50 to-orange-100/50 hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">الإشعارات</p>
                    <p className="text-3xl font-bold text-orange-600">{notifications.length}</p>
                  </div>
                  <div className="bg-orange-200/50 p-3 rounded-lg text-orange-600">
                    <Bell size={28} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Tabs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-none shadow-2xl">
              <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-secondary/5 pb-6">
                <CardTitle className="text-2xl text-primary">مجال الدراسة</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-5 mb-6 bg-muted/50">
                    <TabsTrigger value="dashboard">اللوحة</TabsTrigger>
                    <TabsTrigger value="subjects">المواد</TabsTrigger>
                    <TabsTrigger value="schedule">الجدول</TabsTrigger>
                    <TabsTrigger value="achievements">الإنجازات</TabsTrigger>
                    <TabsTrigger value="messages">الرسائل</TabsTrigger>
                  </TabsList>

                  <TabsContent value="dashboard" className="mt-6 space-y-6">
                    {/* Subjects Overview */}
                    <div>
                      <h3 className="text-lg font-bold text-primary mb-4">المواد الدراسية</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {subjects.map((subject, idx) => (
                          <motion.div key={subject.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}>
                            <Card className="border-none hover:shadow-lg transition-all cursor-pointer group">
                              <CardContent className="p-5">
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="font-bold text-primary">{subject.name}</h4>
                                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{subject.progress}%</span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">المعلم: {subject.teacher}</p>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <motion.div 
                                    className="bg-gradient-to-r from-primary to-secondary h-full rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${subject.progress}%` }}
                                    transition={{ delay: 0.3, duration: 1 }}
                                  />
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Recent Lessons */}
                    <div className="mt-8">
                      <h3 className="text-lg font-bold text-primary mb-4">آخر الدروس المضافة</h3>
                      <div className="space-y-3">
                        {recentLessons.map((lesson) => (
                          <Card key={lesson.id} className="border-none hover:shadow-lg transition-all">
                            <CardContent className="p-4 flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="bg-secondary/10 p-3 rounded-lg">
                                  <FileText className="text-secondary" size={24} />
                                </div>
                                <div>
                                  <p className="font-bold text-primary">{lesson.title}</p>
                                  <p className="text-sm text-muted-foreground">{lesson.subject} • {lesson.date}</p>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm" className="gap-1">
                                تحميل ({lesson.files})
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="subjects" className="mt-6 space-y-4">
                    {subjects.map((subject) => (
                      <Card key={subject.id} className="border-none hover:shadow-lg transition-all">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="text-xl font-bold text-primary">{subject.name}</h4>
                              <p className="text-muted-foreground">👨‍🏫 المعلم: {subject.teacher}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-3xl font-bold text-secondary">{subject.progress}%</p>
                              <p className="text-xs text-muted-foreground">التقدم</p>
                            </div>
                          </div>
                          <div className="w-full bg-muted rounded-full h-3">
                            <motion.div 
                              className="bg-gradient-to-r from-secondary to-accent h-full rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${subject.progress}%` }}
                              transition={{ delay: 0.3, duration: 1 }}
                            />
                          </div>
                          <div className="mt-4 pt-4 border-t flex gap-2">
                            <Button size="sm" className="gap-1">📚 الدروس</Button>
                            <Button size="sm" variant="outline" className="gap-1">✏️ التمارين</Button>
                            <Button size="sm" variant="outline" className="gap-1">📝 الاختبارات</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="schedule" className="mt-6">
                    <div className="space-y-4">
                      {schedule.map((item, idx) => (
                        <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                          <Card className="border-none hover:shadow-lg transition-all">
                            <CardContent className="p-5 flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="bg-primary/10 p-3 rounded-lg">
                                  <Calendar className="text-primary" size={24} />
                                </div>
                                <div>
                                  <p className="font-bold text-primary">{item.subject}</p>
                                  <p className="text-sm text-muted-foreground">📍 القاعة {item.room}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-primary">{item.day}</p>
                                <p className="text-sm text-muted-foreground">{item.time}</p>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="achievements" className="mt-6 space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      {achievements.map((achievement) => (
                        <motion.div key={achievement.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: achievement.id * 0.1 }}>
                          <Card className="border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50 hover:shadow-lg transition-all">
                            <CardContent className="p-6 text-center">
                              <p className="text-5xl mb-3">{achievement.icon}</p>
                              <h4 className="font-bold text-primary mb-1">{achievement.title}</h4>
                              <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                              <p className="text-xs text-muted-foreground">📅 {achievement.date}</p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="messages" className="mt-6 space-y-4">
                    {studentQuestions.length > 0 ? (
                      studentQuestions.map((q) => (
                        <Card key={q.id} className="border-none hover:shadow-lg transition-all">
                          <CardContent className="p-5">
                            <div className="flex gap-4">
                              <div className="text-2xl">❓</div>
                              <div className="flex-1">
                                <p className="font-bold text-primary mb-2">{q.question}</p>
                                {q.answered ? (
                                  <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-sm">
                                    <p className="font-bold text-green-700 mb-1">✓ إجابة من المعلم:</p>
                                    <p className="text-green-700">{q.answer}</p>
                                  </div>
                                ) : (
                                  <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                                    <p className="text-xs text-yellow-700">⏳ في انتظار الإجابة...</p>
                                  </div>
                                )}
                                <p className="text-xs text-muted-foreground mt-2">{q.date}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <Card className="border-none bg-muted/50">
                        <CardContent className="p-8 text-center">
                          <MessageSquare className="mx-auto mb-3 text-muted-foreground" size={40} />
                          <p className="text-muted-foreground">لم تطرح أي أسئلة حتى الآن</p>
                          <Button className="mt-4 gap-2">
                            <MessageSquare size={16} /> اطرح سؤالاً
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>

          {/* Motivational Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-12">
            <Card className="border-none bg-gradient-to-r from-primary/10 to-secondary/10 shadow-lg">
              <CardContent className="p-8 text-center">
                <Target className="mx-auto mb-3 text-primary" size={40} />
                <h3 className="text-2xl font-bold text-primary mb-2">أنت تحقق إنجازات رائعة! 🌟</h3>
                <p className="text-muted-foreground mb-4">استمر في المثابرة والدراسة، النجاح قادم</p>
                <Button className="bg-primary hover:bg-primary/90 font-bold">اعرف نصائح الدراسة الفعالة</Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}

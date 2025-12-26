import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useSchool } from "@/lib/store";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Award, MessageSquare, LogOut, TrendingUp, Calendar, FileText, Target, ChevronLeft, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function StudentPortal() {
  const [, setLocation] = useLocation();
  const { currentUser, logoutUser, getUserNotifications, questions, addQuestion, classes, lessons } = useSchool();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");

  if (!currentUser || currentUser.role !== "student") {
    setLocation("/login-new");
    return null;
  }

  const [newQuestion, setNewQuestion] = useState("");
  const [selectedLesson, setSelectedLesson] = useState<any>(null);

  const handleLogout = () => {
    logoutUser();
    toast({ title: "تم تسجيل الخروج" });
    setLocation("/");
  };

  const handleAddQuestion = () => {
    if (!newQuestion.trim()) return;
    addQuestion({
      studentName: currentUser.name || "طالب",
      studentEmail: currentUser.email,
      question: newQuestion,
    });
    setNewQuestion("");
    toast({ title: "تم إرسال سؤالك للمعلم" });
  };

  const studentQuestions = questions.filter(q => q.studentEmail === currentUser.email);
  const notifications = getUserNotifications(currentUser.id);
  const studentClass = classes.find(c => c.grade === currentUser.grade);
  const classLessons = studentClass ? lessons.filter(l => l.classId === studentClass.id) : [];

  const stats = [
    { label: "المعدل العام", value: "81%", icon: <TrendingUp size={20} />, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "الدروس المتاحة", value: classLessons.length, icon: <BookOpen size={20} />, color: "text-purple-600", bg: "bg-purple-100" },
    { label: "التنبيهات", value: notifications.length, icon: <Bell size={20} />, color: "text-orange-600", bg: "bg-orange-100" },
    { label: "إنجازات", value: "3", icon: <Award size={20} />, color: "text-green-600", bg: "bg-green-100" },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50/50 via-white to-sky-50/50 pb-20">
        <div className="bg-gradient-to-r from-primary via-primary/90 to-indigo-600 text-white pt-12 pb-24 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-right">
                <h1 className="text-4xl md:text-6xl font-black mb-4">أهلاً بك، {currentUser.name} ✨</h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold border border-white/30">
                    الصف: {currentUser.grade || "غير محدد"}
                  </span>
                  <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold border border-white/30">
                    انضممت في: {currentUser.joinDate}
                  </span>
                </div>
              </div>
              <Button variant="secondary" size="lg" className="rounded-2xl px-8 font-black shadow-xl hover:scale-105 transition-all" onClick={handleLogout}>
                <LogOut size={18} className="ml-2" /> خروج آمن
              </Button>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {stats.map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="border-none shadow-xl bg-white/80 backdrop-blur hover:translate-y-[-5px] transition-all">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl mb-3`}>{stat.icon}</div>
                    <p className="text-sm font-bold text-muted-foreground mb-1">{stat.label}</p>
                    <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-3">
              <Card className="border-none shadow-xl bg-white/80 backdrop-blur sticky top-24">
                <CardContent className="p-4 space-y-2">
                  {[
                    { id: "dashboard", label: "الرئيسية", icon: <TrendingUp size={18} /> },
                    { id: "lessons", label: "الدروس والمواد", icon: <BookOpen size={18} /> },
                    { id: "questions", label: "أسئلتي", icon: <MessageSquare size={18} /> },
                    { id: "notifications", label: "التنبيهات", icon: <Bell size={18} /> },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all font-bold ${
                        activeTab === tab.id ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105" : "hover:bg-primary/5 text-muted-foreground"
                      }`}
                    >
                      <ChevronLeft size={16} className={activeTab === tab.id ? "opacity-100" : "opacity-0"} />
                      <div className="flex items-center gap-3">
                        <span>{tab.label}</span>
                        {tab.icon}
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-9">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === "dashboard" && (
                    <div className="space-y-8">
                      <div className="grid md:grid-cols-2 gap-6">
                        <Card className="border-none shadow-xl bg-gradient-to-br from-indigo-600 to-primary text-white">
                          <CardContent className="p-8">
                            <h3 className="text-2xl font-bold mb-4">خطة اليوم 📝</h3>
                            <p className="opacity-90 mb-6 leading-relaxed">لديك اليوم حصتان دراسيتان وواجب في مادة الرياضيات. استعد جيداً!</p>
                            <Button variant="secondary" className="w-full rounded-xl font-bold py-6">بدء الدراسة الآن</Button>
                          </CardContent>
                        </Card>
                        <Card className="border-none shadow-xl">
                          <CardContent className="p-8 text-center">
                            <Target className="mx-auto mb-4 text-primary" size={48} />
                            <h3 className="text-xl font-bold text-primary mb-2">أنت تحقق إنجازات رائعة! 🌟</h3>
                            <p className="text-muted-foreground mb-4">أكملت 85% من دروس هذا الأسبوع. استمر!</p>
                            <div className="w-full bg-muted rounded-full h-3 mb-2">
                              <div className="bg-primary h-full rounded-full w-[85%]" />
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <h3 className="text-2xl font-black text-primary text-right">أحدث الدروس 📚</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {classLessons.slice(0, 4).map((lesson) => (
                          <Card key={lesson.id} className="border-none shadow-md hover:shadow-xl transition-all cursor-pointer group" onClick={() => { setSelectedLesson(lesson); setActiveTab("lessons"); }}>
                            <CardContent className="p-6">
                              <div className="flex justify-between items-start mb-4">
                                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">{lesson.date}</span>
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                  <FileText size={20} />
                                </div>
                              </div>
                              <h4 className="text-lg font-black text-primary mb-2 text-right">{lesson.title}</h4>
                              <p className="text-sm text-muted-foreground text-right line-clamp-2">{lesson.content}</p>
                            </CardContent>
                          </Card>
                        ))}
                        {classLessons.length === 0 && <p className="text-center col-span-2 py-12 text-muted-foreground">لا توجد دروس جديدة حالياً</p>}
                      </div>
                    </div>
                  )}

                  {activeTab === "lessons" && (
                    <div className="space-y-6">
                      {selectedLesson ? (
                        <Card className="border-none shadow-2xl">
                          <CardHeader className="border-b bg-muted/30 p-8">
                            <div className="flex justify-between items-center mb-4">
                              <Button variant="outline" size="sm" onClick={() => setSelectedLesson(null)}>رجوع للقائمة</Button>
                              <span className="text-sm text-muted-foreground">{selectedLesson.date}</span>
                            </div>
                            <CardTitle className="text-3xl font-black text-primary text-right">{selectedLesson.title}</CardTitle>
                          </CardHeader>
                          <CardContent className="p-8">
                            <div className="prose prose-lg max-w-none text-right leading-loose whitespace-pre-wrap">
                              {selectedLesson.content}
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                          {classLessons.map((lesson) => (
                            <Card key={lesson.id} className="border-none shadow-xl hover:shadow-2xl transition-all group overflow-hidden" onClick={() => setSelectedLesson(lesson)}>
                              <CardContent className="p-0">
                                <div className="h-2 bg-primary group-hover:h-4 transition-all" />
                                <div className="p-6">
                                  <div className="flex justify-between items-center mb-4">
                                    <span className="text-xs text-muted-foreground font-bold">{lesson.date}</span>
                                    <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                                      <FileText size={24} />
                                    </div>
                                  </div>
                                  <h4 className="text-xl font-black text-primary mb-3 text-right">{lesson.title}</h4>
                                  <p className="text-sm text-muted-foreground text-right mb-6 line-clamp-3 leading-relaxed">{lesson.content}</p>
                                  <Button className="w-full rounded-xl font-bold h-12">ابدأ القراءة</Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                          {classLessons.length === 0 && (
                            <div className="col-span-2 text-center py-32 bg-white/50 rounded-3xl border-2 border-dashed border-muted-foreground/20">
                              <BookOpen size={64} className="mx-auto text-muted-foreground/30 mb-4" />
                              <p className="text-muted-foreground text-xl">لا توجد دروس منشورة لصفك بعد</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "questions" && (
                    <div className="space-y-6">
                      <Card className="border-none shadow-xl bg-primary/5 border border-primary/10">
                        <CardContent className="p-8">
                          <h3 className="text-xl font-bold text-primary mb-4 text-right">طرح سؤال جديد للأستاذ 💡</h3>
                          <div className="flex gap-3">
                            <Input 
                              value={newQuestion}
                              onChange={(e) => setNewQuestion(e.target.value)}
                              placeholder="اكتب سؤالك هنا بوضوح..."
                              className="text-right h-14 text-lg rounded-2xl"
                            />
                            <Button onClick={handleAddQuestion} className="h-14 px-8 rounded-2xl font-black text-lg gap-2">
                              إرسال <MessageSquare size={20} />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="space-y-4">
                        {studentQuestions.map((q) => (
                          <Card key={q.id} className="border-none shadow-lg hover:shadow-xl transition-all">
                            <CardContent className="p-6">
                              <div className="flex justify-between items-start mb-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${q.answered ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                  {q.answered ? "تمت الإجابة" : "في انتظار الرد"}
                                </span>
                                <div className="text-right">
                                  <p className="font-bold text-primary text-lg mb-1">{q.question}</p>
                                  <p className="text-xs text-muted-foreground">{q.date}</p>
                                </div>
                              </div>
                              {q.answered && (
                                <div className="bg-green-50 p-5 rounded-2xl border border-green-100 text-right mt-4">
                                  <p className="font-black text-green-800 mb-2">إجابة المعلم:</p>
                                  <p className="text-green-700 leading-relaxed">{q.answer}</p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                        {studentQuestions.length === 0 && <p className="text-center py-12 text-muted-foreground font-bold text-lg">لم تطرح أي أسئلة بعد</p>}
                      </div>
                    </div>
                  )}

                  {activeTab === "notifications" && (
                    <div className="space-y-4">
                      {notifications.map((n) => (
                        <Card key={n.id} className="border-none shadow-md bg-white hover:bg-muted/10 transition-all">
                          <CardContent className="p-6 flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">{n.createdAt}</span>
                            <div className="flex items-center gap-4 text-right">
                              <div>
                                <p className="font-black text-primary">{n.title}</p>
                                <p className="text-sm text-muted-foreground">{n.message}</p>
                              </div>
                              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                                <Bell size={20} />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      {notifications.length === 0 && <p className="text-center py-20 text-muted-foreground text-xl font-bold">لا توجد تنبيهات جديدة 🔕</p>}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

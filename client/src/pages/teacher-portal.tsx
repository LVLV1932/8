import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSchool } from "@/lib/store";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { BookOpen, Users, MessageSquare, LogOut, BarChart3, Plus, Upload, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function TeacherPortal() {
  const [, setLocation] = useLocation();
  const { currentUser, logoutUser, questions, answerQuestion, articles } = useSchool();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");

  if (!currentUser || currentUser.role !== "teacher") {
    setLocation("/login-new");
    return null;
  }

  const [answerText, setAnswerText] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);

  const handleLogout = () => {
    logoutUser();
    toast({ title: "تم تسجيل الخروج" });
    setLocation("/");
  };

  const handleAnswerQuestion = (questionId: number) => {
    if (!answerText.trim()) {
      toast({ variant: "destructive", title: "خطأ", description: "يرجى كتابة إجابة" });
      return;
    }
    answerQuestion(questionId, answerText);
    setAnswerText("");
    setSelectedQuestion(null);
    toast({ title: "تم إرسال الإجابة ✓" });
  };

  const unansweredQuestions = questions.filter(q => !q.answered);
  const answeredQuestions = questions.filter(q => q.answered);

  const studentCount = 45;
  const classesPerWeek = 12;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-secondary/10 via-primary/5 to-accent/5">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-secondary via-primary to-accent text-white pt-12 pb-20">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-start">
              <div>
                <h1 className="text-5xl font-bold mb-3">مرحباً، {currentUser.name} 👨‍🏫</h1>
                <p className="text-white/80">تخصص: {currentUser.subject}</p>
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
          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-blue-100/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">الطلاب</p>
                    <p className="text-3xl font-bold text-blue-600">{studentCount}</p>
                  </div>
                  <Users className="text-blue-600" size={32} />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-gradient-to-br from-green-50 to-green-100/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">الحصص أسبوعياً</p>
                    <p className="text-3xl font-bold text-green-600">{classesPerWeek}</p>
                  </div>
                  <Clock className="text-green-600" size={32} />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-gradient-to-br from-purple-50 to-purple-100/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">أسئلة بانتظار</p>
                    <p className="text-3xl font-bold text-purple-600">{unansweredQuestions.length}</p>
                  </div>
                  <MessageSquare className="text-purple-600" size={32} />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-gradient-to-br from-orange-50 to-orange-100/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">الدروس المرفوعة</p>
                    <p className="text-3xl font-bold text-orange-600">{articles.length}</p>
                  </div>
                  <BookOpen className="text-orange-600" size={32} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-none shadow-2xl">
              <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-secondary/5 pb-6">
                <CardTitle className="text-2xl text-primary">لوحة التحكم</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4 mb-6">
                    <TabsTrigger value="dashboard">اللوحة</TabsTrigger>
                    <TabsTrigger value="questions">الأسئلة</TabsTrigger>
                    <TabsTrigger value="uploads">الدروس</TabsTrigger>
                    <TabsTrigger value="students">الطلاب</TabsTrigger>
                  </TabsList>

                  <TabsContent value="dashboard" className="mt-6">
                    <div className="space-y-6">
                      <Card className="border-none bg-muted/50">
                        <CardContent className="p-6">
                          <h3 className="text-lg font-bold text-primary mb-3">📊 إحصائيات سريعة</h3>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-lg border">
                              <p className="text-muted-foreground text-sm mb-1">متوسط حضور الطلاب</p>
                              <p className="text-2xl font-bold text-primary">92%</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg border">
                              <p className="text-muted-foreground text-sm mb-1">متوسط التقييم</p>
                              <p className="text-2xl font-bold text-secondary">4.8/5 ⭐</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-none">
                        <CardContent className="p-6">
                          <h3 className="text-lg font-bold text-primary mb-4">📋 رسالة للطلاب</h3>
                          <Textarea placeholder="أكتب رسالة تحفيزية للطلاب..." className="mb-3" />
                          <Button className="gap-2"><Plus size={16} /> إرسال رسالة</Button>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="questions" className="mt-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-primary mb-4">❓ أسئلة الطلاب ({unansweredQuestions.length} بانتظار)</h3>
                      {unansweredQuestions.length > 0 ? (
                        unansweredQuestions.map((q) => (
                          <Card key={q.id} className="border-2 border-yellow-300 bg-yellow-50">
                            <CardContent className="p-5">
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                  <p className="font-bold text-primary mb-1">{q.question}</p>
                                  <p className="text-xs text-muted-foreground">من: {q.studentName} ({q.studentEmail})</p>
                                </div>
                                <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">بانتظار</span>
                              </div>
                              
                              {selectedQuestion === q.id ? (
                                <div className="mt-4 p-4 bg-white rounded-lg border border-yellow-300">
                                  <Label className="mb-2 block font-bold">إجابتك:</Label>
                                  <Textarea 
                                    value={answerText}
                                    onChange={(e) => setAnswerText(e.target.value)}
                                    placeholder="أكتب إجابتك هنا..."
                                    className="mb-3"
                                  />
                                  <div className="flex gap-2">
                                    <Button size="sm" onClick={() => handleAnswerQuestion(q.id)} className="gap-1">
                                      <CheckCircle size={16} /> إرسال الإجابة
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => setSelectedQuestion(null)}>إلغاء</Button>
                                  </div>
                                </div>
                              ) : (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="mt-3"
                                  onClick={() => setSelectedQuestion(q.id)}
                                >
                                  الرد على السؤال
                                </Button>
                              )}
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <Card className="border-none bg-muted/50">
                          <CardContent className="p-8 text-center">
                            <CheckCircle className="mx-auto mb-3 text-green-600" size={40} />
                            <p className="text-muted-foreground">لا توجد أسئلة بانتظار الإجابة</p>
                          </CardContent>
                        </Card>
                      )}
                    </div>

                    {answeredQuestions.length > 0 && (
                      <div className="mt-8">
                        <h3 className="text-lg font-bold text-primary mb-4">✓ الأسئلة المجابة ({answeredQuestions.length})</h3>
                        <div className="space-y-3">
                          {answeredQuestions.map((q) => (
                            <Card key={q.id} className="border-none bg-green-50">
                              <CardContent className="p-4">
                                <p className="font-bold text-primary mb-1">{q.question}</p>
                                <p className="text-sm text-green-700 mb-2">✓ {q.answer}</p>
                                <p className="text-xs text-muted-foreground">الإجابة في: {q.date}</p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="uploads" className="mt-6">
                    <Card className="border-none">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-bold text-primary mb-6">📚 رفع درس جديد</h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>عنوان الدرس</Label>
                            <Input placeholder="الدوال والمعادلات" />
                          </div>
                          <div className="space-y-2">
                            <Label>الوصف</Label>
                            <Textarea placeholder="وصف الدرس..." rows={4} />
                          </div>
                          <div className="space-y-2">
                            <Label>الملفات</Label>
                            <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-all">
                              <Upload className="mx-auto mb-2 text-muted-foreground" size={32} />
                              <p className="text-muted-foreground">اسحب الملفات أو اضغط للاختيار</p>
                            </div>
                          </div>
                          <Button className="w-full gap-2"><Plus size={16} /> رفع الدرس</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="students" className="mt-6">
                    <div className="space-y-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Card key={i} className="border-none hover:shadow-lg transition-all">
                          <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                {String.fromCharCode(65 + i)}
                              </div>
                              <div>
                                <p className="font-bold text-primary">طالب {i + 1}</p>
                                <p className="text-xs text-muted-foreground">student{i + 1}@school.iq</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-secondary">{85 + i}%</p>
                              <p className="text-xs text-muted-foreground">المعدل</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}

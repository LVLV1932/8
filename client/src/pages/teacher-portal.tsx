import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSchool } from "@/lib/store";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { BookOpen, Users, MessageSquare, LogOut, Plus, Trash, FileText, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function TeacherPortal() {
  const [, setLocation] = useLocation();
  const { currentUser, logoutUser, classes, lessons, addLesson, deleteLesson, questions, answerQuestion } = useSchool();
  const { toast } = useToast();
  
  const [newLesson, setNewLesson] = useState({ title: "", content: "", classId: "" });
  const [answerText, setAnswerText] = useState("");
  const [answeringId, setAnsweringId] = useState<number | null>(null);

  if (!currentUser || currentUser.role !== "teacher") {
    setLocation("/login-new");
    return null;
  }

  const teacherClasses = classes.filter(c => c.teacherId === currentUser.id);
  const teacherLessons = lessons.filter(l => l.teacherId === currentUser.id);
  const unansweredQuestions = questions.filter(q => !q.answered);
  const answeredQuestions = questions.filter(q => q.answered);

  const handleAddLesson = () => {
    if (!newLesson.title || !newLesson.classId) return;
    addLesson({
      title: newLesson.title,
      content: newLesson.content,
      classId: Number(newLesson.classId),
      teacherId: currentUser.id
    });
    setNewLesson({ title: "", content: "", classId: "" });
    toast({ title: "تم إضافة الدرس بنجاح" });
  };

  const handleAnswerQuestion = (questionId: number) => {
    if (!answerText.trim()) {
      toast({ variant: "destructive", title: "خطأ", description: "يرجى كتابة إجابة" });
      return;
    }
    answerQuestion(questionId, answerText);
    setAnswerText("");
    setAnsweringId(null);
    toast({ title: "تم إرسال الإجابة ✓" });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-secondary/10 via-primary/5 to-accent/5 pb-12">
        <div className="bg-gradient-to-r from-secondary via-primary to-accent text-white pt-12 pb-20">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <div>
              <h1 className="text-5xl font-bold mb-3">أهلاً بك، أستاذ {currentUser.name} 👨‍🏫</h1>
              <p className="text-white/80">تخصص: {currentUser.subject} | لديك {teacherClasses.length} صفوف</p>
            </div>
            <Button variant="secondary" size="lg" className="gap-2 bg-white/20 hover:bg-white/30 border border-white/30" onClick={() => { logoutUser(); setLocation("/"); }}>
              <LogOut size={18} /> خروج
            </Button>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="border-none shadow-lg bg-white/80 backdrop-blur">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">صفوفي</p>
                  <p className="text-3xl font-bold text-blue-600">{teacherClasses.length}</p>
                </div>
                <Users className="text-blue-600" size={32} />
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg bg-white/80 backdrop-blur">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">أسئلة بانتظار</p>
                  <p className="text-3xl font-bold text-purple-600">{unansweredQuestions.length}</p>
                </div>
                <MessageSquare className="text-purple-600" size={32} />
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg bg-white/80 backdrop-blur">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">دروسي المنشورة</p>
                  <p className="text-3xl font-bold text-orange-600">{teacherLessons.length}</p>
                </div>
                <BookOpen className="text-orange-600" size={32} />
              </CardContent>
            </Card>
          </motion.div>

          <Tabs defaultValue="classes">
            <TabsList className="mb-8 bg-white/50 backdrop-blur p-1 rounded-xl shadow-sm">
              <TabsTrigger value="classes" className="rounded-lg px-8">صفوفي</TabsTrigger>
              <TabsTrigger value="lessons" className="rounded-lg px-8">الدروس</TabsTrigger>
              <TabsTrigger value="questions" className="rounded-lg px-8">الأسئلة</TabsTrigger>
            </TabsList>

            <TabsContent value="classes">
              <div className="grid md:grid-cols-2 gap-6">
                {teacherClasses.map(c => (
                  <Card key={c.id} className="border-none bg-white/80 backdrop-blur hover:shadow-xl transition-all group overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <Users size={24} />
                        </div>
                        <div className="text-right">
                          <h3 className="text-2xl font-bold text-primary">{c.grade} - {c.name}</h3>
                          <p className="text-muted-foreground">قم بإدارة الدروس والطلاب لهذا الصف</p>
                        </div>
                      </div>
                      <Button className="mt-6 w-full h-12 text-lg font-bold rounded-xl shadow-lg shadow-primary/10">عرض قائمة الطلاب</Button>
                    </CardContent>
                  </Card>
                ))}
                {teacherClasses.length === 0 && (
                  <div className="col-span-2 text-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-muted-foreground/20">
                    <p className="text-muted-foreground text-xl">لا توجد صفوف معينة لك حالياً</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="lessons">
              <div className="grid lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-1 border-none shadow-xl">
                  <CardHeader><CardTitle className="text-xl font-bold">نشر درس جديد</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="font-bold">اختيار الصف</Label>
                      <select 
                        className="w-full border-2 border-muted bg-background rounded-xl p-3 text-right focus:border-primary transition-colors outline-none" 
                        value={newLesson.classId}
                        onChange={e => setNewLesson({...newLesson, classId: e.target.value})}
                      >
                        <option value="">-- اختر الصف --</option>
                        {teacherClasses.map(c => <option key={c.id} value={c.id}>{c.grade} - {c.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2 text-right">
                      <Label className="font-bold">عنوان الدرس</Label>
                      <Input placeholder="أدخل عنوان الدرس..." value={newLesson.title} onChange={e => setNewLesson({...newLesson, title: e.target.value})} className="text-right h-12" />
                    </div>
                    <div className="space-y-2 text-right">
                      <Label className="font-bold">محتوى الدرس</Label>
                      <Textarea placeholder="أدخل تفاصيل الدرس..." value={newLesson.content} onChange={e => setNewLesson({...newLesson, content: e.target.value})} className="text-right" rows={5} />
                    </div>
                    <Button className="w-full h-12 text-lg font-bold gap-2" onClick={handleAddLesson}><Plus size={20} /> نشر الآن</Button>
                  </CardContent>
                </Card>

                <div className="lg:col-span-2 space-y-4">
                  <h3 className="font-bold text-xl mb-4 text-primary text-right">قائمة الدروس المنشورة</h3>
                  {teacherLessons.map(l => (
                    <Card key={l.id} className="border-none shadow-md bg-white/80 hover:bg-white transition-all">
                      <CardContent className="p-6 flex justify-between items-center">
                        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 h-12 w-12" onClick={() => deleteLesson(l.id)}>
                          <Trash size={20} />
                        </Button>
                        <div className="text-right">
                          <h4 className="font-bold text-primary text-xl">{l.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            الصف: {classes.find(c => c.id === l.classId)?.name} | بتاريخ: {l.date}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="questions">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-primary mb-4 text-right">❓ أسئلة جديدة ({unansweredQuestions.length})</h3>
                  {unansweredQuestions.map((q) => (
                    <Card key={q.id} className="border-2 border-yellow-200 bg-yellow-50/50 hover:bg-yellow-50 transition-all">
                      <CardContent className="p-6">
                        <div className="text-right mb-4">
                          <p className="font-bold text-primary text-xl leading-relaxed">{q.question}</p>
                          <div className="flex justify-end gap-2 items-center mt-2">
                             <span className="text-xs text-muted-foreground">{q.date}</span>
                             <span className="text-xs font-bold text-primary/70">من: {q.studentName}</span>
                          </div>
                        </div>
                        {answeringId === q.id ? (
                          <div className="mt-4 space-y-4">
                            <Textarea value={answerText} onChange={(e) => setAnswerText(e.target.value)} placeholder="اكتب إجابتك هنا..." className="text-right text-lg p-4" rows={4} />
                            <div className="flex gap-2">
                              <Button size="lg" className="flex-1 font-bold" onClick={() => handleAnswerQuestion(q.id)}>إرسال الإجابة</Button>
                              <Button size="lg" variant="outline" className="font-bold" onClick={() => setAnsweringId(null)}>إلغاء</Button>
                            </div>
                          </div>
                        ) : (
                          <Button size="lg" className="w-full font-bold h-12 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all" onClick={() => { setAnsweringId(q.id); setAnswerText(""); }}>الرد الآن</Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-green-700 mb-4 text-right">✓ تم الرد عليها ({answeredQuestions.length})</h3>
                  {answeredQuestions.map((q) => (
                    <Card key={q.id} className="border-none bg-green-50/50 hover:bg-green-50 transition-all">
                      <CardContent className="p-6 text-right">
                        <p className="font-bold text-primary text-lg mb-2">{q.question}</p>
                        <div className="bg-white/80 p-4 rounded-xl border border-green-100">
                          <p className="text-green-700 leading-relaxed font-medium">✓ الإجابة: {q.answer}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}

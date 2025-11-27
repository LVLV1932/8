import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useSchool } from "@/lib/store";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { MessageSquare, Send, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";

export default function StudentQA() {
  const { currentStudent, addQuestion, questions } = useSchool();
  const { toast } = useToast();
  const { register, handleSubmit, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!currentStudent) return null;

  const studentQuestions = questions.filter(q => q.studentEmail === currentStudent.email);
  const answeredCount = studentQuestions.filter(q => q.answered).length;

  const onSubmit = async (data: any) => {
    if (!data.question || data.question.trim().length < 5) {
      toast({ variant: "destructive", title: "خطأ", description: "يرجى كتابة سؤال واضح" });
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    addQuestion({
      studentName: currentStudent.name,
      studentEmail: currentStudent.email,
      question: data.question
    });

    toast({ title: "تم إرسال سؤالك بنجاح", description: "ستتلقى الرد قريباً من الإدارة" });
    reset();
    setIsSubmitting(false);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-accent/5 to-secondary/5">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary/80 text-white pt-12 pb-8">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <MessageSquare size={32} /> الأسئلة والإجابات
              </h1>
              <p className="text-white/80">اطرح أسئلتك والإدارة ستجيب عليها في أسرع وقت</p>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Ask Question Form */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <Card className="border-none shadow-lg bg-white">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
                  <CardTitle className="flex items-center gap-2">
                    <Send size={20} className="text-primary" />
                    اطرح سؤالك
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-8">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                      <Label>السؤال</Label>
                      <Textarea 
                        placeholder="اكتب سؤالك هنا... (مثال: ما هي البرامج المتاحة في المدرسة؟)"
                        rows={5}
                        {...register("question")}
                        className="text-right"
                      />
                      <p className="text-xs text-muted-foreground">يرجى كتابة سؤال واضح وشامل للحصول على إجابة أفضل</p>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary/90 gap-2 text-base"
                      disabled={isSubmitting}
                    >
                      <Send size={18} /> {isSubmitting ? "جاري الإرسال..." : "إرسال السؤال"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Your Questions */}
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-primary mb-6">أسئلتك</h2>
                {studentQuestions.length > 0 ? (
                  <div className="space-y-4">
                    {studentQuestions.map((q, idx) => (
                      <motion.div
                        key={q.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <Card className="border-none shadow-md">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-bold text-primary text-lg">{q.question}</h3>
                                  {q.answered && (
                                    <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                      <CheckCircle size={14} /> مجابة
                                    </div>
                                  )}
                                </div>
                              </div>
                              <span className="text-xs text-muted-foreground">{q.date}</span>
                            </div>

                            {q.answered && q.answer && (
                              <div className="bg-green-50 p-4 rounded-lg border border-green-200 mt-4">
                                <p className="text-sm font-medium text-green-900 mb-2">الإجابة من الإدارة:</p>
                                <p className="text-sm text-green-800">{q.answer}</p>
                              </div>
                            )}

                            {!q.answered && (
                              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mt-4 flex items-center gap-2">
                                <Clock size={16} className="text-yellow-600" />
                                <p className="text-sm text-yellow-800">السؤال قيد الانتظار... ستتلقى الإجابة قريباً</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p className="text-muted-foreground">لم تطرح أي أسئلة بعد</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Stats Sidebar */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="space-y-6">
                {/* Stats Cards */}
                <Card className="border-none shadow-lg bg-gradient-to-br from-primary/10 to-secondary/10">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <p className="text-muted-foreground mb-2">إجمالي أسئلتك</p>
                      <p className="text-4xl font-bold text-primary">{studentQuestions.length}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-lg bg-gradient-to-br from-green-100 to-accent/10">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <p className="text-muted-foreground mb-2">الأسئلة المجابة</p>
                      <p className="text-4xl font-bold text-green-600">{answeredCount}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-lg bg-white">
                  <CardHeader>
                    <CardTitle className="text-base">نصائح</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm font-medium text-blue-900">💡 اكتب سؤالاً واضحاً</p>
                      <p className="text-xs text-blue-800 mt-1">السؤال الواضح يستحق إجابة واضحة</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm font-medium text-blue-900">⏰ تحقق بانتظام</p>
                      <p className="text-xs text-blue-800 mt-1">سيتم إخطارك عند الإجابة على أسئلتك</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm font-medium text-blue-900">📝 احفظ النسخة</p>
                      <p className="text-xs text-blue-800 mt-1">يمكنك الرجوع لأسئلتك السابقة في أي وقت</p>
                    </div>
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

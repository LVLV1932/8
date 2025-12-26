import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLocation } from "wouter";
import { Plus, Trash, Edit, Image as ImageIcon, FileText, Users, Settings, Save, LogOut, BookOpen, CheckCircle, AlertCircle, X, MessageSquare, Key, ClipboardList, Shield, UserCircle } from "lucide-react";
import { useSchool, Teacher, Program, Article, AssignedCode, Question, User } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { RegistrationsTab } from "./admin-registrations";

export default function Admin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { 
    config, updateConfig, 
    teachers, addTeacher, updateTeacher, deleteTeacher, 
    programs, addProgram, updateProgram, deleteProgram,
    articles, addArticle, updateArticle, deleteArticle,
    assignedCodes, addAssignedCode, updateAssignedCode, deleteAssignedCode,
    questions, answerQuestion, deleteQuestion,
    users, updateUser, deleteUser,
    classes, addClass, updateClass, deleteClass,
    terms, updateTerms
  } = useSchool();

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newTerms, setNewTerms] = useState(terms);
  const [newClassName, setNewClassName] = useState("");
  const [newClassGrade, setNewClassGrade] = useState("");

  // Local state for forms
  const [newTeacher, setNewTeacher] = useState({ name: "", email: "", subject: "", role: "", bio: "" });
  const [newProgram, setNewProgram] = useState({ title: "", desc: "", icon: "BookOpen" });
  const [newArticle, setNewArticle] = useState({ title: "", content: "", author: "", forStudents: false as boolean });
  const [newCode, setNewCode] = useState({ code: "", grade: "", assignedTo: "" });
  const [answerText, setAnswerText] = useState("");

  // Edit States
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    updateConfig({
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      studentCount: Number(formData.get("studentCount")),
      teacherCount: Number(formData.get("teacherCount")),
      successRate: Number(formData.get("successRate")),
      foundingYear: Number(formData.get("foundingYear")),
    });
    toast({ title: "تم حفظ الإعدادات بنجاح" });
  };

  // Teacher Handlers
  const handleAddTeacher = () => {
    if (!newTeacher.name || !newTeacher.subject) {
      toast({ variant: "destructive", title: "خطأ", description: "يرجى ملء الحقول المطلوبة" });
      return;
    }
    addTeacher(newTeacher);
    setNewTeacher({ name: "", email: "", subject: "", role: "", bio: "" });
    toast({ title: "تم إضافة المدرس بنجاح" });
  };

  const handleUpdateTeacher = () => {
    if (!editingTeacher) return;
    updateTeacher(editingTeacher);
    setEditingTeacher(null);
    toast({ title: "تم تحديث بيانات المدرس" });
  };

  // Program Handlers
  const handleAddProgram = () => {
    if (!newProgram.title) {
      toast({ variant: "destructive", title: "خطأ", description: "العنوان مطلوب" });
      return;
    }
    addProgram(newProgram);
    setNewProgram({ title: "", desc: "", icon: "BookOpen" });
    toast({ title: "تم إضافة البرنامج بنجاح" });
  };

  const handleUpdateProgram = () => {
    if (!editingProgram) return;
    updateProgram(editingProgram);
    setEditingProgram(null);
    toast({ title: "تم تحديث البرنامج" });
  };

  // Article Handlers
  const [articleImage, setArticleImage] = useState<string>("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setArticleImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddArticle = () => {
    if (!newArticle.title || !newArticle.content) {
      toast({ variant: "destructive", title: "خطأ", description: "العنوان والمحتوى مطلوبان" });
      return;
    }
    addArticle({ ...newArticle, image: articleImage });
    setNewArticle({ title: "", content: "", author: "", forStudents: false });
    setArticleImage("");
    toast({ title: "تم نشر المقال بنجاح" });
  };

  const handleUpdateArticle = () => {
    if (!editingArticle) return;
    updateArticle(editingArticle);
    setEditingArticle(null);
    toast({ title: "تم تحديث المقال" });
  };

  return (
    <Layout>
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground pb-20 pt-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-secondary/20 p-2 rounded-lg">
                <Settings className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">لوحة التحكم</h1>
                <p className="text-primary-foreground/70 text-sm">إدارة محتوى الموقع والإعدادات</p>
              </div>
            </div>
            <Button 
              variant="secondary" 
              size="sm" 
              className="gap-2 shadow-lg hover:bg-white"
              onClick={() => {
                toast({ title: "تم تسجيل الخروج" });
                setLocation("/");
              }}
            >
              <LogOut size={16}/> خروج
            </Button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 -mt-12 pb-12">
        <Card className="shadow-xl border-none bg-background/95 backdrop-blur-sm overflow-hidden">
          <Tabs defaultValue="config" className="w-full">
            <div className="border-b bg-muted/30 px-6 pt-2 overflow-x-auto">
              <TabsList className="bg-transparent h-auto p-0 gap-6 inline-flex min-w-full md:min-w-0">
                <TabsTrigger 
                  value="config" 
                  className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-secondary data-[state=active]:bg-transparent data-[state=active]:text-secondary data-[state=active]:shadow-none transition-all whitespace-nowrap"
                >
                  <div className="flex items-center gap-2">
                    <Settings size={16}/> الإعدادات العامة
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="teachers" 
                  className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-secondary data-[state=active]:bg-transparent data-[state=active]:text-secondary data-[state=active]:shadow-none transition-all whitespace-nowrap"
                >
                  <div className="flex items-center gap-2">
                    <Users size={16}/> المدرسون
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="programs" 
                  className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-secondary data-[state=active]:bg-transparent data-[state=active]:text-secondary data-[state=active]:shadow-none transition-all whitespace-nowrap"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen size={16}/> البرامج
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="articles" 
                  className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-secondary data-[state=active]:bg-transparent data-[state=active]:text-secondary data-[state=active]:shadow-none transition-all whitespace-nowrap"
                >
                  <div className="flex items-center gap-2">
                    <FileText size={16}/> المقالات
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="media" 
                  className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-secondary data-[state=active]:bg-transparent data-[state=active]:text-secondary data-[state=active]:shadow-none transition-all whitespace-nowrap"
                >
                  <div className="flex items-center gap-2">
                    <ImageIcon size={16}/> الوسائط
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="codes" 
                  className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-secondary data-[state=active]:bg-transparent data-[state=active]:text-secondary data-[state=active]:shadow-none transition-all whitespace-nowrap"
                >
                  <div className="flex items-center gap-2">
                    <Key size={16}/> أكواد الدخول
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="questions" 
                  className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-secondary data-[state=active]:bg-transparent data-[state=active]:text-secondary data-[state=active]:shadow-none transition-all whitespace-nowrap"
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare size={16}/> أسئلة الطلاب
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="users" 
                  className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-secondary data-[state=active]:bg-transparent data-[state=active]:text-secondary data-[state=active]:shadow-none transition-all whitespace-nowrap"
                >
                  <div className="flex items-center gap-2">
                    <Users size={16}/> إدارة المستخدمين
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="registrations" 
                  className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-secondary data-[state=active]:bg-transparent data-[state=active]:text-secondary data-[state=active]:shadow-none transition-all whitespace-nowrap"
                >
                  <div className="flex items-center gap-2">
                    <ClipboardList size={16}/> طلبات التسجيل
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="terms" 
                  className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-secondary data-[state=active]:bg-transparent data-[state=active]:text-secondary data-[state=active]:shadow-none transition-all whitespace-nowrap"
                >
                  <div className="flex items-center gap-2">
                    <FileText size={16}/> الشروط والأحكام
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="classes" 
                  className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-secondary data-[state=active]:bg-transparent data-[state=active]:text-secondary data-[state=active]:shadow-none transition-all whitespace-nowrap"
                >
                  <div className="flex items-center gap-2">
                    <Users size={16}/> الصفوف الدراسية
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6 md:p-8 bg-card min-h-[500px]">
              <TabsContent value="config" className="mt-0">
                <div className="max-w-4xl mx-auto">
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <Card className="bg-primary/5 border-none shadow-sm">
                      <CardContent className="p-6 flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-xl text-primary"><Users size={24}/></div>
                        <div><p className="text-sm text-muted-foreground font-bold">الطلاب</p><p className="text-2xl font-black">{users.filter(u => u.role === 'student').length}</p></div>
                      </CardContent>
                    </Card>
                    <Card className="bg-secondary/5 border-none shadow-sm">
                      <CardContent className="p-6 flex items-center gap-4">
                        <div className="bg-secondary/10 p-3 rounded-xl text-secondary"><Users size={24}/></div>
                        <div><p className="text-sm text-muted-foreground font-bold">المدرسون</p><p className="text-2xl font-black">{teachers.length}</p></div>
                      </CardContent>
                    </Card>
                    <Card className="bg-accent/5 border-none shadow-sm">
                      <CardContent className="p-6 flex items-center gap-4">
                        <div className="bg-accent/10 p-3 rounded-xl text-accent"><MessageSquare size={24}/></div>
                        <div><p className="text-sm text-muted-foreground font-bold">الأسئلة</p><p className="text-2xl font-black">{questions.length}</p></div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-primary mb-2">معلومات المدرسة</h2>
                    <p className="text-muted-foreground">هذه المعلومات تظهر في الصفحة الرئيسية وشريط الإحصائيات.</p>
                  </div>
                  
                  <form onSubmit={handleSaveConfig} className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-base">اسم المدرسة</Label>
                          <Input name="name" defaultValue={config.name} className="h-11" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-base">الوصف المختصر</Label>
                          <Input name="description" defaultValue={config.description} className="h-11" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-base">سنة التأسيس</Label>
                          <Input name="foundingYear" type="number" defaultValue={config.foundingYear} className="h-11" />
                        </div>
                      </div>
                      
                      <div className="space-y-4 bg-muted/20 p-6 rounded-xl border">
                        <h3 className="font-semibold text-primary mb-2">الإحصائيات</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>عدد الطلاب</Label>
                            <Input name="studentCount" type="number" defaultValue={config.studentCount} />
                          </div>
                          <div className="space-y-2">
                            <Label>عدد الكادر</Label>
                            <Input name="teacherCount" type="number" defaultValue={config.teacherCount} />
                          </div>
                          <div className="space-y-2 col-span-2">
                            <Label>نسبة النجاح (%)</Label>
                            <div className="relative">
                              <Input name="successRate" type="number" defaultValue={config.successRate} className="pr-12" />
                              <span className="absolute left-3 top-2.5 text-muted-foreground">%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end pt-4 border-t">
                      <Button type="submit" size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2 font-bold px-8">
                        <Save size={18}/> حفظ التغييرات
                      </Button>
                    </div>
                  </form>
                </div>
              </TabsContent>

              <TabsContent value="teachers" className="mt-0">
                <div className="grid lg:grid-cols-12 gap-8">
                  {/* Add Form */}
                  <div className="lg:col-span-4 space-y-6">
                    <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
                      <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                        <Plus size={18} className="text-secondary" /> إضافة مدرس جديد
                      </h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>الاسم</Label>
                          <Input 
                            value={newTeacher.name}
                            onChange={e => setNewTeacher({...newTeacher, name: e.target.value})}
                            placeholder="مثال: أحمد علي"
                            className="bg-background"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>المادة</Label>
                          <Input 
                            value={newTeacher.subject}
                            onChange={e => setNewTeacher({...newTeacher, subject: e.target.value})}
                            placeholder="مثال: الرياضيات"
                            className="bg-background"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>المنصب/الدور</Label>
                          <Input 
                            value={newTeacher.role}
                            onChange={e => setNewTeacher({...newTeacher, role: e.target.value})}
                            placeholder="مثال: مدرس أول"
                            className="bg-background"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>نبذة</Label>
                          <Textarea 
                            value={newTeacher.bio}
                            onChange={e => setNewTeacher({...newTeacher, bio: e.target.value})}
                            placeholder="نبذة مختصرة عن الخبرة..."
                            className="bg-background"
                            rows={3}
                          />
                        </div>
                        <Button onClick={handleAddTeacher} className="w-full gap-2 mt-2">
                          إضافة للقائمة
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* List */}
                  <div className="lg:col-span-8">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-primary">قائمة المدرسين</h3>
                      <span className="bg-secondary/20 text-secondary-foreground px-3 py-1 rounded-full text-sm font-bold">
                        {teachers.length} مدرس
                      </span>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      {teachers.map((teacher) => (
                        <motion.div 
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          key={teacher.id}
                          className="bg-background border rounded-xl p-4 flex items-start justify-between group hover:shadow-md transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary font-bold text-lg">
                              {teacher.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-bold text-primary">{teacher.name}</h4>
                              <p className="text-xs text-muted-foreground font-medium">{teacher.subject}</p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                                  onClick={() => setEditingTeacher(teacher)}
                                >
                                  <Edit size={16}/>
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>تعديل بيانات المدرس</DialogTitle>
                                </DialogHeader>
                                {editingTeacher && (
                                  <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                      <Label>الاسم</Label>
                                      <Input value={editingTeacher.name} onChange={e => setEditingTeacher({...editingTeacher, name: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>المادة</Label>
                                      <Input value={editingTeacher.subject} onChange={e => setEditingTeacher({...editingTeacher, subject: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>المنصب</Label>
                                      <Input value={editingTeacher.role} onChange={e => setEditingTeacher({...editingTeacher, role: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>نبذة</Label>
                                      <Textarea value={editingTeacher.bio} onChange={e => setEditingTeacher({...editingTeacher, bio: e.target.value})} />
                                    </div>
                                    <Button onClick={handleUpdateTeacher} className="w-full">حفظ التعديلات</Button>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              onClick={() => {
                                if(confirm('هل أنت متأكد من الحذف؟')) {
                                  deleteTeacher(teacher.id);
                                  toast({ title: "تم الحذف بنجاح" });
                                }
                              }}
                            >
                              <Trash size={16}/>
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="programs" className="mt-0">
                <div className="grid lg:grid-cols-12 gap-8">
                  {/* Add Form */}
                  <div className="lg:col-span-4 space-y-6">
                    <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
                      <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                        <Plus size={18} className="text-secondary" /> إضافة برنامج جديد
                      </h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>عنوان البرنامج</Label>
                          <Input 
                            value={newProgram.title}
                            onChange={e => setNewProgram({...newProgram, title: e.target.value})}
                            className="bg-background"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>الوصف</Label>
                          <Textarea 
                            value={newProgram.desc}
                            onChange={e => setNewProgram({...newProgram, desc: e.target.value})}
                            className="bg-background"
                            rows={4}
                          />
                        </div>
                        <Button onClick={handleAddProgram} className="w-full gap-2 mt-2">
                          إضافة البرنامج
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* List */}
                  <div className="lg:col-span-8">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-primary">البرامج الأكاديمية</h3>
                      <span className="bg-secondary/20 text-secondary-foreground px-3 py-1 rounded-full text-sm font-bold">
                        {programs.length} برنامج
                      </span>
                    </div>

                    <div className="space-y-3">
                      {programs.map((program) => (
                        <motion.div 
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          key={program.id}
                          className="bg-background border rounded-xl p-4 flex items-center justify-between group hover:border-secondary/50 transition-all"
                        >
                          <div className="flex items-center gap-4">
                            <div className="bg-secondary/10 p-2.5 rounded-lg text-secondary">
                              <BookOpen size={20} />
                            </div>
                            <div>
                              <h4 className="font-bold text-primary">{program.title}</h4>
                              <p className="text-sm text-muted-foreground max-w-md truncate">{program.desc}</p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                             <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                                  onClick={() => setEditingProgram(program)}
                                >
                                  <Edit size={16}/>
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>تعديل البرنامج</DialogTitle>
                                </DialogHeader>
                                {editingProgram && (
                                  <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                      <Label>العنوان</Label>
                                      <Input value={editingProgram.title} onChange={e => setEditingProgram({...editingProgram, title: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>الوصف</Label>
                                      <Textarea value={editingProgram.desc} onChange={e => setEditingProgram({...editingProgram, desc: e.target.value})} />
                                    </div>
                                    <Button onClick={handleUpdateProgram} className="w-full">حفظ التعديلات</Button>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              onClick={() => {
                                deleteProgram(program.id);
                                toast({ title: "تم الحذف بنجاح" });
                              }}
                            >
                              <Trash size={16}/>
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="articles" className="mt-0">
                <div className="grid lg:grid-cols-12 gap-8">
                   {/* Add Form */}
                   <div className="lg:col-span-4 space-y-6">
                    <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
                      <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                        <Plus size={18} className="text-secondary" /> نشر مقال جديد
                      </h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>عنوان المقال</Label>
                          <Input 
                            value={newArticle.title}
                            onChange={e => setNewArticle({...newArticle, title: e.target.value})}
                            className="bg-background text-right"
                            placeholder="عنوان جذاب..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>صورة المقال</Label>
                          <div className="flex flex-col gap-4">
                            <Input 
                              type="file" 
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="bg-background text-right"
                            />
                            {articleImage && (
                              <div className="relative w-full h-40 rounded-lg overflow-hidden border shadow-inner">
                                <img src={articleImage} alt="Preview" className="w-full h-full object-cover" />
                                <Button 
                                  variant="destructive" 
                                  size="sm" 
                                  className="absolute top-2 right-2 shadow-lg"
                                  onClick={() => setArticleImage("")}
                                >
                                  حذف الصورة
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>الكاتب (اختياري)</Label>
                          <Input 
                            value={newArticle.author}
                            onChange={e => setNewArticle({...newArticle, author: e.target.value})}
                            className="bg-background text-right"
                            placeholder="مثال: الإدارة"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>المحتوى</Label>
                          <Textarea 
                            value={newArticle.content}
                            onChange={e => setNewArticle({...newArticle, content: e.target.value})}
                            className="bg-background text-right"
                            rows={8}
                            placeholder="اكتب تفاصيل الخبر هنا..."
                          />
                        </div>
                        <Button onClick={handleAddArticle} className="w-full gap-2 mt-2 bg-primary hover:bg-primary/90 font-bold">
                          <FileText size={16}/> نشر المقال الآن
                        </Button>
                      </div>
                    </div>
                  </div>

                   {/* List */}
                  <div className="lg:col-span-8">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-primary">المقالات المنشورة</h3>
                      <span className="bg-secondary/20 text-secondary-foreground px-3 py-1 rounded-full text-sm font-bold">
                        {articles.length} مقال
                      </span>
                    </div>

                    <div className="space-y-4">
                      {articles.map((article) => (
                        <motion.div 
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          key={article.id}
                          className="bg-background border rounded-xl p-5 flex flex-col gap-3 group hover:border-secondary/50 transition-all shadow-sm"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                               <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                  <span>{article.date}</span>
                                  {article.author && <span>• {article.author}</span>}
                               </div>
                               <h4 className="font-bold text-lg text-primary">{article.title}</h4>
                            </div>
                            <div className="flex gap-1">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                                    onClick={() => setEditingArticle(article)}
                                  >
                                    <Edit size={16}/>
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>تعديل المقال</DialogTitle>
                                  </DialogHeader>
                                  {editingArticle && (
                                    <div className="space-y-4 py-4">
                                      <div className="space-y-2">
                                        <Label>العنوان</Label>
                                        <Input value={editingArticle.title} onChange={e => setEditingArticle({...editingArticle, title: e.target.value})} />
                                      </div>
                                      <div className="space-y-2">
                                        <Label>الكاتب</Label>
                                        <Input value={editingArticle.author} onChange={e => setEditingArticle({...editingArticle, author: e.target.value})} />
                                      </div>
                                      <div className="space-y-2">
                                        <Label>المحتوى</Label>
                                        <Textarea rows={8} value={editingArticle.content} onChange={e => setEditingArticle({...editingArticle, content: e.target.value})} />
                                      </div>
                                      <Button onClick={handleUpdateArticle} className="w-full">حفظ التعديلات</Button>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                onClick={() => {
                                  deleteArticle(article.id);
                                  toast({ title: "تم الحذف بنجاح" });
                                }}
                              >
                                <Trash size={16}/>
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                            {article.content}
                          </p>
                        </motion.div>
                      ))}
                      
                      {articles.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
                          <FileText className="w-10 h-10 mx-auto mb-2 opacity-20" />
                          <p>لا توجد مقالات بعد. قم بإضافة أول خبر!</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="media" className="mt-0">
                <div className="space-y-6">
                  <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
                    <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                      <Plus size={18} className="text-secondary" /> رفع صور جديدة
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>اختر الصور</Label>
                        <Input type="file" multiple accept="image/*" className="bg-background" />
                      </div>
                      <Button className="w-full gap-2 bg-primary hover:bg-primary/90">
                        <ImageIcon size={16}/> رفع الصور
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-primary mb-4">الصور والوسائط</h3>
                    <div className="grid md:grid-cols-4 gap-4">
                      {[
                        { id: 1, url: "https://via.placeholder.com/300?bg=1f3a93&text=حفل+مدرسي", title: "فعالية مدرسية 1" },
                        { id: 2, url: "https://via.placeholder.com/300?bg=ef4444&text=نشاط+تعليمي", title: "نشاط تعليمي" },
                        { id: 3, url: "https://via.placeholder.com/300?bg=22b366&text=فعالية+رياضية", title: "فعالية رياضية" },
                        { id: 4, url: "https://via.placeholder.com/300?bg=1f3a93&text=حفل+تخرج", title: "حفل تخرج" },
                      ].map(img => (
                        <div key={img.id} className="group relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all">
                          <img src={img.url} alt={img.title} className="w-full h-40 object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button size="icon" variant="ghost" className="text-white hover:bg-primary/50">
                              <Edit size={16} />
                            </Button>
                            <Button size="icon" variant="ghost" className="text-white hover:bg-destructive/50">
                              <Trash size={16} />
                            </Button>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white text-xs font-medium">{img.title}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="codes" className="mt-0">
                <div className="grid lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-4">
                    <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
                      <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                        <Plus size={18} className="text-secondary" /> إضافة كود جديد
                      </h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>الكود</Label>
                          <Input 
                            value={newCode.code}
                            onChange={e => setNewCode({...newCode, code: e.target.value})}
                            placeholder="ZUBAIR-2025-001"
                            className="bg-background"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>الصف/المرحلة</Label>
                          <Input 
                            value={newCode.grade}
                            onChange={e => setNewCode({...newCode, grade: e.target.value})}
                            placeholder="الأول الثانوي"
                            className="bg-background"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>مخصص لـ (اختياري)</Label>
                          <Input 
                            value={newCode.assignedTo}
                            onChange={e => setNewCode({...newCode, assignedTo: e.target.value})}
                            placeholder="اسم الطالب أو المعلم"
                            className="bg-background"
                          />
                        </div>
                        <Button onClick={() => {
                          if(newCode.code && newCode.grade) {
                            addAssignedCode(newCode);
                            setNewCode({code: "", grade: "", assignedTo: ""});
                            toast({title: "تم إضافة الكود بنجاح"});
                          }
                        }} className="w-full gap-2 mt-2">إضافة الكود</Button>
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-8">
                    <h3 className="text-lg font-bold text-primary mb-4">الأكواد المعينة</h3>
                    <div className="space-y-3">
                      {assignedCodes.map((code) => (
                        <motion.div key={code.id} layout initial={{opacity: 0}} animate={{opacity: 1}} className="bg-background border rounded-xl p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-primary">{code.code}</h4>
                                {code.usedBy && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">مستخدم</span>}
                              </div>
                              <p className="text-sm text-muted-foreground">الصف: {code.grade}</p>
                              {code.assignedTo && <p className="text-xs text-muted-foreground">مخصص لـ: {code.assignedTo}</p>}
                            </div>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => {if(confirm('حذف؟')) deleteAssignedCode(code.id); toast({title: "تم الحذف"});}}>
                              <Trash size={16}/>
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="questions" className="mt-0">
                <div>
                  <h3 className="text-lg font-bold text-primary mb-6">أسئلة الطلاب</h3>
                  <div className="space-y-4">
                    {questions.map((q) => (
                      <motion.div key={q.id} layout initial={{opacity: 0}} animate={{opacity: 1}} className="bg-background border rounded-xl p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <p className="font-bold text-primary mb-1">{q.studentName}</p>
                            <p className="text-sm text-muted-foreground mb-3">{q.question}</p>
                            <p className="text-xs text-muted-foreground">البريد: {q.studentEmail}</p>
                          </div>
                          {q.answered && <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle size={14}/> مجابة</div>}
                        </div>
                        {q.answered && q.answer && (
                          <div className="bg-green-50 p-3 rounded-lg mb-4 border border-green-200">
                            <p className="text-xs font-medium text-green-900 mb-1">الإجابة:</p>
                            <p className="text-sm text-green-800">{q.answer}</p>
                          </div>
                        )}
                        {!q.answered && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" className="gap-2">الإجابة</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader><DialogTitle>الإجابة على السؤال</DialogTitle></DialogHeader>
                              <Textarea placeholder="اكتب الإجابة هنا..." rows={4} value={answerText} onChange={e => setAnswerText(e.target.value)} />
                              <Button onClick={() => {
                                answerQuestion(q.id, answerText);
                                setAnswerText("");
                                toast({title: "تم إرسال الإجابة"});
                              }} className="w-full">إرسال الإجابة</Button>
                            </DialogContent>
                          </Dialog>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => deleteQuestion(q.id)} className="text-destructive">حذف</Button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="registrations" className="mt-0">
                <RegistrationsTab />
              </TabsContent>

              <TabsContent value="terms" className="mt-0">
                <div className="max-w-4xl mx-auto space-y-6">
                  <div className="text-right">
                    <h2 className="text-2xl font-bold text-primary">تعديل الشروط والأحكام</h2>
                    <p className="text-muted-foreground">تظهر هذه الشروط للمستخدمين الجدد عند إنشاء حساب</p>
                  </div>
                  <div className="space-y-4">
                    <Textarea 
                      value={newTerms} 
                      onChange={(e) => setNewTerms(e.target.value)} 
                      className="min-h-[300px] text-right text-lg leading-relaxed p-6"
                      placeholder="اكتب الشروط والأحكام هنا..."
                    />
                    <div className="flex justify-end">
                      <Button 
                        onClick={() => {
                          updateTerms(newTerms);
                          toast({ title: "✅ تم تحديث الشروط بنجاح" });
                        }}
                        className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2 font-bold px-8 h-12"
                      >
                        <Save size={18}/> حفظ الشروط
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="classes" className="mt-0">
                <div className="space-y-6">
                  <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
                    <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">إضافة صف دراسي جديد</h3>
                    <div className="flex gap-4">
                      <Input 
                        placeholder="اسم الصف (مثال: أ)" 
                        value={newClassName}
                        onChange={(e) => setNewClassName(e.target.value)}
                        className="text-right"
                      />
                      <Input 
                        placeholder="المرحلة (مثال: الأول المتوسط)" 
                        value={newClassGrade}
                        onChange={(e) => setNewClassGrade(e.target.value)}
                        className="text-right"
                      />
                      <Button onClick={() => {
                        if(!newClassName || !newClassGrade) return;
                        addClass({ name: newClassName, grade: newClassGrade });
                        setNewClassName("");
                        setNewClassGrade("");
                        toast({ title: "تم إضافة الصف بنجاح" });
                      }}>إضافة</Button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    {classes.map((c) => (
                      <Card key={c.id} className="border-none shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteClass(c.id)}>
                              <Trash size={16} />
                            </Button>
                            <div className="text-right">
                              <p className="font-bold text-primary">{c.grade} - {c.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {teachers.find(t => t.id === c.teacherId)?.name || "لا يوجد معلم معين"}
                              </p>
                            </div>
                          </div>
                          <div className="mt-4">
                            <Label className="text-xs mb-2 block">تعيين معلم للصف</Label>
                            <select 
                              className="w-full text-xs border rounded p-1"
                              value={c.teacherId || ""}
                              onChange={(e) => updateClass({ ...c, teacherId: Number(e.target.value) })}
                            >
                              <option value="">اختر معلم</option>
                              {teachers.map(t => (
                                <option key={t.id} value={t.id}>{t.name} ({t.subject})</option>
                              ))}
                            </select>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="users" className="mt-0">
                <div className="space-y-6">
                  <div className="flex justify-between items-center mb-6">
                    <div className="text-right">
                      <h2 className="text-2xl font-bold text-primary">إدارة الحسابات</h2>
                      <p className="text-muted-foreground">تعديل بيانات المستخدمين، الرتب، وكلمات المرور</p>
                    </div>
                    <span className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-sm font-bold border border-primary/20">
                      {users.length} مستخدم مسجل
                    </span>
                  </div>

                  <div className="grid gap-4">
                    {users.map((user) => (
                      <Card key={user.id} className="border-none shadow-sm hover:shadow-md transition-all group overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex items-center justify-between p-4 flex-row-reverse">
                            <div className="flex items-center gap-4 flex-row-reverse">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${
                                user.role === 'admin' ? 'bg-gradient-to-br from-red-500 to-red-600' : 
                                user.role === 'teacher' ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 
                                'bg-gradient-to-br from-green-500 to-green-600'
                              }`}>
                                {user.role === 'admin' ? <Shield size={24} /> : user.role === 'teacher' ? <UserCircle size={24} /> : <Users size={24} />}
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-primary text-lg">{user.name}</p>
                                <div className="flex items-center gap-2 flex-row-reverse">
                                  <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-md ${
                                    user.role === 'admin' ? 'bg-red-100 text-red-600' : 
                                    user.role === 'teacher' ? 'bg-blue-100 text-blue-600' : 
                                    'bg-green-100 text-green-600'
                                  }`}>
                                    {user.role === 'admin' ? 'مدير' : user.role === 'teacher' ? 'مدرس' : 'طالب'}
                                  </span>
                                  <span className="text-xs text-muted-foreground">{user.email}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="hover:bg-primary/5 text-muted-foreground hover:text-primary" onClick={() => setEditingUser(user)}>
                                    <Edit size={18} />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                  <DialogHeader>
                                    <DialogTitle className="text-2xl font-bold text-right">تعديل حساب: {user.name}</DialogTitle>
                                  </DialogHeader>
                                  {editingUser && (
                                    <div className="space-y-4 py-6">
                                      <div className="space-y-2 text-right">
                                        <Label className="text-sm font-bold">الاسم الكامل</Label>
                                        <Input value={editingUser.name} onChange={e => setEditingUser({...editingUser, name: e.target.value})} className="h-11 text-right" />
                                      </div>
                                      <div className="space-y-2 text-right">
                                        <Label className="text-sm font-bold">الرتبة / الصلاحيات</Label>
                                        <select 
                                          className="w-full border-2 border-muted bg-background rounded-xl h-11 px-3 focus:border-primary transition-colors outline-none text-right"
                                          value={editingUser.role}
                                          onChange={e => setEditingUser({...editingUser, role: e.target.value as any})}
                                        >
                                          <option value="student">طالب</option>
                                          <option value="teacher">مدرس</option>
                                          <option value="admin">مدير النظام</option>
                                        </select>
                                      </div>
                                      <div className="space-y-2 text-right">
                                        <Label className="text-sm font-bold">المادة الدراسية (للمعلمين)</Label>
                                        <Input value={editingUser.subject || ""} onChange={e => setEditingUser({...editingUser, subject: e.target.value})} className="h-11 text-right" placeholder="مثال: الرياضيات" />
                                      </div>
                                      <div className="space-y-2 text-right">
                                        <Label className="text-sm font-bold">الصف / المرحلة (للطلاب)</Label>
                                        <select 
                                          className="w-full border-2 border-muted bg-background rounded-xl h-11 px-3 focus:border-primary transition-colors outline-none text-right"
                                          value={editingUser.grade || ""}
                                          onChange={e => setEditingUser({...editingUser, grade: e.target.value})}
                                        >
                                          <option value="">اختر الصف</option>
                                          {classes.map(c => (
                                            <option key={c.id} value={c.grade}>{c.grade}</option>
                                          ))}
                                        </select>
                                      </div>
                                      <div className="space-y-2 text-right">
                                        <Label className="text-sm font-bold">كلمة المرور الجديدة</Label>
                                        <Input type="text" value={editingUser.password} onChange={e => setEditingUser({...editingUser, password: e.target.value})} className="h-11 font-mono text-right" />
                                      </div>
                                      <Button onClick={() => {
                                        updateUser(editingUser);
                                        toast({ title: "✅ تم تحديث بيانات الحساب بنجاح" });
                                      }} className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold text-lg rounded-xl shadow-lg shadow-primary/20">
                                        حفظ التغييرات
                                      </Button>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                                onClick={() => {
                                  if(confirm(`هل أنت متأكد من حذف حساب "${user.name}"؟ لا يمكن التراجع عن هذا الإجراء.`)) {
                                    deleteUser(user.id);
                                    toast({ variant: "destructive", title: "🗑️ تم حذف الحساب" });
                                  }
                                }}
                              >
                                <Trash size={18} />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </div>
    </Layout>
  );
}

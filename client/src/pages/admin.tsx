import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLocation } from "wouter";
import { Plus, Trash, Edit, Image as ImageIcon, FileText, Users, Settings, Save, LogOut, BookOpen, CheckCircle, AlertCircle } from "lucide-react";
import { useSchool } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Admin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { config, updateConfig, teachers, addTeacher, deleteTeacher, programs, addProgram, deleteProgram } = useSchool();

  // Local state for forms
  const [newTeacher, setNewTeacher] = useState({ name: "", subject: "", role: "", bio: "" });
  const [newProgram, setNewProgram] = useState({ title: "", desc: "", icon: "BookOpen" });

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

  const handleAddTeacher = () => {
    if (!newTeacher.name || !newTeacher.subject) {
      toast({ variant: "destructive", title: "خطأ", description: "يرجى ملء الحقول المطلوبة" });
      return;
    }
    addTeacher(newTeacher);
    setNewTeacher({ name: "", subject: "", role: "", bio: "" });
    toast({ title: "تم إضافة المدرس بنجاح" });
  };

  const handleAddProgram = () => {
    if (!newProgram.title) {
      toast({ variant: "destructive", title: "خطأ", description: "العنوان مطلوب" });
      return;
    }
    addProgram(newProgram);
    setNewProgram({ title: "", desc: "", icon: "BookOpen" });
    toast({ title: "تم إضافة البرنامج بنجاح" });
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
            <div className="border-b bg-muted/30 px-6 pt-2">
              <TabsList className="bg-transparent h-auto p-0 gap-6">
                <TabsTrigger 
                  value="config" 
                  className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-secondary data-[state=active]:bg-transparent data-[state=active]:text-secondary data-[state=active]:shadow-none transition-all"
                >
                  <div className="flex items-center gap-2">
                    <Settings size={16}/> الإعدادات العامة
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="teachers" 
                  className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-secondary data-[state=active]:bg-transparent data-[state=active]:text-secondary data-[state=active]:shadow-none transition-all"
                >
                  <div className="flex items-center gap-2">
                    <Users size={16}/> المدرسون
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="programs" 
                  className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-secondary data-[state=active]:bg-transparent data-[state=active]:text-secondary data-[state=active]:shadow-none transition-all"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen size={16}/> البرامج
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="media" 
                  className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-secondary data-[state=active]:bg-transparent data-[state=active]:text-secondary data-[state=active]:shadow-none transition-all"
                >
                  <div className="flex items-center gap-2">
                    <ImageIcon size={16}/> الوسائط
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6 md:p-8 bg-card min-h-[500px]">
              <TabsContent value="config" className="mt-0">
                <div className="max-w-4xl mx-auto">
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
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mt-1 -ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              if(confirm('هل أنت متأكد من الحذف؟')) {
                                deleteTeacher(teacher.id);
                                toast({ title: "تم الحذف بنجاح" });
                              }
                            }}
                          >
                            <Trash size={16}/>
                          </Button>
                        </motion.div>
                      ))}
                      
                      {teachers.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground border-2 border-dashed rounded-xl bg-muted/30">
                          <AlertCircle className="w-10 h-10 mb-2 opacity-20" />
                          <p>لا يوجد مدرسين مضافين حالياً</p>
                        </div>
                      )}
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
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="media" className="mt-0">
                 <div className="flex flex-col items-center justify-center py-16 bg-muted/20 rounded-xl border-2 border-dashed">
                   <div className="bg-primary/5 p-4 rounded-full mb-4">
                     <ImageIcon className="h-8 w-8 text-primary/40" />
                   </div>
                   <h3 className="text-lg font-bold text-primary mb-2">مكتبة الوسائط</h3>
                   <p className="text-muted-foreground mb-6 max-w-sm text-center">
                     قم برفع صور الفعاليات والنشاطات المدرسية ليتم عرضها في المعرض
                   </p>
                   <Button variant="outline" disabled>
                     خاصية قيد التطوير
                   </Button>
                 </div>
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </div>
    </Layout>
  );
}

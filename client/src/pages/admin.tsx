import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLocation } from "wouter";
import { Plus, Trash, Edit, Image as ImageIcon, FileText, Users, Settings, Save, LogOut } from "lucide-react";
import { useSchool } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

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
      <div className="bg-primary text-primary-foreground shadow-md">
        <div className="container mx-auto px-4 h-16 flex justify-between items-center">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Settings className="animate-spin-slow" /> لوحة التحكم
          </h1>
          <Button 
            variant="secondary" 
            size="sm" 
            className="gap-2"
            onClick={() => {
              toast({ title: "تم تسجيل الخروج" });
              setLocation("/");
            }}
          >
            <LogOut size={16}/> خروج
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="config" className="w-full space-y-8">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-3xl grid-cols-4 bg-muted p-1 rounded-xl">
              <TabsTrigger value="config" className="rounded-lg gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"><Settings size={16}/> الإعدادات العامة</TabsTrigger>
              <TabsTrigger value="teachers" className="rounded-lg gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"><Users size={16}/> المدرسون</TabsTrigger>
              <TabsTrigger value="programs" className="rounded-lg gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"><BookOpen size={16}/> البرامج</TabsTrigger>
              <TabsTrigger value="media" className="rounded-lg gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"><ImageIcon size={16}/> الوسائط</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="config">
            <Card className="max-w-3xl mx-auto border-none shadow-lg">
              <CardHeader className="border-b bg-muted/30">
                <CardTitle>إعدادات الموقع العامة</CardTitle>
                <CardDescription>تعديل المعلومات الأساسية التي تظهر في الصفحة الرئيسية</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSaveConfig} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>اسم المدرسة</Label>
                      <Input name="name" defaultValue={config.name} />
                    </div>
                    <div className="space-y-2">
                      <Label>الوصف المختصر</Label>
                      <Input name="description" defaultValue={config.description} />
                    </div>
                    <div className="space-y-2">
                      <Label>عدد الطلاب</Label>
                      <Input name="studentCount" type="number" defaultValue={config.studentCount} />
                    </div>
                    <div className="space-y-2">
                      <Label>عدد الكادر</Label>
                      <Input name="teacherCount" type="number" defaultValue={config.teacherCount} />
                    </div>
                    <div className="space-y-2">
                      <Label>نسبة النجاح (%)</Label>
                      <Input name="successRate" type="number" defaultValue={config.successRate} />
                    </div>
                    <div className="space-y-2">
                      <Label>سنة التأسيس</Label>
                      <Input name="foundingYear" type="number" defaultValue={config.foundingYear} />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 gap-2">
                    <Save size={16}/> حفظ التغييرات
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teachers">
            <div className="grid lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-1 h-fit border-none shadow-lg">
                <CardHeader className="bg-secondary/10 border-b">
                  <CardTitle className="text-lg">إضافة مدرس جديد</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label>الاسم</Label>
                    <Input 
                      value={newTeacher.name}
                      onChange={e => setNewTeacher({...newTeacher, name: e.target.value})}
                      placeholder="مثال: أحمد علي"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>المادة</Label>
                    <Input 
                      value={newTeacher.subject}
                      onChange={e => setNewTeacher({...newTeacher, subject: e.target.value})}
                      placeholder="مثال: الرياضيات"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>المنصب/الدور</Label>
                    <Input 
                      value={newTeacher.role}
                      onChange={e => setNewTeacher({...newTeacher, role: e.target.value})}
                      placeholder="مثال: مدرس أول"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>نبذة</Label>
                    <Textarea 
                      value={newTeacher.bio}
                      onChange={e => setNewTeacher({...newTeacher, bio: e.target.value})}
                      placeholder="نبذة مختصرة عن الخبرة..."
                    />
                  </div>
                  <Button onClick={handleAddTeacher} className="w-full gap-2">
                    <Plus size={16}/> إضافة للقائمة
                  </Button>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2 border-none shadow-lg">
                <CardHeader className="border-b">
                  <CardTitle>قائمة المدرسين ({teachers.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {teachers.map(teacher => (
                      <div key={teacher.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {teacher.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm">{teacher.name}</h4>
                            <p className="text-xs text-muted-foreground">{teacher.subject}</p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
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
                    ))}
                    {teachers.length === 0 && (
                      <div className="p-8 text-center text-muted-foreground">لا يوجد بيانات</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="programs">
            <div className="grid lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-1 h-fit border-none shadow-lg">
                <CardHeader className="bg-secondary/10 border-b">
                  <CardTitle className="text-lg">إضافة برنامج</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label>عنوان البرنامج</Label>
                    <Input 
                      value={newProgram.title}
                      onChange={e => setNewProgram({...newProgram, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>الوصف</Label>
                    <Textarea 
                      value={newProgram.desc}
                      onChange={e => setNewProgram({...newProgram, desc: e.target.value})}
                    />
                  </div>
                  <Button onClick={handleAddProgram} className="w-full gap-2">
                    <Plus size={16}/> إضافة
                  </Button>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2 border-none shadow-lg">
                <CardHeader className="border-b">
                  <CardTitle>البرامج الحالية ({programs.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {programs.map(program => (
                      <div key={program.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                        <div>
                          <h4 className="font-bold text-sm">{program.title}</h4>
                          <p className="text-xs text-muted-foreground truncate max-w-md">{program.desc}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => {
                            deleteProgram(program.id);
                            toast({ title: "تم الحذف بنجاح" });
                          }}
                        >
                          <Trash size={16}/>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="media">
             <div className="text-center py-12 bg-muted/30 rounded-xl border-2 border-dashed">
               <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
               <h3 className="text-lg font-medium">مكتبة الوسائط</h3>
               <p className="text-muted-foreground mb-4">يمكنك إضافة صور للمعرض هنا (قريباً)</p>
               <Button variant="outline">رفع صور</Button>
             </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

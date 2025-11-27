import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLocation } from "wouter";
import { Plus, Trash, Edit, Image as ImageIcon, FileText, Users } from "lucide-react";

export default function Admin() {
  const [, setLocation] = useLocation();

  return (
    <Layout>
      <div className="bg-slate-900 text-white py-8">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">لوحة الإدارة</h1>
          <Button variant="destructive" size="sm" onClick={() => setLocation("/")}>تسجيل الخروج</Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="images" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto mb-8">
            <TabsTrigger value="images" className="gap-2"><ImageIcon size={16}/> إدارة الصور</TabsTrigger>
            <TabsTrigger value="articles" className="gap-2"><FileText size={16}/> المقالات</TabsTrigger>
            <TabsTrigger value="teachers" className="gap-2"><Users size={16}/> المدرسون</TabsTrigger>
          </TabsList>

          <TabsContent value="images" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>إضافة صورة جديدة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 items-end">
                  <div className="space-y-2">
                    <Label>عنوان الصورة</Label>
                    <Input placeholder="وصف الصورة" />
                  </div>
                  <div className="space-y-2">
                     <Label>ملف الصورة</Label>
                     <Input type="file" />
                  </div>
                  <Button className="w-full md:w-auto"><Plus size={16} className="ml-2"/> إضافة</Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {/* Mock Gallery Items */}
               {[1,2,3,4].map(i => (
                 <div key={i} className="relative group rounded-lg overflow-hidden aspect-square bg-muted">
                   <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="destructive" size="icon"><Trash size={16}/></Button>
                   </div>
                 </div>
               ))}
            </div>
          </TabsContent>

          <TabsContent value="articles">
             <Card>
              <CardHeader>
                <CardTitle>إضافة مقال جديد</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>العنوان</Label>
                  <Input placeholder="عنوان المقال" />
                </div>
                <div className="space-y-2">
                  <Label>المحتوى</Label>
                  <Textarea placeholder="نص المقال..." rows={5} />
                </div>
                <Button><Plus size={16} className="ml-2"/> نشر المقال</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teachers">
             <Card>
              <CardHeader>
                <CardTitle>إضافة مدرس</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>الاسم</Label>
                    <Input />
                  </div>
                  <div className="space-y-2">
                    <Label>المادة</Label>
                    <Input />
                  </div>
                </div>
                <Button><Plus size={16} className="ml-2"/> إضافة</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

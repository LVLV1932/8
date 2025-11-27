import { Layout } from "@/components/layout/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { useSchool } from "@/lib/store";

export default function Teachers() {
  const { teachers } = useSchool();

  return (
    <Layout>
      <div className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">الهيئة التدريسية</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            نخبة من أفضل المدرسين ذوي الخبرة والكفاءة العلمية العالية
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-16">
        {teachers.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            لا يوجد مدرسين مضافين حالياً.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teachers.map((teacher) => (
              <Card key={teacher.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-none shadow-md bg-card">
                <div className="h-2 bg-secondary w-0 group-hover:w-full transition-all duration-500" />
                <CardContent className="pt-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground">
                      {teacher.name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                        {teacher.subject}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-primary mb-1">{teacher.name}</h3>
                  <p className="text-secondary font-medium text-sm mb-4">{teacher.role}</p>
                  
                  <p className="text-muted-foreground text-sm mb-6 min-h-[40px]">
                    {teacher.bio}
                  </p>

                  <button className="w-full py-2 rounded-lg border border-input hover:bg-accent hover:text-accent-foreground transition-colors text-sm font-medium flex items-center justify-center gap-2">
                    <Mail size={16} />
                    تواصل مع المدرس
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

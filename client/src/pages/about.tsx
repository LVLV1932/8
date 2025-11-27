import { Layout } from "@/components/layout/layout";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Target, History, Users, Award } from "lucide-react";
import libraryImg from "@assets/generated_images/modern_library_interior.png";

export default function About() {
  return (
    <Layout>
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">عن المدرسة</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            تعرف على رؤيتنا، رسالتنا، وتاريخنا في خدمة التعليم المتميز
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-16">
        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-12 mb-24">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex gap-4 items-start">
              <div className="bg-secondary/20 p-3 rounded-lg">
                <Target className="text-secondary w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-primary mb-2">رؤيتنا</h2>
                <p className="text-muted-foreground leading-relaxed">
                  أن نكون مؤسسة تعليمية رائدة محلياً وإقليمياً في رعاية المتفوقين وإعدادهم ليكونوا قادة المستقبل وصناع التغيير الإيجابي في المجتمع.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="bg-secondary/20 p-3 rounded-lg">
                <Award className="text-secondary w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-primary mb-2">رسالتنا</h2>
                <p className="text-muted-foreground leading-relaxed">
                  تقديم تعليم نوعي يركز على تنمية مهارات التفكير النقدي والإبداعي، وغرس القيم الأخلاقية والوطنية، من خلال بيئة تعليمية محفزة وكادر متميز وشراكة مجتمعية فاعلة.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl overflow-hidden shadow-xl"
          >
            <img src={libraryImg} alt="Library" className="w-full h-full object-cover" />
          </motion.div>
        </div>

        {/* History */}
        <section className="mb-24">
          <div className="bg-muted/50 rounded-3xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-primary mb-6 flex items-center gap-3">
                  <History className="text-secondary" />
                  تاريخنا وإنجازاتنا
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    تأسست ثانوية الزبير للمتفوقين عام 2020 استجابة للحاجة الماسة لرعاية الطلبة المتميزين في قضاء الزبير والمناطق المجاورة.
                  </p>
                  <p>
                    منذ انطلاقتها، حققت المدرسة نسب نجاح 100% في الامتحانات الوزارية، وحصد طلابنا العديد من الجوائز في المسابقات العلمية والثقافية على مستوى المحافظة والعراق.
                  </p>
                  <p>
                    تتميز المدرسة ببنيتها التحتية الحديثة ومختبراتها المتطورة، مما جعلها نموذجاً يحتذى به في التعليم الحكومي المتميز.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Administration */}
        <section>
          <h2 className="text-3xl font-bold text-primary mb-12 text-center">فريقنا الإداري</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((_, i) => (
              <Card key={i} className="text-center border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-8 pb-8">
                  <div className="w-24 h-24 mx-auto bg-muted rounded-full mb-4 overflow-hidden">
                     <Users className="w-full h-full p-6 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-lg font-bold text-primary">الاستاذ/ة الاسم {i+1}</h3>
                  <p className="text-sm text-secondary font-medium mb-2">المنصب الإداري</p>
                  <p className="text-sm text-muted-foreground">
                    خبرة تربوية تمتد لأكثر من 20 عاماً في مجال الإدارة والتعليم.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}

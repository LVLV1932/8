import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, FlaskConical, Trophy } from "lucide-react";
import heroImage from "@assets/generated_images/modern_high_school_exterior_architecture.png";
import abstractBg from "@assets/generated_images/abstract_academic_background.png";
import { useSchool } from "@/lib/store";

export default function Home() {
  const { config, articles } = useSchool();

  // Get latest 3 articles
  const latestArticles = articles.slice(0, 3);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt={config.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/60 mix-blend-multiply" />
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {config.name}
              <br />
              <span className="text-secondary">{config.description}</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-white/90">
              نجمع بين التميز الأكاديمي وبناء الشخصية القيادية في بيئة تعليمية محفزة ومبتكرة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/about">
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold text-lg px-8">
                  اكتشف المزيد
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary font-bold text-lg px-8">
                  تواصل معنا
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Ticker */}
      <section className="py-8 bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4 flex flex-wrap justify-center gap-12 md:gap-24 text-center">
          <div>
            <div className="text-4xl font-bold mb-1">{config.studentCount}+</div>
            <div className="text-sm font-semibold opacity-80">طالب متفوق</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-1">{config.teacherCount}+</div>
            <div className="text-sm font-semibold opacity-80">كادر تدريبي</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-1">{config.successRate}%</div>
            <div className="text-sm font-semibold opacity-80">نسبة النجاح</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-1">{config.foundingYear}</div>
            <div className="text-sm font-semibold opacity-80">سنة التأسيس</div>
          </div>
        </div>
      </section>

      {/* Latest News (New Section) */}
      {latestArticles.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-bold text-primary mb-2">أحدث الأخبار</h2>
                <p className="text-muted-foreground">تابع نشاطات وفعاليات المدرسة</p>
              </div>
              <Link href="/articles">
                <Button variant="link" className="text-secondary hover:text-secondary/80 gap-2">
                  عرض كل الأخبار <ArrowLeft size={16} />
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {latestArticles.map((article, i) => (
                <Card key={article.id} className="border-none shadow-md hover:shadow-xl transition-all group cursor-pointer">
                  <CardContent className="p-6">
                    <div className="text-xs text-secondary font-bold mb-2">{article.date}</div>
                    <h3 className="text-lg font-bold text-primary mb-3 group-hover:text-secondary transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {article.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">لماذا ثانوية الزبير؟</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              نقدم تجربة تعليمية متكاملة تركز على الجوانب العلمية والعملية والشخصية
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <BookOpen className="w-10 h-10 text-secondary" />,
                title: "تعليم رقمي متطور",
                desc: "فصول دراسية مجهزة بأحدث التقنيات الذكية لتعزيز التفاعل والتعلم النشط."
              },
              {
                icon: <FlaskConical className="w-10 h-10 text-secondary" />,
                title: "مختبرات علمية",
                desc: "مختبرات مجهزة بالكامل للفيزياء والكيمياء والأحياء لتطبيق الجانب العملي."
              },
              {
                icon: <Trophy className="w-10 h-10 text-secondary" />,
                title: "تميز أكاديمي",
                desc: "نخبة من أفضل المدرسين وبرامج إثرائية لرعاية الموهوبين والمتفوقين."
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                <Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-8 text-center">
                    <div className="mb-6 inline-flex p-4 rounded-full bg-primary/5">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-primary">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Principal's Message / About Preview */}
      <section className="py-24 bg-primary/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-secondary/10 -skew-x-12 transform translate-x-20" />
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                كلمة مدير المدرسة
              </h2>
              <div className="prose prose-lg text-muted-foreground mb-8">
                <p>
                  يسرنا أن نرحب بكم في {config.name}، الصرح العلمي الذي يهدف إلى بناء جيل واعد من القادة والعلماء.
                </p>
                <p>
                  نحن نؤمن بأن التعليم ليس مجرد تلقين للمعلومات، بل هو عملية بناء متكاملة للشخصية والفكر. نسعى لتوفير بيئة حاضنة للإبداع والتميز.
                </p>
              </div>
              <Link href="/about">
                <Button className="gap-2">
                  اقرأ المزيد عن المدرسة <ArrowLeft size={16} />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                 <img 
                  src={abstractBg} 
                  alt="School Building" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-secondary p-6 rounded-lg shadow-lg hidden md:block">
                <p className="font-bold text-primary-foreground text-lg">رؤيتنا</p>
                <p className="text-primary-foreground/80">الريادة في رعاية المتفوقين</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

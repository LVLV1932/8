import { Layout } from "@/components/layout/layout";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSchool } from "@/lib/store";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import studentImg from "@assets/generated_images/student_studying_in_library.png";
import scienceImg from "@assets/generated_images/science_fair_project.png";
import sportsImg from "@assets/generated_images/sports_day_celebration.png";

export default function Articles() {
  const { articles } = useSchool();

  // Helper to get image for article (randomly assigned for demo if not set)
  const getArticleImage = (index: number) => {
    const images = [studentImg, scienceImg, sportsImg];
    return images[index % images.length];
  };

  return (
    <Layout>
      <div className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">أخبار ونشاطات المدرسة</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            تابع أحدث الفعاليات والإنجازات في ثانوية الزبير للمتفوقين
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full flex flex-col overflow-hidden hover:shadow-xl transition-shadow border-none shadow-md group">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={article.image || getArticleImage(index)} 
                    alt={article.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {article.date}</span>
                    <span className="flex items-center gap-1"><User size={12} /> {article.author || "الإدارة"}</span>
                  </div>
                  <CardTitle className="text-xl font-bold text-primary line-clamp-2 leading-tight">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                    {article.content}
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="link" className="px-0 text-secondary hover:text-secondary/80 gap-2">
                    اقرأ المزيد <ArrowLeft size={16} />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {articles.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">لا توجد مقالات منشورة حالياً.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

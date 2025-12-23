import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Calendar, User, ArrowRight } from "lucide-react";
import { useSchool } from "@/lib/store";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import studentImg from "@assets/generated_images/student_studying_in_library.png";
import scienceImg from "@assets/generated_images/science_fair_project.png";
import sportsImg from "@assets/generated_images/sports_day_celebration.png";

export default function ArticleDetail() {
  const [location, setLocation] = useLocation();
  const { articles } = useSchool();
  const [article, setArticle] = useState<any>(null);

  useEffect(() => {
    // Get article ID from URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    
    if (id) {
      const found = articles.find(a => a.id === Number(id));
      setArticle(found);
    }
  }, [articles]);

  const getArticleImage = (index: number) => {
    const images = [studentImg, scienceImg, sportsImg];
    return images[index % images.length];
  };

  if (!article) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <Card className="max-w-md w-full">
            <CardContent className="p-8 text-center space-y-4">
              <p className="text-muted-foreground">لم يتم العثور على المقالة</p>
              <Button onClick={() => setLocation("/articles")} className="w-full">
                العودة للمقالات
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const articleIndex = articles.findIndex(a => a.id === article.id);

  return (
    <Layout>
      <div className="bg-gradient-to-br from-primary via-primary/90 to-secondary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/20 gap-2 mb-6"
            onClick={() => setLocation("/articles")}
          >
            <ArrowRight size={16} /> العودة للمقالات
          </Button>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{article.title}</h1>
            <div className="flex items-center gap-6 text-white/80 text-sm">
              <span className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
                <Calendar size={14} /> {article.date}
              </span>
              <span className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
                <User size={14} /> {article.author || "الإدارة"}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-2xl mb-8">
              <img 
                src={article.image || getArticleImage(articleIndex)} 
                alt={article.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <Card className="border-none shadow-lg">
              <CardContent className="p-8 md:p-12">
                <article className="prose prose-lg max-w-none">
                  <div className="text-xl text-muted-foreground leading-relaxed whitespace-pre-wrap text-right">
                    {article.content}
                  </div>
                </article>

                <div className="mt-12 pt-8 border-t border-border space-y-4">
                  <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">📝 كتب بواسطة</p>
                    <p className="font-bold text-lg text-primary">{article.author || "الإدارة"}</p>
                    <p className="text-sm text-muted-foreground mt-2">📅 {article.date}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-12">
            <Button 
              onClick={() => setLocation("/articles")}
              className="w-full bg-primary hover:bg-primary/90 font-bold py-6 text-lg"
            >
              ← العودة لقائمة المقالات
            </Button>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}

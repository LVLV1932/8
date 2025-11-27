import { Layout } from "@/components/layout/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Atom, Globe, Laptop, Calculator, Microscope, Palette, BookOpen } from "lucide-react";
import labImg from "@assets/generated_images/advanced_science_laboratory.png";
import { useSchool } from "@/lib/store";

const iconMap: Record<string, any> = {
  Microscope: Microscope,
  Laptop: Laptop,
  Calculator: Calculator,
  Globe: Globe,
  Palette: Palette,
  Atom: Atom,
  BookOpen: BookOpen
};

export default function Programs() {
  const { programs } = useSchool();

  return (
    <Layout>
      <div className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">برامجنا الأكاديمية</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            مناهج دراسية متطورة وأنشطة إثرائية تلبي طموحات الطلاب المتفوقين
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
           <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
             {programs.map((prog, i) => {
               const Icon = iconMap[prog.icon] || BookOpen;
               return (
                 <Card key={i} className="hover:border-secondary transition-colors group">
                   <CardHeader className="pb-2">
                     <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors mb-2">
                       <Icon className="w-6 h-6" />
                     </div>
                     <CardTitle className="text-lg">{prog.title}</CardTitle>
                   </CardHeader>
                   <CardContent>
                     <p className="text-muted-foreground text-sm">
                       {prog.desc}
                     </p>
                   </CardContent>
                 </Card>
               );
             })}
           </div>
           
           <div className="bg-muted rounded-2xl p-6 h-full flex flex-col">
             <h3 className="text-xl font-bold text-primary mb-4">البيئة التعليمية</h3>
             <div className="rounded-xl overflow-hidden mb-6 flex-grow">
               <img src={labImg} alt="Lab" className="w-full h-full object-cover" />
             </div>
             <p className="text-muted-foreground text-sm leading-relaxed">
               توفر المدرسة بيئة تعليمية محفزة مدعومة بأحدث المختبرات والوسائل التعليمية. نركز على التعلم القائم على المشاريع والتجارب العملية لضمان استيعاب عميق للمفاهيم العلمية.
             </p>
           </div>
        </div>
      </div>
    </Layout>
  );
}

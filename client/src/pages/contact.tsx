import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const contactSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  message: z.string().min(10, "الرسالة يجب أن تكون أطول من 10 أحرف"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function Contact() {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data: ContactForm) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "تم إرسال رسالتك بنجاح",
      description: "سنتواصل معك في أقرب وقت ممكن.",
    });
    reset();
  };

  return (
    <Layout>
      <div className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">تواصل معنا</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            نحن هنا للإجابة على استفساراتكم وتلقي مقترحاتكم
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="grid sm:grid-cols-2 gap-6">
              <Card className="border-none shadow-md">
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                    <MapPin />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">العنوان</h3>
                    <p className="text-muted-foreground text-sm">البصرة، قضاء الزبير<br/>بجانب تربية الزبير</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md">
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                    <Phone />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">الهاتف</h3>
                    <p className="text-muted-foreground text-sm" dir="ltr">+964 770 000 0000</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md">
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                    <Mail />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">البريد الإلكتروني</h3>
                    <p className="text-muted-foreground text-sm">info@alzubair.edu.iq</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md">
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                    <Clock />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">أوقات الدوام</h3>
                    <p className="text-muted-foreground text-sm">الأحد - الخميس<br/>8:00 ص - 2:00 م</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Map Placeholder */}
            <div className="rounded-2xl overflow-hidden h-[300px] bg-muted relative border border-border">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113945.03451559196!2d47.60451571221715!3d30.3644026369018!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3fc44f8f4a613583%3A0x7d0a20297e615e4!2z2YbYsdmK2Kgg2YXZiNmI2Ygg2KfZhNiy2KfZhtmK2Kgg2KfZhNiz2K7ZitmE!5e0!3m2!1sar!2siq!4v1700000000000!5m2!1sar!2siq"
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Contact Form */}
          <Card className="shadow-lg border-none">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-primary mb-6">أرسل لنا رسالة</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم الكامل</Label>
                  <Input id="name" {...register("name")} placeholder="أدخل اسمك الكامل" />
                  {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input id="email" type="email" {...register("email")} placeholder="name@example.com" />
                  {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">الرسالة</Label>
                  <Textarea id="message" rows={6} {...register("message")} placeholder="كيف يمكننا مساعدتك؟" />
                  {errors.message && <p className="text-destructive text-sm">{errors.message.message}</p>}
                </div>
                
                <Button type="submit" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold" disabled={isSubmitting}>
                  {isSubmitting ? "جاري الإرسال..." : "إرسال الرسالة"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

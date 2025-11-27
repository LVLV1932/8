import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from "lucide-react";
import { Link } from "wouter";
import schoolLogo from "@assets/logo_1764275780967.png";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 font-bold text-xl">
            <img src={schoolLogo} alt="شعار المدرسة" className="h-12 w-12 rounded-full object-cover border-2 border-secondary/20" />
            <span>ثانوية الزبير للمتفوقين</span>
          </div>
          <p className="text-primary-foreground/80 text-sm leading-relaxed">
            بيئة تعليمية متميزة تهدف إلى رعاية الطلاب المتفوقين وبناء قادة المستقبل من خلال تعليم متكامل ومبتكر.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-bold text-lg mb-4 text-secondary">روابط سريعة</h3>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li><Link href="/about" className="hover:text-secondary transition-colors">عن المدرسة</Link></li>
            <li><Link href="/programs" className="hover:text-secondary transition-colors">البرامج الأكاديمية</Link></li>
            <li><Link href="/teachers" className="hover:text-secondary transition-colors">الهيئة التدريسية</Link></li>
            <li><Link href="/contact" className="hover:text-secondary transition-colors">تواصل معنا</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-bold text-lg mb-4 text-secondary">معلومات التواصل</h3>
          <ul className="space-y-3 text-sm text-primary-foreground/80">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-secondary mt-0.5" />
              <span>البصرة، قضاء الزبير، بجانب تربية الزبير</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-secondary" />
              <span dir="ltr">+964 770 000 0000</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-secondary" />
              <span>info@alzubair.edu.iq</span>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="font-bold text-lg mb-4 text-secondary">تابعنا</h3>
          <div className="flex gap-4">
            <a href="#" className="h-10 w-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-all">
              <Facebook size={20} />
            </a>
            <a href="#" className="h-10 w-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-all">
              <Instagram size={20} />
            </a>
            <a href="#" className="h-10 w-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-all">
              <Twitter size={20} />
            </a>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 md:px-8 mt-12 pt-8 border-t border-primary-foreground/10 text-center text-sm text-primary-foreground/60">
        <p>جميع الحقوق محفوظة © {new Date().getFullYear()} ثانوية الزبير للمتفوقين</p>
      </div>
    </footer>
  );
}

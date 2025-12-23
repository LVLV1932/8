import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Menu, X, Sun, Moon, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

import schoolLogo from "@assets/logo_1764275780967.png";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const [theme, setTheme] = useState("light");

  const links = [
    { href: "/", label: "الرئيسية" },
    { href: "/about", label: "عن المدرسة" },
    { href: "/programs", label: "برامجنا" },
    { href: "/articles", label: "أخبارنا" },
    { href: "/teachers", label: "الهيئة التدريسية" },
    { href: "/contact", label: "تواصل معنا" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <img src={schoolLogo} alt="شعار المدرسة" className="h-12 w-12 rounded-full object-cover shadow-md" />
          <span className="hidden md:inline-block font-tajawal font-black tracking-wide">ثانوية الزبير للمتفوقين</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <span className={`text-sm font-bold transition-all hover:text-secondary cursor-pointer relative ${
                location === link.href ? "text-secondary" : "text-foreground/70"
              }`}>
                {link.label}
                {location === link.href && (
                  <span className="absolute -bottom-6 left-0 w-full h-1 bg-secondary rounded-t-md animate-in fade-in zoom-in duration-300" />
                )}
              </span>
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title="تبديل الوضع"
            className="text-foreground/70 hover:text-primary"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
          <Link href="/login-new">
            <Button size="sm" className="bg-accent hover:bg-accent/90 text-white font-bold">دخول</Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" size="sm" className="border-primary/20 hover:border-primary hover:bg-primary/5 text-primary font-bold">تسجيل</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
             {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
          <button className="p-2 text-foreground" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-b bg-background p-4 space-y-4 animate-in slide-in-from-top-5">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}>
              <div className={`block p-2 text-base font-medium ${
                location === link.href ? "text-secondary" : "text-foreground/80"
              }`}>
                {link.label}
              </div>
            </Link>
          ))}
          <div className="pt-4 border-t space-y-2">
             <Link href="/login-new" onClick={() => setIsOpen(false)}>
              <Button className="w-full bg-accent hover:bg-accent/90">دخول</Button>
            </Link>
            <Link href="/register" onClick={() => setIsOpen(false)}>
              <Button className="w-full" variant="outline">تسجيل جديد</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Menu, X, Sun, Moon, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();

  const links = [
    { href: "/", label: "الرئيسية" },
    { href: "/about", label: "عن المدرسة" },
    { href: "/programs", label: "برامجنا" },
    { href: "/teachers", label: "الهيئة التدريسية" },
    { href: "/contact", label: "تواصل معنا" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
            <GraduationCap size={24} />
          </div>
          <span className="hidden md:inline-block">ثانوية الزبير للمتفوقين</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <span className={`text-sm font-medium transition-colors hover:text-secondary cursor-pointer ${
                location === link.href ? "text-secondary" : "text-foreground/80"
              }`}>
                {link.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title="تبديل الوضع"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
          <Link href="/login">
            <Button variant="outline" size="sm">تسجيل الدخول</Button>
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
          <div className="pt-4 border-t">
             <Link href="/login" onClick={() => setIsOpen(false)}>
              <Button className="w-full">تسجيل الدخول</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

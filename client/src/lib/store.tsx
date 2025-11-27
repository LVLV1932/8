import React, { createContext, useContext, useEffect, useState } from "react";

// Types
export type Teacher = {
  id: number;
  name: string;
  subject: string;
  role: string;
  bio: string;
  image?: string;
};

export type Program = {
  id: number;
  title: string;
  desc: string;
  icon: string; // Store icon name as string
};

export type Article = {
  id: number;
  title: string;
  content: string;
  image?: string;
  date: string;
  author?: string;
};

export type SchoolConfig = {
  name: string;
  description: string;
  studentCount: number;
  teacherCount: number;
  successRate: number;
  foundingYear: number;
  email: string;
  phone: string;
  address: string;
};

type SchoolContextType = {
  teachers: Teacher[];
  programs: Program[];
  articles: Article[];
  config: SchoolConfig;
  addTeacher: (teacher: Omit<Teacher, "id">) => void;
  updateTeacher: (teacher: Teacher) => void;
  deleteTeacher: (id: number) => void;
  addProgram: (program: Omit<Program, "id">) => void;
  updateProgram: (program: Program) => void;
  deleteProgram: (id: number) => void;
  updateConfig: (config: Partial<SchoolConfig>) => void;
  addArticle: (article: Omit<Article, "id" | "date">) => void;
  updateArticle: (article: Article) => void;
  deleteArticle: (id: number) => void;
};

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

// Initial Data
const initialTeachers: Teacher[] = [
  { id: 1, name: "أحمد علي", subject: "الرياضيات", role: "مدرس أول", bio: "خبرة 15 سنة في تدريس الرياضيات للموهوبين" },
  { id: 2, name: "فاطمة حسين", subject: "الفيزياء", role: "مدرسة", bio: "ماجستير في الفيزياء النووية" },
  { id: 3, name: "محمد حسن", subject: "الكيمياء", role: "مدرس", bio: "مشرف على المختبرات العلمية" },
  { id: 4, name: "زينب كاظم", subject: "اللغة الإنجليزية", role: "مدرسة", bio: "حاصلة على شهادة التوفل والآيلتس" },
];

const initialPrograms: Program[] = [
  { id: 1, title: "العلوم الطبية", desc: "إعداد للكليات الطبية", icon: "Microscope" },
  { id: 2, title: "الحوسبة", desc: "برمجة وذكاء اصطناعي", icon: "Laptop" },
  { id: 3, title: "الرياضيات", desc: "مناهج متقدمة", icon: "Calculator" },
];

const initialArticles: Article[] = [
  { 
    id: 1, 
    title: "حفل تكريم المتفوقين السنوي", 
    content: "أقامت المدرسة حفلها السنوي لتكريم الطلبة الأوائل بحضور السيد مدير التربية ونخبة من أولياء الأمور. تم توزيع الجوائز والشهادات التقديرية على الطلاب المتميزين.", 
    date: "2024/05/15",
    author: "الإدارة"
  },
  { 
    id: 2, 
    title: "افتتاح المختبر العلمي الجديد", 
    content: "تم اليوم افتتاح مختبر الروبوتات والذكاء الاصطناعي الجديد، المجهز بأحدث التقنيات العالمية لخدمة طلابنا وتطوير مهاراتهم البرمجية.", 
    date: "2024/04/20",
    author: "قسم الحاسوب"
  }
];

const initialConfig: SchoolConfig = {
  name: "ثانوية الزبير للمتفوقين",
  description: "صرح علمي لبناء قادة المستقبل",
  studentCount: 500,
  teacherCount: 50,
  successRate: 100,
  foundingYear: 2020,
  email: "info@alzubair.edu.iq",
  phone: "+964 770 000 0000",
  address: "البصرة، قضاء الزبير، بجانب تربية الزبير"
};

export function SchoolProvider({ children }: { children: React.ReactNode }) {
  // Initialize state from localStorage or defaults
  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    if (typeof window === 'undefined') return initialTeachers;
    const saved = localStorage.getItem("school_teachers");
    return saved ? JSON.parse(saved) : initialTeachers;
  });

  const [programs, setPrograms] = useState<Program[]>(() => {
    if (typeof window === 'undefined') return initialPrograms;
    const saved = localStorage.getItem("school_programs");
    return saved ? JSON.parse(saved) : initialPrograms;
  });

  const [articles, setArticles] = useState<Article[]>(() => {
    if (typeof window === 'undefined') return initialArticles;
    const saved = localStorage.getItem("school_articles");
    return saved ? JSON.parse(saved) : initialArticles;
  });

  const [config, setConfig] = useState<SchoolConfig>(() => {
    if (typeof window === 'undefined') return initialConfig;
    const saved = localStorage.getItem("school_config");
    return saved ? JSON.parse(saved) : initialConfig;
  });

  // Persist to localStorage whenever state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("school_teachers", JSON.stringify(teachers));
      localStorage.setItem("school_programs", JSON.stringify(programs));
      localStorage.setItem("school_articles", JSON.stringify(articles));
      localStorage.setItem("school_config", JSON.stringify(config));
    }
  }, [teachers, programs, articles, config]);

  // Actions
  const addTeacher = (teacher: Omit<Teacher, "id">) => {
    setTeachers(prev => [...prev, { ...teacher, id: Date.now() }]);
  };

  const updateTeacher = (updated: Teacher) => {
    setTeachers(prev => prev.map(t => t.id === updated.id ? updated : t));
  };

  const deleteTeacher = (id: number) => {
    setTeachers(prev => prev.filter(t => t.id !== id));
  };

  const addProgram = (program: Omit<Program, "id">) => {
    setPrograms(prev => [...prev, { ...program, id: Date.now() }]);
  };

  const updateProgram = (updated: Program) => {
    setPrograms(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const deleteProgram = (id: number) => {
    setPrograms(prev => prev.filter(p => p.id !== id));
  };

  const updateConfig = (newConfig: Partial<SchoolConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const addArticle = (article: Omit<Article, "id" | "date">) => {
    setArticles(prev => [...prev, { 
      ...article, 
      id: Date.now(), 
      date: new Date().toLocaleDateString('ar-EG') 
    }]);
  };

  const updateArticle = (updated: Article) => {
    setArticles(prev => prev.map(a => a.id === updated.id ? updated : a));
  };

  const deleteArticle = (id: number) => {
    setArticles(prev => prev.filter(a => a.id !== id));
  };

  return (
    <SchoolContext.Provider value={{
      teachers, programs, articles, config,
      addTeacher, updateTeacher, deleteTeacher,
      addProgram, updateProgram, deleteProgram,
      updateConfig,
      addArticle, updateArticle, deleteArticle
    }}>
      {children}
    </SchoolContext.Provider>
  );
}

export function useSchool() {
  const context = useContext(SchoolContext);
  if (context === undefined) {
    throw new Error("useSchool must be used within a SchoolProvider");
  }
  return context;
}

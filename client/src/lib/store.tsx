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
  icon: string;
};

export type Article = {
  id: number;
  title: string;
  content: string;
  image?: string;
  date: string;
  author?: string;
  forStudents?: boolean;
};

export type ClassCode = {
  id: number;
  grade: string;
  code: string;
  description: string;
};

export type Student = {
  id: number;
  name: string;
  email: string;
  grade: string;
  classCode: string;
  joinDate: string;
};

export type Question = {
  id: number;
  studentName: string;
  studentEmail: string;
  question: string;
  answer?: string;
  date: string;
  answered: boolean;
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
  classCodes: ClassCode[];
  students: Student[];
  questions: Question[];
  config: SchoolConfig;
  currentStudent: Student | null;
  
  // Teacher actions
  addTeacher: (teacher: Omit<Teacher, "id">) => void;
  updateTeacher: (teacher: Teacher) => void;
  deleteTeacher: (id: number) => void;
  
  // Program actions
  addProgram: (program: Omit<Program, "id">) => void;
  updateProgram: (program: Program) => void;
  deleteProgram: (id: number) => void;
  
  // Article actions
  addArticle: (article: Omit<Article, "id" | "date">) => void;
  updateArticle: (article: Article) => void;
  deleteArticle: (id: number) => void;
  
  // ClassCode actions
  addClassCode: (classCode: Omit<ClassCode, "id">) => void;
  updateClassCode: (classCode: ClassCode) => void;
  deleteClassCode: (id: number) => void;
  
  // Student actions
  registerStudent: (student: Omit<Student, "id" | "joinDate">) => void;
  loginStudent: (email: string, classCode: string) => boolean;
  logoutStudent: () => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (id: number) => void;
  
  // Question actions
  addQuestion: (question: Omit<Question, "id" | "date" | "answered">) => void;
  answerQuestion: (id: number, answer: string) => void;
  deleteQuestion: (id: number) => void;
  
  // Config actions
  updateConfig: (config: Partial<SchoolConfig>) => void;
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

const initialClassCodes: ClassCode[] = [
  { id: 1, grade: "الأول الثانوي", code: "ZUBAIR-6001", description: "الصف الأول الثانوي" },
  { id: 2, grade: "الثاني الثانوي", code: "ZUBAIR-6002", description: "الصف الثاني الثانوي" },
  { id: 3, grade: "الثالث الثانوي", code: "ZUBAIR-6003", description: "الصف الثالث الثانوي" },
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

  const [classCodes, setClassCodes] = useState<ClassCode[]>(() => {
    if (typeof window === 'undefined') return initialClassCodes;
    const saved = localStorage.getItem("school_classCodes");
    return saved ? JSON.parse(saved) : initialClassCodes;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem("school_students");
    return saved ? JSON.parse(saved) : [];
  });

  const [questions, setQuestions] = useState<Question[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem("school_questions");
    return saved ? JSON.parse(saved) : [];
  });

  const [config, setConfig] = useState<SchoolConfig>(() => {
    if (typeof window === 'undefined') return initialConfig;
    const saved = localStorage.getItem("school_config");
    return saved ? JSON.parse(saved) : initialConfig;
  });

  const [currentStudent, setCurrentStudent] = useState<Student | null>(() => {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem("current_student");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("school_teachers", JSON.stringify(teachers));
      localStorage.setItem("school_programs", JSON.stringify(programs));
      localStorage.setItem("school_articles", JSON.stringify(articles));
      localStorage.setItem("school_classCodes", JSON.stringify(classCodes));
      localStorage.setItem("school_students", JSON.stringify(students));
      localStorage.setItem("school_questions", JSON.stringify(questions));
      localStorage.setItem("school_config", JSON.stringify(config));
    }
  }, [teachers, programs, articles, classCodes, students, questions, config]);

  useEffect(() => {
    if (typeof window !== 'undefined' && currentStudent) {
      localStorage.setItem("current_student", JSON.stringify(currentStudent));
    }
  }, [currentStudent]);

  // Teacher actions
  const addTeacher = (teacher: Omit<Teacher, "id">) => {
    setTeachers(prev => [...prev, { ...teacher, id: Date.now() }]);
  };

  const updateTeacher = (updated: Teacher) => {
    setTeachers(prev => prev.map(t => t.id === updated.id ? updated : t));
  };

  const deleteTeacher = (id: number) => {
    setTeachers(prev => prev.filter(t => t.id !== id));
  };

  // Program actions
  const addProgram = (program: Omit<Program, "id">) => {
    setPrograms(prev => [...prev, { ...program, id: Date.now() }]);
  };

  const updateProgram = (updated: Program) => {
    setPrograms(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const deleteProgram = (id: number) => {
    setPrograms(prev => prev.filter(p => p.id !== id));
  };

  // Article actions
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

  // ClassCode actions
  const addClassCode = (classCode: Omit<ClassCode, "id">) => {
    setClassCodes(prev => [...prev, { ...classCode, id: Date.now() }]);
  };

  const updateClassCode = (updated: ClassCode) => {
    setClassCodes(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  const deleteClassCode = (id: number) => {
    setClassCodes(prev => prev.filter(c => c.id !== id));
  };

  // Student actions
  const registerStudent = (student: Omit<Student, "id" | "joinDate">) => {
    const newStudent: Student = {
      ...student,
      id: Date.now(),
      joinDate: new Date().toLocaleDateString('ar-EG')
    };
    setStudents(prev => [...prev, newStudent]);
  };

  const loginStudent = (email: string, classCode: string) => {
    const student = students.find(s => s.email === email && s.classCode === classCode);
    if (student) {
      setCurrentStudent(student);
      return true;
    }
    return false;
  };

  const logoutStudent = () => {
    setCurrentStudent(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem("current_student");
    }
  };

  const updateStudent = (updated: Student) => {
    setStudents(prev => prev.map(s => s.id === updated.id ? updated : s));
    if (currentStudent?.id === updated.id) {
      setCurrentStudent(updated);
    }
  };

  const deleteStudent = (id: number) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    if (currentStudent?.id === id) {
      logoutStudent();
    }
  };

  // Question actions
  const addQuestion = (question: Omit<Question, "id" | "date" | "answered">) => {
    setQuestions(prev => [...prev, {
      ...question,
      id: Date.now(),
      date: new Date().toLocaleDateString('ar-EG'),
      answered: false
    }]);
  };

  const answerQuestion = (id: number, answer: string) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, answer, answered: true } : q));
  };

  const deleteQuestion = (id: number) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const updateConfig = (newConfig: Partial<SchoolConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  return (
    <SchoolContext.Provider value={{
      teachers, programs, articles, classCodes, students, questions, config, currentStudent,
      addTeacher, updateTeacher, deleteTeacher,
      addProgram, updateProgram, deleteProgram,
      addArticle, updateArticle, deleteArticle,
      addClassCode, updateClassCode, deleteClassCode,
      registerStudent, loginStudent, logoutStudent, updateStudent, deleteStudent,
      addQuestion, answerQuestion, deleteQuestion,
      updateConfig
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

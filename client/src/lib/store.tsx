import React, { createContext, useContext, useEffect, useState } from "react";

// User roles
export type UserRole = "admin" | "teacher" | "student";

// Types
export type Teacher = {
  id: number;
  name: string;
  email: string;
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

export type AssignedCode = {
  id: number;
  code: string;
  grade: string;
  assignedTo?: string;
  usedBy?: string;
  createdAt: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  grade?: string;
  subject?: string;
  assignedCode?: string;
  joinDate: string;
};

export type ClassRoom = {
  id: number;
  name: string;
  teacherId?: number;
  grade: string;
};

export type Lesson = {
  id: number;
  classId: number;
  teacherId: number;
  title: string;
  content: string;
  date: string;
  files?: string[];
};

export type Notification = {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
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
  users: User[];
  classes: ClassRoom[];
  lessons: Lesson[];
  assignedCodes: AssignedCode[];
  notifications: Notification[];
  questions: Question[];
  config: SchoolConfig;
  terms: string;
  currentUser: User | null;
  
  // Auth
  loginUser: (email: string, password: string) => boolean;
  logoutUser: () => void;
  registerUser: (user: Omit<User, "id" | "joinDate">) => boolean;
  updateUser: (user: User) => void;
  deleteUser: (id: number) => void;

  // Class & Lesson actions
  addClass: (classRoom: Omit<ClassRoom, "id">) => void;
  updateClass: (classRoom: ClassRoom) => void;
  deleteClass: (id: number) => void;
  addLesson: (lesson: Omit<Lesson, "id" | "date">) => void;
  deleteLesson: (id: number) => void;

  // Terms actions
  updateTerms: (terms: string) => void;

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
  
  // Code actions
  addAssignedCode: (code: Omit<AssignedCode, "id" | "createdAt">) => void;
  updateAssignedCode: (code: AssignedCode) => void;
  deleteAssignedCode: (id: number) => void;
  getAvailableCodes: () => AssignedCode[];
  
  // Notification actions
  addNotification: (notification: Omit<Notification, "id" | "createdAt">) => void;
  markNotificationRead: (id: number) => void;
  deleteNotification: (id: number) => void;
  getUserNotifications: (userId: number) => Notification[];
  
  // Question actions
  addQuestion: (question: Omit<Question, "id" | "date" | "answered">) => void;
  answerQuestion: (id: number, answer: string) => void;
  deleteQuestion: (id: number) => void;
  
  // Config actions
  updateConfig: (config: Partial<SchoolConfig>) => void;
};

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

const initialTeachers: Teacher[] = [
  { id: 1, name: "أحمد علي", email: "ahmed@school.iq", subject: "الرياضيات", role: "معلم أول", bio: "خبرة 15 سنة" },
  { id: 2, name: "فاطمة حسين", email: "fatima@school.iq", subject: "الفيزياء", role: "معلمة", bio: "ماجستير فيزياء" },
];

const initialPrograms: Program[] = [
  { id: 1, title: "العلوم الطبية", desc: "إعداد للكليات الطبية", icon: "Microscope" },
  { id: 2, title: "الحوسبة", desc: "برمجة وذكاء اصطناعي", icon: "Laptop" },
  { id: 3, title: "الرياضيات", desc: "مناهج متقدمة", icon: "Calculator" },
];

const initialArticles: Article[] = [
  { 
    id: 1, 
    title: "حفل تكريم المتفوقين", 
    content: "أقامت المدرسة حفلها السنوي لتكريم الطلبة الأوائل.",
    date: "2024/05/15",
    author: "الإدارة"
  },
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
  address: "البصرة، قضاء الزبير"
};

const initialUsers: User[] = [
  { 
    id: 1, 
    name: "مدير المدرسة", 
    email: "admin@school.iq", 
    password: "admin123", 
    role: "admin",
    joinDate: new Date().toLocaleDateString('ar-EG')
  },
];

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

  const [users, setUsers] = useState<User[]>(() => {
    if (typeof window === 'undefined') return initialUsers;
    const saved = localStorage.getItem("school_users");
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [classes, setClasses] = useState<ClassRoom[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem("school_classes");
    return saved ? JSON.parse(saved) : [];
  });

  const [lessons, setLessons] = useState<Lesson[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem("school_lessons");
    return saved ? JSON.parse(saved) : [];
  });

  const [assignedCodes, setAssignedCodes] = useState<AssignedCode[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem("school_assignedCodes");
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem("school_notifications");
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

  const [terms, setTerms] = useState<string>(() => {
    if (typeof window === 'undefined') return "شروط الاستخدام الأساسية للمدرسة...";
    const saved = localStorage.getItem("school_terms");
    return saved ? saved : "أوافق على الالتزام بقوانين المدرسة والحفاظ على سرية المعلومات الأكاديمية والمشاركة الفعالة في العملية التعليمية.";
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem("current_user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("school_teachers", JSON.stringify(teachers));
      localStorage.setItem("school_programs", JSON.stringify(programs));
      localStorage.setItem("school_articles", JSON.stringify(articles));
      localStorage.setItem("school_users", JSON.stringify(users));
      localStorage.setItem("school_classes", JSON.stringify(classes));
      localStorage.setItem("school_lessons", JSON.stringify(lessons));
      localStorage.setItem("school_assignedCodes", JSON.stringify(assignedCodes));
      localStorage.setItem("school_notifications", JSON.stringify(notifications));
      localStorage.setItem("school_questions", JSON.stringify(questions));
      localStorage.setItem("school_config", JSON.stringify(config));
      localStorage.setItem("school_terms", terms);
    }
  }, [teachers, programs, articles, users, assignedCodes, notifications, questions, config, terms]);

  useEffect(() => {
    if (typeof window !== 'undefined' && currentUser) {
      localStorage.setItem("current_user", JSON.stringify(currentUser));
    }
  }, [currentUser]);

  // Auth
  const loginUser = (email: string, password: string) => {
    // Check both users array and registrations (if approved)
    const user = users.find(u => (u.email === email || u.name === email) && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const deleteUser = (id: number) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const logoutUser = () => {
    setCurrentUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem("current_user");
    }
  };

  const registerUser = (user: Omit<User, "id" | "joinDate">) => {
    if (users.some(u => u.email === user.email)) {
      return false;
    }
    const newUser = {
      ...user,
      id: Date.now(),
      joinDate: new Date().toLocaleDateString('ar-EG')
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const updateUser = (updated: User) => {
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
    if (currentUser?.id === updated.id) {
      setCurrentUser(updated);
    }
  };

  // Class & Lesson actions
  const addClass = (classRoom: Omit<ClassRoom, "id">) => {
    setClasses(prev => [...prev, { ...classRoom, id: Date.now() }]);
  };

  const updateClass = (updated: ClassRoom) => {
    setClasses(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  const deleteClass = (id: number) => {
    setClasses(prev => prev.filter(c => c.id !== id));
  };

  const addLesson = (lesson: Omit<Lesson, "id" | "date">) => {
    setLessons(prev => [...prev, { 
      ...lesson, 
      id: Date.now(), 
      date: new Date().toLocaleDateString('ar-EG') 
    }]);
  };

  const deleteLesson = (id: number) => {
    setLessons(prev => prev.filter(l => l.id !== id));
  };

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

  // Code actions
  const addAssignedCode = (code: Omit<AssignedCode, "id" | "createdAt">) => {
    setAssignedCodes(prev => [...prev, { ...code, id: Date.now(), createdAt: new Date().toLocaleDateString('ar-EG') }]);
  };

  const updateAssignedCode = (updated: AssignedCode) => {
    setAssignedCodes(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  const deleteAssignedCode = (id: number) => {
    setAssignedCodes(prev => prev.filter(c => c.id !== id));
  };

  const getAvailableCodes = () => {
    return assignedCodes.filter(c => !c.usedBy);
  };

  // Notification actions
  const addNotification = (notification: Omit<Notification, "id" | "createdAt">) => {
    setNotifications(prev => [...prev, {
      ...notification,
      id: Date.now(),
      createdAt: new Date().toLocaleDateString('ar-EG')
    }]);
  };

  const markNotificationRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getUserNotifications = (userId: number) => {
    return notifications.filter(n => n.userId === userId);
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

  const updateTerms = (newTerms: string) => {
    setTerms(newTerms);
  };

  return (
    <SchoolContext.Provider value={{
      teachers, programs, articles, users, classes, lessons, assignedCodes, notifications, questions, config, terms, currentUser,
      loginUser, logoutUser, registerUser, updateUser, deleteUser,
      addClass, updateClass, deleteClass, addLesson, deleteLesson,
      addTeacher, updateTeacher, deleteTeacher,
      addProgram, updateProgram, deleteProgram,
      addArticle, updateArticle, deleteArticle,
      addAssignedCode, updateAssignedCode, deleteAssignedCode, getAvailableCodes,
      addNotification, markNotificationRead, deleteNotification, getUserNotifications,
      addQuestion, answerQuestion, deleteQuestion,
      updateConfig, updateTerms
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

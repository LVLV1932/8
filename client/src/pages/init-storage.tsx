export function initializeStorage() {
  if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify([{
      id: 1,
      fullName: "مدير النظام",
      username: "admin",
      email: "admin@school.iq",
      phone: "+964 770 000 0000",
      password: "admin123",
      role: "admin",
      gender: "male",
      dob: null,
      address: "البصرة",
      status: "approved",
      createdAt: new Date().toLocaleString('ar-EG')
    }]));
  }
  if (!localStorage.getItem("registrations")) {
    localStorage.setItem("registrations", JSON.stringify([]));
  }
}

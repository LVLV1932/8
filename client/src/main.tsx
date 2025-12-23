import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initializeStorage } from "./pages/init-storage";

initializeStorage();
createRoot(document.getElementById("root")!).render(<App />);

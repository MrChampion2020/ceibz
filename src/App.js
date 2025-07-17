import React from "react";
import "./App.css";
import Navigation from "./navigation/Navigation";
import Modal from "react-modal";
import { AuthProvider } from "./AuthContext";
import { ThemeProvider } from "./components/ThemeProvider";
import { LanguageProvider } from "./components/LanguageContext";

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <Navigation />
          <Modal />
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;




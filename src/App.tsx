import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MailProvider } from './context/MailContext';
import MainLayout from './layouts/MainLayout';
import Inbox from './pages/Inbox';
import Sent from './pages/Sent';
import Drafts from './pages/Drafts';
import Compose from './pages/Compose';
import DecryptMsg from './pages/DecryptMsg';
import Contacts from './pages/Contacts';
import AboutUs from './pages/AboutUs';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import Docs from './pages/Docs';
import { ContactProvider } from './context/ContactContext';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
      <MailProvider>
        <ContactProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Landing />} />
              <Route path="/docs" element={<Docs />} />
              <Route element={<MainLayout />}>
                <Route path="/inbox" element={<Inbox />} />
                <Route path="/sent" element={<Sent />} />
                <Route path="/drafts" element={<Drafts />} />
                <Route path="/compose" element={<Compose />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/mail/:id" element={<DecryptMsg />} />
              </Route>
            </Routes>
          </BrowserRouter>
          <Toaster 
            position="bottom-right" 
            toastOptions={{
              className: 'font-mono text-sm shadow-xl',
              duration: 4000
            }} 
          />
        </ContactProvider>
      </MailProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;

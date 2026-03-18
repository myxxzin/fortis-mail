import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MailProvider } from './context/MailContext';
import MainLayout from './layouts/MainLayout';
import Inbox from './pages/Inbox';
import Sent from './pages/Sent';
import Drafts from './pages/Drafts';
import Compose from './pages/Compose';
import DecryptMsg from './pages/DecryptMsg';
import Contacts from './pages/Contacts';
import Login from './pages/Login';
import Register from './pages/Register';
import { ContactProvider } from './context/ContactContext';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <MailProvider>
        <ContactProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Navigate to="/inbox" replace />} />
                <Route path="inbox" element={<Inbox />} />
                <Route path="sent" element={<Sent />} />
                <Route path="drafts" element={<Drafts />} />
                <Route path="compose" element={<Compose />} />
                <Route path="contacts" element={<Contacts />} />
                <Route path="mail/:id" element={<DecryptMsg />} />
              </Route>
            </Routes>
          </BrowserRouter>
          <Toaster 
            position="top-right" 
            toastOptions={{
              className: 'font-mono text-sm shadow-xl',
              duration: 4000
            }} 
          />
        </ContactProvider>
      </MailProvider>
    </AuthProvider>
  );
}

export default App;

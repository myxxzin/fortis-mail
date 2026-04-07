import { useLanguage } from '../../../contexts/LanguageContext';
import FlowDiagram from '../../../components/docs/FlowDiagram';
import { Database, Laptop, Combine, LockKeyhole, RefreshCwOff, Zap } from 'lucide-react';

export default function EncryptionSection() {
  const { language } = useLanguage();

  const flowNodesVI = [
    { id: '1', title: 'React UI & Máy Mã Hóa', description: 'Giao diện bắt dữ liệu & Web Crypto API đảm nhiệm hàm toán học nặng tại RAM nội bộ Browser.', icon: <Laptop /> },
    { id: '2', title: 'FortisMail Engine', description: 'Hàm lấy khóa ảo (deriveAESKey), xác thực ký số (verifySignature), ráp Payload JSON.', icon: <Zap /> },
    { id: '3', title: 'Firestore / Mails DB', description: 'Trạm trung chuyển mờ đục. Tiếp nhận duy nhất ASCII Armored Ciphertext định tuyến người dùng UID.', icon: <Database />, isSecondary: true },
  ];
  
  const flowNodesEN = [
    { id: '1', title: 'React UI & Crypto Context', description: 'Intercepts interactions allocating math intensive Web Crypto API jobs securely resolving inside local RAM.', icon: <Laptop /> },
    { id: '2', title: 'Encryption Core Engine', description: 'Orchestrating ephemeral derivation (deriveAESKey), signature matching (verifySignature) & JSON wrappers.', icon: <Zap /> },
    { id: '3', title: 'Firestore Routing Blind', description: 'Database cluster completely oblivious storing exclusively ASCII Armored Ciphertext strings attached to UIDs.', icon: <Database />, isSecondary: true },
  ];

  if (language === 'vi') {
    return (
      <div id="encryption" className="scroll-mt-24">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#226214] to-[#43cc25] dark:from-[#43cc25] dark:to-[#8ff277] mb-6">
          Kiến Trúc Mật Mã Học
        </h1>
        
        <h2 className="text-2xl font-bold mt-12 mb-8 text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
          1. Luồng Hệ Thống (System Architecture)
        </h2>
        
        <p className="text-lg text-slate-700 dark:text-slate-300 mb-8 border-l-4 border-[#43cc25] pl-4 py-1 bg-[#43cc25]/10 dark:bg-[#43cc25]/20 rounded-r-lg">
          <strong>Mô hình hai lớp độc lập:</strong><br/>
          <strong>Tiền phương (Frontend):</strong> Đóng vai trò máy trạm Mã hóa (Web Crypto C++ Core).<br />
          <strong>Hậu phương (Backend):</strong> Máy chủ câm chuyển phát ngốc nghếch (Firebase routing).
        </p>

        <div className="p-6 bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 rounded-3xl mb-12 shadow-sm">
          <FlowDiagram nodes={flowNodesVI} direction="horizontal" />
        </div>

        <h2 className="text-2xl font-bold mt-16 mb-8 text-slate-900 dark:text-slate-100 tracking-tight">2. Lõi Thiết Kế Mật Mã (Crypto Core)</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 hover:border-cyan-300 dark:hover:border-cyan-800/50 transition-colors">
            <Combine className="w-8 h-8 text-cyan-600 dark:text-cyan-400 mb-4" />
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100">Hybrid Cryptography (Lai)</h3>
            <p className="text-slate-700 dark:text-slate-300 text-md leading-relaxed">
              Giải quyết bài toán tốc độ. FORTISMail kết hợp <strong>Mã hóa đối xứng (AES-256-GCM)</strong> cho dữ liệu khổng lồ, sau đó bọc chìa khoá AES nội bộ vô lớp vỏ phong bì siêu vững của <strong>Mã hóa bất đối xứng (ECDH)</strong>.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-800/50 transition-colors">
            <LockKeyhole className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-4" />
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100">PBKDF2 Password Hardening</h3>
            <p className="text-slate-700 dark:text-slate-300 text-md leading-relaxed">
              Tạo ra Master Key 256-bit từ mật khẩu thô ráp. Việc ép vòng lặp băm tự thân <strong>100,000 rounds</strong> biến việc hack brute-force bằng dàn máy cày ASIC thành một trò đùa phá sản về tài chính đối với tội phạm mạng.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 hover:border-green-300 dark:hover:border-green-800/50 transition-colors">
            <Zap className="w-8 h-8 text-green-600 dark:text-green-400 mb-4" />
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100">Cơ Chế Forward Secrecy</h3>
            <p className="text-slate-700 dark:text-slate-300 text-md leading-relaxed">
              Dùng một lần vứt. Khóa mã hóa session <strong>(Ephemeral ECDH)</strong> sinh ra tạm thời và bị ném vào quên lãng. Tránh rủi ro giải mã hàng loạt nếu Private Key gốc bị lộ sau 10 năm nữa.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 hover:border-red-300 dark:hover:border-red-800/50 transition-colors">
            <RefreshCwOff className="w-8 h-8 text-red-600 dark:text-red-400 mb-4" />
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100">Chặn Đứng Replay Attack</h3>
            <p className="text-slate-700 dark:text-slate-300 text-md leading-relaxed">
              Chữ ký ECDSA kỹ thuật số không chỉ đóng gói nội dung thư mà buộc chết chùm giá trị <strong>Timestamp (Thời gian) vòng RecipientID</strong>. Bất cứ hành động xào trộn tái kích hoạt gửi lậu luồng packet cũ đều lập tức invalid.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="encryption" className="scroll-mt-24">
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#226214] to-[#43cc25] dark:from-[#43cc25] dark:to-[#8ff277] mb-6">
        Cryptography Core
      </h1>
      
      <h2 className="text-2xl font-bold mt-12 mb-8 text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
        1. Two-Layer Architecture
      </h2>

      <p className="text-lg text-slate-700 dark:text-slate-300 mb-8 border-l-4 border-[#43cc25] pl-4 py-1 bg-[#43cc25]/10 dark:bg-[#43cc25]/20 rounded-r-lg">
        <strong>Dual Separation Model:</strong><br/>
        <strong>Frontend:</strong> C++ Web Crypto execution block carrying 100% of the hashing architecture.<br />
        <strong>Backend:</strong> Dumb Courier. Firebase blindly receiving opaque blobs sorting via UIDs.
      </p>

      <div className="p-6 bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 rounded-3xl mb-12 shadow-sm">
        <FlowDiagram nodes={flowNodesEN} direction="horizontal" />
      </div>

      <h2 className="text-2xl font-bold mt-16 mb-8 text-slate-900 dark:text-slate-100 tracking-tight">2. Core Technical Designs</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 hover:border-cyan-300 dark:hover:border-cyan-800/50 transition-colors">
          <Combine className="w-8 h-8 text-cyan-600 dark:text-cyan-400 mb-4" />
          <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100">Hybrid Cryptography</h3>
          <p className="text-slate-700 dark:text-slate-300 text-md leading-relaxed">
            The best of both worlds. <strong>AES-256-GCM symmetric block mapping</strong> shreds mass data at hyper velocity natively before nesting its tiny key internally an uncrackable <strong>ECDH asymmetric</strong> vault box.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-800/50 transition-colors">
          <LockKeyhole className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-4" />
          <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100">PBKDF2 Bruteforce Block</h3>
          <p className="text-slate-700 dark:text-slate-300 text-md leading-relaxed">
            Converting fragile human pins securely into 256-bit Masters. Punishing password entries executing vicious <strong>100,000 salt rounds</strong> making ASIC dictionary attacks financially destructive to intercepting operations.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 hover:border-green-300 dark:hover:border-green-800/50 transition-colors">
          <Zap className="w-8 h-8 text-green-600 dark:text-green-400 mb-4" />
          <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100">Forward Secrecy Ephemerals</h3>
          <p className="text-slate-700 dark:text-slate-300 text-md leading-relaxed">
            Generate and Terminate. Ephemeral session keys destruct automatically ensuring that if 10 years later your Core Root Key falls, historical mail iterations forever stay mathematically impossible to back-trace.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 hover:border-red-300 dark:hover:border-red-800/50 transition-colors">
          <RefreshCwOff className="w-8 h-8 text-red-600 dark:text-red-400 mb-4" />
          <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100">Anti-Replay Attack Armor</h3>
          <p className="text-slate-700 dark:text-slate-300 text-md leading-relaxed">
            ECDSA Digital Signatures blanket not merely content boundaries. Forging intercept blocks enclosing <strong>Timestamp Arrays + Recipient UID logic</strong> immediately invalidates illegally tampered network relays.
          </p>
        </div>
      </div>
    </div>
  );
}

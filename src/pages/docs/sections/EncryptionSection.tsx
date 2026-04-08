import { useLanguage } from '../../../contexts/LanguageContext';
import FlowDiagram from '../../../components/docs/FlowDiagram';
import { Database, Laptop, LockKeyhole, ShieldCheck, Mail } from 'lucide-react';
import Callout from '../../../components/docs/Callout';
import CodeBlock from '../../../components/docs/CodeBlock';

export default function EncryptionSection() {
  const { language } = useLanguage();

  const flowArchitectureNodes = [
    { id: '1', title: 'Browser', description: 'React + Context', icon: <Laptop className="w-5 h-5" /> },
    { id: '2', title: 'Crypto Engine', description: 'AES-256 + ECDH', icon: <LockKeyhole className="w-5 h-5" /> },
    { id: '3', title: 'Signature', description: 'ECDSA Timestamp', icon: <ShieldCheck className="w-5 h-5" /> },
    { id: '4', title: 'Firebase', description: 'Payload Routers', icon: <Database className="w-5 h-5" />, isSecondary: true },
    { id: '5', title: 'Recipient', description: 'Memory Decryption', icon: <Mail className="w-5 h-5" /> }
  ];

  if (language === 'vi') {
    return (
      <div id="encryption" className="scroll-mt-24">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-12 mb-6 border-t border-slate-200 dark:border-slate-800 pt-10">
          Kiến Trúc Mật Mã (Cryptography Core)
        </h2>
        
        <p className="text-slate-700 dark:text-slate-300 mb-8 leading-relaxed text-lg">
          Mô hình phân tầng hai lớp (Two-layer model): <strong>Frontend</strong> hoạt động như cỗ máy mã hóa độc lập (Encryption Engine) và <strong>Backend</strong> là tuyến chuyển phát hoàn toàn bị vô hiệu hóa nhận diện nội dung (Blind Courier).
        </p>

        <div className="mb-12">
          <FlowDiagram nodes={flowArchitectureNodes} direction="horizontal" />
        </div>

        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-12 mb-4">
          1. Mô Hình Mật Mã Lai (Hybrid Cryptography)
        </h3>
        
        <p className="text-slate-700 dark:text-slate-300 mb-6">
          FORTISMail áp dụng phương pháp <strong>Mật mã lai</strong>, kết hợp thế mạnh về tốc độ khi xử lý khối dữ liệu lớn của mã hóa đối xứng (AES-256-GCM) và tính năng giao tiếp khóa diện rộng an toàn tuyệt đối của mã hóa bất đối xứng (ECDH).
        </p>

        <div className="mb-10 overflow-hidden rounded-xl bg-[#0f172a]">
          <CodeBlock language="typescript" code={`ENCRYPT FLOW:
──────────────────────────────────────────────────────
Message Content (large)
        │
        ▼
  AES-256-GCM  ──── generates ────▶  [AES File Key]
  (fast, bulk)                              │
        │                                   ▼
  [Ciphertext]                    ECDH (DH Ephemeral)
                                  wraps [AES File Key]
                                          │
                                          ▼
                                  [Encrypted Key Blob]
                                  (safe to transmit)
──────────────────────────────────────────────────────
Final payload = Ciphertext + Encrypted Key Blob`} />
        </div>

        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-12 mb-4">
          2. deriveAESKey() — Cơ Chế PBKDF2
        </h3>
        <p className="text-slate-700 dark:text-slate-300 mb-4">Tính năng nhận diện tham số chuỗi Mật khẩu của người dùng, liên kết trực tiếp với mã định danh (Salt) để xuất ra chuỗi <strong>Master Key 256-bit</strong>.</p>
        <ul className="list-inside list-disc space-y-2 text-slate-700 dark:text-slate-300 ml-2 mb-8">
          <li><strong>Tại sao lại là PBKDF2 (100,000 vòng lặp):</strong> Hệ thống SHA-256 mặc định xử lý quá nhanh, giúp máy trạm đào hash giải toán tỷ lần/giây để Brute-Force tài khoản.</li>
          <li>Việc thực thi vòng khóa 100,000 lần khiến mọi nỗ lực Brute-Force qua từ điển bị tổn thất sức mạnh tính toán kinh tế hoàn toàn. Mục đích chính của <strong>Master Key</strong> này dùng để bọc lớp an toàn cho khóa Private Key trước khi gán lên máy chủ Firestore.</li>
        </ul>

        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-12 mb-4">
          3. encryptMessageHybrid() — Forward Secrecy
        </h3>
        <p className="text-slate-700 dark:text-slate-300 mb-4">Thay vì dùng toàn bộ khoá lâu dài, hàm này khởi tạo cặp khóa tạm thời (ephemeral) dùng một lần duy nhất cho mỗi luồng thư gửi đi.</p>
        
        <div className="bg-white dark:bg-[#09090b] border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-sm mb-8 space-y-4 text-slate-700 dark:text-slate-300">
          <div className="border-l-4 border-rose-500 pl-4 py-1">
             <strong className="text-rose-600 dark:text-rose-400 block mb-1">Thiếu bảo vệ Ephemeral Keys:</strong>
             Nếu chỉ mã hoá thẳng bằng Private Key cá nhân và Public Key đối tác, khi 10 năm sau tin tặc trộm được Private Key, TOÀN BỘ luồng e-mail cũ bị rò rỉ đồng loạt.
          </div>
          <div className="border-l-4 border-[#43cc25] pl-4 py-1">
             <strong className="text-[#43cc25] block mb-1">FORTISMail (Sử dụng Ephemeral Keys):</strong>
             Khóa thiết lập phiên chỉ dùng đúng 1 lần, sau khi mã hoá xong lập tức tiêu hủy không thể cứu giãn. Do vậy dù Private Key của nạn nhân có bị lộ trong tương lai thì các thư quá khứ vẫn **hoàn toàn vô hình**. Tính năng này được gọi là thiết lập <strong>Forward Secrecy</strong>.
          </div>
        </div>

        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-12 mb-4">
          4. verifySignature() — ECDSA Anti-Replay Attack 
        </h3>
        <p className="text-slate-700 dark:text-slate-300 mb-6">Mỗi tin nhắn điều hướng ra ngoài phải đính thông số Timestamp. Việc ký chữ ký số <strong>ECDSA</strong> chỉ với nội dung văn bản là không đủ.</p>
        <div className="mb-12">
          <Callout type="info" title="Lý luận Phòng vệ (Defense Logic)">
            Việc gói gọn tham số <code className="bg-white dark:bg-slate-800 px-1 py-0.5 rounded text-sm">timestamp</code> và <code className="bg-white dark:bg-slate-800 px-1 py-0.5 rounded text-sm">recipientUID</code> trực tiếp vào Payload đảm bảo kẻ gian không thể bắt gói tin cũ để gán và chỉnh sửa thời gian nhằm gây nhầm lẫn hệ thống. Nếu một bit bị xoắn sai hoặc lệch thời gian ký quỹ, chốt <code>verification</code> sẽ rớt lập tức.
          </Callout>
        </div>

      </div>
    );
  }

  // English Version
  return (
    <div id="encryption" className="scroll-mt-24">
      <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-12 mb-6 border-t border-slate-200 dark:border-slate-800 pt-10">
        Cryptography Core
      </h2>
      
      <p className="text-slate-700 dark:text-slate-300 mb-8 leading-relaxed text-lg">
        Structural Two-Layer definition logic: The <strong>Frontend React</strong> ecosystem acts natively as a dedicated hardware Encryption Engine whilst the <strong>Firebase Backend</strong> strictly plays the role of a Blind Courier.
      </p>

      <div className="mb-12">
        <FlowDiagram nodes={flowArchitectureNodes} direction="horizontal" />
      </div>

      <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-12 mb-4">
        1. Hybrid Cryptography Matrix
      </h3>
      
      <p className="text-slate-700 dark:text-slate-300 mb-6">
        FORTISMail combines immense file capacity processing capabilities inherently found within symmetric environments (AES-256-GCM) dynamically merged directly alongside the secure transport validation sequences native to asymmetric exchanges (ECDH paradigms).
      </p>

      <div className="mb-10 overflow-hidden rounded-xl bg-[#0f172a]">
        <CodeBlock language="typescript" code={`ENCRYPT FLOW:
──────────────────────────────────────────────────────
Message Content (large)
        │
        ▼
  AES-256-GCM  ──── generates ────▶  [AES File Key]
  (fast, bulk)                              │
        │                                   ▼
  [Ciphertext]                    ECDH (DH Ephemeral)
                                  wraps [AES File Key]
                                          │
                                          ▼
                                  [Encrypted Key Blob]
                                  (safe to transmit)
──────────────────────────────────────────────────────
Final payload = Ciphertext + Encrypted Key Blob`} />
      </div>

      <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-12 mb-4">
        2. deriveAESKey() — PBKDF2 Enforcement
      </h3>
      <p className="text-slate-700 dark:text-slate-300 mb-4">Responsible for ingesting human-readable configurations incorporating distinct user identification parameters (salts) driving secure cryptographic <strong>256-bit Master Keys</strong>.</p>
      <ul className="list-inside list-disc space-y-2 text-slate-700 dark:text-slate-300 ml-2 mb-8">
        <li><strong>Why implement 100,000 iterations:</strong> Primitive SHA-256 frameworks resolve virtually instantly authorizing ASIC data clusters billions of password validations every passing second.</li>
        <li>Isolating computations by artificially escalating iteration requirements deliberately guarantees standard authentication processing takes ~0.2s — rendering large-scale brute-force infiltration attempts completely bankrupt logistically. The extracted <strong>Master Key</strong> wraps the primary Private variable shielding Firebase allocations.</li>
      </ul>

      <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-12 mb-4">
        3. encryptMessageHybrid() — Forward Secrecy Defense
      </h3>
      <p className="text-slate-700 dark:text-slate-300 mb-4">Rather than reusing persistent permanent root keys continually, algorithms generate singular disposable variant key pairings specifically engineered per dispatched element individually.</p>
      
      <div className="bg-white dark:bg-[#09090b] border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-sm mb-8 space-y-4 text-slate-700 dark:text-slate-300">
        <div className="border-l-4 border-rose-500 pl-4 py-1">
           <strong className="text-rose-600 dark:text-rose-400 block mb-1">Exposed Legacy Implementations:</strong>
           Merging Alice's explicit long-term core properties identically creates exploitable sequences globally. Should a hardware breach compromise Alice years later, ALL historic interactions become readable retroactively enabling destructive exposures.
        </div>
        <div className="border-l-4 border-[#43cc25] pl-4 py-1">
           <strong className="text-[#43cc25] block mb-1">FORTISMail's Ephemeral Solutions:</strong>
           Session authorizations strictly vaporize completely shortly following encryption termination phases permanently. This absolute defense infrastructure explicitly designates <strong>Forward Secrecy</strong> — confirming that past intercepted interactions perpetually retain uncrackable attributes universally regardless of future breaches.
        </div>
      </div>

      <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-12 mb-4">
        4. verifySignature() — Nullifying Replay Arrays
      </h3>
      <p className="text-slate-700 dark:text-slate-300 mb-6">Every independent transmission embeds rigorous temporal variables manually. Securing solely standard readable block text provides hostile interceptors dangerous reconfiguration possibilities.</p>
      <div className="mb-12">
        <Callout type="info" title="Defense Logic Explanation">
          By injecting exact <code className="bg-white dark:bg-slate-800 px-1 py-0.5 rounded text-sm">timestamp</code> nodes dynamically inside signed payloads, any interception manipulation attempt attempting delivery resends triggers profound mathematical contradictions instantly. ECDSA layers structurally disconnect failed packages successfully blocking Replay Attack potentials immediately.
        </Callout>
      </div>

    </div>
  );
}

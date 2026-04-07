export default function GettingStarted() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white uppercase">TỔNG QUAN VÀ TRIẾT LÝ THIẾT KẾ</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">CHƯƠNG 1 (DESIGN PHILOSOPHY)</p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
        <h3 className="text-xl font-bold mt-8 border-b border-slate-200 dark:border-slate-800 pb-2">1.1. Bối cảnh và Bài toán (The Problem Space)</h3>
        <p>
          Các dịch vụ email truyền thống (như Gmail, Outlook) sử dụng mã hóa In-Transit (TLS) và At-Rest (mã hóa ổ cứng máy chủ). Điều này có nghĩa là nhà cung cấp dịch vụ vẫn nắm giữ chìa khóa và có thể đọc được nội dung thư (plaintext) của bạn.
        </p>
        <p>
          <strong>FortisMail</strong> ra đời để giải quyết triệt để bài toán này bằng mô hình <strong>End-to-End Encryption (E2EE)</strong> kết hợp <strong>Zero-Knowledge Architecture</strong>.
        </p>

        <h3 className="text-xl font-bold mt-8 border-b border-slate-200 dark:border-slate-800 pb-2">1.2. Triết lý Zero-Knowledge</h3>
        <ul className="list-disc pl-6 space-y-2 mt-4 text-slate-700 dark:text-slate-300">
          <li><strong>Máy chủ bị "Mù" (Blind Server):</strong> Database (Firebase Firestore) chỉ lưu trữ các chuỗi ký tự vô nghĩa (Ciphertext). Server không biết mật khẩu của người dùng, không giữ Private Key không bị mã hóa, và hoàn toàn không thể giải mã nội dung.</li>
          <li><strong>Bảo mật cấp độ Client (Client-Side Security):</strong> Toàn bộ quá trình mã hóa/giải mã diễn ra trên RAM của trình duyệt người dùng thông qua <code>Web Crypto API</code>, đảm bảo dữ liệu thô không bao giờ rời khỏi thiết bị.</li>
        </ul>

        <h3 className="text-xl font-bold mt-8 border-b border-slate-200 dark:border-slate-800 pb-2">1.3. Hệ sinh thái Công nghệ (Tech Stack Deep Dive)</h3>
        <ul className="list-disc pl-6 space-y-2 mt-4 text-slate-700 dark:text-slate-300">
          <li><strong>Core Framework:</strong> React 19 + TypeScript + Vite. Cung cấp môi trường phát triển Strict-Type và HMR (Hot Module Replacement) siêu tốc.</li>
          <li><strong>Cryptography Engine:</strong> Native <code>window.crypto.subtle</code>. Thuật toán được thực thi trực tiếp bằng C++ dưới tầng trình duyệt thay vì dùng thư viện JS ngoài (như <code>crypto-js</code> chỉ dùng hỗ trợ), mang lại hiệu năng cao nhất và an toàn nhất.</li>
          <li><strong>Backend & Infrastructure:</strong>
            <ul className="list-circle pl-6 mt-2 space-y-1">
              <li><code>Firebase Auth</code>: Quản lý phiên bản đăng nhập.</li>
              <li><code>Firestore</code>: NoSQL Database thời gian thực.</li>
              <li><code>Firebase Storage</code>: Lưu trữ Blob tệp đính kèm đã bị mã hóa.</li>
            </ul>
          </li>
          <li><strong>UI/UX:</strong> <code>TailwindCSS v4</code> kết hợp <code>Framer Motion</code> để xử lý mượt mà các trạng thái loading/encrypting bất đồng bộ.</li>
        </ul>
      </div>
    </div>
  );
}

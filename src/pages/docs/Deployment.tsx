export default function Deployment() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      {/* Chapter 5 */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white uppercase">TRẢI NGHIỆM NGƯỜI DÙNG & TỐI ƯU HÓA</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">CHƯƠNG 5 (UX/UI & OPTIMIZATION)</p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
        <h3 className="text-xl font-bold mt-8 border-b border-slate-200 dark:border-slate-800 pb-2">5.1. Progressive Disclosure (Tiết lộ dần dần)</h3>
        <p>Thiết kế giao diện tránh làm người dùng bị "ngợp" bởi các khái niệm mật mã. Các đoạn Public Key dài ngoằng được cắt bớt (<code>substring(0, 24) + '...'</code>) hoặc thay bằng Alias (Tên gợi nhớ). Biểu tượng Ổ khóa (Lock) và Khiên bảo vệ (ShieldCheck) từ <code>lucide-react</code> liên tục được sử dụng để củng cố cảm giác an toàn.</p>

        <h3 className="text-xl font-bold mt-8 border-b border-slate-200 dark:border-slate-800 pb-2">5.2. Hoạt ảnh mã hóa trực quan (Visual Feedback)</h3>
        <p>Sử dụng <code>&lt;motion.div&gt;</code> của <code>framer-motion</code>:</p>
        <p>Khi bấm nút gửi hoặc giải mã, thay vì hiện màn hình trống, UI chuyển sang một Spinner với dòng chữ "ENCRYPTING..." / "DECRYPTING..." bằng phông chữ Monospace, tạo cảm giác như một thiết bị quân sự/hacker (Cyberpunk vibe) đang xử lý thuật toán phức tạp.</p>
      </div>

      <div className="w-full h-px bg-slate-200 dark:bg-slate-800 my-12 hidden sm:block"></div>

      {/* Chapter 6 */}
      <div className="space-y-4 pt-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white uppercase">HƯỚNG DẪN TÍCH HỢP VÀ TRIỂN KHAI</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">CHƯƠNG 6 (DEPLOYMENT GUIDE)</p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
        <h3 className="text-xl font-bold mt-8 border-b border-slate-200 dark:border-slate-800 pb-2">6.1. Khởi tạo Firebase Environment</h3>
        <p>Để dự án hoạt động, tạo file <code>.env</code> ở root directory:</p>
        <pre className="bg-slate-900 text-slate-300 p-4 rounded-lg overflow-x-auto text-sm border border-slate-800">
          <code>
VITE_FIREBASE_API_KEY=AIzaSyA...{'\n'}
VITE_FIREBASE_AUTH_DOMAIN=fortis-mail.firebaseapp.com{'\n'}
VITE_FIREBASE_PROJECT_ID=fortis-mail{'\n'}
VITE_FIREBASE_STORAGE_BUCKET=fortis-mail.firebasestorage.app{'\n'}
VITE_FIREBASE_MESSAGING_SENDER_ID=...{'\n'}
VITE_FIREBASE_APP_ID=...
          </code>
        </pre>

        <h3 className="text-xl font-bold mt-8 border-b border-slate-200 dark:border-slate-800 pb-2">6.2. Cấu hình ESLint & TypeScript Strict Mode</h3>
        <p>Dự án sử dụng chuẩn cấu hình cao nhất (<code>tseslint.configs.strictTypeChecked</code>). Đảm bảo chạy lệnh <code>npm run lint</code> trước mỗi lần commit. Kiến trúc sử dụng Oxc/SWC compiler thông qua plugin <code>@vitejs/plugin-react</code> giúp thời gian build giảm xuống chỉ còn vài giây.</p>

        <h3 className="text-xl font-bold mt-8 border-b border-slate-200 dark:border-slate-800 pb-2">6.3. Quy trình Build & Deploy (Vercel)</h3>
        <p>Dự án là một Single Page Application (SPA). Tệp <code>vercel.json</code> (hoặc <code>public/_redirects</code>) bắt buộc phải cấu hình Rewrite rule để điều hướng toàn bộ traffic về <code>index.html</code>:</p>
        <pre className="bg-slate-900 text-slate-300 p-4 rounded-lg overflow-x-auto text-sm border border-slate-800">
          <code>
{'{'}{'\n'}
  "rewrites": [{'{'} "source": "/(.*)", "destination": "/index.html" {'}'}]{'\n'}
{'}'}
          </code>
        </pre>

        <div className="bg-[#43cc25]/10 border-l-4 border-[#43cc25] p-4 rounded-r-lg mt-12">
          <p className="text-sm text-corporate-800 dark:text-corporate-200 m-0">
             <strong>Tổng kết:</strong> FortisMail không chỉ là một ứng dụng React thông thường, nó là một minh chứng (Proof of Concept) cho việc đưa mật mã học cấp độ quân sự vào trình duyệt web. Bằng cách kết hợp Web Crypto API, React và Firebase, dự án đạt được sự cân bằng tuyệt vời giữa tính bảo mật tuyệt đối (Zero-Knowledge) và Trải nghiệm người dùng (UX) hiện đại.
          </p>
        </div>
      </div>
    </div>
  );
}

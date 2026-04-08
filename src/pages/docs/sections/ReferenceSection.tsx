import { useLanguage } from '../../../contexts/LanguageContext';
import CodeBlock from '../../../components/docs/CodeBlock';

export default function ReferenceSection() {
  const { language } = useLanguage();

  if (language === 'vi') {
    return (
      <div id="reference" className="scroll-mt-24">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-12 mb-6 border-t border-slate-200 dark:border-slate-800 pt-10">
          Cấu trúc & Phân bổ (Reference)
        </h2>
        
        <p className="text-slate-700 dark:text-slate-300 mb-8 leading-relaxed text-lg">
          Nội dung tham chiếu bao gồm cấu trúc thư mục toàn diện, phân công vai trò chuyên môn và hạ tầng công nghệ tổng quan của dự án FORTISMail.
        </p>

        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-10 mb-4">
          1. Sơ đồ Mã Nguồn (Repository Structure)
        </h3>
        
        <div className="mb-6 overflow-hidden rounded-xl bg-[#0f172a]">
          <CodeBlock language="typescript" code={`secure-webmail/
├── public/                    # Tài nguyên tĩnh (Static assets)
├── src/
│   ├── assets/                # Hình ảnh, thư viện icon
│   ├── components/            # UI components độc lập tái sử dụng
│   ├── config/                # Biến hằng số và cấu trúc Firebase
│   ├── context/               # AuthContext (React lưu trữ RAM)
│   ├── layouts/               # Tổ chức giao diện chung
│   ├── locales/
│   │   ├── en.ts              # File ngôn ngữ Tiếng Anh
│   │   └── vi.ts              # File ngôn ngữ Tiếng Việt
│   ├── pages/
│   │   ├── docs/              # Tài liệu nội bộ (Trang hiện tại)
│   │   ├── Compose.tsx        # Màn hình soạn thảo được mã hoá
│   │   ├── Contacts.tsx       # Lưu danh bạ chứa Public Key
│   │   ├── DecryptMsg.tsx     # Luồng giải mã & đọc thư
│   │   ├── Docs.tsx           
│   │   ├── Drafts.tsx         # Hệ thống lưu nháp
│   │   ├── Inbox.tsx          # Hộp thư đến
│   │   ├── Landing.tsx        # Trang chủ
│   │   ├── Login.tsx          # Cổng đăng nhập & Sinh khóa
│   │   ├── Register.tsx       # Khởi tạo khóa ECDH mới
│   │   └── Sent.tsx           # Thư đã gửi
│   │
│   └── utils/
│       └── cryptoAuth.ts      # ⚠️ LÕI MẬT MÃ - Xử lý tính toán Web Crypto
├── package.json
├── vite.config.ts
├── vercel.json                # Cấu hình biên dịch Vercel
└── WHITEPAPER.md              # Sách trắng thuật toán gốc`} />
        </div>

        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-10 mb-4">
          2. Các Tệp Quan Trọng (Key Files)
        </h3>
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mb-12 shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#f8fafc] dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4 font-bold border-b border-slate-200 dark:border-slate-700 w-1/3">Tập Tin (File)</th>
                <th className="px-6 py-4 font-bold border-b border-slate-200 dark:border-slate-700">Vai Trò Sự Kiện (Role)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                 <td className="px-6 py-4 font-mono font-semibold text-[#43cc25]">src/utils/cryptoAuth.ts</td>
                 <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                   Trái tim dự án. Nơi thiết lập mọi thuật toán ECDH, AES, PBKDF2, ECDSA.
                 </td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                 <td className="px-6 py-4 font-mono font-semibold text-[#43cc25]">src/context/AuthContext.tsx</td>
                 <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                   Cô lập biến Private Key không cho thoát ra ngoài qua React Context nội bộ.
                 </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-10 mb-4">
          3. Phân Công Chuyên Môn (Role Assignment)
        </h3>
        
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mb-12 shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#f8fafc] dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4 font-bold border-b border-slate-200 dark:border-slate-700 w-1/3">Vị Trí (Role)</th>
                <th className="px-6 py-4 font-bold border-b border-slate-200 dark:border-slate-700">Trách Nhiệm Hành Động (Responsibilities)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                 <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">Project Manager & System Architect</td>
                 <td className="px-6 py-4 text-slate-600 dark:text-slate-300">Quản lý tiến độ dự án, thiết kế cấu trúc hệ thống toàn cục, giám sát luồng logic <code>cryptoAuth.ts</code> và đảm bảo chất lượng kiến trúc E2E.</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                 <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">Security & Cryptography Engineer</td>
                 <td className="px-6 py-4 text-slate-600 dark:text-slate-300">Tính toán và kiểm thử các thuật toán lõi (ECDH, PBKDF2), thiết lập bức tường bảo vệ React Context và ngăn chặn phân tích lô gic chéo độc hại.</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                 <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">Backend & Database Engineer</td>
                 <td className="px-6 py-4 text-slate-600 dark:text-slate-300">Xây dựng cấu trúc Flat NoSQL, quản lý Security Rules đa tầng trên Firestore và đảm bảo hệ thống lưu trữ Cloud Storage vững chãi.</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                 <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">UI/UX Engineer</td>
                 <td className="px-6 py-4 text-slate-600 dark:text-slate-300">Thiết kế trải nghiệm người dùng, đảm bảo hiệu năng Responsive tuyệt đối, làm chủ khối hệ thống TailwindCSS và các hoạt ảnh bảo mật đặc trưng.</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                 <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">Core Frontend Developer</td>
                 <td className="px-6 py-4 text-slate-600 dark:text-slate-300">Cốt lõi xử lý React, thao tác DOM ảo, ghép nối giao thức Router và tích hợp State cô lập, ngăn chặn tối đa lộ lọt biến rác RAM.</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                 <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">QA Engineer & Technical Writer</td>
                 <td className="px-6 py-4 text-slate-600 dark:text-slate-300">Triển khai Pen-Test toàn diện, soạn thảo lưu trữ Whitepaper giải trình kiến trúc cốt lõi, hoàn thiện chuẩn API và Docs dự án khép kín.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-10 mb-6">
          4. Cơ Sở Công Nghệ (Tech Stack Summary)
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          <div className="border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
             <div className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Frontend</div>
             <div className="font-semibold text-slate-900 dark:text-slate-200">React 19 + Vite 8</div>
          </div>
          <div className="border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
             <div className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Ngôn Ngữ</div>
             <div className="font-semibold text-slate-900 dark:text-slate-200">TypeScript</div>
          </div>
          <div className="border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
             <div className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Giao Diện</div>
             <div className="font-semibold text-slate-900 dark:text-slate-200">Tailwind CSS 4</div>
          </div>
          <div className="border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
             <div className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Backend</div>
             <div className="font-semibold text-slate-900 dark:text-slate-200">Firebase Firestore</div>
          </div>
          <div className="border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
             <div className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Mật Mã Cơ Sở</div>
             <div className="font-semibold text-slate-900 dark:text-slate-200">Web Crypto API</div>
          </div>
          <div className="border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
             <div className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Triển Khai</div>
             <div className="font-semibold text-slate-900 dark:text-slate-200">Vercel</div>
          </div>
        </div>

      </div>
    );
  }

  // EN
  return (
    <div id="reference" className="scroll-mt-24">
      <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-12 mb-6 border-t border-slate-200 dark:border-slate-800 pt-10">
        Reference Schematics
      </h2>
      
      <p className="text-slate-700 dark:text-slate-300 mb-8 leading-relaxed text-lg">
        Holistic referencing mapping exact repository components explicitly defining professional team responsibility distributions strictly defining underlying structural platform components efficiently.
      </p>

      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-10 mb-4">
        1. Ecosystem Directory Tree
      </h3>
      
      <div className="mb-6 overflow-hidden rounded-xl bg-[#0f172a]">
        <CodeBlock language="typescript" code={`secure-webmail/
├── public/                    # Standard rendering properties
├── src/
│   ├── assets/                # Independent SVGs
│   ├── components/            # Reusable UI constructs
│   ├── config/                # Backend initialization properties
│   ├── context/               # AuthContext (RAM Storage Blocks)
│   ├── layouts/               # Generic framework overlays
│   ├── locales/
│   │   ├── en.ts              # Native english dictionaries
│   │   └── vi.ts              # Translation mappings
│   ├── pages/
│   │   ├── docs/              # Internal Documentation 
│   │   ├── Compose.tsx        # Dynamic Encrypted generation layouts
│   │   ├── Contacts.tsx       # Validation storage interfaces
│   │   ├── DecryptMsg.tsx     # Safe memory-isolated processing
│   │   ├── Docs.tsx           
│   │   ├── Drafts.tsx         # Storage implementations
│   │   ├── Inbox.tsx          # Default user interactions
│   │   ├── Landing.tsx        # Initialization
│   │   ├── Login.tsx          # Mathematical derivation pipelines
│   │   ├── Register.tsx       # Initial ECDH array constructions
│   │   └── Sent.tsx           # Standard records
│   │
│   └── utils/
│       └── cryptoAuth.ts      # ⚠️ CRYPTO CORE MATRIX
├── package.json
├── vite.config.ts
├── vercel.json                # Operations routing configurations
└── WHITEPAPER.md              # Original logic arrays`} />
      </div>

      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-10 mb-4">
        2. Foundation Operations (Key Files)
      </h3>
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mb-12 shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#f8fafc] dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            <tr>
              <th className="px-6 py-4 font-bold border-b border-slate-200 dark:border-slate-700 w-1/3">Target Reference</th>
              <th className="px-6 py-4 font-bold border-b border-slate-200 dark:border-slate-700">Responsibility Execution</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
               <td className="px-6 py-4 font-mono font-semibold text-[#43cc25]">src/utils/cryptoAuth.ts</td>
               <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                 Holds fundamental arrays distributing functional ECDH, AES, PBKDF2 logic inherently validating application safety globally.
               </td>
            </tr>
            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
               <td className="px-6 py-4 font-mono font-semibold text-[#43cc25]">src/context/AuthContext.tsx</td>
               <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                 Secures functional boundaries completely prohibiting exposure vulnerabilities maintaining safe rendering closures internally.
               </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-10 mb-4">
        3. Department Assignments
      </h3>
      
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mb-12 shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#f8fafc] dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            <tr>
              <th className="px-6 py-4 font-bold border-b border-slate-200 dark:border-slate-700 w-1/3">Entity Designations</th>
              <th className="px-6 py-4 font-bold border-b border-slate-200 dark:border-slate-700">Accountability Parameters</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
               <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">Project Manager & System Architect</td>
               <td className="px-6 py-4 text-slate-600 dark:text-slate-300">Manages project timelines securely, designs holistic architectural structures, and oversees core E2EE zero-knowledge implementation workflows natively.</td>
            </tr>
            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
               <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">Security & Cryptography Engineer</td>
               <td className="px-6 py-4 text-slate-600 dark:text-slate-300">Governs and audits core algorithms (<code>cryptoAuth.ts</code>), establishes robust Context isolation boundaries, and perpetually nullifies cryptographic vulnerability vectors.</td>
            </tr>
            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
               <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">Backend & Database Engineer</td>
               <td className="px-6 py-4 text-slate-600 dark:text-slate-300">Establishes strict flattened NoSQL structures dynamically, specifically administrating Firebase Security Rules alongside complex Cloud Storage routing coordinations.</td>
            </tr>
            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
               <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">UI/UX Engineer</td>
               <td className="px-6 py-4 text-slate-600 dark:text-slate-300">Crafts intuitive visual user paradigms reliably, strictly maintaining comprehensive responsive layouts utilizing TailwindCSS alongside seamless operational behaviors.</td>
            </tr>
            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
               <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">Core Frontend Developer</td>
               <td className="px-6 py-4 text-slate-600 dark:text-slate-300">Assembles complex React architectures reliably isolating decrypted State deployments consistently avoiding parameter leaks actively bridging interface mechanisms.</td>
            </tr>
            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
               <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">QA Engineer & Technical Writer</td>
               <td className="px-6 py-4 text-slate-600 dark:text-slate-300">Executes comprehensive validation procedures formally generating core Whitepaper blueprints, structural logic manuals natively preserving system continuity professionally.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-10 mb-6">
        4. Application Framework Summary
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        <div className="border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
           <div className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Frontend</div>
           <div className="font-semibold text-slate-900 dark:text-slate-200">React 19 + Vite 8</div>
        </div>
        <div className="border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
           <div className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Structures</div>
           <div className="font-semibold text-slate-900 dark:text-slate-200">TypeScript</div>
        </div>
        <div className="border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
           <div className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Designing</div>
           <div className="font-semibold text-slate-900 dark:text-slate-200">Tailwind CSS 4</div>
        </div>
        <div className="border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
           <div className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Backend Arrays</div>
           <div className="font-semibold text-slate-900 dark:text-slate-200">Firebase Firestore</div>
        </div>
        <div className="border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
           <div className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Cryptographic APIs</div>
           <div className="font-semibold text-slate-900 dark:text-slate-200">Web Crypto Native</div>
        </div>
        <div className="border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
           <div className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Production Hosting</div>
           <div className="font-semibold text-slate-900 dark:text-slate-200">Vercel Solutions</div>
        </div>
      </div>

    </div>
  );
}

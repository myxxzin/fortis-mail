import { useLanguage } from '../../../contexts/LanguageContext';
import CodeBlock from '../../../components/docs/CodeBlock';
import { Layers, Users, Server, Atom, BookOpen, AlertOctagon } from 'lucide-react';

export default function ReferenceSection() {
  const { language } = useLanguage();

  if (language === 'vi') {
    return (
      <div id="reference" className="scroll-mt-24">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 mb-6">
          Tham Khảo & Vai Trò
        </h1>
        
        <h2 className="text-2xl font-bold mt-12 mb-6 text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          1. Cơ Cấu Sinh Thái Cây Thư Mục
        </h2>
        
        <div className="bg-[#0d1117] p-5 rounded-2xl border border-slate-800 shadow-sm mb-6">
          <CodeBlock language="typescript" code={`secure-webmail/
├── public/                    # Tài nguyên tĩnh (Static assets)
├── src/
│   ├── assets/                # Hình ảnh, SVG icons
│   ├── components/            # UI components (Atomic design)
│   ├── config/                # Cấu hình tĩnh Firebase/App
│   ├── context/               # AuthContext (Giáp cách ly key trên RAM)
│   ├── layouts/               # Dashboard Layout & Sidebar
│   ├── locales/
│   │   ├── en.ts              # Dictionary Tiếng Anh
│   │   └── vi.ts              # Dictionary Tiếng Việt
│   ├── pages/
│   │   ├── docs/              # 📚 Trang tài liệu nội bộ
│   │   ├── Compose.tsx        # ✉️ Soạn email E2EE
│   │   ├── DecryptMsg.tsx     # 🔓 Bóc tách giải mã thư đến
│   │   ├── Drafts.tsx         # 📝 Bản nháp tự động mã hóa
│   │   ├── Inbox.tsx          # 📥 Hộp thư rỗng (Ciphertext)
│   │   └── Login.tsx          # 🔑 Cổng sinh Master Key
│   │
│   └── utils/
│       └── cryptoAuth.ts      # ⚠️ TRÁI TIM — Luồng mật mã hóa tổng
│
├── vercel.json                # Serverless Deployment Rules
└── WHITEPAPER.md              # Sách trắng thuật toán`} />
        </div>

        <h3 className="text-xl font-bold mt-8 mb-4 text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <AlertOctagon className="w-5 h-5 text-amber-500" /> Trọng điểm cần lưu ý
        </h3>
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-12">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4 font-semibold text-xs tracking-wider border-b border-slate-200 dark:border-slate-800">TẬP TIN ĐỊNH TUYẾN</th>
                <th className="px-6 py-4 font-semibold text-xs tracking-wider border-b border-slate-200 dark:border-slate-800">MỨC ĐỘ RỦI RO CHIẾN LƯỢC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-[#09090b]">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                 <td className="px-6 py-5 font-mono font-bold text-emerald-600 dark:text-emerald-400">src/utils/cryptoAuth.ts</td>
                 <td className="px-6 py-5 text-slate-600 dark:text-slate-300">
                   <span className="bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 text-xs font-bold px-2 py-1 rounded inline-block mb-2">ĐỘ DỊ KHẢO: MAXIMUM</span><br/>
                   Thay đổi dù chỉ 1 dòng String Buffer tại block này sẽ lập tức làm chệch thuật toán giải mã, khiến toàn bộ User không mở được thư hiện tại. Cực kỳ cẩn trọng.
                 </td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                 <td className="px-6 py-5 font-mono font-bold text-amber-600 dark:text-amber-400">src/context/AuthContext.tsx</td>
                 <td className="px-6 py-5 text-slate-600 dark:text-slate-300">Nắm giữ con trỏ bộ nhớ (Memory Pointer) trỏ thẳng tới Private Key. Bất kỳ dev thiếu kinh nghiệm nào đặt <code>console.log()</code> ở đây đều sẽ lặp tức ném toàn bộ cơ sở dữ liệu vào tay Hacker.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-bold mt-16 mb-6 text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2 border-t border-slate-200 dark:border-slate-800 pt-10">
          <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          2. Cấu Trúc Đội Ngũ (Dev Team Roles)
        </h2>
        
        <div className="grid md:grid-cols-2 gap-4 mb-16">
          <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-[#09090b]">
             <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2">Architect / Tech Lead</h4>
             <p className="text-slate-600 dark:text-slate-400 text-sm">Chịu trách nhiệm hoàn toàn <code>cryptoAuth.ts</code>. Thiết kế logic Web Crypto. Quản lý phân quyền rule Firebase. Đứng mũi chịu sào bảo mật.</p>
          </div>
          <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-[#09090b]">
             <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2">Frontend Developer</h4>
             <p className="text-slate-600 dark:text-slate-400 text-sm">Viền hóa Data thành UI. Kiểm soát vòng đời State React Context. Thực hiện Debouncing Auto-save tránh treo luồng.</p>
          </div>
          <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-[#09090b]">
             <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2">Backend Engineer</h4>
             <p className="text-slate-600 dark:text-slate-400 text-sm">Thiết lập cấu trúc Flat Database, tối đa hóa Security Rules từ chối truy cập xéo. Xử lý giới hạn Bypass 1MB Document Storage.</p>
          </div>
          <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-[#09090b]">
             <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2">QA / Security Admin</h4>
             <p className="text-slate-600 dark:text-slate-400 text-sm">Viết Playwright Test. Audit bằng công cụ quét lỗ hổng. Đảm bảo triệt bỏ mọi mã Tracking dính líu XSS.</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-16 mb-6 text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2 border-t border-slate-200 dark:border-slate-800 pt-10">
          <Layers className="w-6 h-6 text-teal-600 dark:text-teal-400" />
          3. Công Nghệ Chốt Chặn (Tech Stack)
        </h2>
        
        <div className="flex flex-wrap gap-4 mt-6">
           <div className="flex items-center gap-3 bg-white dark:bg-[#09090b] border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm hover:shadow transition-shadow">
             <Atom className="w-6 h-6 text-blue-500" />
             <div>
               <div className="font-bold text-slate-900 dark:text-white">React 19 + TypeScript</div>
               <div className="text-xs text-slate-500">Core Frontend Framework</div>
             </div>
           </div>
           
           <div className="flex items-center gap-3 bg-white dark:bg-[#09090b] border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm hover:shadow transition-shadow">
             <Server className="w-6 h-6 text-amber-500" />
             <div>
               <div className="font-bold text-slate-900 dark:text-white">Firebase 11</div>
               <div className="text-xs text-slate-500">Auth + Firestore + Storage</div>
             </div>
           </div>

           <div className="flex items-center gap-3 bg-white dark:bg-[#09090b] border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm hover:shadow transition-shadow">
             <code className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold">W-API</code>
             <div>
               <div className="font-bold text-slate-900 dark:text-white">Web Crypto API</div>
               <div className="text-xs text-slate-500">Native Asymmetrical C-Core</div>
             </div>
           </div>
        </div>
      </div>
    );
  }

  // English
  return (
    <div id="reference" className="scroll-mt-24">
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 mb-6">
        Reference Schematics
      </h1>
      
      <h2 className="text-2xl font-bold mt-12 mb-6 text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
        <BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        1. Ecosystem Directory Tree
      </h2>
      
      <div className="bg-[#0d1117] p-5 rounded-2xl border border-slate-800 shadow-sm mb-6">
        <CodeBlock language="typescript" code={`secure-webmail/
├── public/                    # Static runtime assets
├── src/
│   ├── assets/                # Structural SVGs
│   ├── components/            # Isolated Atomic UI blocks
│   ├── config/                # Platform connection statics
│   ├── context/               # AuthContext (RAM Memory Barricade)
│   ├── layouts/               # Application routing wrappers
│   ├── locales/
│   │   ├── en.ts              # English Translation dictionary
│   │   └── vi.ts              # Vietnamese Translation dictionary
│   ├── pages/
│   │   ├── docs/              # 📚 Technical Developer Bible
│   │   ├── Compose.tsx        # ✉️ E2EE Content writing buffer
│   │   ├── DecryptMsg.tsx     # 🔓 Isolated Ciphertext parsing mechanism
│   │   ├── Drafts.tsx         # 📝 Auto-debouncing encrypted array
│   │   ├── Inbox.tsx          # 📥 Render empty incoming ciphertext
│   │   └── Login.tsx          # 🔑 Heavy iteration PBKDF2 entry
│   │
│   └── utils/
│       └── cryptoAuth.ts      # ⚠️ FATAL CORE — Base cryptography library
│
├── vercel.json                # Serverless deployment configuration
└── WHITEPAPER.md              # Original algorithm definitions`} />
      </div>

      <h3 className="text-xl font-bold mt-8 mb-4 text-slate-900 dark:text-slate-100 flex items-center gap-2">
        <AlertOctagon className="w-5 h-5 text-amber-500" /> Threat Classifications
      </h3>
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-12">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400">
            <tr>
              <th className="px-6 py-4 font-semibold text-xs tracking-wider border-b border-slate-200 dark:border-slate-800">INFRASTRUCTURE TARGET</th>
              <th className="px-6 py-4 font-semibold text-xs tracking-wider border-b border-slate-200 dark:border-slate-800">MODIFICATION PENALTY HAZARD</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-[#09090b]">
            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
               <td className="px-6 py-5 font-mono font-bold text-emerald-600 dark:text-emerald-400">src/utils/cryptoAuth.ts</td>
               <td className="px-6 py-5 text-slate-600 dark:text-slate-300">
                 <span className="bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 text-xs font-bold px-2 py-1 rounded inline-block mb-2">CATASTROPHIC DEVIATION BLOCK</span><br/>
                 Adjusting a single Buffer parsing array or ArrayBuffer slicing metric instantly corrupts global ciphertext headers retroactively locking down 100% of historical application access. 
               </td>
            </tr>
            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
               <td className="px-6 py-5 font-mono font-bold text-amber-600 dark:text-amber-400">src/context/AuthContext.tsx</td>
               <td className="px-6 py-5 text-slate-600 dark:text-slate-300">Monolithic bridge securely locking the transient Memory Pointers to active keys. Dropping sloppy debugging <code>console.log()</code> tracking blocks here permanently surrenders entire database contents.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold mt-16 mb-6 text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2 border-t border-slate-200 dark:border-slate-800 pt-10">
        <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        2. Department Assignments
      </h2>
      
      <div className="grid md:grid-cols-2 gap-4 mb-16">
        <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-[#09090b]">
           <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2">Project Tech Lead</h4>
           <p className="text-slate-600 dark:text-slate-400 text-sm">Maintains structural <code>cryptoAuth.ts</code>. Directs asymmetric pipeline logistics. Handles extreme Firestore vulnerability patching.</p>
        </div>
        <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-[#09090b]">
           <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2">Frontend Department</h4>
           <p className="text-slate-600 dark:text-slate-400 text-sm">Mounts visual layout interfaces masking block encryption procedures safely. Implements state isolation via React Context closures.</p>
        </div>
        <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-[#09090b]">
           <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2">Database Integrity Engineer</h4>
           <p className="text-slate-600 dark:text-slate-400 text-sm">Dictating Flat Database restrictions optimizing routing velocity strictly denying invalid unauthorized UID penetration reads natively.</p>
        </div>
        <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-[#09090b]">
           <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2">Infosec Auditing</h4>
           <p className="text-slate-600 dark:text-slate-400 text-sm">Launching end-to-end sandbox invasion tests utilizing Playwright routines targeting internal buffer parsing or XSS insertion leaks.</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-16 mb-6 text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2 border-t border-slate-200 dark:border-slate-800 pt-10">
        <Layers className="w-6 h-6 text-teal-600 dark:text-teal-400" />
        3. Fundamental Tech Stack
      </h2>
      
      <div className="flex flex-wrap gap-4 mt-6">
         <div className="flex items-center gap-3 bg-white dark:bg-[#09090b] border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm hover:shadow transition-shadow">
           <Atom className="w-6 h-6 text-blue-500" />
           <div>
             <div className="font-bold text-slate-900 dark:text-white">React 19 & TypeScript</div>
             <div className="text-xs text-slate-500">Core Interaction Rendering</div>
           </div>
         </div>
         
         <div className="flex items-center gap-3 bg-white dark:bg-[#09090b] border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm hover:shadow transition-shadow">
           <Server className="w-6 h-6 text-amber-500" />
           <div>
             <div className="font-bold text-slate-900 dark:text-white">Firebase Suite</div>
             <div className="text-xs text-slate-500">Auth, Firestore & Storage CDN</div>
           </div>
         </div>

         <div className="flex items-center gap-3 bg-white dark:bg-[#09090b] border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm hover:shadow transition-shadow">
           <code className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold">W-API</code>
           <div>
             <div className="font-bold text-slate-900 dark:text-white">Web Crypto Protocol</div>
             <div className="text-xs text-slate-500">Subtle Unhackable Core C++</div>
           </div>
         </div>
      </div>
    </div>
  );
}

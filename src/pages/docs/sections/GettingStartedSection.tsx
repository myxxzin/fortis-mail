import { useLanguage } from '../../../contexts/LanguageContext';
import CodeBlock from '../../../components/docs/CodeBlock';
import Callout from '../../../components/docs/Callout';
import { Shield, EyeOff, Cpu, KeyRound, Terminal, Key, Rocket } from 'lucide-react';

export default function GettingStartedSection() {
  const { language } = useLanguage();

  const diffsVI = [
    { icon: <Cpu />, title: 'Mật mã Client-side', desc: 'Toàn bộ tính toán diễn ra tại trình duyệt, chặn rò rỉ.' },
    { icon: <Shield />, title: 'Data Cá nhân hóa', desc: 'Thư được cá nhân hóa hoàn toàn (Template variables) offline.' },
    { icon: <EyeOff />, title: 'Máy chủ Mù (Blind)', desc: 'Thư viện backend chỉ định tuyến blobs mã hóa, không đọc data.' },
    { icon: <KeyRound />, title: 'Native Web Crypto', desc: 'Dùng lõi C++ (window.crypto.subtle), cấm npm crypto libraries.' }
  ];

  const diffsEN = [
    { icon: <Cpu />, title: 'Client-side Crypto', desc: 'All cryptography executes strictly within browser RAM bounds.' },
    { icon: <Shield />, title: 'Content Personalization', desc: 'Dynamic recipient and variable parsing works completely offline.' },
    { icon: <EyeOff />, title: 'Blind Server', desc: 'Backend intentionally routes opaque blobs and nothing more.' },
    { icon: <KeyRound />, title: 'Native Web Crypto', desc: 'Built purely on window.crypto.subtle evading npm supply chain.' }
  ];

  if (language === 'vi') {
    return (
      <div id="getting-started" className="scroll-mt-24">
        {/* Header Ribbon */}
        <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold border border-blue-100 dark:border-blue-800">
          <Rocket className="w-4 h-4" /> Bắt Đầu Dự Án V1.0.0
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 mb-6">
          Tổng Quan Dự Án & Setup
        </h1>
        
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed border-l-4 border-slate-300 dark:border-slate-700 pl-4 py-1">
          FORTISMail là <strong>ứng dụng email web mã hóa đầu cuối (E2EE) Zero-Knowledge</strong>. Khác với các hệ thống email phổ thông, máy chủ FORTISMail (Firebase) chỉ lưu trữ các chuỗi mã hóa vô nghĩa. Thậm chí một vụ rò rỉ dữ liệu (database breach) toàn phần cũng không để lọt nội dung.
        </p>

        {/* Bento Grid Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          {diffsVI.map((d, i) => (
            <div key={i} className="group p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/20 backdrop-blur-md hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all duration-300 hover:shadow-sm">
              <div className="flex items-center gap-3 mb-3 text-slate-800 dark:text-slate-200">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                   {d.icon}
                </div>
                <h3 className="font-bold text-lg">{d.title}</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{d.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-8 text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <Terminal className="w-6 h-6 text-slate-400" /> Bắt Đầu Cài Đặt
        </h2>
        
        {/* Stepper Guide */}
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-800 before:to-transparent">
          
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-50 dark:border-[#09090b] bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 font-bold z-10">1</div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-[#111] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h4 className="font-bold text-slate-900 dark:text-white mb-2">Yêu Cầu Nền Tảng (Prerequisites)</h4>
              <CodeBlock language="bash" code={`Node.js >= 18\nnpm >= 9\nA Firebase project with Firestore + Storage enabled`} />
            </div>
          </div>

          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-50 dark:border-[#09090b] bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 font-bold z-10">2</div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-[#111] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h4 className="font-bold text-slate-900 dark:text-white mb-2">Clone & Khởi Chạy (Install)</h4>
              <CodeBlock language="bash" code={`# Clone core platform\ngit clone https://github.com/myxxzin/fortis-mail.git\n\n# Node modules provision\ncd fortis-mail\nnpm install\n\n# Local server\nnpm run dev`} />
            </div>
          </div>

          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-50 dark:border-[#09090b] bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 font-bold z-10"><Key className="w-4 h-4"/></div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-[#111] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h4 className="font-bold text-slate-900 dark:text-white mb-2">File Môi Trường (.env)</h4>
              <CodeBlock language="env" code={`VITE_FIREBASE_API_KEY=\nVITE_FIREBASE_AUTH_DOMAIN=\nVITE_FIREBASE_PROJECT_ID=\nVITE_FIREBASE_STORAGE_BUCKET=\nVITE_FIREBASE_MESSAGING_SENDER_ID=\nVITE_FIREBASE_APP_ID=`} />
            </div>
          </div>
        </div>

        <div className="mt-12">
          <Callout type="warning" title="Tuyệt đối KHÔNG commit file .env">
            Lưu ý bảo mật sống còn: Không đẩy file cấu trúc <code>.env</code> lên Git Control. Đối với các kỹ sư nội bộ mới, vui lòng lên tiếng liên hệ trực tiếp đến Tech Lead nhằm cấp phát chùm key thật.
          </Callout>
        </div>
      </div>
    );
  }

  // English Version
  return (
    <div id="getting-started" className="scroll-mt-24">
      {/* Header Ribbon */}
      <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold border border-blue-100 dark:border-blue-800">
        <Rocket className="w-4 h-4" /> V1.0.0 Dev Onboarding
      </div>
      
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 mb-6">
        Project Overview & Setup
      </h1>
      
      <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed border-l-4 border-slate-300 dark:border-slate-700 pl-4 py-1">
        FORTISMail is a <strong>Zero-Knowledge, End-to-End Encrypted (E2EE) web mail application</strong>. Unlike conventional systems where servers scan texts, FORTISMail ensures only authorized peers decrypt. Even complete database infiltrations yield absolute garbage noise.
      </p>

      {/* Bento Grid Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
        {diffsEN.map((d, i) => (
          <div key={i} className="group p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/20 backdrop-blur-md hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all duration-300 hover:shadow-sm">
            <div className="flex items-center gap-3 mb-3 text-slate-800 dark:text-slate-200">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                 {d.icon}
              </div>
              <h3 className="font-bold text-lg">{d.title}</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{d.desc}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mt-12 mb-8 text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
        <Terminal className="w-6 h-6 text-slate-400" /> Getting Started
      </h2>
      
      {/* Stepper Guide */}
      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-800 before:to-transparent">
        
        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-50 dark:border-[#09090b] bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 font-bold z-10">1</div>
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-[#111] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h4 className="font-bold text-slate-900 dark:text-white mb-2">Prerequisites</h4>
            <CodeBlock language="bash" code={`Node.js >= 18\nnpm >= 9\nA Firebase project with Firestore + Storage enabled`} />
          </div>
        </div>

        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-50 dark:border-[#09090b] bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 font-bold z-10">2</div>
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-[#111] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h4 className="font-bold text-slate-900 dark:text-white mb-2">Install & Run</h4>
            <CodeBlock language="bash" code={`# Clone core platform\ngit clone https://github.com/myxxzin/fortis-mail.git\n\n# Bring in tools\ncd fortis-mail\nnpm install\n\n# Ignite server\nnpm run dev`} />
          </div>
        </div>

        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-50 dark:border-[#09090b] bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 font-bold z-10"><Key className="w-4 h-4"/></div>
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-[#111] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h4 className="font-bold text-slate-900 dark:text-white mb-2">Environment Config</h4>
            <CodeBlock language="env" code={`VITE_FIREBASE_API_KEY=\nVITE_FIREBASE_AUTH_DOMAIN=\nVITE_FIREBASE_PROJECT_ID=\nVITE_FIREBASE_STORAGE_BUCKET=\nVITE_FIREBASE_MESSAGING_SENDER_ID=\nVITE_FIREBASE_APP_ID=`} />
          </div>
        </div>
      </div>

      <div className="mt-12">
        <Callout type="warning" title="CRITICAL: Avoid Env Leaks">
          Never commit your <code>.env</code> file. For fresh developer onboarding processes, request properly configured infrastructure keys directly from the Tech Lead.
        </Callout>
      </div>
    </div>
  );
}

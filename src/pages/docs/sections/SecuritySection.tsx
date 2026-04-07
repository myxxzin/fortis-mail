import { useLanguage } from '../../../contexts/LanguageContext';
import CodeBlock from '../../../components/docs/CodeBlock';
import { Lock, Timer, BugOff, Skull, ShieldBan, ShieldAlert, MonitorX } from 'lucide-react';

export default function SecuritySection() {
  const { language } = useLanguage();

  if (language === 'vi') {
    return (
      <div id="security" className="scroll-mt-24">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500 mb-6">
          Bảo Mật UX & Quy Tắc
        </h1>
        
        <h2 className="text-2xl font-bold mt-12 mb-8 text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
          1. Trải nghiệm Bảo Mật (Security UX)
        </h2>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <Lock className="w-8 h-8 text-slate-700 dark:text-slate-300 mb-4" />
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100">App-Level PIN Lock</h3>
            <p className="text-slate-700 dark:text-slate-400 text-md leading-relaxed mb-4">
              Ở lần đầu truy cập, người dùng thiết lập mã PIN nội bộ. Bất cứ khi tab bị thu nhỏ hoặc tải lại, <strong>Gatekeeper System</strong> sẽ phủ mờ che kín giao diện (UI) bắt buộc nhập PIN để truy xuất vùng nhớ RAM chứa khóa Private Key. 
            </p>
            <div className="text-sm font-semibold text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/30 px-3 py-2 rounded-lg">Tuyệt đối không lưu UUID hay khóa mã vào LocalStorage.</div>
          </div>
          
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <Timer className="w-8 h-8 text-slate-700 dark:text-slate-300 mb-4" />
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100">Debounced Auto-Save Drafts</h3>
            <p className="text-slate-700 dark:text-slate-400 text-md leading-relaxed mb-4">
              Tiến trình mã hóa End-to-End (AES-GCM arraying + ECDSA Signatures) gây đốt CPU khủng khiếp. Tính năng lưu nháp (Draft) được áp dụng bộ đếm trễ <strong>Wait Interval 3000ms (Debounce)</strong>.
            </p>
            <div className="text-sm font-semibold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-3 py-2 rounded-lg">Chống treo máy vì gõ phím nhanh và cháy hóa đơn Firestore Write.</div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-16 mb-8 text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2 border-t border-slate-200 dark:border-slate-800 pt-10">
          2. The 5 Iron Laws (5 Quy Tắc Máu)
        </h2>
        
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 border-l-4 border-red-500 pl-4 py-1">
          Bảo mật E2E Zero-Knowledge rất nguyên khối. <strong>Vi phạm bất kỳ một quy tắc nào dưới đây dẫn đến dây chuyền vỡ trận hoàn toàn</strong> ngay từ Frontend.
        </p>

        <div className="space-y-6">
          <div className="flex gap-4 p-5 rounded-2xl border-l-4 border-l-red-500 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#09090b] shadow-sm">
             <BugOff className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
             <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-1">Luật 1: Không bao giờ log Key ra console</h4>
                <p className="text-slate-700 dark:text-slate-300 mb-3">Các tiện ích Chromium (Extensions) độc hại thường xuyên chạy vòng lặp bắt Console Log (<code>window.console</code>) để rà dữ liệu mã hóa.</p>
                <CodeBlock language="typescript" code={`// ❌ FORBIDDEN\nconsole.log({ privateKey });\n\n// ✅ CORRECT\nif (debugParams) console.warn("Executing key vault swap");`} />
             </div>
          </div>

          <div className="flex gap-4 p-5 rounded-2xl border-l-4 border-l-orange-500 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#09090b] shadow-sm">
             <ShieldAlert className="w-6 h-6 text-orange-500 shrink-0 mt-0.5" />
             <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-1">Luật 2: Không thay thế Native Crypto</h4>
                <p className="text-slate-700 dark:text-slate-300">Cấm sử dụng <code>crypto-js</code> hoặc thư viện mã hóa NPM. Hacker thường xuyên tiêm mã độc vào file package NPM (NPM Supply Chain Attacks). Phải sử dụng hàm nguyên bản C++ <code>window.crypto.subtle</code> của trình duyệt vì không ai chèn lậu được vào đó.</p>
             </div>
          </div>

          <div className="flex gap-4 p-5 rounded-2xl border-l-4 border-l-rose-500 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#09090b] shadow-sm">
             <Skull className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
             <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-1">Luật 3: Sanitize DOM tuyệt đối</h4>
                <p className="text-slate-700 dark:text-slate-300">Dùng <code>dangerouslySetInnerHTML</code> chứa script bẩn (XSS Attack) có thể bẻ cong DOM. Thẻ <code>&lt;script&gt;</code> nếu chọt vô được, nó sẽ moi cạn Private Key lộ trên biến Javascript.</p>
             </div>
          </div>

          <div className="flex gap-4 p-5 rounded-2xl border-l-4 border-l-amber-500 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#09090b] shadow-sm">
             <MonitorX className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
             <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-1">Luật 4: Tẩy chay Tracking Analytics CSP</h4>
                <p className="text-slate-700 dark:text-slate-300"><strong>Tuyệt đối không nhúng Google Tag Manager, Facebook Pixel hay Hotjar.</strong> Các scripts này liên tục đọc String/Text Dom thô trên màn hình. Nếu bạn vừa giải mã Email ra chữ "Báo cáo nội bộ", Google Pixel sẽ âm thầm hốt thẳng cụm đó gửi về server của nó, phá vỡ E2EE.</p>
             </div>
          </div>

          <div className="flex gap-4 p-5 rounded-2xl border-l-4 border-l-yellow-500 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#09090b] shadow-sm">
             <ShieldBan className="w-6 h-6 text-yellow-500 shrink-0 mt-0.5" />
             <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-1">Luật 5: Biến dạng sau khi thao tác (Volatile RAM)</h4>
                <p className="text-slate-700 dark:text-slate-300">Không bao giờ tồn dư dữ liệu đã cởi giáp. Bất kì thông điệp trần trụi tĩnh (Plain Text) nào cũng chỉ được gán trong thời gian tab mở qua React State context. Tat tab = bay hơi.</p>
             </div>
          </div>
        </div>

      </div>
    );
  }

  // English
  return (
    <div id="security" className="scroll-mt-24">
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500 mb-6">
        Security Tactics & Enforcement
      </h1>
      
      <h2 className="text-2xl font-bold mt-12 mb-8 text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
        1. User Security Operations (UX)
      </h2>

      <div className="grid md:grid-cols-2 gap-6 mb-16">
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <Lock className="w-8 h-8 text-slate-700 dark:text-slate-300 mb-4" />
          <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100">Intra-app PIN Locks</h3>
          <p className="text-slate-700 dark:text-slate-400 text-md leading-relaxed mb-4">
            Upon establishing an account, users deploy strict 6-digit numeric configurations. Whenever interface interaction dwindles, heavy <strong>Gatekeeper Shields</strong> obscure DOM visual ranges physically mandating PIN entries opening volatile RAM caches holding valid session keys.
          </p>
          <div className="text-sm font-semibold text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/30 px-3 py-2 rounded-lg">Never stash Vault Keys within localStorage containers.</div>
        </div>
        
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <Timer className="w-8 h-8 text-slate-700 dark:text-slate-300 mb-4" />
          <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100">Execution Debouncing</h3>
          <p className="text-slate-700 dark:text-slate-400 text-md leading-relaxed mb-4">
            Total End-to-End Cryptography computations (AES chunking + strict ECDSA Signing) incinerate frontend processing budgets instantly. Implementing rigorous <strong>3000ms delay debounces</strong> resolves extreme battery drain bottlenecks effectively.
          </p>
          <div className="text-sm font-semibold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-3 py-2 rounded-lg">Protects CPUs from violent overheating during draft writing.</div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-16 mb-8 text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2 border-t border-slate-200 dark:border-slate-800 pt-10">
        2. The Core 5 Iron Laws
      </h2>
      
      <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 border-l-4 border-red-500 pl-4 py-1">
        Foundational E2E Zero-Knowledge is extremely brittle mechanically. <strong>Infracting upon practically any rule directly fractures complete system confidentiality</strong> starting directly across frontends.
      </p>

      <div className="space-y-6">
        <div className="flex gap-4 p-5 rounded-2xl border-l-4 border-l-red-500 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#09090b] shadow-sm">
           <BugOff className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
           <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-1">Law 1: Discard Console Key Dumps</h4>
              <p className="text-slate-700 dark:text-slate-300 mb-3">Hostile Chromium plugins constantly execute loop scrapers hunting through loaded <code>window.console</code> values looking specifically for serialized crypto objects.</p>
              <CodeBlock language="typescript" code={`// ❌ FORBIDDEN\nconsole.log({ privateKey });\n\n// ✅ CORRECT\nif (debugParams) console.warn("Executing key vault swap");`} />
           </div>
        </div>

        <div className="flex gap-4 p-5 rounded-2xl border-l-4 border-l-orange-500 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#09090b] shadow-sm">
           <ShieldAlert className="w-6 h-6 text-orange-500 shrink-0 mt-0.5" />
           <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-1">Law 2: Strictly C++ Native Engine Only</h4>
              <p className="text-slate-700 dark:text-slate-300">Banming all <code>crypto-js</code> and external crypto NPM packages. Adulterated NPM dependencies launch catastrophic Supply Chain Attacks. Leverage purely native OS-level baked browser <code>window.crypto.subtle</code> functions remaining virtually inviolable.</p>
           </div>
        </div>

        <div className="flex gap-4 p-5 rounded-2xl border-l-4 border-l-rose-500 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#09090b] shadow-sm">
           <Skull className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
           <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-1">Law 3: Ruthless XSS Sanitization</h4>
              <p className="text-slate-700 dark:text-slate-300">Invoking <code>dangerouslySetInnerHTML</code> rendering unfiltered strings violently warps DOM trees enabling rogue script execution immediately looting private key arrays completely naked within variable states.</p>
           </div>
        </div>

        <div className="flex gap-4 p-5 rounded-2xl border-l-4 border-l-amber-500 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#09090b] shadow-sm">
           <MonitorX className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
           <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-1">Law 4: Trackers Violate E2E Sanctions</h4>
              <p className="text-slate-700 dark:text-slate-300"><strong>Zero tolerance for Google Analytics, Pixel or Hotjar implants.</strong> Third-party analytic scripts silently scrape visible raw DOM text constantly generating heatmap data directly exposing decrypted plain-text email letters straight back off-site completely shattering internal network shielding arrays.</p>
           </div>
        </div>

        <div className="flex gap-4 p-5 rounded-2xl border-l-4 border-l-yellow-500 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#09090b] shadow-sm">
           <ShieldBan className="w-6 h-6 text-yellow-500 shrink-0 mt-0.5" />
           <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-1">Law 5: Retain Heavy Volatility State</h4>
              <p className="text-slate-700 dark:text-slate-300">Resist dumping decrypted letter blocks strictly onto unencrypted disk caches. Everything must disintegrate operating dynamically within volatile React states entirely vaporizing immediately whenever exit interactions fire.</p>
           </div>
        </div>
      </div>

    </div>
  );
}

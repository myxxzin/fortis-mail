import { useLanguage } from '../../../contexts/LanguageContext';
import CodeBlock from '../../../components/docs/CodeBlock';
import Callout from '../../../components/docs/Callout';

export default function GettingStartedSection() {
  const { language } = useLanguage();

  if (language === 'vi') {
    return (
      <div id="getting-started" className="scroll-mt-24">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-12 mb-6">
          Tổng Quan Dự Án (Project Overview)
        </h2>

        <div className="mb-10 text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
          <p className="mb-4">
            FORTISMail là một <strong>ứng dụng email mã hóa đầu cuối (E2EE)</strong> được thiết kế theo kiến trúc phi tri thức (Zero-Knowledge). Khác với các hệ thống thư tín thông thường (nơi máy chủ có thể quét nội dung thư), FORTISMail đảm bảo rằng <strong>chỉ có người gửi và người nhận đích thực mới có thể giải mã được nội dung</strong>.
          </p>
          <p>
            Máy chủ lưu trữ phía sau (Firebase) chỉ đóng vai trò lưu giữ ciphertext mờ đục. Kể cả trong trường hợp toàn bộ cơ sở dữ liệu trên máy chủ bị rò rỉ, cơ sở dữ liệu đó hoàn toàn không thể bị khai thác hay giải mã bởi bất cứ ai.
          </p>
        </div>

        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-10 mb-4">
          Điểm khác biệt cốt lõi (Key Differentiators)
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4 mb-12">
           <div className="bg-white dark:bg-[#09090b] border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-sm">
              <h4 className="font-bold text-[#43cc25] mb-2 dark:text-[#43cc25]">Tính toán 100% tại Client</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Trình duyệt của bạn đóng vai trò là một máy chủ mã hóa độc lập. Server bên ngoài không thực hiện bất kỳ giao thức tính toán mã hóa nào.</p>
           </div>
           <div className="bg-white dark:bg-[#09090b] border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-sm">
              <h4 className="font-bold text-[#43cc25] mb-2 dark:text-[#43cc25]">Sử dụng Native Web Crypto API</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Mọi thư viện NPM mã hóa đều có rủi ro bị khai thác (Supply Chain Attack). FORTISMail vận hành trực tiếp trên module C++ gốc của trình duyệt (<code>window.crypto.subtle</code>).</p>
           </div>
           <div className="bg-white dark:bg-[#09090b] border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-sm">
              <h4 className="font-bold text-[#43cc25] mb-2 dark:text-[#43cc25]">Định tuyến "Mù"</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Máy chủ Firebase nhận các gói dữ liệu đã bị mã hóa nén thành định dạng ASCII Armor và chỉ thực hiện nhiệm vụ điều hướng mù tới định danh người nhận thích hợp.</p>
           </div>
           <div className="bg-white dark:bg-[#09090b] border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-sm">
              <h4 className="font-bold text-[#43cc25] mb-2 dark:text-[#43cc25]">Cá nhân hoá & Hiệu suất</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Hệ thống hỗ trợ cá nhân hóa thư tín (biến, chèn tên người nhận động) và vận hành với giao diện phi tập trung hoàn chỉnh.</p>
           </div>
        </div>

        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-10 mb-4">
          Yêu cầu hệ thống (Prerequisites)
        </h3>
        <div className="bg-[#0f172a] p-4 rounded-xl mb-8">
           <CodeBlock language="typescript" code={`Node.js >= 18
npm >= 9
Một dự án Firebase đã kích hoạt: 
  - Firestore Database
  - Cloud Storage
  - Authentication (thiết lập sẵn Authorized Domain)`} />
        </div>

        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-10 mb-4">
          Cài đặt (Installation)
        </h3>
        <div className="mb-8 overflow-hidden rounded-xl bg-[#0f172a]">
          <CodeBlock language="bash" code={`# Sao chép dự án từ kho lưu trữ
git clone https://github.com/myxxzin/fortis-mail.git

# Di chuyển cấp thư mục
cd fortis-mail

# Cài đặt nền tảng
npm install`} />
        </div>

        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-10 mb-4">
          Biến môi trường (Environment Config)
        </h3>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          Tạo tệp <code className="bg-slate-100 dark:bg-slate-800 text-sm px-1.5 py-0.5 rounded text-slate-800 dark:text-slate-300">.env</code> tại thư mục gốc của dự án. Lấy tham số truy cập tại màn hình quản trị của Firebase Console.
        </p>
        <div className="mb-6 overflow-hidden rounded-xl bg-[#0f172a]">
          <CodeBlock language="env" code={`VITE_FIREBASE_API_KEY=********
VITE_FIREBASE_AUTH_DOMAIN=app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=fortismail-project
VITE_FIREBASE_STORAGE_BUCKET=fortismail.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=********
VITE_FIREBASE_APP_ID=********`} />
        </div>

        <div className="mb-12">
          <Callout type="warning" title="THẬN TRỌNG: Không Push file .env">
            Lưu ý tuyệt đối không commit tệp <code>.env</code> lên hệ thống version control. Đối với các lập trình viên mới gia nhập, vui lòng liên hệ Senior Dev / Tech Lead để nhận bộ keys. Việc khai báo lộ API lên Github Public có lợi cho tin tặc khai thác dữ liệu qua Bot Parser.
          </Callout>
        </div>

      </div>
    );
  }

  // EN
  return (
    <div id="getting-started" className="scroll-mt-24">
      <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-12 mb-6">
        Project Overview
      </h2>

      <div className="mb-10 text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
        <p className="mb-4">
          FORTISMail is an <strong>End-to-End Encrypted (E2EE) webmail protocol</strong> modeled explicitly via 100% Zero-Knowledge foundations. Instead of legacy servers ingesting unencrypted message structures natively, FORTISMail ensures that <strong>only targeted recipients inherently carry mathematical capabilities to resolve textual payload contents</strong> securely.
        </p>
        <p>
          Backend cloud clusters (Firebase) possess only blinded opaque ciphertexts structurally preventing unauthorized exploitation. Consequently, a comprehensive internal database breach physically produces completely unreadable data caches.
        </p>
      </div>

      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-10 mb-4">
        Key System Differentiators
      </h3>
      
      <div className="grid md:grid-cols-2 gap-4 mb-12">
         <div className="bg-white dark:bg-[#09090b] border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-sm">
            <h4 className="font-bold text-[#43cc25] mb-2 dark:text-[#43cc25]">Client-Side Exclusivity</h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Target browsers function as isolated localized cryptographic servers handling heavy processing locally thereby prohibiting external routing computational dependencies entirely.</p>
         </div>
         <div className="bg-white dark:bg-[#09090b] border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-sm">
            <h4 className="font-bold text-[#43cc25] mb-2 dark:text-[#43cc25]">Native Web Crypto API Integration</h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Abandoning NPM packages mitigating catastrophic Supply Chain vulnerability potentials. Relying consistently upon browser C++ OS-level binary operations (<code>window.crypto.subtle</code>).</p>
         </div>
         <div className="bg-white dark:bg-[#09090b] border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-sm">
            <h4 className="font-bold text-[#43cc25] mb-2 dark:text-[#43cc25]">Blind Network Routing</h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Remote Firebase server points exclusively intercept properly scaled ASCII Armored segments solely indexing identifiers delivering encrypted messages passively.</p>
         </div>
         <div className="bg-white dark:bg-[#09090b] border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-sm">
            <h4 className="font-bold text-[#43cc25] mb-2 dark:text-[#43cc25]">Personalized Variables & Efficacy</h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Maintains advanced mail attributes (dynamic identifiers, templates) seamlessly matching modern decentralized rendering interface demands.</p>
         </div>
      </div>

      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-10 mb-4">
        Prerequisites
      </h3>
      <div className="bg-[#0f172a] p-4 rounded-xl mb-8">
         <CodeBlock language="typescript" code={`Node.js >= 18
npm >= 9
An active configured Firebase application incorporating: 
  - Firestore NoSQL Database
  - Active Cloud Storage Instances
  - Authentication (Authorized domain validation active)`} />
      </div>

      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-10 mb-4">
        Platform Installation
      </h3>
      <div className="mb-8 overflow-hidden rounded-xl bg-[#0f172a]">
        <CodeBlock language="bash" code={`# Retrieve primary project repository
git clone https://github.com/myxxzin/fortis-mail.git

# Enter application directories
cd fortis-mail

# Mount dependencies
npm install`} />
      </div>

      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-10 mb-4">
        Environmental Setup Parameters
      </h3>
      <p className="text-slate-700 dark:text-slate-300 mb-4">
        Draft a dedicated <code className="bg-slate-100 dark:bg-slate-800 text-sm px-1.5 py-0.5 rounded text-slate-800 dark:text-slate-300">.env</code> root directory configuration file manually mapping authorized project settings natively retrieved from Firebase administration consoles.
      </p>
      <div className="mb-6 overflow-hidden rounded-xl bg-[#0f172a]">
        <CodeBlock language="env" code={`VITE_FIREBASE_API_KEY=********
VITE_FIREBASE_AUTH_DOMAIN=app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=fortismail-project
VITE_FIREBASE_STORAGE_BUCKET=fortismail.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=********
VITE_FIREBASE_APP_ID=********`} />
      </div>

      <div className="mb-12">
        <Callout type="warning" title="CAUTION: Prevent .ENV Leakages">
          Do not push variable configuration objects into remote GitHub clusters. New onboarded development members must request production-level internal parameters actively via Tech Leads minimizing automated robotic Git parser exposures significantly.
        </Callout>
      </div>

    </div>
  );
}

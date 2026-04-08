import { useLanguage } from '../../../contexts/LanguageContext';
import CodeBlock from '../../../components/docs/CodeBlock';


export default function SecuritySection() {
  const { language } = useLanguage();

  if (language === 'vi') {
    return (
      <div id="security" className="scroll-mt-24">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-12 mb-6 border-t border-slate-200 dark:border-slate-800 pt-10">
          Chính sách bảo mật (Security Policy & UX)
        </h2>
        
        <p className="text-slate-700 dark:text-slate-300 mb-8 leading-relaxed text-lg">
          Zero-Knowledge E2E đòi hỏi một quy chuẩn kiểm soát tĩnh rất gắt gao. Bất kỳ sự chệch hướng nhỏ nào khỏi các nguyên tắc cốt lõi đều đe dọa sự toàn vẹn của bức thiết kế bảo mật phía Frontend.
        </p>

        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-10 mb-6">
          1. Giải pháp Bảo mật Hành vi (Security UX Patterns)
        </h3>

        <div className="space-y-6 mb-12">
          <div className="bg-white dark:bg-[#09090b] border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-lg mb-3">App-Level PIN Lock (Khoá PIN Phiên Trình Duyệt)</h4>
            <p className="text-slate-600 dark:text-slate-400 mb-3">
              Mỗi khi một email được mở ra, nếu người dùng rời khỏi tầm nhìn hiển thị của luồng thư (chuyển màn hình, tải lại), hệ thống <strong>Gatekeeper Shield</strong> sẽ lập tức phủ đen màn hình yêu cầu xác nhận vòng lặp 6 con số giao thức bí mật.
            </p>
            <ul className="list-inside list-disc space-y-1 text-slate-600 dark:text-slate-400 ml-2">
              <li>Chỉ xác nhận chuỗi giá trị băm Hash (~10ms) đảm bảo phản hồi liền mạch.</li>
              <li>Loại trừ trường hợp phải nhập lại mật khẩu tổng Master phức tạp.</li>
              <li><strong>TUYỆT ĐỐI CẤM:</strong> Sử dụng hệ thống <code>localStorage</code> để cất giấu định danh. Tính năng phân giải hoạt động 100% nhờ React Context.</li>
            </ul>
          </div>
          <div className="bg-white dark:bg-[#09090b] border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-lg mb-3">Tự động lưu nháp mảng Debounced (Debounced Auto-Save)</h4>
            <p className="text-slate-600 dark:text-slate-400 mb-3">
              Việc thiết lập trạng thái gọi cơ chế E2E (AES keygen block, ECDSA validation, Base64 Stringify) liên  tục chiếm hữu sức mạnh khổng lồ trên máy tính của người sử dụng. Nếu không kiểm soát, mỗi luồng đánh máy có thể gây: 
            </p>
            <ul className="list-inside list-disc space-y-1 text-slate-600 dark:text-slate-400 ml-2 mb-3">
              <li>Freeze (treo trình duyệt) vì CPU spike.</li>
              <li>Tạo thành chuỗi vòng ghi (write loops) vô tận, đẩy hoá đơn Firebase Cloud billing lên mức khủng hoảng tài chính.</li>
            </ul>
            <div className="border border-amber-500/30 bg-amber-50 dark:bg-amber-900/10 p-3 rounded-lg text-amber-800 dark:text-amber-500 text-sm font-semibold">
              Giải pháp: Dùng biến state chặn độ trễ 3000ms. Tiến trình chỉ gom dữ liệu thao tác và lưu đồng loạt thành file cục bộ lên Firestore sau 3 giây không có hoạt động.
            </div>
          </div>
        </div>

        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-10 mb-6">
          2. The 5 Iron Laws (5 Đặc Lệnh Bất Di Bất Dịch)
        </h3>
        
        <p className="text-slate-700 dark:text-slate-300 mb-6 text-lg border-l-4 border-red-500 pl-4 py-1">
          Lưu ý quan trọng: Các quy tắc hiển thị bên dưới <strong>không áp dụng thỏa hiệp</strong>. Bất cứ vi phạm vi mô nào cũng có khả năng phá vỡ cơ cấu mã hoá E2E.
        </p>

        <ul className="space-y-6 text-slate-700 dark:text-slate-300">
          <li>
            <strong className="text-slate-900 dark:text-white">Quy tắc 1: Cấm Console Logging toàn thời gian.</strong> Các Extension lập trình độc hại (Malicious addons) được uỷ quyền sẽ lập trình các tập lệnh theo dõi cửa sổ `window.console` mọi định dạng.
            <div className="mt-3 overflow-hidden rounded-xl bg-[#0f172a]">
              <CodeBlock language="typescript" code={`// ❌ FORBIDDEN — Nghiêm cấm đặt trong mọi phiên bản development/production
console.log(privateKey)
console.log(decryptedContent)

// ✅ CORRECT
// Không xuất hoặc tham chiếu trực tiếp chuỗi Private Key thông qua chuỗi output tĩnh.`} />
            </div>
          </li>
          
          <li className="pt-2">
            <strong className="text-slate-900 dark:text-white">Quy tắc 2: Không dùng thư viện cấu hình NPM.</strong> Các công nghệ tích hợp thường xuyên trở thành nạn nhân cho "Supply Chain Attack". FORTISMail chỉ có giấy phép vận hành trên mã nguồn `window.crypto.subtle`.
            <div className="mt-3 overflow-hidden rounded-xl bg-[#0f172a]">
              <CodeBlock language="typescript" code={`// ❌ FORBIDDEN
import CryptoJS from 'crypto-js'   // Mã độc từ thư viện NPM sẽ cuỗm sạch thông tin
import forge from 'node-forge'

// ✅ CORRECT
window.crypto.subtle.encrypt(...)  // Cấu trúc máy chủ mã C++ native từ hệ điều hành`} />
            </div>
          </li>
          
          <li className="pt-2">
            <strong className="text-slate-900 dark:text-white">Quy tắc 3: Làm sạch hoàn toàn DOM Output (Sanitizing).</strong> Các rủi ro bảo mật về XSS xảy ra nếu nhà cung cấp sơ hở phân loại nội dung hiển thị thư. 
            <div className="mt-3 overflow-hidden rounded-xl bg-[#0f172a]">
              <CodeBlock language="typescript" code={`// ❌ FORBIDDEN
element.innerHTML = userContent

// ✅ CORRECT
element.textContent = userContent   // Lọc hoặc dùng DOMPurify`} />
            </div>
          </li>
          
          <li className="pt-2">
            <strong className="text-slate-900 dark:text-white">Quy tắc 4: Loại thải Tracking Network Analytics.</strong> Việc đặt những đoạn mã như Google Tag Manager, Facebook Pixel lên trang sẽ tự động copy thụ động mọi nội dung văn bản thư trên màn hình, báo cáo trực tiếp đến hệ thống đối tác thứ 3. Tuyệt đối không nhúng External Scripts vào ứng dụng E2E.
          </li>
          
          <li className="pt-2">
            <strong className="text-slate-900 dark:text-white">Quy tắc 5: Bảo mật thông tin tạm trú vĩnh viễn trên Context State.</strong> File thư tín sau khi giải mã không được phép bám trụ lâu dài trên thiết bị bộ nhớ thường trực.
            <div className="mt-3 overflow-hidden rounded-xl bg-[#0f172a]">
              <CodeBlock language="typescript" code={`// ❌ FORBIDDEN
localStorage.setItem('privateKey', decryptedKey)
sessionStorage.setItem('message', plaintext)

// ✅ CORRECT
// Toàn bộ dữ liệu nằm hoàn toàn ở RAM và React State nội bộ. Sẽ bay sạch khi Tab tắt.`} />
            </div>
          </li>
        </ul>

      </div>
    );
  }

  // EN
  return (
    <div id="security" className="scroll-mt-24">
      <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-12 mb-6 border-t border-slate-200 dark:border-slate-800 pt-10">
        Security Operations
      </h2>
      
      <p className="text-slate-700 dark:text-slate-300 mb-8 leading-relaxed text-lg">
        Valid Zero-Knowledge boundaries inherently demand perfectly disciplined functional parameters structurally. Minor logical divergence introduces massive systemic encryption risk cascades efficiently across endpoints natively.
      </p>

      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-10 mb-6">
        1. User Security Operations (UX Restrictions)
      </h3>

      <div className="space-y-6 mb-12">
        <div className="bg-white dark:bg-[#09090b] border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm">
          <h4 className="font-bold text-slate-800 dark:text-slate-200 text-lg mb-3">Hardware PIN Obfuscation Layer</h4>
          <p className="text-slate-600 dark:text-slate-400 mb-3">
            Whenever active viewports lose targeted user interaction variables (switching backgrounds inherently), <strong>Gatekeeper Systems</strong> enforce explicit physical screen locking metrics requesting secondary 6-digit numeric combinations instantly.
          </p>
          <ul className="list-inside list-disc space-y-1 text-slate-600 dark:text-slate-400 ml-2">
            <li>Rapid resolution speeds evaluating hash verifications successfully.</li>
            <li>Maintains convenience eliminating frustrating heavy Master Key repetitions completely.</li>
            <li><strong>ABSOLUTE DISALLOWANCE:</strong> Storing variables structurally via insecure native <code>localStorage</code> caches. Variables depend implicitly utilizing RAM hooks safely.</li>
          </ul>
        </div>
        <div className="bg-white dark:bg-[#09090b] border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm">
          <h4 className="font-bold text-slate-800 dark:text-slate-200 text-lg mb-3">Computational Debounced Write Pipelines</h4>
          <p className="text-slate-600 dark:text-slate-400 mb-3">
            Continuous E2EE mathematical functions executing instantly directly tax primary operational system threads substantially logically. Non-regulated iterations force extreme conditions generating:
          </p>
          <ul className="list-inside list-disc space-y-1 text-slate-600 dark:text-slate-400 ml-2 mb-3">
            <li>Heavy application freezing constraints interrupting operations completely.</li>
            <li>Aggressive automated Firebase billing expansion costs through continuous excessive writing configurations effectively.</li>
          </ul>
          <div className="border border-amber-500/30 bg-amber-50 dark:bg-amber-900/10 p-3 rounded-lg text-amber-800 dark:text-amber-500 text-sm font-semibold">
            Mechanism: Incorporating strict 3000ms delay debounces batch processing execution arrays entirely generating optimal operational intervals properly.
          </div>
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-10 mb-6">
        2. Foundation Guidelines (The 5 Iron Laws)
      </h3>
      
      <p className="text-slate-700 dark:text-slate-300 mb-6 text-lg border-l-4 border-red-500 pl-4 py-1">
        Warning parameters: Highlighted rules require <strong>zero logical negotiations universally</strong>. Adherence validates structural security requirements permanently natively.
      </p>

      <ul className="space-y-6 text-slate-700 dark:text-slate-300">
        <li>
          <strong className="text-slate-900 dark:text-white">Law 1: Expunge Output Logging.</strong> Unauthorized plugin scrapers actively identify raw operational arrays processing specifically looking explicitly for visible <code>window.console</code> metrics dynamically.
          <div className="mt-3 overflow-hidden rounded-xl bg-[#0f172a]">
            <CodeBlock language="typescript" code={`// ❌ FORBIDDEN — in ANY environment natively
console.log(privateKey)
console.log(decryptedContent)

// ✅ CORRECT
// Use opaque logic referencing. Avoid explicit literal extractions strictly.`} />
          </div>
        </li>
        
        <li className="pt-2">
          <strong className="text-slate-900 dark:text-white">Law 2: Abolish NPM Cryptographic Arrays.</strong> Dependent external libraries introduce extreme underlying "Supply Chain" insertion exploitations actively continuously. Adhere stringently applying exact <code>window.crypto.subtle</code> arrays exclusively seamlessly.
          <div className="mt-3 overflow-hidden rounded-xl bg-[#0f172a]">
            <CodeBlock language="typescript" code={`// ❌ FORBIDDEN
import CryptoJS from 'crypto-js'   // Massive Supply chain attack vector
import forge from 'node-forge'

// ✅ CORRECT
window.crypto.subtle.encrypt(...)  // Pure safe native compiled browser C++ binaries`} />
          </div>
        </li>
        
        <li className="pt-2">
          <strong className="text-slate-900 dark:text-white">Law 3: Comprehensive DOM Content Sanitization.</strong> Bypassing security checks injects malicious payload streams straight performing silent RAM variable extraction easily effectively.
          <div className="mt-3 overflow-hidden rounded-xl bg-[#0f172a]">
            <CodeBlock language="typescript" code={`// ❌ FORBIDDEN
element.innerHTML = userContent

// ✅ CORRECT
element.textContent = userContent   // Or systematically utilize DOMPurify architectures`} />
          </div>
        </li>
        
        <li className="pt-2">
          <strong className="text-slate-900 dark:text-white">Law 4: Decline Persistent Tracking Systems.</strong> Applying Google Tag algorithms copies user plain-text renders inherently delivering confidential exposed material to arbitrary third party systems fundamentally shattering explicit verification requirements correctly.
        </li>
        
        <li className="pt-2">
          <strong className="text-slate-900 dark:text-white">Law 5: Retain Volatile Disposability Integrations.</strong> Physical arrays remaining completely isolated prevent rogue system software reads automatically effectively natively preserving parameters locally successfully.
          <div className="mt-3 overflow-hidden rounded-xl bg-[#0f172a]">
            <CodeBlock language="typescript" code={`// ❌ FORBIDDEN
localStorage.setItem('privateKey', decryptedKey)
sessionStorage.setItem('message', plaintext)

// ✅ CORRECT
// All decrypted elements exist safely held isolated strictly avoiding physical presence.`} />
          </div>
        </li>
      </ul>

    </div>
  );
}

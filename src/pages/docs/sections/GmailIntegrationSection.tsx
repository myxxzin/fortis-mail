import { useLanguage } from '../../../contexts/LanguageContext';
import Callout from '../../../components/docs/Callout';

export default function GmailIntegrationSection() {
  const { language } = useLanguage();

  if (language === 'vi') {
    return (
      <div id="gmail-integration" className="scroll-mt-24 mb-16 pt-10 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-3xl font-bold mb-4">Phân tích Luồng Nghiệp vụ (Workflows)</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
          Tài liệu này mổ xẻ logic luồng hoạt động nội bộ tại các tính năng cốt lõi nhất của hệ thống.
        </p>

        <h3 className="text-xl font-bold mt-8 border-b border-slate-200 dark:border-slate-800 pb-2">1. Phân tích Compose.tsx (Soạn thảo)</h3>
        <ul className="list-none space-y-4 mt-4 mb-6">
          <li className="bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
             <strong className="text-[#43cc25]">State & Debounce Auto-Save:</strong><br/>
             Dùng <code>useRef</code> để theo dõi nội dung. Một hàm Timeout (3000ms) liên tục lắng nghe thay đổi. Nếu người dùng dừng gõ, thư nháp tự động lưu lên Firestore. Đồng bộ thêm sự kiện <code>beforeunload</code> để đẩy xuống <code>localStorage</code> đề phòng cúp điện hoặc out mạng.
          </li>
          <li className="bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
             <strong className="text-[#43cc25]">Trải nghiệm chọn Danh bạ:</strong><br/>
             Dropdown thông minh tự map (Ánh xạ) bí danh Alias sang Public Key dài 300 ký tự. Có cơ chế xử lý ngoại lệ khi thao tác Paste (dán) key rác từ Clipboard.
          </li>
          <li className="bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
             <strong className="text-[#43cc25]">Bất đồng bộ xử lý khối lượng lớn:</strong><br/>
             Mã hóa và tải file được bọc bởi vòng <code>Promise.race</code> timeout 15s, làm đứt mạch (Circuit Breaker) nếu server suy yếu thay vì làm đóng băng hoàn toàn trình duyệt.
          </li>
        </ul>

        <h3 className="text-xl font-bold mt-8 border-b border-slate-200 dark:border-slate-800 pb-2">2. Phân tích DecryptMsg.tsx (Gatekeeper & Đọc thư)</h3>
        <ul className="list-none space-y-4 mt-4 mb-6">
          <li className="bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
             <strong className="text-accent-blue font-bold">Bảo vệ State Machine:</strong><br/>
             Bảo vệ luồng bằng 4 trạng thái tuyến tính: <code>locked</code> -&gt; <code>password-entered</code> -&gt; <code>decrypting</code> -&gt; <code>decrypted</code>. Đánh giá Mật khẩu (PIN) nhanh dưới 10ms bằng cách SHA-256 nội bộ đối chiếu trực tiếp thay vì request chéo lên API Auth.
          </li>
          <li className="bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
             <strong className="text-accent-blue font-bold">Global Identity Resolution:</strong><br/>
             Nếu Public Key chưa lưu trong danh bạ cục bộ, API sẽ càn quét chéo lên collection <code>users</code> tổng để lôi Profile Alias ra, đảm bảo tính chất định danh tuyệt đỉnh (Đọc tên người gửi thay vì đọc chuỗi Hash mù).
          </li>
        </ul>

        <h3 className="text-xl font-bold mt-8 border-b border-slate-200 dark:border-slate-800 pb-2">3. Giao thức Delivery ACK</h3>
        <Callout type="success" title="Chứng thực Đọc mã hóa toán học">
          Đây là tính năng độc quyền: Sau khi người nhận giải mã thành công một thư mới, hệ thống tính toán sinh ra Hash nội dung (<code>msg_hash</code>) rồi tự tạo thông điệp <code>ACK:{'{'}msg_hash{'}'}</code> mã hóa Ephemeral gửi trả lại người gửi. 
          Người gửi ban đầu vô tình phát hiện ra ACK tại thư mục Đã Gửi (Sent), khi giải mã nếu thấy Hash trùng lặp, nhãn <strong>[ACK Verified] (✔️)</strong> bật sáng. Đảm bảo 100% đối phương đã đọc.
        </Callout>
      </div>
    );
  }

  // English
  return (
    <div id="gmail-integration" className="scroll-mt-24 mb-16 pt-10 border-t border-slate-200 dark:border-slate-800">
      <h2 className="text-3xl font-bold mb-4">Business Workflows Deep Dive</h2>
      <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
        Let's structurally dissect the internal mechanics functioning behind the core front-end views.
      </p>

      <h3 className="text-xl font-bold mt-8 border-b border-slate-200 dark:border-slate-800 pb-2">1. The State of Compose.tsx</h3>
      <ul className="list-none space-y-4 mt-4 mb-6">
        <li className="bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
           <strong className="text-[#43cc25]">Debounced Tracking:</strong><br/>
           Relies upon <code>useRef</code> to silently catalog content inputs. An agile 3000ms Timeout mechanism observes interactions continuously. When idle, active states upload to Firestore Drafts. We utilize a rigid <code>beforeunload</code> listener firing emergency checkpoints back to <code>localStorage</code> minimizing unsaved catastrophic blunders.
        </li>
        <li className="bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
           <strong className="text-[#43cc25]">Contact Identity Handling:</strong><br/>
           Our Smart dropdown quietly forces legible Profile Aliases mapping transparently to brutal 300-character Public Keys. We execute heavily fortified Regex traps against malformed clipboard Paste injections directly securing Input elements.
        </li>
        <li className="bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
           <strong className="text-[#43cc25]">Asynchronous Execution (Circuit Breakers):</strong><br/>
           We containerize Encryption flows into a tight <code>Promise.race</code> timeout cycle (15s limits). Instead of rendering your browser hostage, structural weaknesses or internet loss triggers safe UI abort resets seamlessly.
        </li>
      </ul>

      <h3 className="text-xl font-bold mt-8 border-b border-slate-200 dark:border-slate-800 pb-2">2. Engineering DecryptMsg.tsx</h3>
      <ul className="list-none space-y-4 mt-4 mb-6">
        <li className="bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
           <strong className="text-accent-blue font-bold">Linear Gatekeeping:</strong><br/>
           Strict architectural render tiers: <code>locked</code> -&gt; <code>password-entered</code> -&gt; <code>decrypting</code> -&gt; <code>decrypted</code>. SHA-256 handles instantaneous gate unlocking without round-trip Auth Firebase delays (average ~10ms unlock verifications locally).
        </li>
        <li className="bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
           <strong className="text-accent-blue font-bold">Global Identity Resolution:</strong><br/>
           Local Context lookups frequently miss. Ergo, cross-queries sweep the public <code>users</code> database to gracefully fetch sender identifiers eliminating terrible UI Hash displays.
        </li>
      </ul>

      <h3 className="text-xl font-bold mt-8 border-b border-slate-200 dark:border-slate-800 pb-2">3. Delivery ACK Protocol</h3>
      <Callout type="success" title="Mathematical Read Verification">
        A genuinely sophisticated highlight: Upon successfully reading a decrypted package, background chron-workers instantly parse a <code>msg_hash</code>, generating a tiny embedded payload: <code>ACK:{'{'}msg_hash{'}'}</code>. This transmits back as an Ephemeral Message entirely invisibly. 
        When the original Sender views their "Sent Items", deciphering the valid ACK flips up the shiny <strong>[ACK Verified] (✔️)</strong> seal. 100% mathematical integrity validating that the recipient absolutely decoded the packet!
      </Callout>
    </div>
  );
}

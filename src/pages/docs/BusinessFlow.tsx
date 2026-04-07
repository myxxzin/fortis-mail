export default function BusinessFlow() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white uppercase">PHÂN TÍCH LUỒNG NGHIỆP VỤ</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">CHƯƠNG 3 (BUSINESS WORKFLOWS)</p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
        <h3 className="text-xl font-bold mt-8 border-b border-slate-200 dark:border-slate-800 pb-2">3.1. Phân tích Compose.tsx (Soạn thảo)</h3>
        <ul className="list-none space-y-4 mt-4">
          <li className="bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
             <strong className="text-[#43cc25]">State Management & Debounce Auto-Save:</strong><br/>
             Sử dụng <code>useRef</code> (<code>latestDraftState</code>) để theo dõi nội dung. Một hàm <code>setTimeout</code> (3000ms) liên tục lắng nghe thay đổi. Nếu người dùng dừng gõ 3 giây, thư nháp được gửi lên Firestore. Hệ thống cũng bắt sự kiện <code>beforeunload</code> để lưu nháp cục bộ (<code>localStorage</code>) đề phòng rớt mạng đột ngột.
          </li>
          <li className="bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
             <strong className="text-[#43cc25]">Trải nghiệm chọn danh bạ (Contact Resolver):</strong><br/>
             Người dùng không cần nhớ Public Key dài 300 ký tự. Dropdown danh bạ xuất hiện khi focus vào ô <em>To</em>. Khi chọn bí danh (Alias), hệ thống ngầm map với Public Key tương ứng. Xử lý cả lỗi Clipboard (khi dán key từ bên ngoài).
          </li>
          <li className="bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
             <strong className="text-[#43cc25]">Bất đồng bộ khi gửi (Async Execution):</strong><br/>
             Việc upload file lên Firebase được bọc trong <code>Promise.race</code> với timeout 15 giây. Nếu mạng chậm/lỗi cấu hình, hệ thống chủ động ngắt mạch (Circuit Breaker) thay vì treo giao diện vô hạn.
          </li>
        </ul>

        <h3 className="text-xl font-bold mt-8 border-b border-slate-200 dark:border-slate-800 pb-2">3.2. Phân tích DecryptMsg.tsx (Đọc thư)</h3>
        <ul className="list-none space-y-4 mt-4">
          <li className="bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
             <strong className="text-accent-blue font-bold">Bảo vệ tầng hiển thị (Gatekeeper):</strong><br/>
             Giao diện render ra 4 trạng thái tuyến tính (State Machine): <code>locked</code> -&gt; <code>password-entered</code> -&gt; <code>decrypting</code> -&gt; <code>decrypted</code>. Nếu người dùng thiết lập mã PIN, hàm sẽ lấy PIN kết hợp với IdentityID, băm SHA-256 và so sánh với Hash lưu trữ (thay vì gọi API Auth Firebase), giúp quá trình mở khóa diễn ra chưa tới 10ms.
          </li>
          <li className="bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
             <strong className="text-accent-blue font-bold">Resolution định danh toàn cầu (Global Identity Resolution):</strong><br/>
             Hệ thống duy trì song song danh bạ nội bộ (<code>ContactContext</code>) và truy vấn chéo lên collection <code>users</code>. Nếu Public Key của người gửi không có trong danh bạ, hệ thống sẽ fetch Alias từ public profile của họ để hiển thị, thay vì hiện chuỗi mã hóa khó hiểu.
          </li>
        </ul>

        <h3 className="text-xl font-bold mt-8 border-b border-slate-200 dark:border-slate-800 pb-2">3.3. Giao thức Delivery ACK (Chứng thực đã đọc mã hóa)</h3>
        <p>Đây là tính năng Advanced của dự án:</p>
        <ol className="list-decimal pl-6 space-y-2 mt-4 text-slate-700 dark:text-slate-300">
          <li>Người nhận sau khi giải mã thành công, ứng dụng ngầm tính mã băm (Hash) của nội dung thư: <code>msg_hash</code>.</li>
          <li>Ứng dụng tạo một thông điệp nội bộ: <code>ACK:{'{'}msg_hash{'}'}</code>.</li>
          <li>Thông điệp này được mã hóa Hybrid bằng Public Key của <em>Người gửi ban đầu</em> và đẩy vào bảng <code>deliveryAcks</code>.</li>
          <li><em>Người gửi</em> khi xem lại thư đã gửi (Sent Items), ứng dụng sẽ tự quét bảng <code>deliveryAcks</code>, giải mã. Nếu khớp mã Hash, UI sẽ render nhãn <strong>[ACK Verified] (✔️)</strong>, đảm bảo về mặt toán học rằng đối phương đã đọc chính xác nội dung thư.</li>
        </ol>
      </div>
    </div>
  );
}

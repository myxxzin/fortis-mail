export default function SystemArchitecture() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white uppercase">Kiến trúc Hệ thống và Dữ liệu</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">CHƯƠNG 4 (SYSTEM & DATA ARCHITECTURE)</p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
        <h3 className="text-xl font-bold mt-8 border-b border-slate-200 dark:border-slate-800 pb-2">4.1. Kiến trúc State Management (Context API)</h3>
        <p>Thay vì dùng Redux cồng kềnh, FortisMail dùng hệ thống Multi-Context:</p>
        <ul className="list-disc pl-6 space-y-2 mt-4 text-slate-700 dark:text-slate-300">
          <li><code className="text-[#43cc25]">AuthContext</code>: Nguồn chân lý (Single Source of Truth) về User. Nắm giữ thông tin Auth Firebase và Private Key (lưu trên RAM). Nếu refresh trang, Private Key mất, buộc user nhập lại PIN. Đây là tính năng bảo mật (Volatile Memory).</li>
          <li><code className="text-[#43cc25]">MailContext</code>: Xử lý CRUD với Firestore (Mails, Drafts, Delivery Acks).</li>
          <li><code className="text-[#43cc25]">ContactContext</code>: Quản lý Address Book cục bộ.</li>
        </ul>

        <h3 className="text-xl font-bold mt-8 border-b border-slate-200 dark:border-slate-800 pb-2">4.2. Schema Cơ Sở Dữ Liệu (Firestore NoSQL)</h3>
        
        <div className="space-y-6 mt-4">
          <div className="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
             <h4 className="font-bold mb-2 flex items-center text-slate-900 dark:text-white">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>Collection <code>users</code>
             </h4>
             <ul className="list-disc pl-6 space-y-1 text-sm text-slate-600 dark:text-slate-300">
                <li><code>uid</code> (String): ID từ Firebase Auth.</li>
                <li><code>publicKey</code> (String): ECDH/ECDSA Public Keys dạng PEM.</li>
                <li><code>encryptedPrivateKey</code> (Object): <code>{'{'} ciphertext, iv {'}'}</code> mã hóa bằng AES-GCM.</li>
                <li><code>pinHash</code> (String): Mã băm của mã PIN mở khóa nhanh.</li>
             </ul>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
             <h4 className="font-bold mb-2 flex items-center text-slate-900 dark:text-white">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>Collection <code>mails</code>
             </h4>
             <ul className="list-disc pl-6 space-y-1 text-sm text-slate-600 dark:text-slate-300">
                <li><code>senderPubKey</code> / <code>recipientPubKey</code> (String): Các key định tuyến (Index queries).</li>
                <li><code>content</code> (String): Gói tin ASCII Armor (<code>-----BEGIN FORTISMAIL...</code>).</li>
                <li><code>subject</code> (String): Tiêu đề thư (Có thể mã hóa hoặc để hở tùy chính sách).</li>
                <li><code>timestamp</code> (Number): Giờ gửi.</li>
                <li><code>attachments</code> (Array): Metadata chứa Name, Type, URL (Không chứa File Key ở đây, File Key nằm kín trong biến <code>content</code>).</li>
             </ul>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
             <h4 className="font-bold mb-2 flex items-center text-slate-900 dark:text-white">
                <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>Collection <code>drafts</code>
             </h4>
             <p className="text-sm text-slate-600 dark:text-slate-300 ml-4 mb-2">
               Tương tự <code>mails</code> nhưng nội dung chưa bị mã hóa. Được bảo vệ nghiêm ngặt bằng <strong>Firestore Security Rules</strong>:
             </p>
             <pre className="text-xs bg-slate-900 text-slate-300 p-3 rounded-lg mx-4">
               <code>allow read, write: if request.auth.uid == resource.data.userId;</code>
             </pre>
          </div>
        </div>

      </div>
    </div>
  );
}

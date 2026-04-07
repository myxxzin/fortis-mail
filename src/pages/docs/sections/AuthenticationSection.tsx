import { useLanguage } from '../../../contexts/LanguageContext';
import FlowDiagram from '../../../components/docs/FlowDiagram';
import { DatabaseZap, FileSymlink, Network, KeySquare, MonitorOff } from 'lucide-react';

export default function AuthenticationSection() {
  const { language } = useLanguage();

  const flowAttachmentVI = [
    { id: '1', title: 'Tạo AES-File-Key (1 Lần)', description: 'Trình duyệt cấp phát khóa AES-256 ngẫu nhiên bọc mã toàn bộ Byte Array của File. Khóa File chưa rời máy.', icon: <KeySquare /> },
    { id: '2', title: 'Tải Blob lên Firebase Storage', description: 'Gói Blob (10MB+) đẩy lên Storage Cloud lấy tĩnh một tham chiếu [URL]. Bản thân Storage chỉ chứa mớ nén vô hồn.', icon: <DatabaseZap /> },
    { id: '3', title: 'Package Firebase Firestore', description: 'Gói chung tham chiếu [URL] và [AES-File-Key] cho chui vào luồng ECDH bọc mã E2E chích thẳng vô lõi /mails db cực nhẹ.', icon: <FileSymlink />, isSecondary: true },
  ];

  const flowAttachmentEN = [
    { id: '1', title: 'AES-File-Key Transient Gen', description: 'Browser strictly spawns an untracked RNG AES-256 local key enveloping the raw Byte Arrays parsing the attachment natively.', icon: <KeySquare /> },
    { id: '2', title: 'Storage Node Uploads', description: 'Transfers 10MB+ Ciphertext Blob clusters extracting a permanent raw pointer [URL]. Storage retains pure chaotic byte dust.', icon: <DatabaseZap /> },
    { id: '3', title: 'Firestore Package Execution', description: 'Fuses [URL] alongside transient [AES-File-Key] shoving everything collectively inside standard E2EE pipeline evading limits heavily.', icon: <FileSymlink />, isSecondary: true },
  ];

  if (language === 'vi') {
    return (
      <div id="authentication" className="scroll-mt-24">
        <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold border border-blue-100 dark:border-blue-800">
          <DatabaseZap className="w-4 h-4" /> Hệ Thống Bộ Nhớ Cốt Lõi
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 mb-6">
          Lưu Trữ & Sinh Mệnh Khóa
        </h1>
        
        <h2 className="text-2xl font-bold mt-12 mb-8 text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
          1. Kiến Trúc Lưu Trữ (Data Storage Design)
        </h2>
        <p className="text-lg text-slate-700 dark:text-slate-300 mb-6">
          Hệ thống Firestore sử dụng ba collection hoàn toàn độc lập, <strong>không tồn tại JOIN key vật lý</strong> nhằm tăng tốc độ truy vấn NoSQL cao nhất và giảm triệt để bề mặt rò rỉ.
        </p>
        
        {/* DB Schema Cards */}
        <div className="grid lg:grid-cols-3 gap-4 mb-12">
          
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-[#09090b]">
             <div className="bg-slate-50 dark:bg-slate-900 py-3 px-5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                <h4 className="font-bold text-slate-900 dark:text-white font-mono text-sm">/users/{`{uid}`}</h4>
             </div>
             <div className="p-5 font-mono text-sm leading-loose">
               <div className="text-slate-600 dark:text-slate-400"><span className="text-blue-500 font-bold">alias:</span> string</div>
               <div className="text-slate-600 dark:text-slate-400"><span className="text-blue-500 font-bold">publicKey:</span> jwk / pem</div>
               <div className="text-slate-600 dark:text-slate-400"><span className="text-blue-500 font-bold">pinHash:</span> string</div>
             </div>
          </div>
          
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-[#09090b]">
             <div className="bg-slate-50 dark:bg-slate-900 py-3 px-5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.5)]"></div>
                <h4 className="font-bold text-slate-900 dark:text-white font-mono text-sm">/mails/{`{mailId}`}</h4>
             </div>
             <div className="p-5 font-mono text-sm leading-loose">
               <div className="text-slate-600 dark:text-slate-400"><span className="text-teal-500 font-bold">from / to:</span> refs</div>
               <div className="text-slate-600 dark:text-slate-400"><span className="text-teal-500 font-bold">payload:</span> ciphertext</div>
               <div className="text-slate-600 dark:text-slate-400"><span className="text-teal-500 font-bold">signature:</span> hex / b64</div>
             </div>
          </div>
          
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-[#09090b]">
             <div className="bg-slate-50 dark:bg-slate-900 py-3 px-5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                <h4 className="font-bold text-slate-900 dark:text-white font-mono text-sm">/drafts/{`{draftId}`}</h4>
             </div>
             <div className="p-5 font-mono text-sm leading-loose">
               <div className="text-slate-600 dark:text-slate-400"><span className="text-amber-500 font-bold">ownerUID:</span> string</div>
               <div className="text-slate-600 dark:text-slate-400"><span className="text-amber-500 font-bold">content:</span> ciphertext</div>
               <div className="text-slate-600 dark:text-slate-400"><span className="text-amber-500 font-bold">lastSaved:</span> temp_ts</div>
             </div>
          </div>

        </div>

        <h3 className="text-xl font-bold mt-8 mb-4 text-slate-900 dark:text-slate-100 flex items-center gap-2">
          Bypass Giới Hạn 1MB (Cloud Attachment Pipeline)
        </h3>
        <p className="text-lg text-slate-700 dark:text-slate-300 mb-6">
          Do Firestore chặn cứng giới hạn 1MB/document. Cơ chế File Đính kèm hoạt động qua mô hình kết hợp (Hybrid Split):
        </p>
        <div className="p-6 bg-slate-50 dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 rounded-3xl mb-12">
          <FlowDiagram nodes={flowAttachmentVI} direction="vertical" />
        </div>

        <h2 className="text-2xl font-bold mt-16 mb-8 text-slate-900 dark:text-slate-100 tracking-tight border-t border-slate-200 dark:border-slate-800 pt-10">
          2. Vòng Đời Trạng Thái (State Lifecycle)
        </h2>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4 text-indigo-600 dark:text-indigo-400">
               <Network className="w-6 h-6" />
               <h3 className="text-xl font-bold text-slate-900 dark:text-white">Kiên quyết Cấm Redux</h3>
            </div>
            <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed mb-4">
              Tuyệt đối không lưu Private key nội phủ trên Redux Store. Mọi Chrome Extension chứa script mã độc quét <code>window.__REDUX_STORE__</code> đều bắt được toàn bộ. Thay vào đó, gán vĩnh viễn khóa trên <strong>React Context Local RAM</strong> - bảo vệ triệt để rò rỉ bộ nhớ.
            </p>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-4 text-rose-600 dark:text-rose-400">
               <MonitorOff className="w-6 h-6" />
               <h3 className="text-xl font-bold text-slate-900 dark:text-white">Sinh Ly Tử Biệt</h3>
            </div>
            <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed mb-4">
              <strong>KHÔNG có hệ thống cứu trợ "Quên Mật Khẩu"</strong>.
              Master Key được derive ra nhờ tính toán toán học từ chuỗi Mật khẩu. Mất mật khẩu = bay màu giải mã khóa, mọi di sản email chìm ngập hoàn toàn thành đống rác ngẫu nhiên. Đây là luật để chặn đứng Zero-Day.
            </p>
          </div>
        </div>

      </div>
    );
  }

  // EN
  return (
    <div id="authentication" className="scroll-mt-24">
      <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold border border-blue-100 dark:border-blue-800">
        <DatabaseZap className="w-4 h-4" /> Core State Machinery
      </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 mb-6">
        Storage Mechanics
      </h1>
      
      <h2 className="text-2xl font-bold mt-12 mb-8 text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
        1. Base Database Configurations
      </h2>
      <p className="text-lg text-slate-700 dark:text-slate-300 mb-6">
        Flattened to perfection. Three robust collections stripped explicitly lacking <strong>intricate JOIN nodes</strong> structurally isolating potential cross-contamination attacks guaranteeing maximum fetch thresholds.
      </p>
      
      {/* DB Schema Cards */}
      <div className="grid lg:grid-cols-3 gap-4 mb-12">
        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-[#09090b]">
           <div className="bg-slate-50 dark:bg-slate-900 py-3 px-5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
              <h4 className="font-bold text-slate-900 dark:text-white font-mono text-sm">/users/{`{uid}`}</h4>
           </div>
           <div className="p-5 font-mono text-sm leading-loose">
             <div className="text-slate-600 dark:text-slate-400"><span className="text-blue-500 font-bold">alias:</span> string</div>
             <div className="text-slate-600 dark:text-slate-400"><span className="text-blue-500 font-bold">publicKey:</span> crypto-jwk</div>
             <div className="text-slate-600 dark:text-slate-400"><span className="text-blue-500 font-bold">pinHash:</span> sha-string</div>
           </div>
        </div>
        
        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-[#09090b]">
           <div className="bg-slate-50 dark:bg-slate-900 py-3 px-5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.5)]"></div>
              <h4 className="font-bold text-slate-900 dark:text-white font-mono text-sm">/mails/{`{mailId}`}</h4>
           </div>
           <div className="p-5 font-mono text-sm leading-loose">
             <div className="text-slate-600 dark:text-slate-400"><span className="text-teal-500 font-bold">from / to:</span> string_refs</div>
             <div className="text-slate-600 dark:text-slate-400"><span className="text-teal-500 font-bold">payload:</span> aes_gcm_armor</div>
             <div className="text-slate-600 dark:text-slate-400"><span className="text-teal-500 font-bold">signature:</span> ecdsa_b64</div>
           </div>
        </div>
        
        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-[#09090b]">
           <div className="bg-slate-50 dark:bg-slate-900 py-3 px-5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
              <h4 className="font-bold text-slate-900 dark:text-white font-mono text-sm">/drafts/{`{draftId}`}</h4>
           </div>
           <div className="p-5 font-mono text-sm leading-loose">
             <div className="text-slate-600 dark:text-slate-400"><span className="text-amber-500 font-bold">ownerUID:</span> string</div>
             <div className="text-slate-600 dark:text-slate-400"><span className="text-amber-500 font-bold">content:</span> encrypted_data</div>
             <div className="text-slate-600 dark:text-slate-400"><span className="text-amber-500 font-bold">lastSaved:</span> temporary_ts</div>
           </div>
        </div>
      </div>

      <h3 className="text-xl font-bold mt-8 mb-4 text-slate-900 dark:text-slate-100 flex items-center gap-2">
        1MB Firestore Limit Attachments Evasion
      </h3>
      <p className="text-lg text-slate-700 dark:text-slate-300 mb-6">
        Attachments rapidly explode maximum packet constraints. Bypassing safely requires splitting routing metrics intelligently.
      </p>
      <div className="p-6 bg-slate-50 dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 rounded-3xl mb-12">
        <FlowDiagram nodes={flowAttachmentEN} direction="vertical" />
      </div>

      <h2 className="text-2xl font-bold mt-16 mb-8 text-slate-900 dark:text-slate-100 tracking-tight border-t border-slate-200 dark:border-slate-800 pt-10">
        2. Context Implementations 
      </h2>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-4 text-indigo-600 dark:text-indigo-400">
             <Network className="w-6 h-6" />
             <h3 className="text-xl font-bold text-slate-900 dark:text-white">Redux Abolishment</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed mb-4">
            Never utilize Redux wrappers for Vault logic arrays. Any loaded plugin or extensions executing <code>window.__REDUX_STORE__</code> scrapes memory mercilessly extracting Vault files. Leveraging local <strong>React Context hooks</strong> shields internal runtime segments.
          </p>
        </div>
        <div>
          <div className="flex items-center gap-3 mb-4 text-rose-600 dark:text-rose-400">
             <MonitorOff className="w-6 h-6" />
             <h3 className="text-xl font-bold text-slate-900 dark:text-white">Permanent Forgetting</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed mb-4">
            <strong>There strictly avoids "Reset Passwords" requests.</strong> Server admins cannot access recovery modules. Lost master passwords irrevocably brick mathematical decryption arrays dropping all account content straight back to meaningless hashes preventing external recovery spoof attacks.
          </p>
        </div>
      </div>

    </div>
  );
}

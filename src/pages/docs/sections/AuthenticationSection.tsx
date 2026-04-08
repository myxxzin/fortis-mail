import { useLanguage } from '../../../contexts/LanguageContext';
import CodeBlock from '../../../components/docs/CodeBlock';
import Callout from '../../../components/docs/Callout';

export default function AuthenticationSection() {
  const { language } = useLanguage();

  if (language === 'vi') {
    return (
      <div id="authentication" className="scroll-mt-24">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-12 mb-6 border-t border-slate-200 dark:border-slate-800 pt-10">
          Thiết Kế Cơ sở Lưu trữ (Data Storage Design)
        </h2>
        
        <p className="text-slate-700 dark:text-slate-300 mb-8 leading-relaxed text-lg">
          Lược đồ hạ tầng được tổ chức thành ba collection chuyên biệt hoàn toàn độc lập. Lịch trình định tuyến <strong>thiết kế không hỗ trợ các khóa ngoại (JOIN keys vật lý)</strong>. Phương pháp phi cấu trúc (Flattened) này tối ưu hóa quyền truy cập, giảm độ trễ truy vấn NoSQL và ngăn chặn nguy cơ rò rỉ dữ liệu liên đới.
        </p>

        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-10 mb-4">
          1. Firestore Collections (Kiến trúc CSDL)
        </h3>

        <div className="mb-8 overflow-hidden rounded-xl bg-[#0f172a]">
          <CodeBlock language="typescript" code={`Firestore Database
├── /users/{uid}
│   ├── alias          (Tên người hiển thị public)
│   ├── publicKey      (Khóa công khai dùng để mã hóa từ phía đối tác)
│   └── pinHash        (Mã băm của PIN thiết bị — tuyệt đối không lưu dạng text gốc)
│
├── /mails/{mailId}
│   ├── to             (Chuỗi UID người nhận)
│   ├── from           (Chuỗi UID người gửi)
│   ├── encryptedPayload  (Bản mã nội dung chuẩn ASCII Armored)
│   ├── encryptedKey      (Khóa AES giải mã do ECDH gói lại)
│   ├── signature         (Chữ ký chống giả mạo ECDSA)
│   └── timestamp
│
└── /drafts/{draftId}
    ├── ownerUID
    ├── encryptedContent
    └── lastSaved`} />
        </div>

        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-12 mb-4">
          2. Vượt Quá Giới Hạn 1MB (Large Files By-pass Pipeline)
        </h3>

        <p className="text-slate-700 dark:text-slate-300 mb-4">
          Cơ chế Firestore thiết lập cứng giới hạn Data Document dưới mức 1MB/bản ghi. Về lý thuyết không thể nhồi tệp đính kèm lớn thẳng vào JSON mảng. FORTISMail xử lý thông qua cơ chế chẻ lớp (split-layer):
        </p>

        <div className="mb-10 overflow-hidden rounded-xl bg-[#0f172a]">
          <CodeBlock language="typescript" code={`ATTACHMENT PIPELINE:
────────────────────────────────────────────────────────
1. Client tự động sinh chuỗi khóa AES-File-Key vô danh.
2. Binary Array của tệp tài liệu được AES bọc mã độc lập.
3. Chuyển Blob mã hóa lên Cloud Storage → Storage trả về {URL}.
4. Client nhận {URL} và {AES-File-Key}.
   └──▶ Nạp cả hai vào cùng 1 lõi Payload JSON của Email (Dung lượng siêu nhỏ).
5. Cuối cùng, thực hiện quy trình mã hóa luồng E2E cho lõi Payload JSON đó.
6. Đẩy lõi siêu nhẹ này lên Firestore Database.
────────────────────────────────────────────────────────`} />
        </div>

        <div className="mb-12">
          <Callout type="info" title="Kết quả đầu ra">
            Cloud Storage sẽ đảm nhiệm chứa các tệp rác khổng lồ không thể giải nghĩa. Trong khi đó Firestore chỉ giữ các con trỏ logic nhỏ có khả năng định tuyến mạnh mẽ. Hai hệ thống hợp tác tạo ra luồng E2EE không biên giới.
          </Callout>
        </div>

        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-12 mb-6 border-t border-slate-200 dark:border-slate-800 pt-10">
          Chính Sách Bộ Nhớ Bức Tường (State Barrier)
        </h2>

        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-8 mb-4">
          1. React Context VS Redux Toolkits
        </h3>
        <p className="text-slate-700 dark:text-slate-300 mb-6">
          Khóa Private Key (bí mật) bắt buộc phải nằm trên hệ thực thể RAM. Nếu bảo quản sai chỗ, toàn bộ phương pháp mã hóa tiền đề đều phá sản nặng nề. Do đó, FORTISMail <strong>KHÔNG DÙNG Redux</strong>.
        </p>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mb-10 shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f8fafc] dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4 font-bold border-b border-slate-200 dark:border-slate-700">Yếu Tố Ảnh Hưởng</th>
                <th className="px-6 py-4 font-bold border-b border-slate-200 dark:border-slate-700">Redux Component</th>
                <th className="px-6 py-4 font-bold border-b border-slate-200 dark:border-slate-700">React Context (FORTISMail)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-6 py-4 font-semibold">Tầm soát khả năng hiển thị</td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">Tọa lạc tại vùng nhớ dễ truy cập (Có thể debug được).</td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">Bị cô lập hoàn toàn, bị che khuất theo DOM closure vòng đời.</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-6 py-4 font-semibold">Rủi ro bị đánh cắp Private Key</td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-300 text-rose-500 font-bold">CỰC CAO (Extension chỉ cần gọi object Window).</td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-300 text-[#43cc25] font-bold">THẤP (Khóa vật lý RAM bay hơi khi tắt trình duyệt).</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-12 mb-4">
          2. Vòng đời khoá gốc (Revocation Nullification)
        </h3>
        
        <div className="mb-12">
          <Callout type="warning" title="Thu hồi tính năng Reset (Quên Mật khẩu)">
             Người dùng quên mật khẩu thì hoàn toàn <strong>KHÔNG CÓ CƠ CHẾ GỠ LỖI NÀO</strong>. Do máy chủ không sở hữu hàm giải mã gốc, việc xóa mật khẩu buộc cơ chế PBKDF2 sinh mã đạo hàm không chuẩn, dẫn đến chuỗi khoá cũ không khớp. Toàn bộ thông tin từ trong quá khứ trở thành phế phẩm. Đây không phải là một lỗi của phần mềm mà chính là quy luật tự nhiên khắc nghiệt của Zero-Knowledge Model.
          </Callout>
        </div>

      </div>
    );
  }

  // EN
  return (
    <div id="authentication" className="scroll-mt-24">
      <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-12 mb-6 border-t border-slate-200 dark:border-slate-800 pt-10">
        Data Storage Design
      </h2>
      
      <p className="text-slate-700 dark:text-slate-300 mb-8 leading-relaxed text-lg">
        The base underlying Firestore structure involves operating specifically mapping into three independent partitions. Explicitly establishing layouts absent of <strong>physical JOIN key implementations</strong> prevents lateral routing breaches maximizing strict non-relational fetch thresholds flawlessly.
      </p>

      <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-10 mb-4">
        1. Firestore Flattened Schema Definition
      </h3>

      <div className="mb-8 overflow-hidden rounded-xl bg-[#0f172a]">
        <CodeBlock language="typescript" code={`Firestore Database Networks
├── /users/{uid}
│   ├── alias          (Broadcasting display parameters)
│   ├── publicKey      (Externally exposed key for incoming encryptions)
│   └── pinHash        (Never raw format — distinctly transformed outputs)
│
├── /mails/{mailId}
│   ├── to             (Recipient addressing object)
│   ├── from           (Sender authentication variable)
│   ├── encryptedPayload  (Core payload explicitly ASCII aligned)
│   ├── encryptedKey      (AES retrieval instance contained inside ECDH limits)
│   ├── signature         (Spoof-blocking validation logic point)
│   └── timestamp
│
└── /drafts/{draftId}
    ├── ownerUID
    ├── encryptedContent
    └── lastSaved`} />
      </div>

      <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-12 mb-4">
        2. High-Capacity Document Storage Matrix
      </h3>

      <p className="text-slate-700 dark:text-slate-300 mb-4">
        Firestore heavily invokes strict 1MB operational file limitations actively preventing bulk attachments integrating standard pipelines. FORTISMail circumvents utilizing multi-layer logical components:
      </p>

      <div className="mb-10 overflow-hidden rounded-xl bg-[#0f172a]">
        <CodeBlock language="typescript" code={`EXECUTION LAYER PIPELINE:
────────────────────────────────────────────────────────
1. Browser engines automatically generate transient AES variables natively.
2. Heavy byte clusters process sequentially enclosed entirely by AES formats.
3. Blind segments transfer up via Cloud Storage nodes returning explicit {URLs}.
4. Render components synthesize {URL} coordinates alongside extraction properties.
   └──▶ Appends integrated payloads combining tiny text structures flawlessly.
5. Standard architectural routines execute core E2EE loops securely protecting paths.
6. The radically optimized payload distributes reliably across normal Database clusters.
────────────────────────────────────────────────────────`} />
      </div>

      <div className="mb-12">
        <Callout type="info" title="Computational Efficiency Gains">
          The Cloud Storage domains inherently shoulder large incomprehensible encrypted objects logically while Firestore manages lightning-fast route coordinations solely. Together, components deploy unconstrained cryptographic data flows efficiently.
        </Callout>
      </div>

      <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-12 mb-6 border-t border-slate-200 dark:border-slate-800 pt-10">
        Fundamental Application Policies
      </h2>

      <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-8 mb-4">
        1. Context Implementations Contrasting Redux
      </h3>
      <p className="text-slate-700 dark:text-slate-300 mb-6">
        Absolute secrecy dependencies define uncompromisable bounds storing valid Private variables within operating memory limits exclusively. <strong>Centralizing states via Redux permanently corrupts the infrastructure natively.</strong>
      </p>

      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mb-10 shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#f8fafc] dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            <tr>
              <th className="px-6 py-4 font-bold border-b border-slate-200 dark:border-slate-700">Observation Field</th>
              <th className="px-6 py-4 font-bold border-b border-slate-200 dark:border-slate-700">Redux Management</th>
              <th className="px-6 py-4 font-bold border-b border-slate-200 dark:border-slate-700">React Hook Closure (Context)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <td className="px-6 py-4 font-semibold">Visibility Spectrum</td>
              <td className="px-6 py-4 text-slate-600 dark:text-slate-300">Centralized globally authorizing debug visibility arrays.</td>
              <td className="px-6 py-4 text-slate-600 dark:text-slate-300">Hard-isolated physically blocking external object variables reliably.</td>
            </tr>
            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <td className="px-6 py-4 font-semibold">Key Decoupling Vulnerability</td>
              <td className="px-6 py-4 text-slate-600 dark:text-slate-300 text-rose-500 font-bold">ELEVATED EXTREME (Extensions blindly access core window metrics).</td>
              <td className="px-6 py-4 text-slate-600 dark:text-slate-300 text-[#43cc25] font-bold">CONTROLLED (Hardware memory clears upon application tab closures explicitly).</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-12 mb-4">
        2. Absolute Key Revocation Defenses
      </h3>
      
      <div className="mb-12">
        <Callout type="warning" title="No Server Reset Functionality Supported">
           <strong>Forgot Password flows do not exist logically nor physically.</strong> Because the master cryptographic entity remains purely derived off user strings mathematically via PBKDF2 configurations, failure replicating fundamental strings means previous extraction arrays cannot align securely. All preceding materials lock forever inherently preserving security metrics by removing potential manipulation checkpoints completely.
        </Callout>
      </div>

    </div>
  );
}

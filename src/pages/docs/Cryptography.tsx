export default function Cryptography() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white uppercase">KIẾN TRÚC MẬT MÃ HỌC CHUYÊN SÂU</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">CHƯƠNG 2 (DEEP CRYPTOGRAPHY)</p>
        <div className="bg-[#43cc25]/10 dark:bg-[#43cc25]/10 border-l-4 border-[#43cc25] p-3 rounded-r-lg mt-2">
           <span className="text-sm font-mono text-corporate-700 dark:text-corporate-300">Reference: src/utils/cryptoAuth.ts</span>
        </div>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
        <p>Hệ thống bảo mật của FortisMail là sự kết hợp hoàn hảo giữa mã hóa đối xứng (tốc độ cao) và bất đối xứng (quản lý khóa an toàn). Hệ thống chia làm 4 trụ cột chính:</p>
        
        <h3 className="text-xl font-bold mt-8 border-b border-slate-200 dark:border-slate-800 pb-2">2.1. Quản lý Khóa Định danh (Identity Key Management)</h3>
        <p>Mỗi người dùng sở hữu 2 cặp khóa độc lập (Curve P-256):</p>
        <ol className="list-decimal pl-6 space-y-2 mt-4 text-slate-700 dark:text-slate-300">
          <li><strong>ECDSA Key Pair (Ký số):</strong> <code>importPrivateKeyForECDSA</code> / <code>importPublicKeyForECDSA</code>. Dùng thuật toán SHA-256 để ký xác nhận danh tính.</li>
          <li><strong>ECDH Key Pair (Mã hóa):</strong> <code>importPrivateKeyForECDH</code> / <code>importPublicKeyForECDH</code>. Dùng để trao đổi khóa Diffie-Hellman.</li>
        </ol>

        <p className="font-bold mt-6 text- corporate-900 dark:text-white">Bảo vệ Private Key (PBKDF2 & AES-GCM):</p>
        <p>Để hiện thực hóa Zero-Knowledge, Private Key của người dùng không được gửi "trần" lên server. Hàm <code>deriveAESKey</code> sử dụng thuật toán <strong>PBKDF2</strong> (Password-Based Key Derivation Function 2) với 100,000 vòng lặp (iterations) băm mật khẩu người dùng cùng với một chuỗi Salt ngẫu nhiên để tạo ra khóa Master AES-256.</p>
        <pre className="bg-slate-900 text-slate-300 p-4 rounded-lg overflow-x-auto text-sm border border-slate-800">
          <code>
export const deriveAESKey = async (password: string, salt: Uint8Array): Promise&lt;CryptoKey&gt; =&gt; {'{'}
  const material = enc.encode(password);
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    material,
    {'{'} name: "PBKDF2" {'}'},
    false,
    ["deriveBits", "deriveKey"]
  );

  return window.crypto.subtle.deriveKey(
    {'{'}
      name: "PBKDF2",
      salt: salt as any,
      iterations: 100000,
      hash: "SHA-256"
    {'}'},
    keyMaterial,
    {'{'} name: "AES-GCM", length: 256 {'}'},
    true,
    ["encrypt", "decrypt"]
  );
{'}'};
          </code>
        </pre>
        <p>Khóa Master này sẽ mã hóa Private Key trước khi lưu lên Firestore (<code>encryptPrivateKeys</code>).</p>

        <h3 className="text-xl font-bold mt-8 border-b border-slate-200 dark:border-slate-800 pb-2">2.2. Cơ chế Mã hóa Lai Ephemeral (Hybrid Ephemeral Encryption)</h3>
        <p>Đây là trái tim của hệ thống (<code>encryptMessageHybrid</code>). Việc mã hóa một bức thư diễn ra qua 4 bước cực kỳ chặt chẽ:</p>
        <ul className="list-none space-y-4">
           <li>
              <strong>Bước 1: Chữ ký ngữ cảnh (Context-Bound Signature)</strong><br/>
              Hệ thống không chỉ ký nội dung thư, mà ký một chuỗi bao bọc: <code>{`\${plaintext}||To:\${recipientIdentityId}||\${timestamp}`}</code>.<br/>
              <em>Ý nghĩa học thuật:</em> Ngăn chặn <strong>Replay Attack</strong> (Kẻ gian bắt gói tin cũ và gửi lại) và <strong>Surreptitious Forwarding</strong> (Nhận thư rồi bí mật chuyển tiếp cho người khác mà giữ nguyên chữ ký gốc).
           </li>
           <li>
              <strong>Bước 2: Đóng gói JSON Payload ráp nối</strong><br/>
              Gói Body, Sender Public Key, Timestamp và Chữ ký thành một JSON Object.
           </li>
           <li>
              <strong>Bước 3: Thỏa thuận khóa động (Ephemeral ECDH)</strong><br/>
              Hệ thống sinh ra một cặp khóa ECDH "dùng một lần" (Ephemeral Key). Kết hợp Ephemeral Private Key + Recipient Public Key để tính toán ra một <strong>Session Key</strong> (Khóa phiên) duy nhất cho bức thư này.
           </li>
           <li>
              <strong>Bước 4: Mã hóa khối thuật toán AES-GCM</strong><br/>
              Dùng <em>Session Key</em> mã hóa JSON Payload ở Bước 2 cùng một vector khởi tạo ngẫu nhiên (IV 12-bytes). Đầu ra cuối cùng được bọc trong định dạng ASCII Armor: <code>-----BEGIN FORTISMAIL ENCRYPTED MESSAGE-----</code>.
           </li>
        </ul>

        <h3 className="text-xl font-bold mt-8 border-b border-slate-200 dark:border-slate-800 pb-2">2.3. Giải mã và Xác thực Toàn vẹn (Decryption & Verification)</h3>
        <p>Khi người nhận mở thư (<code>decryptMessageHybrid</code>):</p>
        <ol className="list-decimal pl-6 space-y-2 mt-4 text-slate-700 dark:text-slate-300">
           <li>Trích xuất <em>Ephemeral Public Key</em> từ thư.</li>
           <li>Kết hợp nó với <em>Private Decrypt Key</em> của bản thân để tái tạo lại đúng <em>Session Key</em> ban đầu.</li>
           <li>Giải mã AES-GCM để lấy lại JSON Payload.</li>
           <li><strong>Kiểm tra tối mật:</strong> Xác minh chữ ký ECDSA (<code>verifySignature</code>). Nếu sai lệch dù chỉ 1 bit, hàm quăng lỗi ngay lập tức: <code>"CRITICAL SECURITY ALERT: Digital Signature Invalid"</code>.</li>
        </ol>

        <h3 className="text-xl font-bold mt-8 border-b border-slate-200 dark:border-slate-800 pb-2">2.4. Mã hóa Tệp Đính Kèm (E2E Attachment Encryption)</h3>
        <p>Do tệp đính kèm có thể rất lớn (vài chục MB), không thể mã hóa chung bằng bất đối xứng (quá chậm). Giải pháp trong <code>encryptFile</code>:</p>
        <ol className="list-decimal pl-6 space-y-2 mt-4 text-slate-700 dark:text-slate-300">
           <li>Tạo ngẫu nhiên một khóa AES-GCM-256 (File Key) cho mỗi tệp.</li>
           <li>Mã hóa file data (ArrayBuffer) thành Ciphertext Blob và upload lên Firebase Storage.</li>
           <li>Xuất (Export) <em>File Key</em> ra dạng Base64 và nhúng nó vào <em>AttachmentKeys</em> bên trong JSON Payload của bức thư.</li>
           <li>Chỉ người giải mã được bức thư mới lấy được <em>File Key</em> để tải và giải mã file. Firebase Storage bị mù hoàn toàn về nội dung file.</li>
        </ol>

      </div>
    </div>
  );
}

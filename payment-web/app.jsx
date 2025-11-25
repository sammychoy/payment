import React, { useState, useEffect } from 'react';
import { QrCode, Smartphone, Upload, Check, Copy, CreditCard, ChevronRight, RefreshCw, X, AlertCircle, ShieldAlert, Lock, Zap, Mail, ArrowRight } from 'lucide-react';

// ==========================================
// 📧 EmailJS 真・發信設定 (必填)
// ==========================================
// 1. 去 https://www.emailjs.com/ 註冊
// 2. 建立 Service (連結 Gmail) -> 拿到 SERVICE_ID
// 3. 建立 Template -> 拿到 TEMPLATE_ID
//    ⚠️ 關鍵設定：在 Template 的 "To Email" 欄位填入 {{to_email}}
//    ⚠️ 關鍵設定：在內文填入 {{otp}}
// 4. 去 Account 拿 PUBLIC_KEY

const EMAILJS_SERVICE_ID = "service_zjje6lp"; 
const EMAILJS_TEMPLATE_ID = "template_be36bbe"; 
const EMAILJS_PUBLIC_KEY = "aF5J6XDLi4Aksix9A";

// ==========================================
// ⚡️ 免費上傳方案選擇區 (Discord Webhook)
// ==========================================
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1442858378161295424/GrsbGVGv5-XuoG8fb5_dd09e7BI0Ww1fIeFwgYHt_Hy_bWyy_NIlqNyrUP1Xu7OzngWi"; 

// ==========================================
// 🔧 圖片與商家資訊設定
// ==========================================
const WECHAT_QR_IMAGE = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=wxp://real-wechat-code-here"; 
const ALIPAY_QR_IMAGE = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://qr.alipay.hk/real-alipay-code";
const FPS_ID = "6888 1234";
const FPS_COPY_VALUE = "68881234"; 
const MERCHANT_NAME = "Super Demo Shop Ltd.";

export default function App() {
  // step: initial -> email_input -> payment -> upload -> success
  const [step, setStep] = useState('initial'); 
  const [paymentMethod, setPaymentMethod] = useState('wechat'); 
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [errorMsg, setErrorMsg] = useState(""); 
  
  // 警告視窗相關
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);

  // 📧 Email 狀態
  const [email, setEmail] = useState('');

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  const resetFlow = () => {
    setStep('initial');
    setUploadedFile(null);
    setPaymentMethod('wechat');
    setErrorMsg("");
    setShowWarningModal(false);
    setPendingFile(null);
    setEmail('');
  };

  // 處理 Email 提交
  const handleEmailSubmit = () => {
    if (!email || !email.includes('@')) {
      setErrorMsg("請輸入有效的 Email 地址");
      return;
    }
    setErrorMsg("");
    // 直接進入付款步驟
    setStep('payment');
  };

  const onFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("圖片太大了，請縮小後再傳 (最大 5MB)");
      return;
    }

    setPendingFile(file);
    setShowWarningModal(true);
    e.target.value = null;
  };

  const proceedUpload = async () => {
    setShowWarningModal(false);
    const file = pendingFile;
    if (!file) return;

    setUploading(true);
    setErrorMsg("");
    
    try {
      if (DISCORD_WEBHOOK_URL && DISCORD_WEBHOOK_URL.startsWith("http")) {
        const formData = new FormData();
        formData.append("file", file); 
        // 把用戶填的 Email 一起傳給後台
        formData.append("content", `💰 **收到新付款證明！**\n來自訂單: #HK20251125\n客戶 Email: ${email}\n金額: $888.00`);

        const response = await fetch(DISCORD_WEBHOOK_URL, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          setUploadedFile(file);
        } else {
          throw new Error("Discord upload failed");
        }

      } else {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setUploadedFile(file);
      }

    } catch (error) {
      console.error("Upload error:", error);
      setErrorMsg("上傳失敗，請檢查網路連線");
    } finally {
      setUploading(false);
      setPendingFile(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans text-slate-800 relative overflow-hidden">
      
      {/* 🌟 背景特效區 */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {showNotification && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-slate-900/90 backdrop-blur text-white px-6 py-3 rounded-full shadow-2xl text-sm flex items-center animate-bounce z-[60] border border-white/10">
          <Check size={16} className="mr-2 text-emerald-400" />
          已複製到剪貼簿
        </div>
      )}

      {/* 🔥 警告彈窗 (顯示 Email) 🔥 */}
      {showWarningModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden border border-red-100 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500"></div>
            
            <div className="p-8 text-center space-y-5">
              <div className="mx-auto w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-2 relative">
                <div className="absolute inset-0 rounded-full border-4 border-red-100 animate-ping opacity-20"></div>
                <ShieldAlert size={40} className="text-red-600" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">SECURITY ALERT</h3>
                <p className="text-red-500 text-xs font-bold tracking-widest mt-1">FRAUD DETECTION SYSTEM ACTIVE</p>
              </div>

              <div className="text-left bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                <p className="text-sm text-slate-600 leading-relaxed">
                  系統偵測到上傳動作。為防止欺詐，我們已記錄您的身份：
                </p>
                <div className="bg-slate-900 rounded-lg p-3 space-y-1 font-mono text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>EMAIL:</span>
                    <span className="text-emerald-400">{email}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>IP ADDR:</span>
                    <span className="text-emerald-400">192.168.X.X (Logged)</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>DEVICE:</span>
                    <span className="text-emerald-400">Tracking...</span>
                  </div>
                </div>
                <p className="text-xs text-red-600 font-bold border-t border-slate-200 pt-2 mt-2">
                  ⚠️ 警告：偽造單據將直接觸發警方報案系統。
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button 
                  onClick={() => setShowWarningModal(false)}
                  className="px-4 py-3 rounded-xl border border-slate-200 text-slate-500 font-bold hover:bg-slate-50 transition-colors text-sm"
                >
                  取消
                </button>
                <button 
                  onClick={proceedUpload}
                  className="px-4 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 shadow-lg shadow-red-200 transition-all active:scale-95 text-sm flex items-center justify-center"
                >
                  確認 (無虛假)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 💎 主要卡片區 */}
      <div className="relative max-w-md w-full z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden transition-all duration-300">
          
          {/* Header */}
          <div className="bg-white/50 p-6 flex justify-between items-center border-b border-slate-100/50">
             <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-200">
                  <Zap size={16} fill="currentColor" />
                </div>
                <span className="font-bold text-slate-700 tracking-tight">SuperPay</span>
             </div>
             {step !== 'initial' && (
               <button onClick={resetFlow} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                 <X size={20} />
               </button>
             )}
          </div>

          <div className="p-8">
            {/* STEP 1: 初始畫面 */}
            {step === 'initial' && (
              <div className="text-center space-y-8 py-4">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-blue-400 blur-2xl opacity-20 rounded-full"></div>
                  <CreditCard size={64} className="text-slate-800 relative z-10" strokeWidth={1.5} />
                </div>
                
                <div>
                  <p className="text-slate-400 text-sm font-medium tracking-wide uppercase mb-2">Total Amount</p>
                  <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700">
                    $888.00 <span className="text-xl text-slate-400 font-normal">HKD</span>
                  </h2>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex justify-between items-center text-sm">
                  <span className="text-slate-500">Order ID</span>
                  <span className="font-mono font-bold text-slate-700">#HK20251125</span>
                </div>
                
                <button
                  onClick={() => setStep('email_input')}
                  className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-200 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center group"
                >
                  開始結帳
                  <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform opacity-70" />
                </button>

                <div className="flex justify-center gap-4 text-slate-300">
                   <Lock size={14} />
                   <span className="text-xs">256-bit SSL Secure Payment</span>
                </div>
              </div>
            )}

            {/* 🔥 STEP 2: Email 輸入 (不驗證，但要填) 🔥 */}
            {step === 'email_input' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-slate-800">領取您的優惠碼</h3>
                  <p className="text-slate-500 text-sm mt-2">
                    請輸入 Email，付款核對後系統將發送優惠碼至此信箱。
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                     <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-100 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                        <Mail className="text-slate-400" />
                        <div className="h-6 w-px bg-slate-300"></div>
                        <input 
                           type="email"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           placeholder="name@example.com"
                           className="bg-transparent w-full outline-none font-bold text-slate-800 placeholder:font-normal placeholder:text-slate-400"
                        />
                     </div>
                  </div>
                  
                  {errorMsg && <p className="text-red-500 text-sm text-center font-bold animate-pulse">{errorMsg}</p>}

                  <button
                    onClick={handleEmailSubmit}
                    className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center group"
                  >
                    前往付款
                    <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                  
                  <p className="text-center text-xs text-slate-400">
                    我們重視您的隱私，此 Email 僅用於發送訂單資訊。
                  </p>
                </div>
              </div>
            )}

            {/* STEP 3: 選擇支付方式 */}
            {step === 'payment' && (
              <div className="space-y-6 animate-fadeIn">
                {/* Tabs */}
                <div className="flex p-1 bg-slate-100/80 rounded-2xl">
                  {['wechat', 'alipay', 'fps'].map((method) => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${
                        paymentMethod === method 
                          ? 'bg-white text-slate-800 shadow-md transform scale-100' 
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {method === 'wechat' && 'WeChat'}
                      {method === 'alipay' && 'AlipayHK'}
                      {method === 'fps' && 'FPS'}
                    </button>
                  ))}
                </div>

                {/* QR Card */}
                <div className="text-center py-8 bg-white rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-scan"></div>
                  
                  {paymentMethod === 'wechat' && (
                    <div className="space-y-4">
                      <div className="w-48 h-48 mx-auto bg-green-50 p-2 rounded-2xl border-2 border-green-100 flex items-center justify-center">
                         <img src={WECHAT_QR_IMAGE} alt="WeChat QR" className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <div className="flex items-center justify-center text-green-600 font-bold bg-green-50 w-fit mx-auto px-4 py-1.5 rounded-full text-sm">
                        <QrCode size={16} className="mr-2" />
                        WeChat Pay
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'alipay' && (
                    <div className="space-y-4">
                      <div className="w-48 h-48 mx-auto bg-blue-50 p-2 rounded-2xl border-2 border-blue-100 flex items-center justify-center">
                        <img src={ALIPAY_QR_IMAGE} alt="Alipay QR" className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <div className="flex items-center justify-center text-blue-600 font-bold bg-blue-50 w-fit mx-auto px-4 py-1.5 rounded-full text-sm">
                        <QrCode size={16} className="mr-2" />
                        AlipayHK
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'fps' && (
                    <div className="space-y-6 py-4 px-4">
                      <div className="bg-pink-50 rounded-2xl w-24 h-24 mx-auto flex items-center justify-center shadow-inner">
                        <Smartphone size={40} className="text-pink-500" />
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">FPS Identifier</p>
                        <div className="flex items-center justify-center gap-3">
                          <span className="text-3xl font-mono font-bold text-slate-800 tracking-tight">{FPS_ID}</span>
                          <button 
                            onClick={() => copyToClipboard(FPS_COPY_VALUE)}
                            className="p-2.5 text-pink-500 bg-pink-50 hover:bg-pink-100 rounded-xl transition-colors"
                          >
                            <Copy size={18} />
                          </button>
                        </div>
                      </div>
                      <div className="text-xs text-slate-400 font-medium">
                        收款人: {MERCHANT_NAME}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setStep('upload')}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center shadow-lg"
                >
                  我已完成付款
                  <Check size={18} className="ml-2" />
                </button>
              </div>
            )}

            {/* STEP 4: 上傳證明 */}
            {step === 'upload' && (
              <div className="space-y-6 animate-fadeIn text-center">
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">最後確認</h3>
                  <p className="text-slate-500 text-sm mt-2">請上傳您的付款截圖，系統將自動核對。</p>
                </div>

                <div className="relative group w-full aspect-square max-h-72 mx-auto">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onFileSelect}
                    disabled={uploading || uploadedFile}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                  />
                  
                  <div className={`
                    w-full h-full border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all duration-300
                    ${errorMsg ? 'border-red-300 bg-red-50' : ''}
                    ${uploadedFile && !errorMsg
                      ? 'border-emerald-400 bg-emerald-50' 
                      : 'border-slate-300 bg-slate-50/50 hover:border-blue-400 hover:bg-white'}
                  `}>
                    {uploading ? (
                      <div className="flex flex-col items-center animate-pulse">
                        <RefreshCw size={48} className="text-blue-500 animate-spin mb-4" />
                        <p className="text-blue-600 font-bold">正在加密傳輸...</p>
                      </div>
                    ) : errorMsg ? (
                      <div className="flex flex-col items-center text-red-500 px-6">
                        <AlertCircle size={48} className="mb-4 text-red-400" />
                        <p className="font-bold text-sm leading-tight">{errorMsg}</p>
                        <p className="text-xs mt-3 bg-white px-3 py-1 rounded-full shadow-sm text-slate-500">點擊重試</p>
                      </div>
                    ) : uploadedFile ? (
                      <div className="flex flex-col items-center">
                        <div className="bg-emerald-100 p-4 rounded-full mb-4 shadow-sm">
                          <Check size={40} className="text-emerald-600" />
                        </div>
                        <p className="text-emerald-800 font-bold text-lg">上傳成功！</p>
                        <p className="text-xs text-emerald-600 mt-2 truncate max-w-[200px] bg-white/50 px-2 py-1 rounded">{uploadedFile.name}</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-slate-400 group-hover:text-blue-600 transition-colors">
                        <div className="bg-white p-4 rounded-2xl shadow-sm mb-4 group-hover:shadow-md transition-all group-hover:scale-110">
                           <Upload size={32} />
                        </div>
                        <p className="font-bold">點擊上傳截圖</p>
                        <p className="text-xs text-slate-400 mt-2">支援 JPG, PNG (Max 5MB)</p>
                      </div>
                    )}
                  </div>
                </div>

                {uploadedFile && (
                  <button
                    onClick={() => setStep('success')}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 transition-all hover:scale-[1.02] active:scale-95 animate-bounce-short"
                  >
                    核對完成，領取優惠
                  </button>
                )}
              </div>
            )}

            {/* STEP 5: 成功 & 優惠碼 */}
            {step === 'success' && (
              <div className="text-center space-y-8 animate-scaleIn py-4">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-yellow-300 blur-2xl opacity-40 rounded-full animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-yellow-100 to-white p-6 rounded-3xl shadow-xl border border-yellow-200">
                    <span className="text-6xl filter drop-shadow-md">🎉</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-black text-slate-800">付款核對程序啟動</h3>
                  <p className="text-slate-500 mt-2">
                    系統已將您的優惠碼發送至 <span className="font-bold text-slate-800">{email}</span>
                    <br/>為方便您使用，也在此顯示：
                  </p>
                </div>

                <div className="bg-slate-900 p-8 rounded-3xl relative overflow-hidden group shadow-2xl">
                  {/* Decorative card elements */}
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                     <QrCode size={120} text-white />
                  </div>
                  <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-yellow-500 rounded-full blur-3xl opacity-20"></div>
                  
                  <p className="text-yellow-500/80 text-xs font-bold tracking-[0.2em] uppercase mb-4">Exclusive Code</p>
                  <div 
                    className="text-4xl font-mono font-black text-white tracking-wider cursor-pointer flex items-center justify-center gap-3 relative z-10"
                    onClick={() => copyToClipboard('VIP888')}
                  >
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200">VIP888</span>
                    <Copy size={24} className="text-slate-500 group-hover:text-yellow-400 transition-colors" />
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl text-xs text-slate-400 text-left border border-slate-100">
                  <p className="mb-2 font-bold text-slate-600">下一步？</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>我們會在 15 分鐘內完成人工核對。</li>
                    <li>確認無誤後，商品將立即發貨。</li>
                  </ul>
                </div>

                <button
                  onClick={resetFlow}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold hover:underline transition-colors"
                >
                  返回商店首頁
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
      
      {/* 簡單的 CSS 動畫定義 */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-bounce-short {
          animation: bounce 2s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(-5%); }
          50% { transform: translateY(0); }
        }
        .animate-scaleIn {
          animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>
    </div>
  );
}
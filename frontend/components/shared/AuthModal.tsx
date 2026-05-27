'use client';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { X, Lock, Mail, User, AlertCircle, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerReason?: 'document' | 'chat' | 'lawyer' | null;
  onSuccess?: () => void;
}

export default function AuthModal({ isOpen, onClose, triggerReason, onSuccess }: AuthModalProps) {
  const { login, register } = useAuth();
  const { i18n } = useTranslation();
  const isHi = i18n.language === 'hi';
  const hFont = isHi ? 'Noto Sans Devanagari, sans-serif' : 'Inter, sans-serif';

  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const getReasonText = () => {
    switch (triggerReason) {
      case 'document':
        return isHi
          ? 'कृपया एक निःशुल्क खाता बनाएं ताकि हम आपके उत्पन्न कानूनी दस्तावेजों को आपके डैशबोर्ड में सुरक्षित रूप से सहेज सकें।'
          : 'Please create a free account so we can securely save your generated legal documents to your dashboard.';
      case 'chat':
        return isHi
          ? 'इस चैट इतिहास को सहेजने और बाद में सुरक्षित रूप से पुनः प्राप्त करने के लिए साइन अप करें।'
          : 'Sign up to save this chat history and securely retrieve it later.';
      case 'lawyer':
        return isHi
          ? 'वकील से संपर्क करने या अपॉइंटमेंट बुक करने के लिए, आपको लॉग इन होना चाहिए।'
          : 'To contact a lawyer or book an appointment, you must be logged in.';
      default:
        return isHi
          ? 'जारी रखने के लिए अपने न्यायसाथी खाते में लॉग इन करें या एक नया खाता बनाएं।'
          : 'Log in to your NyayaSaathi account or create a new one to continue.';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!username || !password || (isRegister && !email)) {
      setError(isHi ? 'कृपया सभी आवश्यक फ़ील्ड भरें।' : 'Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      let result;
      if (isRegister) {
        result = await register(username, email, password);
      } else {
        result = await login(username, password);
      }

      if (result.success) {
        onSuccess?.();
        onClose();
      } else {
        setError(result.error || (isHi ? 'प्रमाणीकरण विफल रहा।' : 'Authentication failed.'));
      }
    } catch (err) {
      setError(isHi ? 'सर्वर से कनेक्ट होने में असमर्थ।' : 'Unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(26, 26, 26, 0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 20
    }}>
      <div style={{
        background: '#FFFDFB', border: '1px solid #EAE1DA',
        borderRadius: 20, width: '100%', maxWidth: 460,
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
        position: 'relative', fontFamily: hFont,
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Header background pattern */}
        <div style={{
          background: 'linear-gradient(135deg, #923c22 0%, #732F1A 100%)',
          padding: '24px 28px', color: 'white', position: 'relative'
        }}>
          <button onClick={onClose} style={{
            position: 'absolute', top: 20, right: 20,
            background: 'rgba(255,255,255,0.15)', border: 'none',
            borderRadius: '50%', width: 28, height: 28,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'white', transition: 'all 0.2s'
          }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
             onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}>
            <X size={15} />
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <ShieldCheck size={24} />
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>
              {isRegister 
                ? (isHi ? 'नया खाता बनाएं' : 'Create Free Account') 
                : (isHi ? 'लॉग इन करें' : 'Welcome Back')}
            </h2>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', margin: 0, lineHeight: 1.5 }}>
            {getReasonText()}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '28px 28px 32px' }}>
          {error && (
            <div style={{
              background: '#FEF2F2', border: '1px solid #FEE2E2',
              borderRadius: 10, padding: '12px 14px', marginBottom: 20,
              display: 'flex', gap: 8, alignItems: 'center', color: '#B91C1C',
              fontSize: 13
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Username Input */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#3A3A3A', marginBottom: 6 }}>
              {isHi ? 'यूज़रनेम' : 'Username'}
            </label>
            <div style={{ position: 'relative' }}>
              <User size={16} color="#923c22" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder={isHi ? 'अपना यूज़रनेम दर्ज करें' : 'Enter your username'}
                required
                style={{
                  width: '100%', padding: '12px 14px 12px 40px',
                  border: '1.5px solid #EAE1DA', borderRadius: 12,
                  background: '#FFFDFB', outline: 'none', fontSize: 14,
                  transition: 'border-color 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = '#923c22'}
                onBlur={e => e.target.style.borderColor = '#EAE1DA'}
              />
            </div>
          </div>

          {/* Email Input (only for Register) */}
          {isRegister && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#3A3A3A', marginBottom: 6 }}>
                {isHi ? 'ईमेल पता' : 'Email Address'}
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#923c22" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={isHi ? 'अपना ईमेल दर्ज करें' : 'Enter your email'}
                  required={isRegister}
                  style={{
                    width: '100%', padding: '12px 14px 12px 40px',
                    border: '1.5px solid #EAE1DA', borderRadius: 12,
                    background: '#FFFDFB', outline: 'none', fontSize: 14,
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={e => e.target.style.borderColor = '#923c22'}
                  onBlur={e => e.target.style.borderColor = '#EAE1DA'}
                />
              </div>
            </div>
          )}

          {/* Password Input */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#3A3A3A', marginBottom: 6 }}>
              {isHi ? 'पासवर्ड' : 'Password'}
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#923c22" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={isHi ? 'अपना पासवर्ड दर्ज करें' : 'Enter your password'}
                required
                style={{
                  width: '100%', padding: '12px 14px 12px 40px',
                  border: '1.5px solid #EAE1DA', borderRadius: 12,
                  background: '#FFFDFB', outline: 'none', fontSize: 14,
                  transition: 'border-color 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = '#923c22'}
                onBlur={e => e.target.style.borderColor = '#EAE1DA'}
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', background: '#923c22', color: 'white',
              border: 'none', padding: '14px', borderRadius: 12,
              fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(146,60,34,0.2)', transition: 'all 0.2s',
              fontFamily: hFont, display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
            onMouseOver={e => { if (!loading) e.currentTarget.style.background = '#732F1A'; }}
            onMouseOut={e => { if (!loading) e.currentTarget.style.background = '#923c22'; }}
          >
            {loading 
              ? (isHi ? 'प्रसंस्करण...' : 'Processing...') 
              : (isRegister 
                  ? (isHi ? 'रजिस्टर करें' : 'Sign Up') 
                  : (isHi ? 'लॉग इन' : 'Log In'))}
          </button>

          <div style={{ margin: '20px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: '#EAE1DA' }}></div>
            <span style={{ fontSize: 12, color: '#6A564A', fontWeight: 600 }}>OR</span>
            <div style={{ flex: 1, height: 1, background: '#EAE1DA' }}></div>
          </div>

          <button
            type="button"
            onClick={() => {
              const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
              window.location.href = `${backendUrl}/oauth2/authorization/google`;
            }}
            style={{
              width: '100%', background: '#FFFDFB', color: '#3A3A3A',
              border: '1.5px solid #EAE1DA', padding: '14px', borderRadius: 12,
              fontWeight: 600, fontSize: 14, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              transition: 'background 0.2s', fontFamily: hFont
            }}
            onMouseOver={e => e.currentTarget.style.background = '#F9F5F1'}
            onMouseOut={e => e.currentTarget.style.background = '#FFFDFB'}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {isHi ? 'Google के साथ जारी रखें' : 'Continue with Google'}
          </button>

          {/* Switch link */}
          <div style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: '#6A564A' }}>
            {isRegister ? (
              <>
                {isHi ? 'पहले से ही एक खाता है? ' : 'Already have an account? '}
                <button
                  type="button"
                  onClick={() => { setIsRegister(false); setError(null); }}
                  style={{ background: 'none', border: 'none', color: '#923c22', fontWeight: 700, cursor: 'pointer', padding: 0, fontFamily: hFont }}
                >
                  {isHi ? 'लॉग इन करें' : 'Log In'}
                </button>
              </>
            ) : (
              <>
                {isHi ? 'खाता नहीं है? ' : "Don't have an account? "}
                <button
                  type="button"
                  onClick={() => { setIsRegister(true); setError(null); }}
                  style={{ background: 'none', border: 'none', color: '#923c22', fontWeight: 700, cursor: 'pointer', padding: 0, fontFamily: hFont }}
                >
                  {isHi ? 'खाता बनाएं' : 'Sign Up Free'}
                </button>
              </>
            )}
          </div>
        </form>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

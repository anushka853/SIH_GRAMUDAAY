import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import VoiceButton from './VoiceButton';
import { X, User, Building2, ShieldCheck, ArrowRight, UserPlus, LogIn } from 'lucide-react';

export default function LoginModal({ isOpen, onClose }) {
  const { switchRole, currentUser } = useAuth();
  const { t } = useLanguage();

  const [authMode, setAuthMode] = useState('signup');
  const [selectedRole, setSelectedRole] = useState('entrepreneur');

  // User form fields
  const [name, setName] = useState(currentUser?.name || 'Ramesh Patel');
  const [age, setAge] = useState(currentUser?.age || 34);
  const [contact, setContact] = useState(currentUser?.contact || '+91 98765 43210');
  const [address, setAddress] = useState(currentUser?.address || 'At Post Rampur, Anand Rural');
  const [village, setVillage] = useState('Rampur');
  const [block, setBlock] = useState('Anand Rural');
  const [district, setDistrict] = useState('Anand');
  const [state, setState] = useState('Gujarat');

  // Bank & Admin credentials
  const [staffId, setStaffId] = useState('BANK-ANAND-402');
  const [adminKey, setAdminKey] = useState('ADM-GOVT-SCA-99');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const userDetails = {
      name:
        selectedRole === 'entrepreneur'
          ? name
          : selectedRole === 'bank'
          ? `Officer (${staffId})`
          : 'System Administrator',
      age: Number(age),
      contact,
      address,
      staffId,
      adminKey,
      location: { villageName: village, blockName: block, districtName: district, stateName: state },
    };
    switchRole(selectedRole, userDetails);
    onClose();
  };

  const roleOptions = [
    { id: 'entrepreneur', label: t('roles.entrepreneur') || 'Entrepreneur', icon: User, color: '#059669', bg: '#DCFCE7' },
    { id: 'bank', label: t('roles.bank') || 'Bank Officer', icon: Building2, color: '#2563EB', bg: '#DBEAFE' },
    { id: 'admin', label: t('roles.admin') || 'System Admin', icon: ShieldCheck, color: '#D97706', bg: '#FEF3C7' },
  ];

  const inputStyle = {
    width: '100%',
    background: 'var(--bg-input)',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-lg)',
    padding: '0.625rem 0.875rem',
    fontSize: '0.9375rem',
    color: 'var(--text-primary)',
    outline: 'none',
    transition: 'border-color 150ms ease',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.8125rem',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    marginBottom: '0.375rem',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          boxShadow: 'var(--shadow-lg)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors z-10"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="mb-6">
            <p className="page-eyebrow mb-2">{t('login.accessPortal') || 'Access Portal'}</p>
            <h2 className="text-xl font-700" style={{ color: 'var(--text-primary)', fontWeight: 700, letterSpacing: '-0.02em' }}>
              {t('login.signInTitle') || 'Sign in to GramUday AI'}
            </h2>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              {t('login.signInDesc') || 'Multi-role authentication for entrepreneurs, bank staff & admins.'}
            </p>
          </div>

          {/* Mode Toggle */}
          <div
            className="flex p-1 rounded-xl mb-5"
            style={{ background: 'var(--bg-elevated)', gap: '0.25rem' }}
          >
            {[
              { id: 'signup', label: t('login.signUp') || 'Sign Up', icon: UserPlus },
              { id: 'login', label: t('login.logIn') || 'Log In', icon: LogIn },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setAuthMode(id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-500 transition-all"
                style={{
                  fontWeight: authMode === id ? 600 : 400,
                  background: authMode === id ? 'var(--bg-surface)' : 'transparent',
                  color: authMode === id ? 'var(--text-primary)' : 'var(--text-secondary)',
                  boxShadow: authMode === id ? 'var(--shadow-sm)' : 'none',
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>

          {/* Role Selector */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {roleOptions.map(({ id, label, icon: Icon, color, bg }) => {
              const isSelected = selectedRole === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSelectedRole(id)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-500 transition-all"
                  style={{
                    fontWeight: isSelected ? 600 : 500,
                    background: isSelected ? bg : 'transparent',
                    borderColor: isSelected ? color : 'var(--border-default)',
                    color: isSelected ? color : 'var(--text-secondary)',
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: isSelected ? color : 'var(--bg-elevated)', color: isSelected ? 'white' : 'var(--text-secondary)' }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  {label}
                </button>
              );
            })}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Entrepreneur Fields */}
            {selectedRole === 'entrepreneur' && (
              <>
                <div>
                  <label style={labelStyle}>{t('login.fullName') || 'Full Name'}</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Enter your name"
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                      onBlur={(e) => (e.target.style.borderColor = 'var(--border-default)')}
                    />
                    <VoiceButton onTranscript={(txt) => setName(txt)} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label style={labelStyle}>{t('login.age') || 'Age'}</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      required
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                      onBlur={(e) => (e.target.style.borderColor = 'var(--border-default)')}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>{t('login.contact') || 'Contact'}</label>
                    <input
                      type="text"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      required
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                      onBlur={(e) => (e.target.style.borderColor = 'var(--border-default)')}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>{t('login.address') || 'Address / Gram Panchayat'}</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                      onBlur={(e) => (e.target.style.borderColor = 'var(--border-default)')}
                    />
                    <VoiceButton onTranscript={(txt) => setAddress(txt)} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label style={labelStyle}>{t('login.village') || 'Village / Gram'}</label>
                    <input
                      type="text"
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      required
                      style={{ ...inputStyle, fontSize: '0.875rem' }}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                      onBlur={(e) => (e.target.style.borderColor = 'var(--border-default)')}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>{t('login.blockDistrict') || 'Block & District'}</label>
                    <input
                      type="text"
                      value={`${block}, ${district}`}
                      onChange={(e) => {
                        const parts = e.target.value.split(',');
                        setBlock(parts[0] || block);
                        setDistrict(parts[1]?.trim() || district);
                      }}
                      required
                      style={{ ...inputStyle, fontSize: '0.875rem' }}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                      onBlur={(e) => (e.target.style.borderColor = 'var(--border-default)')}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Bank Employee Fields */}
            {selectedRole === 'bank' && (
              <div className="space-y-3">
                <div>
                  <label style={labelStyle}>{t('login.staffId') || 'Bank Staff Employee ID'}</label>
                  <input
                    type="text"
                    value={staffId}
                    onChange={(e) => setStaffId(e.target.value)}
                    required
                    style={{ ...inputStyle, fontFamily: 'monospace' }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--border-default)')}
                  />
                </div>
                <div>
                  <label style={labelStyle}>{t('login.branch') || 'Branch / District Jurisdiction'}</label>
                  <input
                    type="text"
                    value="Anand District Lead Bank Branch"
                    disabled
                    style={{ ...inputStyle, background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}
                  />
                </div>
              </div>
            )}

            {/* System Admin Fields */}
            {selectedRole === 'admin' && (
              <div>
                <label style={labelStyle}>{t('login.adminKey') || 'Government Admin Security Key'}</label>
                <input
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  required
                  style={{ ...inputStyle, fontFamily: 'monospace' }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--border-default)')}
                />
              </div>
            )}

            <button type="submit" className="btn-primary w-full mt-2" style={{ borderRadius: 'var(--radius-lg)' }}>
              {authMode === 'signup' ? (t('login.createAccount') || 'Create Account') : (t('login.signIn') || 'Sign In')}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

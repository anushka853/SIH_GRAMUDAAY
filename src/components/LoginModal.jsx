import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import VoiceButton from './VoiceButton';
import { X, User, Building2, ShieldCheck, ArrowRight, UserPlus, LogIn, Mic } from 'lucide-react';

export default function LoginModal({ isOpen, onClose }) {
  const { switchRole, currentUser } = useAuth();
  const { t } = useLanguage();

  const [authMode, setAuthMode] = useState('signup'); // 'signup' | 'login'
  const [selectedRole, setSelectedRole] = useState('entrepreneur');
  
  // User Form fields
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
      name: selectedRole === 'entrepreneur' ? name : selectedRole === 'bank' ? `Officer (${staffId})` : 'System Administrator',
      age: Number(age),
      contact,
      address,
      staffId,
      adminKey,
      location: { villageName: village, blockName: block, districtName: district, stateName: state }
    };
    switchRole(selectedRole, userDetails);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden text-slate-900 dark:text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <span className="text-[10px] uppercase font-extrabold tracking-wider px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Multi-Role Authentication & Access Control
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">
            GramUday AI Access Portal
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Multilingual Voice & Text Input for Entrepreneurs, Bank Staff & Admins
          </p>
        </div>

        {/* Sign Up vs Log In Mode Switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl mb-5">
          <button
            type="button"
            onClick={() => setAuthMode('signup')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'signup'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            <UserPlus className="w-4 h-4 text-emerald-500" />
            <span>Multilingual Sign-Up</span>
          </button>

          <button
            type="button"
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'login'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            <LogIn className="w-4 h-4 text-blue-500" />
            <span>Secure Log In</span>
          </button>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => setSelectedRole('entrepreneur')}
            className={`py-2.5 px-2 rounded-xl text-xs font-extrabold transition-all flex flex-col items-center gap-1 ${
              selectedRole === 'entrepreneur'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Entrepreneur</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('bank')}
            className={`py-2.5 px-2 rounded-xl text-xs font-extrabold transition-all flex flex-col items-center gap-1 ${
              selectedRole === 'bank'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Bank Employee</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('admin')}
            className={`py-2.5 px-2 rounded-xl text-xs font-extrabold transition-all flex flex-col items-center gap-1 ${
              selectedRole === 'admin'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>System Admin</span>
          </button>
        </div>

        {/* Dynamic Form Content */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Entrepreneur Fields */}
          {selectedRole === 'entrepreneur' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name (Voice or Text Input)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter your name"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                  <VoiceButton onTranscript={(txt) => setName(txt)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Contact Number</label>
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Address / Gram Panchayat (Voice or Text)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                  <VoiceButton onTranscript={(txt) => setAddress(txt)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Village / Gram</label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Block & District</label>
                  <input
                    type="text"
                    value={`${block}, ${district}`}
                    onChange={(e) => {
                      const parts = e.target.value.split(',');
                      setBlock(parts[0] || block);
                      setDistrict(parts[1]?.trim() || district);
                    }}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </>
          )}

          {/* Bank Employee Fields */}
          {selectedRole === 'bank' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Bank Staff Employee ID</label>
                <input
                  type="text"
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Branch / District Jurisdiction</label>
                <input
                  type="text"
                  value="Anand District Lead Bank Branch"
                  disabled
                  className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-500 font-bold"
                />
              </div>
            </div>
          )}

          {/* System Admin Fields */}
          {selectedRole === 'admin' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Master Government Admin Security Key</label>
                <input
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl font-extrabold text-sm bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white shadow-lg transition-all flex items-center justify-center gap-2 mt-4"
          >
            <span>{authMode === 'signup' ? 'Complete Multilingual Sign-Up' : 'Log In to System Portal'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}


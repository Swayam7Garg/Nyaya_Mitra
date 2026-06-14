'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ShieldAlert, Users, Scale, Trash2, CheckCircle2, AlertCircle, ArrowLeft, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { API_BASE_URL } from '@/context/AuthContext';
import Link from 'next/link';

interface User {
  id: number;
  username: string;
  email: string;
  roles: string[];
  enabled: boolean;
  createdAt: string;
}

interface Stats {
  totalUsers: number;
  totalLawyers: number;
  proBono: number;
}

export default function AdminDashboard() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const { i18n } = useTranslation();
  const isHi = i18n.language === 'hi';
  const hFont = isHi ? 'Noto Sans Devanagari, sans-serif' : 'Inter, sans-serif';

  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }
    
    if (!user.roles.includes('ROLE_ADMIN')) {
      router.push('/');
      return;
    }

    fetchDashboardData();
  }, [user, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [statsRes, usersRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (!statsRes.ok || !usersRes.ok) {
        throw new Error(isHi 
          ? 'प्रशासक डेटा प्राप्त करने में विफल। सत्र समाप्त हो सकता है।' 
          : 'Failed to fetch admin data. Session might be expired.');
      }

      const statsData = await statsRes.json();
      const usersData = await usersRes.json();

      setStats(statsData);
      setUsers(usersData);
    } catch (err: any) {
      console.error('Admin error:', err);
      setError(err.message || (isHi ? 'एक त्रुटि हुई' : 'An error occurred'));
      if (err.message?.includes('Session') || err.message?.includes('सत्र')) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const promoteUser = async (userId: number, targetUsername: string) => {
    const confirmMsg = isHi
      ? `क्या आप वाकई ${targetUsername} को एडमिन (प्रशासक) के रूप में प्रमोट करना चाहते हैं?`
      : `Are you sure you want to promote ${targetUsername} to Admin?`;
      
    if (!confirm(confirmMsg)) return;
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/promote`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to promote user');
      fetchDashboardData();
    } catch (err) {
      alert(isHi ? 'उपयोगकर्ता को बढ़ावा देने में त्रुटि।' : 'Error promoting user.');
    }
  };

  const deleteUser = async (userId: number, targetUsername: string) => {
    const confirmMsg = isHi
      ? `क्या आप वाकई ${targetUsername} को स्थायी रूप से हटाना चाहते हैं?`
      : `Are you sure you want to permanently delete ${targetUsername}?`;
      
    if (!confirm(confirmMsg)) return;
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete user');
      fetchDashboardData();
    } catch (err) {
      alert(isHi ? 'उपयोगकर्ता को हटाने में त्रुटि।' : 'Error deleting user.');
    }
  };

  if (!user || !user.roles.includes('ROLE_ADMIN')) {
    return null;
  }

  return (
    <div style={{ flex: 1, backgroundColor: '#FCF5EF', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }} className="pt-24 pb-16 px-4">
      <div className="page-container max-w-6xl mx-auto">
        
        {/* Navigation Back Link */}
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#923c22] hover:text-[#732f1a] transition-colors"
            style={{ fontFamily: hFont }}
          >
            <ArrowLeft className="w-4 h-4" />
            {isHi ? 'मुख्य पृष्ठ पर वापस जाएं' : 'Back to Homepage'}
          </Link>
        </div>

        {/* Dashboard Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#EAE1DA]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#923c22] bg-opacity-10 rounded-2xl">
              <ShieldAlert className="w-8 h-8 text-[#923c22]" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight" style={{ fontFamily: hFont }}>
                {isHi ? 'प्रशासक नियंत्रण केंद्र' : 'Admin Control Panel'}
              </h1>
              <p className="text-sm text-[#6A564A] mt-1" style={{ fontFamily: hFont }}>
                {isHi ? 'प्लेटफ़ॉर्म आँकड़े, सदस्य अनुमतियाँ और उपयोगकर्ता भूमिकाएँ प्रबंधित करें।' : 'Monitor platform metrics, credentials, and user authorizations.'}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-3 shadow-sm" style={{ fontFamily: hFont }}>
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          {/* Card 1: Users */}
          <div className="card bg-white p-6 rounded-2xl flex items-center gap-5 border border-[#EAE1DA]">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-[#6A564A] font-semibold uppercase tracking-wider" style={{ fontFamily: hFont }}>
                {isHi ? 'कुल पंजीकृत उपयोगकर्ता' : 'Total Registered Users'}
              </p>
              <h3 className="text-3xl font-black text-gray-900 mt-1">{stats?.totalUsers ?? '-'}</h3>
            </div>
          </div>
          
          {/* Card 2: Lawyers */}
          <div className="card bg-white p-6 rounded-2xl flex items-center gap-5 border border-[#EAE1DA]">
            <div className="p-4 bg-[#923c22] bg-opacity-10 text-[#923c22] rounded-2xl">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-[#6A564A] font-semibold uppercase tracking-wider" style={{ fontFamily: hFont }}>
                {isHi ? 'कुल पंजीकृत वकील' : 'Total Lawyers Registered'}
              </p>
              <h3 className="text-3xl font-black text-gray-900 mt-1">{stats?.totalLawyers ?? '-'}</h3>
            </div>
          </div>

          {/* Card 3: Pro-Bono */}
          <div className="card bg-white p-6 rounded-2xl flex items-center gap-5 border border-[#EAE1DA]">
            <div className="p-4 bg-[#E0ECD6] text-[#455B3C] rounded-2xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-[#6A564A] font-semibold uppercase tracking-wider" style={{ fontFamily: hFont }}>
                {isHi ? 'सक्रिय प्रो-बोनो वकील' : 'Active Pro-Bono Lawyers'}
              </p>
              <h3 className="text-3xl font-black text-gray-900 mt-1">{stats?.proBono ?? '-'}</h3>
            </div>
          </div>
        </div>

        {/* User Management Section */}
        <div className="bg-white rounded-2xl border border-[#EAE1DA] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#EAE1DA] bg-white flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2" style={{ fontFamily: hFont }}>
              <Shield className="w-5 h-5 text-[#923c22]" />
              {isHi ? 'उपयोगकर्ता प्रमाणीकरण प्रबंधन' : 'User Account Directory'}
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FCF5EF] text-[#6A564A] text-xs uppercase tracking-wider font-semibold border-b border-[#EAE1DA]">
                  <th className="p-4 w-16 text-center">{isHi ? 'आईडी' : 'ID'}</th>
                  <th className="p-4">{isHi ? 'यूज़रनेम / ईमेल' : 'User profile'}</th>
                  <th className="p-4">{isHi ? 'भूमिकाएं' : 'Roles'}</th>
                  <th className="p-4">{isHi ? 'पंजीकरण तिथि' : 'Joined Date'}</th>
                  <th className="p-4 text-right">{isHi ? 'कार्रवाई' : 'Action Management'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE1DA]">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-sm text-[#6A564A] font-medium" style={{ fontFamily: hFont }}>
                      <div className="w-8 h-8 border-3 border-[#923c22] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                      {isHi ? 'उपयोगकर्ता डेटा लोड हो रहा है...' : 'Fetching directory content...'}
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-sm text-[#6A564A]" style={{ fontFamily: hFont }}>
                      {isHi ? 'कोई उपयोगकर्ता विवरण नहीं मिला।' : 'No registered users found.'}
                    </td>
                  </tr>
                ) : (
                  users.map(u => (
                    <tr key={u.id} className="hover:bg-[#FCF5EF] hover:bg-opacity-50 transition-colors">
                      <td className="p-4 text-center text-xs font-mono text-gray-400">#{u.id}</td>
                      <td className="p-4">
                        <div className="font-semibold text-gray-900 text-sm">{u.username}</div>
                        <div className="text-xs text-[#6A564A] mt-0.5">{u.email || 'N/A'}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1.5">
                          {u.roles.map(role => (
                            <span 
                              key={role} 
                              className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                                role === 'ROLE_ADMIN' 
                                  ? 'bg-[#923c22] text-white' 
                                  : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {role.replace('ROLE_', '')}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 text-xs text-[#6A564A] font-medium">
                        {new Date(u.createdAt).toLocaleDateString(isHi ? 'hi-IN' : 'en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end items-center gap-2">
                          {!u.roles.includes('ROLE_ADMIN') && (
                            <button 
                              onClick={() => promoteUser(u.id, u.username)}
                              className="px-3 py-1.5 bg-[#FCF5EF] border border-[#923c22] text-[#923c22] rounded-lg text-xs font-bold hover:bg-[#923c22] hover:text-white transition-all cursor-pointer"
                              style={{ fontFamily: hFont }}
                            >
                              {isHi ? 'एडमिन बनाएं' : 'Make Admin'}
                            </button>
                          )}
                          <button 
                            onClick={() => deleteUser(u.id, u.username)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                            title={isHi ? 'खाता हटाएं' : 'Delete Account'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

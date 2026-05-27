'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ShieldAlert, Users, Scale, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { API_BASE_URL } from '@/context/AuthContext';

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
  const { t } = useTranslation();

  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in and has ADMIN role
    if (!user) {
      router.push('/');
      return;
    }
    
    if (!user.roles.includes('ROLE_ADMIN')) {
      // Not an admin, redirect to home
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
        throw new Error('Failed to fetch admin data. Session might be expired.');
      }

      const statsData = await statsRes.json();
      const usersData = await usersRes.json();

      setStats(statsData);
      setUsers(usersData);
    } catch (err: any) {
      console.error('Admin error:', err);
      setError(err.message || 'An error occurred');
      if (err.message?.includes('Session')) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const promoteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to promote this user to Admin?')) return;
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/promote`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to promote user');
      fetchDashboardData(); // Refresh
    } catch (err) {
      alert('Error promoting user.');
    }
  };

  const deleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to permanently delete this user?')) return;
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete user');
      fetchDashboardData(); // Refresh
    } catch (err) {
      alert('Error deleting user.');
    }
  };

  if (!user || !user.roles.includes('ROLE_ADMIN')) {
    return null; // Don't flash content before redirect
  }

  return (
    <div className="min-h-screen bg-[#fdfaf6] p-8 mt-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-[#923c22] bg-opacity-10 rounded-xl">
            <ShieldAlert className="w-8 h-8 text-[#923c22]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500">Manage platform content and users</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#e0cfc8] flex items-center gap-4">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-full">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Registered Users</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</h3>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#e0cfc8] flex items-center gap-4">
            <div className="p-4 bg-[#923c22] bg-opacity-10 text-[#923c22] rounded-full">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Lawyers</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats?.totalLawyers || 0}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#e0cfc8] flex items-center gap-4">
            <div className="p-4 bg-green-50 text-green-600 rounded-full">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Pro-Bono Lawyers</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats?.proBono || 0}</h3>
            </div>
          </div>
        </div>

        {/* User Management */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e0cfc8] overflow-hidden">
          <div className="p-6 border-b border-[#e0cfc8]">
            <h2 className="text-xl font-bold text-gray-900">User Management</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm">
                  <th className="p-4 border-b border-[#e0cfc8] font-semibold">ID</th>
                  <th className="p-4 border-b border-[#e0cfc8] font-semibold">Username</th>
                  <th className="p-4 border-b border-[#e0cfc8] font-semibold">Roles</th>
                  <th className="p-4 border-b border-[#e0cfc8] font-semibold">Joined</th>
                  <th className="p-4 border-b border-[#e0cfc8] font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      Loading users...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 border-b border-[#e0cfc8] text-sm text-gray-500">#{u.id}</td>
                      <td className="p-4 border-b border-[#e0cfc8]">
                        <div className="font-medium text-gray-900">{u.username}</div>
                        <div className="text-sm text-gray-500">{u.email}</div>
                      </td>
                      <td className="p-4 border-b border-[#e0cfc8]">
                        <div className="flex gap-2">
                          {u.roles.map(role => (
                            <span 
                              key={role} 
                              className={`px-2 py-1 text-xs rounded-full font-medium ${
                                role === 'ROLE_ADMIN' 
                                  ? 'bg-[#923c22] text-white' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {role.replace('ROLE_', '')}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 border-b border-[#e0cfc8] text-sm text-gray-500">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 border-b border-[#e0cfc8]">
                        <div className="flex justify-end gap-2">
                          {!u.roles.includes('ROLE_ADMIN') && (
                            <button 
                              onClick={() => promoteUser(u.id)}
                              className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                            >
                              Make Admin
                            </button>
                          )}
                          <button 
                            onClick={() => deleteUser(u.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-5 h-5" />
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

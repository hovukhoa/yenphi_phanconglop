import React, { useState } from 'react';
import { Users, ShieldCheck, GraduationCap, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { ManagerDashboard } from './components/ManagerDashboard';
import { StudentView } from './components/StudentView';

type ViewState = 'LANDING' | 'LOGIN' | 'MANAGER' | 'STUDENT';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('LANDING');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Xử lý đăng nhập
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '2844') {
      setView('MANAGER');
      setPassword(''); // Clear password
      setError('');
    } else {
      setError('Mật khẩu không đúng. Vui lòng thử lại.');
    }
  };

  // 1. Màn hình Quản lý (Logic cũ)
  if (view === 'MANAGER') {
    return <ManagerDashboard onBack={() => setView('LANDING')} />;
  }

  // 2. Màn hình Học sinh (Placeholder)
  if (view === 'STUDENT') {
    return <StudentView onBack={() => setView('LANDING')} />;
  }

  // 3. Màn hình Đăng nhập
  if (view === 'LOGIN') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 animate-in zoom-in-95 duration-200">
          <button 
            onClick={() => { setView('LANDING'); setError(''); setPassword(''); }}
            className="text-gray-400 hover:text-gray-600 mb-6 flex items-center gap-1 text-sm font-medium transition-colors"
          >
            <ArrowLeft size={16} /> Quay lại
          </button>

          <div className="flex flex-col items-center mb-6">
            <div className="bg-blue-100 p-3 rounded-full mb-4">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Xác thực Giáo viên</h2>
            <p className="text-gray-500 text-sm mt-1">Nhập mật khẩu để truy cập quản lý</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-center text-lg tracking-widest"
                placeholder="••••"
                autoFocus
              />
              {error && <p className="text-red-500 text-sm mt-2 text-center font-medium">{error}</p>}
            </div>
            
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Truy cập <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 4. Màn hình Chính (Landing)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="text-center mb-10 animate-in fade-in slide-in-from-top-8 duration-700">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-4 tracking-tight">
          Phân Công Lớp Học
        </h1>
        <p className="text-lg text-blue-600 max-w-lg mx-auto">
          Hệ thống quản lý và phân công nhiệm vụ tự động dành cho lớp học
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl w-full">
        {/* Nút Học Sinh */}
        <button
          onClick={() => setView('STUDENT')}
          className="group relative bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1"
        >
          <div className="bg-green-100 p-4 rounded-full mb-4 group-hover:bg-green-200 transition-colors">
            <GraduationCap className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Xem Phân Công</h3>
          <p className="text-gray-500 text-sm">Dành cho Học sinh kiểm tra nhiệm vụ hàng ngày</p>
        </button>

        {/* Nút Giáo Viên */}
        <button
          onClick={() => setView('LOGIN')}
          className="group relative bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1"
        >
          <div className="bg-blue-100 p-4 rounded-full mb-4 group-hover:bg-blue-200 transition-colors">
            <ShieldCheck className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Quản Lý</h3>
          <p className="text-gray-500 text-sm">Dành cho Giáo viên thiết lập và phân chia nhiệm vụ</p>
        </button>
      </div>

      <footer className="mt-16 text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} Classroom Task Manager
      </footer>
    </div>
  );
};

export default App;
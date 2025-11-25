
import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, RefreshCw, Shuffle, AlertCircle, Loader2, Clock, Share2, FileSpreadsheet, Check, Settings2, LogOut, Save, Printer, FileText } from 'lucide-react';
import { TaskConfig, Assignment, Student, SaveAssignmentRequest } from '../types';
import { APP_CONFIG, TASK_COLORS } from '../constants';
import { fetchStudentsFromSheet, fetchTasksFromSheet, saveAssignmentsToSheet } from '../services/gasService';
import { shuffleArray } from '../utils/random';
import { TaskConfigCard } from './TaskConfigCard';
import { AssignmentResult } from './AssignmentResult';

interface ManagerDashboardProps {
  onBack: () => void;
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ onBack }) => {
  const [tasks, setTasks] = useState<TaskConfig[]>([]);
  const [allStudents, setAllStudents] = useState<string[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  
  // Date Configuration
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Loading states
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  
  const [currentDate, setCurrentDate] = useState<string>("");
  const [assignmentTime, setAssignmentTime] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Initial Data Load (Students + Tasks)
  useEffect(() => {
    const now = new Date();
    setCurrentDate(now.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' }));
    
    // Set default dates (Next Monday to Saturday)
    const nextMonday = new Date();
    nextMonday.setDate(now.getDate() + (1 + 7 - now.getDay()) % 7); // Calculate next monday
    const nextSaturday = new Date(nextMonday);
    nextSaturday.setDate(nextMonday.getDate() + 5);

    setStartDate(nextMonday.toISOString().split('T')[0]);
    setEndDate(nextSaturday.toISOString().split('T')[0]);

    const loadData = async () => {
      try {
        setIsLoadingData(true);
        setError(null);

        const [studentsData, tasksData] = await Promise.all([
          fetchStudentsFromSheet(),
          fetchTasksFromSheet()
        ]);

        setAllStudents(studentsData);

        if (tasksData.length > 0) {
          const mappedTasks: TaskConfig[] = tasksData.map((taskName, index) => ({
            id: `task-${index}`,
            name: taskName,
            requiredCount: 1,
            color: TASK_COLORS[index % TASK_COLORS.length]
          }));
          setTasks(mappedTasks);
        } else {
          setTasks([]); 
        }

      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Lỗi không xác định khi tải dữ liệu');
      } finally {
        setIsLoadingData(false);
      }
    };
    loadData();
  }, []);

  const handleTaskCountChange = (id: string, count: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, requiredCount: count } : t));
  };

  const handleReset = () => {
    setAssignments([]);
    setAssignmentTime(null);
    setSaveSuccess(false);
    setError(null);
  };

  const handleAssign = useCallback(() => {
    if (allStudents.length === 0) {
      setError("Không có dữ liệu học sinh để phân công.");
      return;
    }
    
    const totalNeeded = tasks.reduce((acc, t) => acc + t.requiredCount, 0);
    if (totalNeeded === 0) {
      alert("Vui lòng chọn số lượng học sinh cho ít nhất 1 nhiệm vụ.");
      return;
    }

    setError(null);
    setSaveSuccess(false);
    setIsProcessing(true);

    setTimeout(() => {
      const shuffledNames = shuffleArray(allStudents);
      const studentObjects: Student[] = shuffledNames.map((name, index) => ({
        id: `s-${index}`,
        name
      }));

      const newAssignments: Assignment[] = [];
      let currentIndex = 0;

      tasks.forEach(task => {
        const count = task.requiredCount;
        if (count > 0) {
            const assignedStudents = studentObjects.slice(currentIndex, currentIndex + count);
            newAssignments.push({
              taskId: task.id,
              taskName: task.name,
              color: task.color,
              students: assignedStudents
            });
            currentIndex += count;
        }
      });

      setAssignments(newAssignments);
      setAssignmentTime(new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }));
      setIsProcessing(false);
    }, 600);
  }, [allStudents, tasks]);

  const handleSaveAndPrint = async () => {
    if (!startDate || !endDate) {
      alert("Vui lòng chọn thời gian áp dụng (Từ ngày - Đến ngày)");
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
        // 1. Format data for saving
        const saveData: SaveAssignmentRequest = {
            startDate: new Date(startDate).toLocaleDateString('vi-VN'),
            endDate: new Date(endDate).toLocaleDateString('vi-VN'),
            assignments: assignments.map(a => ({
                taskName: a.taskName,
                students: a.students.map(s => s.name)
            }))
        };

        // 2. Save to Sheet
        await saveAssignmentsToSheet(saveData);
        setSaveSuccess(true);

        // 3. Trigger Print automatically (Browser handles PDF generation)
        // Delay slightly to ensure UI updates first
        setTimeout(() => {
            window.print();
        }, 500);

    } catch (err) {
        console.error(err);
        setError("Không thể lưu vào Sheet: " + (err instanceof Error ? err.message : String(err)));
    } finally {
        setIsSaving(false);
    }
  };
  
  const handleManualPrint = () => {
      window.print();
  };

  const handleCopyLink = () => {
    if (APP_CONFIG.DEPLOYMENT_URL) {
      navigator.clipboard.writeText(APP_CONFIG.DEPLOYMENT_URL);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } else {
      alert("Chưa có link Web App.");
    }
  };

  const handleOpenSheet = () => {
    if (APP_CONFIG.SHEET_URL) window.open(APP_CONFIG.SHEET_URL, '_blank');
  };

  const totalRequired = tasks.reduce((acc, t) => acc + t.requiredCount, 0);

  if (isLoadingData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-500 gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="font-medium">Đang kết nối Google Sheet...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-10 animate-in fade-in duration-300">
      
      {/* --- PRINT ONLY LAYOUT --- */}
      <div className="hidden print-only p-8 bg-white">
        <div className="text-center mb-8 border-b pb-4">
            <h1 className="text-3xl font-bold uppercase text-gray-800 mb-2">Báo Cáo Phân Công Nhiệm Vụ</h1>
            <p className="text-lg text-gray-600">
                Thời gian: <span className="font-semibold">{new Date(startDate).toLocaleDateString('vi-VN')}</span> - <span className="font-semibold">{new Date(endDate).toLocaleDateString('vi-VN')}</span>
            </p>
        </div>
        <table className="w-full border-collapse border border-gray-300">
            <thead>
                <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-3 text-left w-1/3">Nhiệm vụ</th>
                    <th className="border border-gray-300 p-3 text-left">Học sinh thực hiện</th>
                </tr>
            </thead>
            <tbody>
                {assignments.map((assign, idx) => (
                    <tr key={idx}>
                        <td className="border border-gray-300 p-3 font-semibold">{assign.taskName}</td>
                        <td className="border border-gray-300 p-3">
                            {assign.students.map(s => s.name).join(", ")}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        <div className="mt-8 text-right">
            <p className="text-sm text-gray-500">Ngày lập báo cáo: {currentDate}</p>
        </div>
      </div>

      {/* --- SCREEN ONLY LAYOUT --- */}
      <div className="no-print">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors" title="Thoát quản lý">
                  <LogOut size={20} />
                </button>
                <div className="bg-blue-600 p-2 rounded-lg text-white shadow-blue-200 shadow-md">
                  <Calendar className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h1 className="text-xl font-bold text-gray-800 leading-tight">Phân Công Nhiệm Vụ</h1>
                  <p className="text-gray-500 text-xs flex items-center gap-1">
                    Chế độ: <span className="font-semibold text-blue-600">Quản lý (Giáo viên)</span>
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-3 w-full md:w-auto">
                  <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100 text-sm">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-blue-800">{currentDate}</span>
                  </div>

                  <div className="hidden md:flex items-center gap-2">
                    {APP_CONFIG.SHEET_URL && (
                      <button onClick={handleOpenSheet} className="p-2 text-gray-500 hover:bg-green-50 hover:text-green-700 rounded-full transition-colors tooltip" title="Mở Google Sheet">
                        <FileSpreadsheet size={20} />
                      </button>
                    )}
                    {APP_CONFIG.DEPLOYMENT_URL && (
                      <button onClick={handleCopyLink} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${isCopied ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'}`}>
                        {isCopied ? <Check size={16} /> : <Share2 size={16} />}
                        {isCopied ? 'Đã copy!' : 'Copy Link'}
                      </button>
                    )}
                  </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start gap-3">
              <AlertCircle className="text-red-600 mt-0.5" />
              <div>
                <h3 className="font-bold text-red-800">Thông báo lỗi</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

           {/* Date Selection Section */}
           <section className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
             <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-gray-600" />
                Thời gian áp dụng
             </h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
                    <input 
                        type="date" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
                    <input 
                        type="date" 
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
             </div>
           </section>

          {/* Configuration Section */}
          <section className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-gray-600" />
                Số lượng học sinh
              </h2>
              <div className="text-sm bg-gray-50 px-3 py-1 rounded-lg border">
                Cần: <span className={`font-bold ${totalRequired > allStudents.length ? 'text-red-500' : 'text-blue-600'}`}>{totalRequired}</span> 
                <span className="text-gray-400 mx-1">/</span> 
                {allStudents.length} HS
              </div>
            </div>
            
            {tasks.length === 0 ? (
              <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <p>Không tìm thấy nhiệm vụ nào trong Sheet "MANAGE" cột "JOBS"</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tasks.map(task => (
                  <TaskConfigCard 
                    key={task.id} 
                    task={task} 
                    onChange={handleTaskCountChange} 
                  />
                ))}
              </div>
            )}
          </section>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2 pb-4 sticky top-16 z-40 bg-gray-50/95 backdrop-blur-sm py-2 -mx-4 px-4 border-b border-gray-100/50 lg:static lg:bg-transparent lg:border-none lg:p-0">
            <button
              onClick={handleReset}
              disabled={isProcessing || assignments.length === 0}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 transition-all shadow-sm"
            >
              <RefreshCw size={18} />
              Làm mới
            </button>
            
            <button
              onClick={handleAssign}
              disabled={isProcessing || allStudents.length === 0 || tasks.length === 0}
              className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-95 transition-all disabled:opacity-70"
            >
              {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <Shuffle size={20} />}
              {assignments.length > 0 ? 'Phân công lại' : 'Phân công ngay'}
            </button>
            
            {assignments.length > 0 && (
                <>
                <button
                    onClick={handleSaveAndPrint}
                    disabled={isSaving}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200 active:scale-95 transition-all disabled:opacity-70"
                >
                    {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    Lưu & In
                </button>
                <button
                    onClick={handleManualPrint}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all shadow-sm"
                    title="In lại kết quả"
                >
                    <Printer size={20} />
                </button>
                </>
            )}
          </div>

          {/* Results Section */}
          {assignments.length > 0 && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600 text-xs font-bold shadow-sm">✓</span>
                      <h2 className="text-xl font-bold text-gray-800">Kết quả phân công</h2>
                  </div>
                  {saveSuccess && (
                      <span className="text-green-600 text-sm font-bold flex items-center gap-1 animate-in fade-in">
                          <Check size={16} /> Đã lưu vào Sheet
                      </span>
                  )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {assignments.map(assignment => (
                    <AssignmentResult key={assignment.taskId} assignment={assignment} />
                  ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

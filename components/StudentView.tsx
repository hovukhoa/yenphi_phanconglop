
import React, { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, Loader2, User, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { fetchLatestAssignment, fetchTaskDescriptions } from '../services/gasService';
import { LatestAssignmentResponse, TaskDescriptions } from '../types';
import { TASK_COLORS } from '../constants';
import { TaskDescriptionModal } from './TaskDescriptionModal';

interface StudentViewProps {
  onBack: () => void;
}

export const StudentView: React.FC<StudentViewProps> = ({ onBack }) => {
  const [data, setData] = useState<LatestAssignmentResponse | null>(null);
  const [descriptions, setDescriptions] = useState<TaskDescriptions>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Load cả phân công và mô tả nhiệm vụ song song
        const [assignmentData, descriptionsData] = await Promise.all([
            fetchLatestAssignment(),
            fetchTaskDescriptions()
        ]);
        
        setData(assignmentData);
        setDescriptions(descriptionsData);
        
      } catch (err) {
        setError("Không thể tải dữ liệu phân công.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Hàm helper format ngày sang dd/MM/yyyy
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
        const date = new Date(dateStr);
        // Nếu không phải là ngày hợp lệ (ví dụ chuỗi text thường), trả về nguyên gốc
        if (isNaN(date.getTime())) return dateStr; 
        
        // Sử dụng Intl để format chuẩn tiếng Việt
        return new Intl.DateTimeFormat('vi-VN', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
        }).format(date);
    } catch (e) {
        return dateStr;
    }
  };

  const handleOpenDescription = (taskName: string) => {
    setSelectedTask(taskName);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors py-2"
            >
              <ArrowLeft size={20} />
              <span className="font-semibold hidden sm:inline">Quay lại</span>
            </button>
            <div className="text-center">
                <h1 className="text-lg font-bold text-gray-800 uppercase">Lịch Trực Nhật</h1>
                <p className="text-xs text-gray-500">Dành cho học sinh</p>
            </div>
            <div className="w-10"></div> {/* Spacer for alignment */}
        </div>
      </header>
      
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        
        {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-3" />
                <p>Đang tải dữ liệu phân công...</p>
            </div>
        )}

        {error && !isLoading && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                <p className="text-red-700 font-medium">{error}</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="mt-4 text-sm bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                    Thử lại
                </button>
            </div>
        )}

        {!isLoading && !data && !error && (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                <p className="text-gray-400 text-lg">Chưa có phân công nào được ghi nhận.</p>
            </div>
        )}

        {!isLoading && data && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Info Card */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                    <div className="relative z-10 text-center">
                        <p className="text-blue-100 text-sm font-medium mb-1 uppercase tracking-wide">Thời gian áp dụng</p>
                        <h2 className="text-xl md:text-2xl font-bold flex flex-wrap items-center justify-center gap-2 mt-2">
                             <Calendar className="w-5 h-5 md:w-6 md:h-6" />
                             <span>Từ {formatDate(data.startDate)}</span>
                             <span className="mx-1 font-normal text-blue-200">đến</span>
                             <span>{formatDate(data.endDate)}</span>
                        </h2>
                    </div>
                </div>

                {/* Tasks Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.tasks.map((task, index) => {
                        // Assign random color from palette
                        const colorClass = TASK_COLORS[index % TASK_COLORS.length];
                        
                        return (
                            <div key={index} className={`rounded-xl border shadow-sm bg-white overflow-hidden flex flex-col hover:shadow-md transition-shadow`}>
                                <div className={`px-4 py-3 border-b flex items-center justify-between ${colorClass}`}>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-gray-800 text-lg">{task.taskName}</h3>
                                        {/* Nút xem chi tiết mô tả */}
                                        <button 
                                            onClick={() => handleOpenDescription(task.taskName)}
                                            className="p-1 text-gray-600 hover:text-blue-600 hover:bg-white/50 rounded-full transition-colors"
                                            title="Xem mô tả công việc"
                                        >
                                            <Info size={18} />
                                        </button>
                                    </div>
                                    <span className="bg-white/40 text-gray-800 text-xs font-bold px-2 py-1 rounded-full">
                                        {task.students.length}
                                    </span>
                                </div>
                                <div className="p-4 flex-1">
                                    {task.students.length > 0 ? (
                                        <ul className="space-y-2">
                                            {task.students.map((student, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-gray-700">
                                                    <User className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                                                    <span className="font-medium">{student}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-400 italic text-sm">Không có học sinh</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        )}
      </main>

      {/* Detail Modal */}
      <TaskDescriptionModal 
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        taskName={selectedTask || ''}
        descriptions={selectedTask ? (descriptions[selectedTask] || []) : []}
      />
    </div>
  );
};
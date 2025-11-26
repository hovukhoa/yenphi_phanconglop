
import React from 'react';
import { X, CheckCircle2, ListChecks, Users, User } from 'lucide-react';

interface TaskDescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskName: string;
  descriptions: string[];
  assignedStudents?: string[];
}

export const TaskDescriptionModal: React.FC<TaskDescriptionModalProps> = ({ isOpen, onClose, taskName, descriptions, assignedStudents }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl transform transition-all scale-100 overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="bg-blue-600 px-6 py-4 flex items-center justify-between shrink-0">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <ListChecks className="w-6 h-6" />
                {taskName}
            </h3>
            <button 
                onClick={onClose}
                className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1 transition-colors"
            >
                <X size={24} />
            </button>
        </div>

        {/* Body - Scrollable */}
        <div className="p-6 overflow-y-auto">
            
            {/* Display Assigned Students if available */}
            {assignedStudents && assignedStudents.length > 0 && (
                <div className="mb-6 bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <h4 className="text-sm font-bold text-blue-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Người thực hiện
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {assignedStudents.map((student, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-blue-200 text-blue-900 shadow-sm">
                                <User className="w-4 h-4 text-blue-500" />
                                <span className="font-semibold text-sm">{student}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Mô tả chi tiết công việc
            </h4>
            
            {descriptions && descriptions.length > 0 ? (
                <ul className="space-y-3">
                    {descriptions.map((desc, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                            <span className="leading-relaxed">{desc}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-center py-6 text-gray-400 bg-gray-50 rounded-xl border border-dashed">
                    <p>Chưa có mô tả cho nhiệm vụ này.</p>
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end shrink-0">
            <button 
                onClick={onClose}
                className="px-5 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-sm"
            >
                Đóng
            </button>
        </div>
      </div>
    </div>
  );
};

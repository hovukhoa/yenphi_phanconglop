import React from 'react';
import { Assignment } from '../types';
import { UserCheck } from 'lucide-react';

interface AssignmentResultProps {
  assignment: Assignment;
}

export const AssignmentResult: React.FC<AssignmentResultProps> = ({ assignment }) => {
  return (
    <div className={`overflow-hidden rounded-xl border shadow-sm ${assignment.color.replace('bg-', 'bg-opacity-20 ')} bg-white`}>
      <div className={`px-4 py-3 border-b flex items-center justify-between ${assignment.color}`}>
        <h3 className="font-bold text-lg flex items-center gap-2">
          {assignment.taskName}
        </h3>
        <span className="text-xs font-semibold px-2 py-1 bg-white/30 rounded-full">
          {assignment.students.length} học sinh
        </span>
      </div>
      <div className="p-4">
        {assignment.students.length === 0 ? (
          <p className="text-gray-400 italic text-sm">Chưa có học sinh được phân công</p>
        ) : (
          <ul className="space-y-2">
            {assignment.students.map((student) => (
              <li key={student.id} className="flex items-center gap-2 text-gray-700">
                <UserCheck size={16} className="text-green-600" />
                <span>{student.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
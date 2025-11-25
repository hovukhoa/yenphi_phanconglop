
import { TaskConfig, TaskDescriptions } from './types';

// CẤU HÌNH LIÊN KẾT (Paste link của anh vào đây)
export const APP_CONFIG = {
  // Link Web App (Dạng https://script.google.com/macros/s/.../exec)
  DEPLOYMENT_URL: "https://script.google.com/macros/s/AKfycbzJKkW6bmwl3e9tWL3BBnt5TWr6l-gTqG56u-xvgZ-eaieU1262iyD72fnykWHYw_pshQ/exec", 
  
  // Link file Google Sheet
  SHEET_URL: "https://docs.google.com/spreadsheets/d/1tZ-tutG_E2kuAMuY_C6KRFVWeyiVOxaXCUKUm3X7V_8/edit?gid=0#gid=0" 
};

// Bảng màu để gán ngẫu nhiên/tuần tự cho các nhiệm vụ lấy từ Sheet
export const TASK_COLORS = [
  'bg-blue-100 text-blue-800 border-blue-200',
  'bg-green-100 text-green-800 border-green-200',
  'bg-purple-100 text-purple-800 border-purple-200',
  'bg-orange-100 text-orange-800 border-orange-200',
  'bg-pink-100 text-pink-800 border-pink-200',
  'bg-teal-100 text-teal-800 border-teal-200',
  'bg-indigo-100 text-indigo-800 border-indigo-200',
  'bg-yellow-100 text-yellow-800 border-yellow-200',
  'bg-red-100 text-red-800 border-red-200',
  'bg-cyan-100 text-cyan-800 border-cyan-200',
];

// Dữ liệu mẫu dùng khi chưa load được từ Sheet
export const INITIAL_TASKS: TaskConfig[] = [];

// Dữ liệu mẫu học sinh
export const MOCK_STUDENTS: string[] = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C', 'Phạm Thị D', 'Hoàng Văn E', 'Đỗ Thị F'];
// Dữ liệu mẫu nhiệm vụ (nếu không kết nối được sheet MANAGE)
export const MOCK_TASKS_DATA: string[] = ['Quét lớp (Mock)', 'Lau bảng (Mock)', 'Kê bàn ghế (Mock)'];

// Dữ liệu mẫu mô tả nhiệm vụ
export const MOCK_TASK_DESCRIPTIONS: TaskDescriptions = {
  'Quét lớp': ['Quét sạch bụi sàn nhà', 'Hốt rác đổ đúng nơi quy định', 'Sắp xếp lại chổi sau khi quét'],
  'Lau bảng': ['Giặt khăn lau sạch sẽ', 'Lau bảng sạch phấn', 'Thay nước chậu giặt khăn'],
  'Kê bàn ghế': ['Kê lại bàn ghế cho thẳng hàng', 'Nhặt rác trong ngăn bàn'],
  'Trực nhật': ['Kiểm tra điện, quạt trước khi ra về', 'Đóng cửa sổ nếu trời mưa']
};
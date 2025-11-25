
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

// Dữ liệu mẫu cho JOBS2 (Nhiệm vụ cố định)
export const MOCK_FIXED_ROLES: string[] = [
  'Lớp trưởng (LT – Lê Vy)',
  'Lớp phó học tập (LP – Kim Anh)',
  'Tổ trưởng tổ 1 (TT1 – Quân)',
  'Tổ phó tổ 1 (TP1 – Sơn)',
  'Tổ trưởng tổ 2 (TT2 – Trường)',
  'Tổ phó tổ 2 (TP2 – Hân)',
  'Tổ trưởng tổ 3 (TT3 – Chí Anh)',
  'Tổ phó tổ 3 (TP3 – Dũng)'
];

// Dữ liệu mẫu mô tả nhiệm vụ
export const MOCK_TASK_DESCRIPTIONS: TaskDescriptions = {
  'Quét lớp': ['Quét sạch bụi sàn nhà', 'Hốt rác đổ đúng nơi quy định', 'Sắp xếp lại chổi sau khi quét'],
  'Lau bảng': ['Giặt khăn lau sạch sẽ', 'Lau bảng sạch phấn', 'Thay nước chậu giặt khăn'],
  'Kê bàn ghế': ['Kê lại bàn ghế cho thẳng hàng', 'Nhặt rác trong ngăn bàn'],
  'Trực nhật': ['Kiểm tra điện, quạt trước khi ra về', 'Đóng cửa sổ nếu trời mưa'],
  'Lớp trưởng': ['Quản lý chung', 'Báo cáo sĩ số đầu giờ'],
  'Tổ trưởng': ['Thu bài tập tổ viên', 'Nhắc nhở trật tự']
};

// BẢNG ÁNH XẠ ID TRÊN SVG -> TÊN NHIỆM VỤ
export const SVG_ID_MAPPING: Record<string, string> = {
  'TRUC BANG': 'Trực bảng',
  'GOC SANG TAO': 'Góc sáng tạo',
  'BAO SI SO': 'Báo sĩ số',
  'QUAN LY TV': 'Quản lí TV',
  'GOC THU VIEN': 'Góc thư viện',
  'CUP CAU DAO': 'Cúp cầu dao',
  'CHAM SOC CAY': 'Chăm sóc cây',
  'DO RAC': 'Đổ rác',
  'TRUC NHAT': 'Trực nhật',
  'LT': 'Lớp trưởng (LT – Lê Vy)',
  'LP': 'Lớp phó học tập (LP – Kim Anh)',
  'TT1': 'Tổ trưởng tổ 1 (TT1 – Quân)',
  'TP1': 'Tổ phó tổ 1 (TP1 – Sơn)',
  'TT2': 'Tổ trưởng tổ 2 (TT2 – Trường)',
  'TP2': 'Tổ phó tổ 2 (TP2 – Hân)',
  'TT3': 'Tổ trưởng tổ 3 (TT3 – Chí Anh)',
  'TP3': 'Tổ phó tổ 3 (TP3 – Dũng)'
};

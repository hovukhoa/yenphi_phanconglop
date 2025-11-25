
import { APP_CONFIG, MOCK_STUDENTS, MOCK_TASKS_DATA, MOCK_TASK_DESCRIPTIONS, MOCK_FIXED_ROLES } from '../constants';
import { SaveAssignmentRequest, LatestAssignmentResponse, TaskDescriptions } from '../types';

/**
 * Generic function to fetch data from GAS via GET request
 */
const fetchData = async (action: string): Promise<any> => {
  if (APP_CONFIG.DEPLOYMENT_URL && APP_CONFIG.DEPLOYMENT_URL.includes("script.google.com")) {
    try {
      const separator = APP_CONFIG.DEPLOYMENT_URL.includes('?') ? '&' : '?';
      // Thêm tham số t=${Date.now()} để tránh cache trình duyệt, luôn lấy dữ liệu mới
      const url = `${APP_CONFIG.DEPLOYMENT_URL}${separator}action=${action}&t=${Date.now()}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      });

      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      return data;
    } catch (e) {
      console.warn(`Failed to fetch ${action}`, e);
      throw e;
    }
  }
  throw new Error("Invalid Deployment URL");
};

/**
 * Lấy danh sách học sinh từ Sheet TEN
 */
export const fetchStudentsFromSheet = async (): Promise<string[]> => {
  // 1. Iframe mode
  if (typeof window !== 'undefined' && window.google && window.google.script) {
    return new Promise((resolve, reject) => {
      window.google.script.run
        .withSuccessHandler(resolve)
        .withFailureHandler(reject)
        .getStudentList();
    });
  }

  // 2. Fetch API mode
  try {
    const data = await fetchData('getStudents');
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.warn("Using mock students.");
    return new Promise(resolve => setTimeout(() => resolve(MOCK_STUDENTS), 800));
  }
};

/**
 * Lấy danh sách nhiệm vụ từ Sheet MANAGE (JOBS)
 */
export const fetchTasksFromSheet = async (): Promise<string[]> => {
  // 1. Iframe mode
  if (typeof window !== 'undefined' && window.google && window.google.script) {
    return new Promise((resolve, reject) => {
      window.google.script.run
        .withSuccessHandler(resolve)
        .withFailureHandler(reject)
        .getTaskList();
    });
  }

  // 2. Fetch API mode
  try {
    const data = await fetchData('getTasks');
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.warn("Using mock tasks.");
    return new Promise(resolve => setTimeout(() => resolve(MOCK_TASKS_DATA), 800));
  }
};

/**
 * Lấy danh sách vai trò cố định từ Sheet MANAGE (JOBS2)
 */
export const fetchFixedRoles = async (): Promise<string[]> => {
  // 1. Iframe mode
  if (typeof window !== 'undefined' && window.google && window.google.script) {
    return new Promise((resolve, reject) => {
      window.google.script.run
        .withSuccessHandler(resolve)
        .withFailureHandler(reject)
        .getFixedRoles();
    });
  }

  // 2. Fetch API mode
  try {
    const data = await fetchData('getFixedRoles');
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.warn("Using mock fixed roles.");
    return new Promise(resolve => setTimeout(() => resolve(MOCK_FIXED_ROLES), 800));
  }
};

/**
 * Lấy phân công mới nhất từ Sheet PHANCONG
 */
export const fetchLatestAssignment = async (): Promise<LatestAssignmentResponse | null> => {
    // 1. Iframe mode
    if (typeof window !== 'undefined' && window.google && window.google.script) {
      return new Promise((resolve, reject) => {
        window.google.script.run
          .withSuccessHandler(resolve)
          .withFailureHandler(reject)
          .getLatestAssignment();
      });
    }
  
    // 2. Fetch API mode
    try {
      const data = await fetchData('getLatestAssignment');
      return data;
    } catch (e) {
      console.error("Lỗi lấy dữ liệu phân công:", e);
      // QUAN TRỌNG: Không dùng mock data nữa để đảm bảo tính chính xác
      throw new Error("Không thể kết nối lấy dữ liệu phân công.");
    }
  };

/**
 * Lấy mô tả nhiệm vụ từ Sheet MOTA
 */
export const fetchTaskDescriptions = async (): Promise<TaskDescriptions> => {
  // 1. Iframe mode
  if (typeof window !== 'undefined' && window.google && window.google.script) {
    return new Promise((resolve, reject) => {
      window.google.script.run
        .withSuccessHandler(resolve)
        .withFailureHandler(reject)
        .getTaskDescriptions();
    });
  }

  // 2. Fetch API mode
  try {
    const data = await fetchData('getTaskDescriptions');
    return data || {};
  } catch (e) {
    console.warn("Using mock task descriptions.");
    return new Promise(resolve => setTimeout(() => resolve(MOCK_TASK_DESCRIPTIONS), 800));
  }
};

/**
 * Lưu kết quả phân công vào Sheet PHANCONG
 */
export const saveAssignmentsToSheet = async (data: SaveAssignmentRequest): Promise<any> => {
  // 1. Iframe mode (Ưu tiên dùng cách này vì nó chạy trực tiếp trong sheet, không bị chặn CORS khi POST)
  if (typeof window !== 'undefined' && window.google && window.google.script) {
    return new Promise((resolve, reject) => {
      window.google.script.run
        .withSuccessHandler((res: any) => {
            if (res && res.error) reject(new Error(res.error));
            else resolve(res);
        })
        .withFailureHandler(reject)
        .saveAssignmentData(data);
    });
  }

  // 2. Fetch API mode (Dùng cho môi trường dev hoặc web app ngoài)
  if (APP_CONFIG.DEPLOYMENT_URL && APP_CONFIG.DEPLOYMENT_URL.includes("script.google.com")) {
      try {
        // QUAN TRỌNG: Sử dụng 'text/plain' thay vì 'application/json' để tránh Preflight Request (OPTIONS)
        // Google Apps Script Web App không xử lý OPTIONS tốt, gây lỗi CORS.
        const response = await fetch(APP_CONFIG.DEPLOYMENT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8', 
            },
            body: JSON.stringify({
                action: 'saveAssignments',
                ...data
            })
        });

        if (!response.ok) {
             throw new Error("Server trả về lỗi: " + response.status);
        }
        
        const result = await response.json();
        if (result.error) throw new Error(result.error);
        
        return result; 
      } catch (e) {
        console.error("Save failed", e);
        throw e;
      }
  }
  
  // Nếu không có URL hợp lệ
  throw new Error("Chưa cấu hình Link Web App hoặc Link không hợp lệ.");
};


export interface Student {
  id: string;
  name: string;
}

export interface TaskConfig {
  id: string;
  name: string;
  requiredCount: number;
  color: string;
}

export interface Assignment {
  taskId: string;
  taskName: string;
  students: Student[];
  color: string;
}

export interface SaveAssignmentRequest {
  startDate: string;
  endDate: string;
  assignments: {
    taskName: string;
    students: string[];
  }[];
}

export interface AssignmentData {
  taskName: string;
  students: string[];
}

export interface LatestAssignmentResponse {
  startDate: string;
  endDate: string;
  createdAt: string;
  tasks: AssignmentData[];
}

export type TaskDescriptions = Record<string, string[]>;

// Type definition for Google Apps Script client-side runner
export interface GASClient {
  script: {
    run: {
      withSuccessHandler: (callback: (data: any) => void) => {
        withFailureHandler: (callback: (error: Error) => void) => {
          [key: string]: (arg?: any) => void;
        };
      };
      [key: string]: (arg?: any) => void;
    };
  };
}

declare global {
  interface Window {
    google?: GASClient;
  }
}
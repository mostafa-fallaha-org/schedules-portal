export interface User {
  user_id: number;
  username: string;
  role: 'student' | 'instructor';
}

export interface Student {
  id: number;
  name: string;
  age: number;
  class: string;
}

export interface Instructor {
  id: number;
  name: string;
}

export interface Course {
  code: string;
  name: string;
  credits: number;
}

export interface Instructor_Course {
  instructor_id: number;
  course_code: string;
}

export interface Schedule {
  id: number;
  session_start: string;
  session_end: string;
  class: string;
  course_code: string;
  fixed: boolean;
}

export interface Program {
  id: number;
  class: string;
  weekday: string;
  course_code: string;
  start_time: string;
  end_time: string;
}

export interface Attendance {
  schedule_id: number;
  student_id: number;
  course_code: string;
  arrival_time: string;
} 
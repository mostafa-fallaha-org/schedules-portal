import { User, Instructor, Schedule, Program, Instructor_Course } from '../types';

const API_BASE = '/data-api/rest';

export async function login(username: string, password: string): Promise<User> {
  const response = await fetch(`${API_BASE}/Users?$filter=username eq '${username}' and password eq '${password}'`);
  if (!response.ok) throw new Error('Invalid credentials');
  const data = await response.json();
  return data.value[0];
}

export async function getStudentSchedules(classYear: string): Promise<Schedule[]> {
  const response = await fetch(`${API_BASE}/Schedules?$filter=class eq '${classYear}'`);
  if (!response.ok) throw new Error('Failed to fetch schedules');
  const data = await response.json();
  return data.value;
}

export async function getInstructorCourses(instructorId: number): Promise<Instructor_Course[]> {
  const response = await fetch(`${API_BASE}/Instructors_Courses?$filter=instructor_id eq ${instructorId}`);
  if (!response.ok) throw new Error('Failed to fetch instructor courses');
  const data = await response.json();
  return data.value;
}

export async function getPrograms(courseCodes: string[]): Promise<Program[]> {
  const courseFilter = courseCodes.map(code => `course_code eq '${code}'`).join(' or ');
  const response = await fetch(`${API_BASE}/Program?$filter=${courseFilter}`);
  if (!response.ok) throw new Error('Failed to fetch programs');
  const data = await response.json();
  return data.value;
}

export async function getSchedules(courseCodes: string[]): Promise<Schedule[]> {
  const courseFilter = courseCodes.map(code => `course_code eq '${code}'`).join(' or ');
  const response = await fetch(`${API_BASE}/Schedules?$filter=${courseFilter}`);
  if (!response.ok) throw new Error('Failed to fetch schedules');
  const data = await response.json();
  return data.value;
}

export async function createSchedule(schedule: Omit<Schedule, 'id'>): Promise<Schedule> {
  const response = await fetch(`${API_BASE}/Schedules`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(schedule),
  });
  if (!response.ok) throw new Error('Failed to create schedule');
  const data = await response.json();
  return data;
}

export async function getStudentDetails(studentId: number): Promise<any> {
  const response = await fetch(`${API_BASE}/Students/id/${studentId}`);
  if (!response.ok) throw new Error('Failed to fetch student details');
  const data = await response.json();
  return data;
}

export async function getInstructorDetails(instructorId: number): Promise<Instructor> {
  const response = await fetch(`${API_BASE}/Instructors/${instructorId}`);
  if (!response.ok) throw new Error('Failed to fetch instructor details');
  const data = await response.json();
  return data;
} 
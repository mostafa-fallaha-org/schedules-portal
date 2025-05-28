import {
  User,
  Instructor,
  Schedule,
  Program,
  Instructor_Course,
  Student,
  Course,
} from "../types";
import bcrypt from "bcryptjs";

const API_BASE = "/data-api/rest";

export async function login(user_id: number, password: string): Promise<User> {
  const response = await fetch(
    `${API_BASE}/Users?$filter=user_id eq ${user_id}`
  );
  if (!response.ok) throw new Error("Login Failed");

  const data = await response.json();
  const user = data.value[0];

  const match = await bcrypt.compare(password, user.password);

  if (!match) throw new Error("Invalid credentials");

  return user;
}

export async function getStudentSchedules(
  classYear: string
): Promise<Schedule[]> {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const formattedDate = yesterday.toISOString().split(".")[0] + "Z";

  const response = await fetch(
    `${API_BASE}/Schedules?$filter=class eq '${classYear}' and session_start gt ${formattedDate}`
  );
  if (!response.ok) throw new Error("Failed to fetch schedules");
  const data = await response.json();
  return data.value;
}

export async function getInstructorCourses(
  instructorId: number
): Promise<Instructor_Course[]> {
  const response = await fetch(
    `${API_BASE}/Instructors_Courses?$filter=instructor_id eq ${instructorId}`
  );
  if (!response.ok) throw new Error("Failed to fetch instructor courses");
  const data = await response.json();
  return data.value;
}

export async function getPrograms(courseCodes: string[]): Promise<Program[]> {
  const courseFilter = courseCodes
    .map((code) => `course_code eq '${code}'`)
    .join(" or ");
  const response = await fetch(`${API_BASE}/Program?$filter=${courseFilter}`);
  if (!response.ok) throw new Error("Failed to fetch programs");
  const data = await response.json();
  return data.value;
}

export async function getSchedules(courseCodes: string[]): Promise<Schedule[]> {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  // Format to ISO string, without milliseconds and timezone
  const formattedDate = yesterday.toISOString().split(".")[0] + "Z";

  const courseFilter = courseCodes
    .map((code) => `(course_code eq '${code}')`)
    .join(" or ");

  const filter = `(${courseFilter}) and session_start gt ${formattedDate}`;

  const response = await fetch(
    `${API_BASE}/Schedules?$filter=${encodeURIComponent(filter)}`
  );
  if (!response.ok) throw new Error("Failed to fetch schedules");
  const data = await response.json();
  return data.value;
}

export async function createSchedule(
  schedule: Omit<Schedule, "id">
): Promise<Schedule> {
  const response = await fetch(`${API_BASE}/Schedules`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(schedule),
  });
  if (!response.ok) throw new Error("Failed to create schedule");
  const data = await response.json();
  return data;
}

export async function getStudentDetails(studentId: number): Promise<Student> {
  const response = await fetch(`${API_BASE}/Students/id/${studentId}`);
  if (!response.ok) throw new Error("Failed to fetch student details");
  const data = await response.json();
  return data.value[0];
}

export async function getInstructorDetails(
  instructorId: number
): Promise<Instructor> {
  const response = await fetch(`${API_BASE}/Instructors/id/${instructorId}`);
  if (!response.ok) throw new Error("Failed to fetch instructor details");
  const data = await response.json();
  return data.value[0];
}

export async function deleteSchedule(scheduleId: number): Promise<number> {
  const response = await fetch(`${API_BASE}/Schedules/id/${scheduleId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete schedule");
  return scheduleId;
}

export async function getCourses(): Promise<Course[]> {
  const response = await fetch(`${API_BASE}/Courses`);
  if (!response.ok) throw new Error("Failed to fetch Courses");
  const data = await response.json();
  return data.value;
}

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Table,
  Text,
  VStack,
} from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { Schedule, Student } from "../types";
import { getStudentDetails, getStudentSchedules } from "../services/api";
import {
  formatDateFromDatetime,
  formatTimeFromDatetime,
  getWeekdayFromDatetime,
} from "@/services/dateConversionServices";

interface StudentDashboardProps {
  studentId: number;
  onLogout: () => void;
}

export default function StudentDashboard({
  studentId,
  onLogout,
}: StudentDashboardProps) {
  const [student, setStudent] = useState<Student>();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const studentData: Student = await getStudentDetails(studentId);
        setStudent(studentData);

        const data = await getStudentSchedules(studentData.class);
        setSchedules(data);
      } catch (error) {
        toaster.create({
          title: "Error fetching schedules",
          description:
            error instanceof Error ? error.message : "Failed to load schedules",
          type: "error",
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedules();
  }, [studentId]);

  return (
    <Container maxW="container.xl" py={8}>
      <VStack gap={8} align="stretch">
        <Box display="flex" justifyContent="center">
          <Box width={"25%"}></Box>
          <Heading size="5xl" fontWeight={700} width={"50%"}>
            Student Dashboard
          </Heading>
          <Button
            onClick={onLogout}
            color={"white"}
            backgroundColor={"red.800"}
            _hover={{ backgroundColor: "red.700" }}
          >
            Logout
          </Button>
        </Box>

        <Text fontSize="md" color="gray.500">
          name: {student?.name} <br />
          Class: {student?.class}
        </Text>

        <Text fontSize={"1.5rem"}>Schedules</Text>
        <Box
          borderWidth={1}
          borderRadius="lg"
          overflow="hidden"
          bg="white"
          boxShadow="sm"
        >
          <Table.Root>
            <Table.Header bg="gray.50" backgroundColor={"white"}>
              <Table.Row backgroundColor={"gray.700"}>
                <Table.ColumnHeader fontWeight={700}>
                  Weekday
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight={700}>Date</Table.ColumnHeader>
                <Table.ColumnHeader fontWeight={700}>Course</Table.ColumnHeader>
                <Table.ColumnHeader fontWeight={700}>Class</Table.ColumnHeader>
                <Table.ColumnHeader fontWeight={700}>
                  Start Time
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight={700}>
                  End Time
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight={700}>Type</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {isLoading ? (
                <Table.Row>
                  <Table.Cell colSpan={7} textAlign="center">
                    Loading schedules...
                  </Table.Cell>
                </Table.Row>
              ) : schedules.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={7} textAlign="center">
                    No schedules found
                  </Table.Cell>
                </Table.Row>
              ) : (
                schedules.map((schedule) => (
                  <Table.Row key={schedule.id}>
                    <Table.Cell>
                      {getWeekdayFromDatetime(schedule.session_start)}
                    </Table.Cell>
                    <Table.Cell>
                      {formatDateFromDatetime(schedule.session_start)}
                    </Table.Cell>
                    <Table.Cell>{schedule.course_code}</Table.Cell>
                    <Table.Cell>{schedule.class}</Table.Cell>
                    <Table.Cell>
                      {formatTimeFromDatetime(schedule.session_start)}
                    </Table.Cell>
                    <Table.Cell>
                      {formatTimeFromDatetime(schedule.session_end)}
                    </Table.Cell>
                    <Table.Cell>
                      {schedule.fixed ? "Fixed" : "Not Fixed"}
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>
        </Box>
      </VStack>
    </Container>
  );
}

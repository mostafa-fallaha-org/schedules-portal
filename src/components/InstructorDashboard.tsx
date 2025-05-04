import { Toaster, toaster } from "@/components/ui/toaster";
import {
  formatDateFromDatetime,
  formatTimeFromDatetime,
  getWeekdayFromDatetime,
} from "@/services/dateConversionServices";
import {
  Box,
  Button,
  Container,
  Field,
  HStack,
  Heading,
  Input,
  Portal,
  RadioGroup,
  Select,
  Table,
  Text,
  VStack,
  createListCollection,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MdDeleteForever } from "react-icons/md";
import {
  createSchedule,
  deleteSchedule,
  getInstructorCourses,
  getInstructorDetails,
  getSchedules,
} from "../services/api";
import { Instructor, Instructor_Course, Schedule } from "../types";

interface InstructorDashboardProps {
  instructorId: number;
  onLogout: () => void;
}

export default function InstructorDashboard({
  instructorId,
  onLogout,
}: InstructorDashboardProps) {
  const [instructor, setInstructor] = useState<Instructor>();
  const [instructorCourses, setInstructorCourses] = useState<
    Instructor_Course[]
  >([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectValue, setSelectValue] = useState<string[]>([]);
  const [dateValue, setDateValue] = useState<string>("");
  const [startTimeValue, setStartTimeValue] = useState<string>("");
  const [endTimeValue, setEndTimeValue] = useState<string>("");
  const [radioValue, setRadioValue] = useState<string | null>(null);
  const [courses, setCourses] = useState<string>("");
  const [toast, setToast] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const instructorData: Instructor = await getInstructorDetails(
          instructorId
        );
        setInstructor(instructorData);

        const coursesData = await getInstructorCourses(instructorId);
        setInstructorCourses(coursesData);

        const courseCodes = coursesData.map((course) => course.course_code);
        setCourses(courseCodes.join(" - "));

        const schedulesData = await getSchedules(courseCodes);
        setSchedules(schedulesData);
      } catch (error) {
        toaster.create({
          title: "Error fetching data",
          description:
            error instanceof Error ? error.message : "Failed to load data",
          type: "error",
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [instructorId, toast]);

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !selectedCourse ||
      !selectedClass ||
      !dateValue ||
      !startTimeValue ||
      !endTimeValue ||
      !radioValue
    ) {
      const t = toaster.create({
        title: "Please fill all the fields",
        type: "error",
        duration: 3000,
      });
      setToast(t);
      return;
    }

    try {
      const newSchedule = await createSchedule({
        session_start: startTimeValue,
        session_end: endTimeValue,
        class: selectedClass,
        course_code: selectedCourse,
        fixed: radioValue === "Fixed" ? true : false,
      });

      setSchedules([...schedules, newSchedule]);
      setIsLoading(true);
      const t = toaster.create({
        title: "Schedule created",
        type: "success",
        duration: 3000,
      });
      setToast(t);

      setSelectedCourse("");
      setSelectedClass("");
      setSelectValue([]);
      setDateValue("");
      setStartTimeValue("");
      setEndTimeValue("");
      setRadioValue(null);
    } catch (error) {
      toaster.create({
        title: "Error creating schedule",
        description:
          error instanceof Error ? error.message : "Failed to create schedule",
        type: "error",
        duration: 5000,
      });
    }
  };

  const handleDeleteSchedule = async (scheduleId: number) => {
    const deletedSchedule = await deleteSchedule(scheduleId);
    setIsLoading(true);
    if (deletedSchedule) {
      const t = toaster.create({
        title: "Schedule Deleted",
        type: "success",
        duration: 3000,
      });
      setToast(t);
    } else {
      const t = toaster.create({
        title: "Failed to delete schedule",
        type: "error",
        duration: 3000,
      });
      setToast(t);
    }
  };

  const coursesCollection = createListCollection({
    items: instructorCourses.map((c) => ({
      value: c.course_code,
      label: c.course_code,
    })),
  });

  const classesCollection = createListCollection({
    items: instructorCourses
    .filter(c => c.course_code === selectedCourse)
    .map((c) => ({
      value: c.class,
      label: c.class,
    })),
  });

  return (
    <Container maxW="container.xl" py={8}>
      <Toaster />
      <VStack gap={8} align="stretch">
        <Box display="flex" justifyContent="space-between" alignItems={"end"}>
          <Box width={"25%"}></Box>
          <Heading size="5xl" fontWeight={700} width={"50%"}>
            Instructor Dashboard
          </Heading>
          <Button
            onClick={onLogout}
            color={"white"}
            backgroundColor={"red.600"}
            _hover={{ backgroundColor: "red.700" }}
          >
            Logout
          </Button>
        </Box>

        <Text fontSize="md" color="gray.500">
          Name: {instructor?.name} <br />
          Courses: {courses}
        </Text>

        <Text fontSize={"1.5rem"}>Schedules</Text>
        <Box borderWidth={1} borderRadius="lg" overflow="hidden" boxShadow="sm">
          <Table.Root>
            <Table.Header>
              <Table.Row backgroundColor={"#1e88e5"}>
                <Table.ColumnHeader></Table.ColumnHeader>
                <Table.ColumnHeader fontWeight={700} color={"white"}>
                  Weekday
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight={700} color={"white"}>
                  Date
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight={700} color={"white"}>
                  Course
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight={700} color={"white"}>
                  Class
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight={700} color={"white"}>
                  Start Time
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight={700} color={"white"}>
                  End Time
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight={700} color={"white"}>
                  Type
                </Table.ColumnHeader>
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
                      <button
                        style={{ color: "red" }}
                        onClick={() => handleDeleteSchedule(schedule.id)}
                      >
                        <MdDeleteForever
                          cursor={"pointer"}
                          color="red.600"
                          size={22}
                        />
                      </button>
                    </Table.Cell>
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

        <VStack gap={4} marginTop={"2%"} width={"100%"}>
          <Field.Root required onSubmit={handleCreateSchedule}>
            <Field.Label fontSize={"1.5rem"}>Create a Schedule</Field.Label>

            <HStack width={"100%"} marginTop={"2%"}>
              <Select.Root
                collection={coursesCollection}
                value={selectedCourse ? [selectedCourse] : []}
                onValueChange={(e) => {
                  setSelectedCourse(e.items[0].value);
                  // setSelectValue(e.value);
                }}
              >
                <Select.HiddenSelect />
                <Select.Label>Course</Select.Label>
                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText placeholder="Select Course" />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>
                <Portal>
                  <Select.Positioner>
                    <Select.Content>
                      {coursesCollection.items.map((course) => (
                        <Select.Item item={course} key={course.value}>
                          {course.label}
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>

              <Select.Root
                collection={classesCollection}
                value={selectedClass ? [selectedClass] : []}
                onValueChange={(e) => {
                  setSelectedClass(e.items[0].value);
                  // setSelectValue(e.value);
                }}
              >
                <Select.HiddenSelect />
                <Select.Label>Class</Select.Label>
                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText placeholder="Select Class" />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>
                <Portal>
                  <Select.Positioner>
                    <Select.Content>
                      {classesCollection.items.map((c) => (
                        <Select.Item item={c} key={c.value}>
                          {c.label}
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>

              <Field.Root required>
                <Field.Label>Date</Field.Label>
                <Input
                  name="date"
                  type="date"
                  value={dateValue}
                  onChange={(e) => setDateValue(e.target.value)}
                />
              </Field.Root>
            </HStack>

            <HStack width={"100%"} marginTop={"2%"}>
              <Field.Root required>
                <Field.Label>Start Time</Field.Label>
                <Input
                  name="start_time"
                  type="time"
                  value={startTimeValue}
                  onChange={(e) => setStartTimeValue(e.target.value)}
                />
              </Field.Root>

              <Field.Root required>
                <Field.Label>End Time</Field.Label>
                <Input
                  name="end_time"
                  type="time"
                  value={endTimeValue}
                  onChange={(e) => setEndTimeValue(e.target.value)}
                />
              </Field.Root>

              <RadioGroup.Root
              width={"100%"}
                marginTop={"2%"}
                defaultValue="2"
                value={radioValue}
                onValueChange={(e) => setRadioValue(e.value)}
              >
                <HStack gap="6">
                  <RadioGroup.Item key={"Fixed"} value={"Fixed"}>
                    <RadioGroup.ItemHiddenInput />
                    <RadioGroup.ItemIndicator />
                    <RadioGroup.ItemText>Fixed</RadioGroup.ItemText>
                  </RadioGroup.Item>
                  <RadioGroup.Item key={"NotFixed"} value={"NotFixed"}>
                    <RadioGroup.ItemHiddenInput />
                    <RadioGroup.ItemIndicator />
                    <RadioGroup.ItemText>Not Fixed</RadioGroup.ItemText>
                  </RadioGroup.Item>
                </HStack>
              </RadioGroup.Root>
            </HStack>

            <Field.Root required marginTop={"2%"}>
              <Button
                type="submit"
                onClick={handleCreateSchedule}
                backgroundColor={"#0db39e"}
                fontWeight={700}
                _hover={{ backgroundColor: "#06d6a0" }}
              >
                Create
              </Button>
            </Field.Root>
          </Field.Root>
        </VStack>
      </VStack>
    </Container>
  );
}

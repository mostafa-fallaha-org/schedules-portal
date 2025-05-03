import { useEffect, useState } from "react";
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
import { Toaster, toaster } from "@/components/ui/toaster";
import { Schedule, Program, Instructor } from "../types";
import {
  getInstructorCourses,
  getPrograms,
  createSchedule,
  getSchedules,
  getInstructorDetails,
} from "../services/api";
import {
  formatDateFromDatetime,
  formatTimeFromDatetime,
  formatToAmPm,
  getWeekdayFromDatetime,
} from "@/services/dateConversionServices";

interface InstructorDashboardProps {
  instructorId: number;
  onLogout: () => void;
}

export default function InstructorDashboard({
  instructorId,
  onLogout,
}: InstructorDashboardProps) {
  const [instructor, setInstructor] = useState<Instructor>();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [selectValue, setSelectValue] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>();
  const [radioValue, setRadioValue] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<string>("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const instructorData: Instructor = await getInstructorDetails(
          instructorId
        );
        setInstructor(instructorData);

        const coursesData = await getInstructorCourses(instructorId);
        const courseCodes = coursesData.map((course) => course.course_code);
        setCourses(courseCodes.join(" - "));

        const programsData = await getPrograms(courseCodes);
        setPrograms(programsData);

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
    if (!selectedProgram) {
      return;
    }

    try {
      const newSchedule = await createSchedule({
        session_start: selectedDate + "T" + selectedProgram.start_time,
        session_end: selectedDate + "T" + selectedProgram.end_time,
        class: selectedProgram.class,
        course_code: selectedProgram.course_code,
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
      setSelectedProgram(null);
      setSelectValue([]);
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

  const programCollection = createListCollection({
    items: programs.map((p) => ({
      value: `${p.class} - ${p.course_code} - ${p.weekday} - ${formatToAmPm(
        p.start_time
      )} - ${formatToAmPm(p.end_time)}`,
      label: `${p.class} - ${p.course_code} - ${p.weekday} - ${formatToAmPm(
        p.start_time
      )} - ${formatToAmPm(p.end_time)}`,
      p,
    })),
  });

  return (
    <Container maxW="container.xl" py={8}>
      <Toaster />
      <VStack gap={8} align="stretch">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems={"center"}
        >
          <Box width={"25%"}></Box>
          <Heading size="5xl" fontWeight={700} width={"50%"}>
            Instructor Dashboard
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
          Name: {instructor?.name} <br />
          Courses: {courses}
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

        <VStack gap={4} marginTop={"5%"} width={"50%"}>
          <Field.Root required onSubmit={handleCreateSchedule}>
            <Field.Label fontSize={"1.5rem"}>Create a Schedule</Field.Label>
            <Select.Root
              marginTop={"2%"}
              collection={programCollection}
              value={selectValue}
              onValueChange={(e) => {
                setSelectedProgram(e.items[0].p);
                setSelectValue(e.value);
              }}
            >
              <Select.HiddenSelect />
              <Select.Label>Select Program</Select.Label>
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Select Program" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {programCollection.items.map((program) => (
                      <Select.Item item={program} key={program.value}>
                        {program.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>

            <Field.Root required marginTop={"1%"}>
              <Field.Label>Start Time</Field.Label>
              <Input
                name="start_time"
                type="date"
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </Field.Root>

            <RadioGroup.Root
              marginTop={"1%"}
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

            <Field.Root required marginTop={"2%"}>
              <Button
                type="submit"
                onClick={handleCreateSchedule}
                backgroundColor={"#06d6a0"}
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

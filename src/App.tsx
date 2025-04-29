import { useState } from 'react'
import { Box, Button, DataList } from '@chakra-ui/react'

interface Student {
  id: number
  name: string
  age: number
  class: string
}

function App() {
  const [students, setStudents] = useState<Student[]>([])

  async function getStudents() {
    const endpoint = '/data-api/rest/Students';
    const response = await fetch(endpoint);
    const data = await response.json();
    console.table(data.value);
    setStudents(data.value)
  }

  return (
    <Box>
      <Button onClick={getStudents}>Click</Button>
      <DataList.Root orientation="horizontal" width={"50%"}>
        {students.map(student => (
          <DataList.Item key={student.id}>
            <DataList.ItemLabel>{student.name}</DataList.ItemLabel>
            <DataList.ItemValue>{student.age}</DataList.ItemValue>
            <DataList.ItemValue>{student.class}</DataList.ItemValue>
          </DataList.Item>
        ))}
      </DataList.Root>
    </Box>
  )
}

export default App

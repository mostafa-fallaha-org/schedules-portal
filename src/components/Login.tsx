import { useState } from "react";
import {
  Box,
  Button,
  Input,
  VStack,
  Heading,
  Container,
  Field,
} from "@chakra-ui/react";
import { Toaster, toaster } from "@/components/ui/toaster";
import { login } from "../services/api";
import { User } from "../types";

interface LoginProps {
  onLogin: (user: User) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = await login(username, password);
      onLogin(user);
      toaster.create({
        title: "Login successful",
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      toaster.create({
        title: "Login failed",
        description:
          error instanceof Error
            ? error.message
            : "Please check your credentials",
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.sm" py={10}>
      <Toaster />
      <Box p={8} borderWidth={1} borderRadius="lg" boxShadow="lg" bg="white">
        <VStack gap={4} as="form" onSubmit={handleSubmit}>
          <Heading size="lg" color={"black"}>
            University Portal Login
          </Heading>

          <Field.Root required>
            <Field.Label color={"black"}>Username</Field.Label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              color={"black"}
            />
          </Field.Root>

          <Field.Root required>
            <Field.Label color={"black"}>Password</Field.Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              color={"black"}
            />
          </Field.Root>

          <Button
            type="submit"
            colorScheme="blue"
            width="sm"
            loading={isLoading}
            color={"black"}
            borderColor={"black"}
            _hover={{ backgroundColor: "black", color: "white" }}
          >
            Login
          </Button>
        </VStack>
      </Box>
    </Container>
  );
}

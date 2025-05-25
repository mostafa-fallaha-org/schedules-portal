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
      const user = await login(parseInt(username), password);
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
    <Container
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      minHeight={"70vh"}
    >
      <Box
        width={"40%"}
        padding={8}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
      >
        <VStack gap={4} as="form" onSubmit={handleSubmit}>
          <Heading
            size="lg"
            color={"black"}
            fontSize={"1.5rem"}
            fontWeight={700}
          >
            Login
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
            width="40%"
            loading={isLoading}
            color={"whilde"}
            backgroundColor={"#1e88e5"}
            _hover={{ backgroundColor: "#1976d2" }}
          >
            Login
          </Button>
        </VStack>
        <Toaster />
      </Box>
    </Container>
  );
}

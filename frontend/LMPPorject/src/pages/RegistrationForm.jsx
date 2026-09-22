import { useState } from "react";
import { Box } from "@chakra-ui/react";
import MiniTestPage from "../components/Registration/MiniTestPage";
import RegistrationFormContent  from "../components/Registration/Registration.jsx";

export default  function RegistrationForm() {
  const [step, setStep] = useState("test"); // "test" | "form"

  if (step === "form") {
    return (
      <Box bg="#f8f9fb" color="#2d2d3a" minH="100vh">
        <RegistrationFormContent />
      </Box>
    );
  }

  return (
    <Box bg="#f8f9fb" color="#2d2d3a" minH="100vh">
      <Box maxW="6xl" mx="auto" px={6}>
        <MiniTestPage onFinish={() => setStep("form")} />
      </Box>
    </Box>
  );
}



import { Box } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion.create(Box);

export default function Section({  children, pt,pb,py,mt, mb,}) {
  return (
    <MotionBox
      pt={pt}
      pb={pb}
      py={py}
      mt={mt}
      mb={mb}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </MotionBox>
  );
}


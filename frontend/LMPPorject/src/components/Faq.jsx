import { Box, Text } from "@chakra-ui/react";
import CustomAccordion from "./ui/Accordion";

export default function FAQ() {
  const items = [
    {
      value: "a",
      title: "Как проходят занятия?",
      text: "Занятия проходят онлайн: Zoom или Google Meet. Используем интерактивные материалы, разговорную практику и упражнения под ваш уровень"
    },
    {
      value: "b",
      title: "Подходит ли курс для новичков?",
      text: "Да. Я объясняю простым языком, без перегрузки грамматикой. Начинаем с базовых тем и постепенно усложняем."
    },
    {
      value: "c",
      title: "Сколько нужно уроков, чтобы увидеть результат?",
      text: "Первые изменения заметны уже через 2–3 недели регулярных занятий."
    }
  ];

  return (
    <Box id="faq" py={20}>
      <Box maxW="3xl" mx="auto" px={6}>
        <Text
          fontSize="4xl"
          fontWeight="black"
          textAlign="center"
          mb={12}
          color="#2d2d3a"
        >
          Частые вопросы
        </Text>
        <CustomAccordion items={items} />
      </Box>
    </Box>
  );
}

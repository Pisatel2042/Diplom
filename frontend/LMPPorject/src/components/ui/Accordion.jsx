import { Accordion, Box } from "@chakra-ui/react";

export default function CustomAccordion({ items }) {
  return (
    <Accordion.Root collapsible>
      {items.map((item) => (
        <Accordion.Item key={item.value} value={item.value} border="none" mb={3}>
          <Accordion.ItemTrigger
            px={5}
            py={4}
            bg="white"
            borderRadius="16px"
            boxShadow="0 4px 20px rgba(0,0,0,0.06)"
            _hover={{ transform: "translateY(-1px)", boxShadow: "0 6px 24px rgba(0,0,0,0.10)" }}
            transition="all 0.2s"
            style={{ border: "none" }}
          >
            <Box flex="1" textAlign="left" fontSize="md" fontWeight="bold" color="#2d2d3a">
              {item.title}
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>

          <Accordion.ItemContent>
            <Accordion.ItemBody px={5} py={4} color="#6b6b80" fontSize="sm" lineHeight="relaxed">
              {item.text}
            </Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}

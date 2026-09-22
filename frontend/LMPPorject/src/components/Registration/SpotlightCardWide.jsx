import { Box, Flex, Image } from "@chakra-ui/react";

export default function SpotlightCardWide({gif, children}) {
  return (
    <Flex
      bg="gray.800"
      borderRadius="24px"
      w="100%"
      maxW="1100px"
      mx="auto"
      overflow="visible"
      boxShadow="0 8px 30px rgba(0,0,0,0.15)"
    >
    
      <Box flex="1">
        <Image
          src={gif}
          alt="gif"
          borderRadius="16px"
          w="100%"
         
          objectFit="contain"
        />
      </Box>

      
       <Box flex="1" display="flex" flexDirection="column" justifyContent="center">
        {children}
      </Box>
    </Flex>
  );
}

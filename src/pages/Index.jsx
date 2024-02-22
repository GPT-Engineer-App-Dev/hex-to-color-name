import React, { useState } from "react";
import { Box, Button, Container, FormControl, FormLabel, Input, Text, VStack, Image, useToast } from "@chakra-ui/react";

const Index = () => {
  const [hexCode, setHexCode] = useState("");
  const [colorName, setColorName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleHexInputChange = (event) => {
    setHexCode(event.target.value);
  };

  const fetchColorName = async () => {
    if (!hexCode || hexCode.length !== 6) {
      toast({
        title: "Invalid Hex Code",
        description: "Please input a valid hex code without the '#' symbol.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`https://api.color.pizza/v1/${hexCode}`);
      const data = await response.json();

      if (data.colors && data.colors.length > 0) {
        setColorName(data.colors[0].name);
      } else {
        toast({
          title: "Color Not Found",
          description: "No color name found for the provided hex code.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        setColorName("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error fetching the color name.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={5}>
        <FormControl id="hex-code">
          <FormLabel>Enter HEX Code (without '#')</FormLabel>
          <Input placeholder="e.g. 00FF00" value={hexCode} onChange={handleHexInputChange} maxLength={6} />
        </FormControl>
        <Button colorScheme="blue" isLoading={isLoading} onClick={fetchColorName}>
          Translate Hex to Color Name
        </Button>
        {colorName && (
          <Box textAlign="center">
            <Text fontSize="xl" fontWeight="bold">
              Color Name: {colorName}
            </Text>
            <Box width="100px" height="100px" backgroundColor={`#${hexCode}`} mt={2} borderRadius="md" />
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default Index;

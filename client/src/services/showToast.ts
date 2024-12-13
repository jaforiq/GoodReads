import { createStandaloneToast } from "@chakra-ui/react";

const { toast } = createStandaloneToast();

export const showToast = (
  title: string,
  description: string,
  status: "success" | "error" | "loading"
) => {
  toast({
    title: title,
    description: description,
    status: status,
    position: "top-right",
    duration: 3000,
    isClosable: true,
  });
};

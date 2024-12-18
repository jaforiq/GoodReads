import apiClient from "./api-client";

export const searchBookByTitle = async (debouncedInputValue: string) => {
  try {
    const response = await apiClient.get(
      `/books/searchtitle?title=${encodeURIComponent(debouncedInputValue)}`
    );
    //console.log("Search: ", response);
    return response.data;
  } catch (err: any) {
    console.log("Error occure from search service.", err);
  }
};

export const searchBookByGenre = async (debouncedInputValue: string) => {
  try {
    const response = await apiClient.get(
      `/books/searchgenre?name=${encodeURIComponent(debouncedInputValue)}`
    );
    //console.log("Search: ", response);
    return response.data;
  } catch (err: any) {
    console.log("Error occure from search service.", err);
  }
};

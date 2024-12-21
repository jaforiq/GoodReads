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

export const searchBookByGenre = async (genreIds: number[]) => {
  try {
    const response = await apiClient.get(
      `/books/searchgenre?genreIds=${encodeURIComponent(genreIds.join(","))}`
    );
    return response.data;
  } catch (err: any) {
    console.error("Error from search service:", err);
  }
};

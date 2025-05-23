import apiClient from "./api-client";

// export const getUserReview = async (id: any, token: string) => {
//   try {
//     //console.log("rating: ", id, "tok: ", token);
//     const response = await apiClient.get(`/reviews/userreview/${id}`, {
//       headers: { authorization: `Bearer ${token}` },
//     });
//     //console.log("resp: ", response.data.userReview.rating);
//     return response.data.userReview.rating;
//   } catch (error: any) {
//     throw new Error(error.response);
//   }
// };

export const getAllReview = async (id: any) => {
  try {
    const response = await apiClient.get(`/book/${id}/reviews/`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
};

export const createUserRating = async (
  rating: number,
  id: any,
  token: string
) => {
  try {
    //console.log("createUserRating: ", rating, token);
    const response = await apiClient.post(
      `/book/${id}/reviews/`,
      { rating },
      {
        headers: { authorization: `Bearer ${token}` },
      }
    );
    //console.log("res: ", response);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
};

export const createUserReview = async (
  review: string,
  id: any,
  token: string
) => {
  try {
    const response = await apiClient.post(
      `/book/${id}/reviews/`,
      { review },
      {
        headers: { authorization: `Bearer ${token}` },
      }
    );
    //console.log("respUser: ", response);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
};

export const deleteUserReview = async (id: any, token: string) => {
  try {
    const response = await apiClient.delete(`/reviews/${id}`, {
      headers: { authorization: `Bearer ${token}` },
    });
    //console.log("respUser: ", response);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
};

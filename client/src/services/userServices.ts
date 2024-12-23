import apiClient from "./api-client";

export const userLogin = async (formData: {
  email: string;
  password: string;
}) => {
  try {
    const response = await apiClient.post("/users/", formData);
    return response.data;
  } catch (err: any) {
    console.log("Error occure from Login service.", err);
  }
};

export const createUser = async (formData: {
  username: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await apiClient.post("users/signup", formData);
    return response.data;
  } catch (err: any) {
    console.log("Error occure from SignUp service.", err);
  }
};

export const getAllUser = async (token: string) => {
  try {
    const response = await apiClient.get("/users/", {
      headers: { authorization: `Bearer ${token}` },
    });
    return response.data.users;
  } catch (err: any) {
    console.log("Error occure from SignUp service.", err);
  }
};

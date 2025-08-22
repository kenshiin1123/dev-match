import { redirect } from "react-router";

const getTokenDuration = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return 0;
  }

  const expiration: any = new Date(
    JSON.parse(atob(token.split(".")[1])).exp * 1000
  );

  const now = new Date();
  return expiration - now.getTime();
};

const getAuthToken = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return;
  }

  if (getTokenDuration() < 0) {
    return "EXPIRED";
  }

  // Expiration log
  // const durationInMs = getTokenDuration();
  // const durationInDays = Math.floor(durationInMs / (1000 * 60 * 60 * 24));
  // console.log(`Your authentication will expire in ${durationInDays} day(s).`);

  return token;
};

const getDataFromToken = () => {
  const token = getAuthToken();

  let data = JSON.parse(atob(token!.split(".")[1]));
  return data;
};

const tokenLoader = () => {
  const token = getAuthToken();
  if (!token || token == undefined || token == null || token === "EXPIRED")
    return { role: "anonymous" };
  return getDataFromToken();
};

const checkAuthLoader = () => {
  const token = getAuthToken();

  if (!token) {
    return redirect("/login");
  }

  return null;
};

const deleteAuthToken = () => {
  localStorage.removeItem("token");
};

export {
  getDataFromToken,
  getAuthToken,
  tokenLoader,
  deleteAuthToken,
  checkAuthLoader,
  getTokenDuration,
};

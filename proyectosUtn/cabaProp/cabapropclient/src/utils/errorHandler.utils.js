import messageHandler from "./messageHandler";

export const errorTypes = {
  401: "/error-401",
  500: "/error-500",
};

export const ErrorHandler = (redirect, error) => {
  if (redirect) {
    window.location.replace(`${process.env.REACT_APP_CLIENT}${redirect}`);
  } else messageHandler("error", error);
};

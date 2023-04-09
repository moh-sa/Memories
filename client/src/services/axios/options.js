import axios from "axios";

const URL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_BACK_DEV_URL
    : `https://mempapi.${window.location.hostname.split("memories.")[1]}`;
//  : process.env.REACT_APP_BACK_URL

console.log(window.location.hostname.split("memories."));
console.log(window.location.hostname.split("memories.")[1]);
console.log(
  `https://mempapi.${window.location.hostname.split("memories.")[1]}`
);

export const API = axios.create({
  baseURL: URL,
  withCredentials: true,
});

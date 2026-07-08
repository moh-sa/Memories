const apiUrl = import.meta.env.VITE_API_URL;

if (typeof apiUrl !== "string" || apiUrl.trim() === "") {
  throw new Error(
    "Missing required environment variable: VITE_API_URL. Copy client/.env.example to client/.env and set VITE_API_URL.",
  );
}

export const clientEnv = {
  apiUrl: apiUrl.replace(/\/+$/, ""),
};

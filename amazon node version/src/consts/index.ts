import TelegramBot from "node-telegram-bot-api";
// constants.ts
export const AUTH_TOKEN_TEMPLATE = "Bearer Status|logged-in|Session|{TOKEN}";

// Common headers (US version)
export const COMMON_HEADERS: Record<string, string> = {
  accept: "*/*",
  authorization: "{AUTH_TOKEN}",
  "cache-control": "no-cache",
  "content-type": "application/json",
  country: "Canada",
  iscanary: "false",
  origin: "https://hiring.amazon.ca",
  pragma: "no-cache",
  priority: "u=1, i",
  referer: "https://hiring.amazon.ca/",
  "sec-ch-ua": '"Opera";v="120", "Not-A.Brand";v="8", "Chromium";v="135"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"Windows"',
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "cross-site",
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0",
};

export function generateHeaderWithAuthToken(newToken: string) {
  // replace {TOKEN} with the new one
  const AUTH_TOKEN = AUTH_TOKEN_TEMPLATE.replace("{TOKEN}", newToken);
  const headers = { ...COMMON_HEADERS };
  headers.authorization = headers.authorization.replace("{AUTH_TOKEN}", AUTH_TOKEN);
  return headers
}

// API endpoint
export const url = "https://e5mquma77feepi2bdn4d6h3mpu.appsync-api.us-east-1.amazonaws.com/graphql";

export const createApplicationURL = "https://hiring.amazon.com/application/api/candidate-application/ds/create-application/"

export const bot = new TelegramBot("8055111234:AAFLqqfuxOcauYKAXXLlQFQQeNRVL81JubM")
export const user_ids = ["1029190869", "1826294300"]
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

export const facebookconfig = {
  facebookAppId: process.env.FACEBOOK_APP_ID,
  facebookAppSecret: process.env.FACEBOOK_APP_SECRET,
  facebookProfileURL: process.env.FACEBOOK_REDIRECT_URI,
};

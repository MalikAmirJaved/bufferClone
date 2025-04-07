import mongoose from "mongoose";

const facebookUserSchema = new mongoose.Schema({
  facebookAccessToken: String,
  facebookPageId: String,
  facebookName: String,
  facebookEmail: String,
  pageAccessToken: String,
  pageId: String,
  pageName: String,
});

export const user = mongoose.model("FacebookUser", facebookUserSchema);

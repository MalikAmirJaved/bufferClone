import axios from "axios";
import { user as User } from "../models/user.js";
import { facebookconfig } from "../config/facebook.js";

// STEP 1: Redirect to Facebook OAuth
export const facebooklogin = (req, res) => {
  const url = `https://www.facebook.com/v22.0/dialog/oauth?client_id=${facebookconfig.facebookAppId}&redirect_uri=${facebookconfig.facebookProfileURL}&scope=email,public_profile,pages_show_list,pages_read_engagement`;
  res.redirect(url);
};

// STEP 2: Handle Facebook callback
export const getFacebookUser = async (req, res) => {
  const { code } = req.query;

  const tokenUrl = `https://graph.facebook.com/v22.0/oauth/access_token?client_id=${facebookconfig.facebookAppId}&redirect_uri=${facebookconfig.facebookProfileURL}&client_secret=${facebookconfig.facebookAppSecret}&code=${code}`;

  try {
    // Step 3: Get Access Token
    const tokenRes = await axios.get(tokenUrl);
    const access_token = tokenRes.data.access_token;

    // Step 4: Get User Info
    const userInfoRes = await axios.get(
      `https://graph.facebook.com/me?fields=id,name,email&access_token=${access_token}`
    );
    const profile = userInfoRes.data;

    // Step 5: Get Pages the user manages
    const pagesRes = await axios.get(
      `https://graph.facebook.com/me/accounts?access_token=${access_token}`
    );
    const pages = pagesRes.data.data;

    console.log("✅ Facebook Pages fetched:", pages);

    if (!pages || pages.length === 0) {
      return res.status(403).json({ error: "No managed Facebook Pages found." });
    }

    const page = pages[0]; // Pick the first page or loop for all

    // Step 6: Check if user already exists
    let user = await User.findOne({ facebookPageId: profile.id });

    if (!user) {
      // New user creation
      user = await User.create({
        facebookAccessToken: access_token,
        facebookPageId: profile.id,
        facebookName: profile.name,
        facebookEmail: profile.email,
        pageAccessToken: page.access_token,
        pageId: page.id,
        pageName: page.name,
      });
    } else {
      // Update existing user
      user.facebookAccessToken = access_token;
      user.pageAccessToken = page.access_token;
      user.pageName = page.name;
      user.facebookName = profile.name;
      user.facebookEmail = profile.email;
      await user.save();
    }

    // Step 7: Redirect to frontend
    res.redirect(`http://localhost:5173/post?userId=${user._id}`); // Change to your frontend route

  } catch (error) {
    console.error("❌ Facebook callback error:", error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
};

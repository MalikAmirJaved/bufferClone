import express from "express";
import { facebooklogin, getFacebookUser } from "../controllers/facebookController.js";

const router = express.Router();

router.get("/login", facebooklogin);
router.get("/callback", getFacebookUser);

export default router;

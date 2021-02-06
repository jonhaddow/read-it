import { Router } from "express";

export const userRouter = Router();

userRouter.get("/me", (req, res) => {
	res.json({ user: req.user });
});

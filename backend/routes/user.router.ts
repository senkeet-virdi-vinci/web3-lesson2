import express from "express";
import { UsersService } from "../services/users.service.ts";
import { parseUserFilter } from "../types/user.ts";

const usersRouter = express.Router();

usersRouter.get("/", async (req, res) => {
    try {
        const filter = parseUserFilter(req.query);
        if(!filter) {
            return res.status(400).json({ error: "Invalid id" });
        }

        const users = await UsersService.getUsers(filter);
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
})

export default usersRouter;
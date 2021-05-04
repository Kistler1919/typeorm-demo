import "reflect-metadata";
import { createConnection } from "typeorm";
import express, { Request, Response } from "express";

import { User } from "./entity/User";

const app = express();

app.use(express.json());

app.post("/users", async (req: Request, res: Response) => {
  const { name, email, role } = req.body;

  try {
    const user = User.create({ name: name, email: email, role: role });

    await user.save();
    return res.status(201).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
});
app.get("/users", async (_: Request, res: Response) => {
  try {
    const users = await User.find();

    return res.json(users);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
});

createConnection()
  .then(async () => {
    app.listen(5000, () =>
      console.log("Server running @ http://localhost:5000")
    );
  })
  .catch((error) => console.log(error));

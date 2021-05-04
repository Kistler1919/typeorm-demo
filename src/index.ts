import "reflect-metadata";
import { createConnection } from "typeorm";
import express, { Request, Response } from "express";

import { User } from "./entity/User";
import { Post } from "./entity/Post";
import { validate } from "class-validator";

const app = express();

app.use(express.json());

app.post("/users", async (req: Request, res: Response) => {
  const { name, email, role } = req.body;

  try {
    const user = User.create({ name: name, email: email, role: role });

    const errors = await validate(user);

    if (errors.length > 0) throw errors;

    await user.save();
    return res.status(201).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
});
app.get("/users", async (_: Request, res: Response) => {
  try {
    const users = await User.find({ relations: ['posts'] });

    return res.json(users);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
});

app.put('/users/:uuid', async (req: Request, res: Response) => {
  const uuid = req.params.uuid;
  const { name, email, role } = req.body;

  try {
    const user = await User.findOneOrFail({ uuid });

    user.name = name;
    user.email = email;
    user.role = role;

    await user.save();
    return res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Oops! Something went wrong!' });
  }
});

app.delete('/users/:uuid', async (req: Request, res: Response) => {
  const uuid = req.params.uuid;

  try {
    const user = await User.findOneOrFail({ uuid });

    await user.remove();
    return res.status(204).json({ message: 'User deleted successfully!' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Oops! Something went wrong!' });
  }
});
app.get('/users/:uuid', async (req: Request, res: Response) => {
  const uuid = req.params.uuid;

  try {
    const user = await User.findOneOrFail({ uuid });

    return res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(404).json({ error: 'User not found!' });
  }
});

// POSTS
app.post("/posts", async (req: Request, res: Response) => {
  const { title, body, userUuid } = req.body;

  try {
    const user = await User.findOneOrFail({ uuid: userUuid });
    
    const post = new Post({ title, body, user });

    await post.save();
    return res.json(post);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

app.get("/posts", async (_: Request, res: Response) => {
  try {
    const posts = await Post.find();

    return res.json(posts);
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

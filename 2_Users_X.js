const express = require(`express`);
const app = express();
const PORT = 3000;

app.use(express.json());

let users = [
  {
    id: 1,
    name: "김철수",
    email: "chulsoo.kim@example.com",
    age: 25,
  },
];

app.get("/users", (req, res) => {
  res.json(users);
});

app.post("/users", (req, res) => {
  const { name, email, age } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: "이름과 이메일은 필수 입니다." });
  } else if (!email.includes("@")) {
    return res.status(400).json({ message: "올바른 이메일 형식이 아닙니다" });
  }
  Newuser = {
    id: users.length + 1,
    name,
    email,
    age,
  };

  users.push(Newuser);
  res.json(users);
});

app.patch("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const UpdateUser = users.find((m) => m.id === id);

  const { name, email, age } = req.body;
  if (!UpdateUser) {
    return res.status(404).json({ message: "해당 id 정보가 없습니다." });
  }
  if (!email.includes("@")) {
    return res.status(400).json({ message: "올바른 이메일 형식이 아닙니다." });
  }
  if (name !== undefined) UpdateUser.name = name;
  if (email !== undefined) UpdateUser.email = email;
  if (age !== undefined) UpdateUser.age = age;

  res.json(UpdateUser);
});

app.delete("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex((m) => m.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "해당 id 정보가 없습니다." });
  }

  users.splice(index, 1);
  res.status(200).json({ message: "해당 유저가 삭제되었습니다." });
});

app.get("/users/search", (req, res) => {
  const { name, age } = req.query;
  let filterUsers = [...users];
  if (req.query.name) {
    filterUsers = filterUsers.filter((u) => u.name.includes(req.query.name));
  }
  if (req.query.age) {
    const age = parseInt(req.query.age);
    filterUsers = filterUsers.filter((u) => u.age === age);
  }
  res.json(filterUsers);
});

app.listen(PORT, () => {
  console.log("유저관리 서버가 실행 중 입니다.");
});

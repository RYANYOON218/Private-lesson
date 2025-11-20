const express = require(`express`);
const app = express();
const PORT = 3000;

app.use(express.json());
app.get("/", (req, res) => {
  res.status(200).json({ message: "연락처 서버 입니다." });
});

let numbers = [
  { id: 1, name: "김철수", phone: "010-1111-1111", email: "111@naver.com", group: "친구" },
  { id: 2, name: "이유리", phone: "010-2222-2222", email: "222@naver.com", group: "친구" },
];

app.get("/numbers", (req, res) => {
  res.json(numbers);
});

app.get("/numbers/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const number = numbers.find((m) => m.id === id);

  if (!number) {
    res.status(400).json({ message: "정보가 없습니다." });
  } else {
    res.json(number);
  }
});

app.post("/numbers", (req, res) => {
  const { name, phone, email, group } = req.body;

  if (!name) {
    return res.status(400).json({ message: "이름은 필수 입니다." });
  }
  if (!phone) {
    return res.status(400).json({ message: "전화번호는 필수 입니다." });
  }

  const Newnumber = {
    id: numbers.length + 1,
    name,
    phone,
    email,
    group,
  };

  numbers.push(Newnumber);
  res.status(201).json(Newnumber);
});

app.patch("/numbers/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const number = numbers.find((m) => m.id === id);

  if (!number) {
    return res.status(400).json({ message: "번호가 없습니다." });
  }

  const { name, phone, email, group } = req.body;
  if (name !== undefined) number.name = name;
  if (phone !== undefined) number.phone = phone;
  if (email !== undefined) number.email = email;
  if (group !== undefined) number.group = group;

  res.status(201).json(number);
});

app.delete("/numbers/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = numbers.findIndex((m) => m.id === id);

  if (index === -1) {
    return res.status(400).json({ message: "번호가 없습니다." });
  }

  numbers.splice(index, 1);
  res.json({ message: "삭제 되었습니다." });
});

app.listen(PORT, () => {
  console.log(`서버가 실행중 입니다`);
});

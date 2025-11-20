const express = require(`express`);
const app = express();
const PORT = 3000;

app.use(express.json());

let money = [
  { id: 1, type: "지출", category: "식비", amount: 5000, description: "점심", date: "2025-11-10" },
  { id: 2, type: "지출", category: "여가", amount: 10000, description: "노래방", date: "2025-11-11" },
];

app.get("/", (req, res) => {
  res.json({ message: "가계부 서버 입니다." });
});

app.get("/money", (req, res) => {
  res.json(money);
});

app.get("/money/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const onemoney = money.find((m) => m.id === id);

  if (!onemoney) {
    return res.status(400).json({ message: "해당 목록이 없습니다." });
  } else {
    res.json(onemoney);
  }
});

app.post("/money", (req, res) => {
  const { type, category, amount, description, date } = req.body;

  if (type !== "지출" && type !== "수입") {
    return res.status(400).json({ message: "type은 지출 또는 수입 둘 중 하나여야 합니다." });
  }
  if (amount <= 0) {
    return res.status(400).json({ message: "amount는 항상 양수여야 합니다." });
  }

  const Newmoney = {
    id: money.length + 1,
    type,
    category,
    amount,
    description,
    date,
  };

  money.push(Newmoney);
  res.status(201).json(Newmoney);
});

app.patch("/money/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const onemoney = money.find((m) => m.id === id);

  if (!onemoney) {
    return res.status(400).json({ message: "해당 목록이 없습니다." });
  }

  const { type, category, amount, description, date } = req.body;
  if (type !== "수익" && type !== "지출") {
    return res.status(400).json({ message: "type는 항상 수익 또는 지출 이어야 합니다." });
  }
  if (amount <= 0) {
    return res.status(400).json({ message: "amount는 항상 양수여야 합니다." });
  }
  if (type !== undefined) {
    onemoney.type == type;
  }
  if (category !== undefined) {
    onemoney.category = category;
  }
  if (amount !== undefined) {
    onemoney.amount = amount;
  }
  if (description !== undefined) {
    onemoney.description = description;
  }
  if (date !== undefined) {
    onemoney.date = date;
  }

  res.status(201).json(onemoney);
});

app.delete("/money/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = money.findIndex((m) => m.id === id);

  if (index === -1) {
    return res.status(401).json({ message: "해당 ID 정보가 없습니다." });
  }

  money.splice(index, 1);
  res.status(201).json({ message: "삭제 되었습니다." });
});

app.listen(PORT, () => {
  console.log("서버 7 번이 실행 중 입니다.");
});

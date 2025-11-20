const express = require(`express`);
const app = express();
const PORT = 3000;

app.use(express.json());
app.get("/", (req, res) => {
  res.status(200).json({ message: "메뉴 서버 입니다." });
});

let menus = [
  { id: 1, name: "불고기버거", category: "버거", price: 9000, available: true },
  { id: 2, name: "새우버거", category: "버거", price: 3000, available: true },
];

app.get("/menus", (req, res) => {
  res.json(menus);
});

app.post("/menus", (req, res) => {
  const { name, category, price } = req.body;

  if (!name) {
    return res.status(400).json({ message: "이름은 필수입니다." });
  }
  if (!category) {
    return res.status(400).json({ message: "카테고리는 필수입니다." });
  }
  if (!price) {
    return res.status(400).json({ message: "가격은 필수입니다." });
  }

  const Newmenu = {
    id: menus.length + 1,
    category,
    price,
    available: true,
  };

  menus.push(Newmenu);
  res.status(201).json(Newmenu);
});

app.get("/menus/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const menu = menus.find((m) => m.id === id);

  if (menu) {
    res.json(menu);
  } else {
    res.status(400).json({ message: "메뉴를 찾을 수 없습니다." });
  }
});

app.patch("/menus/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const memu = menus.find((m) => m.id === id);

  if (!memu) {
    res.status(400).json({ message: "메뉴가 없습니다" });
  }

  const { name, category, price, available } = req.body;
  if (name != undefined) memu.name = name;
  if (category != undefined) memu.category = category;
  if (price != undefined) memu.price = price;
  if (available != undefined) memu.available = available;

  res.json(memu);
});

app.delete("/menus/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = menus.findIndex((m) => m.id === id);

  if (index === -1) {
    res.status(400).json({ message: "메뉴가 없습니다." });
  }

  menus.splice(index, 1);
  res.json({ message: "메뉴가 삭제되었습니다." });
});

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT}에서 실행 중 입니다`);
});

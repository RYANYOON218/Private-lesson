const express = require(`express`);
const app = express();
const PORT = 3000;

app.use(express.json());
app.get("/", (req, res) => {
  res.status(200).json({ message: "메모장 서버 입니다!" });
});

let memos = [
  { id: 1, content: "내일 회의 준비하기", createdAt: "2025-11-10", important: false },
  { id: 2, content: "내일 과외 준비하기", createdAt: "2025-11-14", important: false },
];

app.get("/memos", (req, res) => {
  res.json(memos);
});

app.get("/memos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const memo = memos.find((m) => m.id === id);

  if (memo) {
    res.json(memo);
  } else {
    res.status(404).json({ message: "메모를 찾을 수 없습니다!" });
  }
});

app.post("/memos", (req, res) => {
  const { content, createdAt, important } = req.body;

  if (!content) {
    return res.status(400).json({ message: "컨텐츠는 필수입니다." });
  }

  const today = new Date().toISOString().split("T")[0]; // "2025-11-10"

  const Newmemo = {
    id: memos.length + 1,
    content,
    createdAt: today,
    important: true,
  };

  memos.push(Newmemo);
  res.status(201).json(Newmemo);
});

app.patch("/memos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const memo = memos.find((m) => m.id === id);

  if (!memo) {
    res.status(404).json({ message: "메모가 없습니다." });
  }

  const { content, createdAt, important } = req.body;
  if (content != undefined) memo.content = content;
  if (createdAt != undefined) memo.createdAt = createdAt;
  if (important != undefined) memo.important = important;

  res.json(memo);
});

app.delete("/memos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = memos.findIndex((m) => m.id === id);

  if (index === -1) {
    res.status(404).json({ message: "메모를 찾을 수 없습니다." });
  }

  memos.splice(index, 1);
  res.json({ message: "메모가 삭제되었습니다." });
});

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT}에서 실행중 입니다.`);
});

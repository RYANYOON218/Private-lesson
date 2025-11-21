const express = require(`express`);
const app = express();
const PORT = 3000;

app.use(express.json());

let diary = [
  { id: 1, date: "2025-11-10", mood: "😊", weather: "맑음", content: "오늘은 좋은 하루였다.", private: false },
  { id: 2, date: "2025-11-11", mood: "😴", weather: "비", content: "오늘은 비가 많이왔다.", private: true },
];

app.get("/", (req, res) => {
  res.json({ message: "일기장 서버 입니다." });
});

app.get("/diary", (req, res) => {
  res.json(diary);
});

app.get("/diary/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const diary1 = diary.find((m) => m.id === id);

  if (!diary1) {
    return res.status(400).json({ message: "해당 id 의 정보가 없습니다." });
  }

  res.json(diary1);
});

app.post("/diary", (req, res) => {
  const { mood, weather, content, private } = req.body;
  const today = new Date().toISOString().split("T")[0];

  if (content.length < 10) {
    return res.status(400).json({ message: "content 는 최소 10자 입니다." });
  }

  const Newdiary = {
    id: diary.length + 1,
    date: today,
    mood,
    weather,
    content,
    private,
  };

  diary.push(Newdiary);
  res.json(Newdiary);
});

app.patch("/diary/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const diary1 = diary.find((m) => m.id === id);

  const { date, mood, weather, content, private } = req.body;
  if (content.length < 10) {
    return res.status(400).json({ message: "content는 최소 10자 입니다." });
  }
  if (date !== undefined) diary1.date = date;
  if (mood !== undefined) diary1.mood = mood;
  if (weather !== undefined) diary1.weather = weather;
  if (content !== undefined) diary1.content = content;
  if (private !== undefined) diary1.private = private;

  res.json(diary1);
});

app.delete("/diary/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = diary.findIndex((m) => m.id === id);
  if (index === -1) {
    return res.status(400).json({ message: "해당 id 정보가 없습니다." });
  }
  diary.splice(index, 1);
  res.status(201).json({ message: "삭제 되었습니다." });
});

app.listen(PORT, () => {
  console.log("9번 서버가 실행 중 입니다.");
});

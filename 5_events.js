const express = require(`express`);
const app = express();
const PORT = 3000;

app.use(express.json());

let events = [
  {
    id: 1,
    eventName: "팀 회의",
    date: "2025-11-20",
    location: "A동 회의실",
  },
];

app.get("/events", (req, res) => {
  res.status(200).json(events);
});

app.post("/events", (req, res) => {
  const { eventName, date, location } = req.body;
  if (!eventName || !date) {
    return res.status(404).json({ message: "이벤트 이름과 날짜는 필수항목 입니다." });
  }
  Newevent = {
    id: events.length + 1,
    eventName,
    date,
    location,
  };
  events.push(Newevent);
  res.status(201).json({ message: "새로운 이벤트가 생성되었습니다." });
});

app.patch("/events/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const event = events.find((m) => m.id === id);
  const { date, location } = req.body;

  if (date !== undefined) event.date = date;
  if (location !== undefined) event.location = location;

  res.json({ message: "정보가 업데이트 되었습니다." });
});

app.delete("/events/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = events.findIndex((m) => m.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "해당 id 정보가 없습니다." });
  }

  events.splice(index, 1);
  res.json({ message: "해당 이벤트가 삭제되었습니다." });
});

app.listen(PORT, () => {
  console.log("이벤트 서버가 실행 중 입니다.");
});

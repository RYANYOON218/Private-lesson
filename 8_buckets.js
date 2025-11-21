const express = require(`express`);
const app = express();
const PORT = 3000;

app.use(express.json());

let buckets = [
  { id: 1, goal: "제주도 여행하기", deadline: "2025-12-31", completed: false, priority: "높음" },
  { id: 2, goal: "공부하기", deadline: "2025-12-31", completed: false, priority: "중간" },
];

app.get("/", (req, res) => {
  res.json({ messgae: "버킷리스트 서버 입니다." });
});

app.get("/buckets", (req, res) => {
  res.json(buckets);
});

app.get("/buckets/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const bucket = buckets.find((m) => m.id === id);

  if (!bucket) {
    return res.status(401).json({ message: "해당 id 정보가 없습니다." });
  } else {
    res.status(201).json(bucket);
  }
});

app.post("/buckets", (req, res) => {
  const { goal, deadline, completed, priority } = req.body;

  if (priority !== "높음" && priority !== "중간" && priority !== "낮음") {
    return res.status(400).json({ message: "priority는 높음, 중간, 낮음 중 하나만 허용 됩니다" });
  }
  const Newbucket = {
    id: buckets.length + 1,
    goal,
    deadline,
    completed,
    priority,
  };

  buckets.push(Newbucket);
  res.status(201).json(Newbucket);
});

app.patch("/buckets/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const bucket = buckets.find((m) => m.id === id);

  if (!bucket) {
    return res.status(400).json({ message: "해당 id 정보가 없습니다." });
  }
  const { goal, deadline, completed, priority } = req.body;
  if (priority !== "높음" && priority !== "중간" && priority !== "낮음") {
    return res.status(400).json({ message: "priority는 높음, 중간, 낮음 중 하나만 허용 됩니다" });
  }
  if (goal !== undefined) bucket.goal = goal;
  if (deadline !== undefined) bucket.deadline = deadline;
  if (completed !== undefined) bucket.completed = completed;
  if (priority !== undefined) bucket.priority = priority;

  res.status(201).json({
    message: "변경 되었습니다.",
    bucket,
  });
});

app.delete("/buckets/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = buckets.findIndex((m) => m.id === id);

  if (index === -1) {
    return res.status(400).json({ message: "해당 id 정보가 없습니다." });
  }

  buckets.splice(index, 1);
  res.status(201).json({ message: "삭제 완료 되었습니다." });
});

app.listen(PORT, () => {
  console.log("8번 서버가 실행 중 입니다.");
});

const express = require(`express`);
const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "운동 기록 서버 입니다." });
});

let exercises = [
  { id: 1, exercise: "런닝", duration: 30, calories: 300, date: "2025-11-15" },
  { id: 2, exercise: "골프", duration: 60, calories: 100, date: "2025-11-10" },
];

app.get("/exercises", (req, res) => {
  res.json(exercises);
});

app.get("/exercises/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const exercise1 = exercises.find((m) => m.id === id);

  if (!exercise1) {
    return res.status(400).json({ message: "기록이 없습니다." });
  }
  res.json(exercise1);
});

app.post("/exercises", (req, res) => {
  const { exercise, duration, calories, date } = req.body;

  if (!exercise) {
    return res.status(400).json({ message: "exercise는 필수입니다." });
  }
  if (!duration) {
    return res.status(400).json({ message: "duration은 필수입니다." });
  }
  if (duration <= 0) {
    return res.status(400).json({ message: "duration은 항상 양수여야 합니다." });
  }
  const Newexercise = {
    id: exercises.length + 1,
    exercise,
    duration,
    calories,
    date,
  };

  exercises.push(Newexercise);
  res.status(201).json(Newexercise);
});

app.patch("/exercises/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const exercise1 = exercises.find((m) => m.id === id);

  if (!exercise1) {
    return res.json({ message: "운동 기록이 없습니다." });
  }

  const { exercise, duration, calories, date } = req.body;
  if (duration <= 0) {
    return res.status(400).json({ message: "duration은 항상 양수여야 합니다." });
  }
  if (exercise != undefined) exercise1.exercise = exercise;
  if (duration != undefined) exercise1.duration = duration;
  if (calories != undefined) exercise1.calories = calories;
  if (date != undefined) exercise1.date = date;

  res.json(exercises);
});

app.delete("/exercises/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = exercises.findIndex((m) => m.id === id);

  if (index === -1) {
    return res.json({ message: "운동 기록이 없습니다." });
  }

  exercises.splice(index, 1);
  res.status(201).json({ message: "삭제 되었습니다." });
});

app.listen(PORT, () => {
  console.log(`서버가 작동 중 입니다.`);
});

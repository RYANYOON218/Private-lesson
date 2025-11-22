const express = require(`express`);
const app = express();
const PORT = 3000;

app.use(express.json());

let todos = [{ id: 1, task: "저녁 장보기", completed: false, createdAt: "2025-11-18" }];

app.get("/todos", (req, res) => {
  res.json(todos);
});

app.get("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find((m) => m.id === id);
  if (!todo) {
    return res.status(404).json({ message: "해당 id 정보가 없습니다." });
  }
  res.json(todo);
});

app.post("/todos", (req, res) => {
  const { task, completed, createdAt } = req.body;
  if (!task) {
    return res.status(400).json({ meesage: "할 일 내용은 필수입니다." });
  }
  const Newtodo = {
    id: todos.length + 1,
    task,
    completed,
    createdAt: new Date().toISOString().split("T")[0],
  };

  todos.push(Newtodo);
  res.json(Newtodo);
});

app.delete("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const Xtodo = todos.findIndex((m) => m.id === id);

  if (Xtodo === -1) {
    return res.status(404).json({ message: "해당 id 정보가 없습니다." });
  }

  todos.splice(Xtodo, 1);
  res.status(200).json({ message: "할 일이 삭제되었습니다." });
});

app.listen(PORT, () => {
  console.log("할일 리스트 서버가 실행 중 입니다.");
});

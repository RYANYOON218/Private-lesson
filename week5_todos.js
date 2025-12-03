const sqlite3 = require(`sqlite3`).verbose();
const express = require(`express`);
const app = express();
const PORT = 3000;
app.use(express.json());

app.listen(PORT, () => {
  console.log("서버가 실행 중 입니다.");
});

const db = new sqlite3.Database("./todos.db", (err) => {
  if (err) {
    console.log("데이터베이스 연결 실패:", err.message);
  } else {
    console.log("데이터베이스 연결 성공!");
  }
});

db.run(
  `
CREATE TABLE IF NOT EXISTS todos (
id INTEGER PRIMARY KEY AUTOINCREMENT,
task TEXT NOT NULL,
completed INTEGER DEFAULT 0,
createdAt TEXT
)
`,
  (err) => {
    if (err) {
      console.error("테이블 생성 실패:", err.message);
    } else {
      console.log("todos 테이블 준비 완료!");
    }
  }
);

app.post("/todos", (req, res) => {
  const { task, completed } = req.body;
  const createdAt = new Date().toISOString();

  if (completed !== undefined) {
    if (completed !== 1 && completed !== 0) {
      return res.status(400).json({ message: "completed는 boolean 입니다." });
    }
  }
  if (!task) {
    return res.status(400).json({ message: "Task 는 필수 입니다." });
  }
  db.run("INSERT INTO todos (task, completed, createdAt) VALUES (?,?,?)", [task, completed, createdAt], function (err) {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.status(201).json({
      id: this.lastID,
      task,
      completed,
      createdAt,
    });
  });
});

app.get("/todos", (req, res) => {
  db.all("SELECT * FROM todos", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.get("/todos/:id", (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM todos WHERE id = ?", [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ message: "해당 ID 정보가 없습니다." });
    }
    res.json(row);
  });
});

app.patch("/todos/:id", (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  const updates = [];
  const values = [];

  if (completed !== undefined) {
    updates.push("completed=?");
    values.push(completed);
  }
  if (updates.length === 0) {
    return res.status(400).json({ message: "수정할 내용이 없습니다." });
  }

  values.push(id);
  const sql = `UPDATE todos SET ${updates.join(`,`)} WHERE id = ?`;

  db.run(sql, values, function (err) {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: "해당 id 정보가 없습니다." });
    }

    db.get("SELECT * FROM todos WHERE id = ?", [id], (err, row) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      res.json(row);
    });
  });
});

app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM todos WHERE id = ?", [id], function (err) {
    if (err) return res.json(500).json({ error: err.message });
    if (this.changes === 0) {
      return res.status(404).json({ message: "해당 id 정보가 없습니다." });
    }
    res.json({ message: "해당 정보가 삭제되었습니다." });
  });
});

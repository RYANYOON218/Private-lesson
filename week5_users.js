const sqlite3 = require(`sqlite3`).verbose();
const express = require(`express`);
const app = express();
const PORT = 3000;

app.use(express.json());
app.listen(PORT, () => {
  console.log("서버가 실행 중 입니다.");
});

const db = new sqlite3.Database("./users.db", (err) => {
  if (err) {
    console.error("데이터 베이스 연결 실패:", err.message);
  } else {
    console.log("데이터 베이스 연결 성공!");
  }
});

db.run(
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    age INTEGER)`,
  (err) => {
    if (err) {
      console.error("테이블 생성 실패:", err.error);
    } else {
      console.log("테이블이 준비 되었습니다.");
    }
  }
);

app.post("/users", (req, res) => {
  const { name, email, age } = req.body;
  if (!name) {
    return res.status(400).json({ meesage: "이름은 필수 입니다." });
  } else if (!email) {
    return res.status(400).json({ message: "이메일은 필수 입니다." });
  } else if (!email.includes("@")) {
    return res.status(400).json({ meesage: "올바른 메일 형식이 아닙니다." });
  }
  db.run("INSERT INTO users(name, email, age) VALUES(?,?,?)", [name, email, age], function (err) {
    if (err) {
      return res.status(500).json({ message: err.mesage });
    }
    res.status(200).json({
      id: this.lastID,
      name,
      email,
      age,
    });
  });
});

app.get("/users", (req, res) => {
  db.all("SELECT * FROM users ", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM users WHERE id = ?", [id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.meesage });
    }
    if (!rows) {
      return res.status(404).json({ message: "해당 id 정보가 없습니다." });
    }
    res.json(rows);
  });
});

app.patch("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, age } = req.body;

  const updates = [];
  const values = [];

  if (name !== undefined) {
    updates.push("name = ?");
    values.push(name);
  }
  if (email !== undefined) {
    if (!email.includes("@")) {
      return res.status(400).json({ message: "올바른 이메일 양식이 아닙니다." });
    }
    updates.push("email = ?");
    values.push(email);
  }
  if (age !== undefined) {
    updates.push("age = ?");
    values.push(age);
  }

  if (updates.length === 0) {
    return res.status(400).json({ message: "수정할 내용이 없습니다." });
  }
  values.push(id);
  const sql = `UPDATE users SET ${updates.join(`,`)} WHERE id =? `;

  db.run(sql, values, function (err) {
    if (err) {
      return res.status(500).json({ message: err.meesage });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: "해당 id 정보가 없습니다." });
    }

    db.get("SELECT * FROM users WHERE id = ?", [id], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    });
  });
});

app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM users WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "해당 id 데이터가 삭제되었습니다." });
  });
});

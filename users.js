const sqlite3 = require(`sqlite3`).verbose();
const bcrypt = require(`bcryptjs`);
const express = require(`express`);

const db = new sqlite3.Database("./users.db");
const app = express();
app.use(express.json());
const { generateToken, authenticateToken } = require("./middleware/auth");

const PORT = 3000;

db.run(
  `CREATE TABLE IF NOT EXISTS users(
  id INTEGER AUTOINCREMENT PRIMARY KEY,
  name TEXT NOT NULL,
  eamil TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  age INTEGER,
  updatedAt TEXT
  )`,
  (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    } else {
      console.log({ message: "테이블 생성 완료" });
    }
  }
);

db.run(
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    age INTEGER
    updatedAt TEXT)`,
  (err) => {
    if (err) {
      console.error("테이블 생성 실패");
    } else {
      console.log("users 테이블 준비 완료");
    }
  }
);

app.post("/auth/register", async (req, res) => {
  const { name, email, password, age } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "이름과 이메일, 비밀번호는 필수 입니다." });
  }
  if (!isValidPassword(password)) {
    return res.status(400).json({ message: "비밀번호는 최소 6자리 입니다." });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "이메일 양식이 맞지 않습니다." });
  }
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    db.run(
      "INSERT INTO users (name, email, password, age) VALUES (?,?,?,?)",
      [name, email, hashedPassword, age],
      function (err) {
        if (err) {
          return res.status(409).json({ message: "이미 존재하는 이메일 주소 입니다." });
        }
        const userId = this.lastID;
        const token = generateToken({ id: userId, email: email });
        res.status(201).json({
          message: "회원가입이 완료되었습니다.",
          user: { id: userId, name, email, age },
          token: token,
        });
      }
    );
  } catch (error) {
    console.error("회원가입 중 오류:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
});

// 이메일 유효성 검사
function isValidEmail(email) {
  return email && email.includes("@") && email.includes(".");
}

// 비밀번호 유효성 검사
function isValidPassword(password) {
  return password && password.length >= 6;
}

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ message: "서버 오류 발생" });
    }

    if (!user) {
      return res.status(401).json({ message: "이메일 또는 비밀번호가 일치하지 않습니다." });
    }

    try {
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
      }
      const token = generateToken({ id: user.id, email: user.email });

      res.status(200).json({
        message: "로그인 성공",
        user: { id: user.id, name: user.name, email: user.email },
        token: token,
      });
    } catch (error) {
      console.error("로그인 중 비밀번호 비교 오류: ", error);
      res.status(500).json({ message: "서버 오류 발생" });
    }
  });
});

app.get("/users", authenticateToken, (req, res) => {
  db.all("SELECT * FROM users", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({
      rows,
      requestedBy: req.user,
    });
  });
});

app.get("/users/me", authenticateToken, (req, res) => {
  const userId = req.user.id;
  db.get("SELECT * FROM users WHERE id = ?", [userId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ message: "사용자 정보가 없습니다." });
    }
    res.status(201).json(row);
  });
});

app.patch("/users/me", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { name, age, currentPassword, newPassword } = req.body;

  const updates = [];
  const values = [];

  if (name !== undefined) {
    if (!name.trim()) {
      return res.status(400).json({ message: "이름은 빈 값일 수 없습니다" });
    }
    updates.push("name = ?");
    values.push(name);
  }

  if (age !== undefined) {
    if (age !== null && (isNaN(age) || age < 0)) {
      return res.status(400).json({ message: "나이는 0 이상의 숫자여야 합니다" });
    }
    updates.push("age = ?");
    values.push(age);
  }

  // 비밀번호 변경 요청이 있는 경우
  if (newPassword) {
    if (!currentPassword) {
      return res.status(400).json({
        message: "현재 비밀번호를 입력해주세요",
      });
    }

    if (!isValidPassword(newPassword)) {
      return res.status(400).json({
        message: "새 비밀번호는 최소 6자 이상이어야 합니다",
      });
    }

    // 현재 비밀번호 확인 후 처리
    db.get("SELECT password FROM users WHERE id = ?", [userId], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      try {
        const isValidCurrent = await bcrypt.compare(currentPassword, user.password);
        if (!isValidCurrent) {
          return res.status(401).json({
            message: "현재 비밀번호가 틀렸습니다",
          });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        updates.push("password = ?");
        values.push(hashedNewPassword);

        // 업데이트 실행
        executeUpdate();
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    });
    return;
  }

  executeUpdate();

  function executeUpdate() {
    if (updates.length === 0) {
      return res.status(400).json({ message: "수정할 내용이 없습니다" });
    }

    updates.push("updatedAt = CURRENT_TIMESTAMP");
    values.push(userId);
    const sql = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;

    db.run(sql, values, function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: "사용자를 찾을 수 없습니다" });
      }

      // 수정된 데이터 조회 후 반환 (비밀번호 제외)
      db.get("SELECT id, name, email, age, updatedAt FROM users WHERE id = ?", [userId], (err, row) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({
          message: "정보가 수정되었습니다",
          user: row,
        });
      });
    });
  }
});

app.delete("/users/me", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "비밀번호가 필요합니다." });
  }
  db.get("SELECT password FROM users WHERE id = ?", [userId], async (err, data) => {
    if (err) {
      return res.status(500).json({ err: err.message });
    }
    if (!data) {
      return res.status(404).json({ message: "사용자 정보가 없습니다." });
    }

    try {
      const isValidPassword = await bcrypt.compare(password, data.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "비밀번호가 틀렸습니다." });
      }
      db.run("DELETE FROM users WHERE id = ?", [userId], function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: "사용자 정보가 삭제 되었습니다." });
      });
    } catch (err) {
      return res.status(500).json({ err: err.message });
    }
  });
});

app.get("/public/users/count", (req, res) => {
  db.get("SELECT COUNT(*) as userCount FROM users", [], function (err, rows) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log("users 서버가 실행 중 입니다.");
});

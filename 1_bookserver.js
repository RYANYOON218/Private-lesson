const express = require(`express`);
const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  return "연습용 서버 입니다!";
});

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT}에서 실행중 입니다.`);
});

// ===== 도서 관리 API =====
let books = [
  { id: 1, title: "클린 코드", author: "로버트 C. 마틴", year: 2013, read: true },
  { id: 2, title: "리팩토링", author: "마틴 파울러", year: 2020, read: false },
];

// 1. 모든 책 조회*
app.get("/books", (req, res) => {
  res.json(books);
});

// 2. 특정 책 조회*
app.get("/books/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find((b) => b.id === id);

  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: "책을 찾을 수 없습니다" });
  }
});

// 3. 새 책 추가*
app.post("/books", (req, res) => {
  const { title, author, year } = req.body;

  // 유효성 검사*
  if (!title || !author) {
    return res.status(400).json({ message: "제목과 저자는 필수입니다" });
  }

  const newBook = {
    id: books.length + 1,
    title,
    author,
    year: year || new Date().getFullYear(),
    read: false,
  };

  books.push(newBook);
  res.status(201).json(newBook);
});

// 4. 책 정보 수정*
app.patch("/books/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find((b) => b.id === id);

  if (!book) {
    return res.status(404).json({ message: "책을 찾을 수 없습니다" });
  }

  // 수정할 필드만 업데이트*
  const { title, author, year, read } = req.body;
  if (title !== undefined) book.title = title;
  if (author !== undefined) book.author = author;
  if (year !== undefined) book.year = year;
  if (read !== undefined) book.read = read;

  res.json(book);
});

// 5. 책 삭제*
app.delete("/books/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = books.findIndex((b) => b.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "책을 찾을 수 없습니다" });
  }

  books.splice(index, 1);
  res.json({ message: "책이 삭제되었습니다" });
});

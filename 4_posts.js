const express = require(`express`);
const app = express();
const PORT = 3000;

app.use(express.json());

let posts = [
  {
    id: 1,
    author: "홍길동",
    title: "Express.js는 재밌다",
    content: "API 만들기는...",
  },
];

app.get("/posts", (req, res) => {
  res.json(posts);
});

app.get("/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const post = posts.find((m) => m.id === id);

  if (!post) {
    return res.status(404).json({ message: "해당 id 정보가 없습니다." });
  }
  res.json(post);
});

app.post("/posts", (req, res) => {
  const { author, title, content } = req.body;
  if (!author || !title || !content) {
    return res.status(404).json({ message: "글쓴이, 제목, 내용은 모두 필수입니다." });
  }
  const Newpost = {
    id: posts.length + 1,
    author,
    title,
    content,
  };
  posts.push(Newpost);
  res.status(201).json({ message: "새 게시글이 등록되었습니다." });
});

app.delete("/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const Xpost = posts.findIndex((m) => m.id === id);

  if (Xpost === -1) {
    return res.status(404).json({ message: "해당 id 정보가 없습니다." });
  }
  posts.splice(Xpost, 1);
  res.json({ message: "해당 게시물이 삭제되었습니다." });
});

app.listen(PORT, () => {
  console.log("게시물 서버가 실행 중 입니다.");
});

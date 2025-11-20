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

let movies = [
  { id: 1, title: "인터스텔라", director: "놀란", genre: "SF", rating: 9.5, watched: true },
  { id: 2, title: "인터스텔라2", director: "놀란", genre: "SF", rating: 9.0, watched: false },
];

app.get("/movies", (req, res) => {
  res.json(movies);
});

app.get("/movies/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const movie = movies.find((m) => m.id === id);

  if (movie) {
    res.json(movie);
  } else {
    res.status(404).json({ message: "영화를 찾을 수 없습니다." });
  }
});

app.post("/movies", (req, res) => {
  const { title, director, genre, rating } = req.body;

  if (!title) {
    return res.status(400).json({ message: "제목은 필수입니다." });
  } else if (!director) {
    return res.status(400).json({ message: "감독은 필수입니다." });
  } else if (!genre) {
    return res.status(400).json({ message: "장르는 필수입니다." });
  } else if (!rating) {
    return res.status(400).json({ message: "별점은 필수입니다." });
  }

  const NewMovie = {
    id: movies.length + 1,
    title,
    director,
    genre,
    rating,
    watched: false,
  };

  movies.push(NewMovie);
  res.status(201).json(NewMovie);
});

app.patch("/movies/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const movie = movies.find((b) => b.id === id);

  if (!movie) {
    res.status(404).json({ message: "영화를 찾을 수 없습니다" });
  }

  const { title, director, genre, rating, watched } = req.body;
  if (title !== undefined) movie.title = title;
  if (director !== undefined) movie.director = director;
  if (genre !== undefined) movie.genre = genre;
  if (rating !== undefined) movie.rating = rating;
  if (watched !== undefined) movie.watched = watched;

  res.json(movie);
});

app.delete("/movies/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = movies.findIndex((m) => m.id === id);

  if (index === -1) {
    res.status(404).json({ message: "영화를 찾을 수 없습니다" });
  }

  movies.splice(index, 1);
  res.json({ message: "영화가 삭제되었습니다" });
});

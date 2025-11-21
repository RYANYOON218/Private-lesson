const express = require(`express`);
const app = express();
const PORT = 3000;

app.use(express.json());

let music = [
  {
    id: 1,
    title: "봄날",
    artist: "BTS",
    album: "You Never Walk Alone",
    duration: 275, // 초
    favorite: false,
  },
  {
    id: 2,
    title: "좋은날",
    artist: "아이유",
    album: "아이유의 좋은날 앨범",
    duration: 300, // 초
    favorite: true,
  },
];

app.get("/", (req, res) => {
  res.json({ message: "음악 서버 입니다." });
});

app.get("/music", (req, res) => {
  res.json(music);
});

app.get("/music/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const music1 = music.find((m) => m.id === id);

  if (!music1) {
    return res.json({ message: "해당 id 정보가 없습니다." });
  }
  res.status(201).json(music1);
});

app.post("/music", (req, res) => {
  const { title, artist, album, duration, favorite } = req.body;

  if (title === undefined) {
    return res.status(400).json({ message: "title은 필수 입니다." });
  }
  if (artist === undefined) {
    return res.status(400).json({ message: "artist는 필수 입니다." });
  }
  if (duration <= 0) {
    return res.status(400).json({ message: "duration은 항상 양수여야 합니다." });
  }
  const Newmusic = {
    id: music.length + 1,
    title,
    artist,
    album,
    duration,
    favorite,
  };
  music.push(Newmusic);
  res.status(201).json(Newmusic);
});

app.patch("/music/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const music1 = music.find((m) => m.id === id);

  if (!music1) {
    return res.status(401).json({ message: "해당 id 정보가 없습니다." });
  }

  const { title, artist, album, duration, favorite } = req.body;
  if (duration <= 0) {
    return res.status(400).json({ message: "duration은 항상 양수여야 합니다." });
  }
  if (title != undefined) music1.title = title;
  if (artist != undefined) music1.artist = artist;
  if (album != undefined) music1.album = album;
  if (duration != undefined) music1.duration = duration;
  if (favorite != undefined) music1.favorite = favorite;

  res.status(201).json(music1);
});

app.delete("/music/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = music.findIndex((m) => m.id === id);

  if (index === -1) {
    return res.status(401).json({ message: "해당 id 정보가 없습니다." });
  }
  music.splice(index, 1);
  res.json({ message: "삭제 되었습니다." });
});

app.listen(PORT, () => {
  console.log("10번 서버가 실행 중 입니다.");
});

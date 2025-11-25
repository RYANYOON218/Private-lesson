const express = require(`express`);
const app = express();
const PORT = 3000;

app.use(express.json());

let products = [
  {
    id: 1,
    name: "노트북",
    price: 1500000,
    stock: 30,
    category: "전자제품",
  },
];

app.get("/products", (req, res) => {
  res.json(products);
});

app.get("/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find((m) => m.id === id);

  if (!product) {
    return res.status(404).json({ message: "해당 id에 정보가 없습니다." });
  }
  res.status(201).json(product);
});

app.post("/products", (req, res) => {
  const { name, price, stock, category } = req.body;
  if (!name) {
    return res.status(400).json({ message: "이름은 필수 입니다." });
  }
  if (!price) {
    return res.status(400).json({ message: "가격은 필수 입니다." });
  }
  if (!stock) {
    return res.status(400).json({ message: "재고는 필수 입니다." });
  }
  if (price <= 0 || stock <= 0) {
    return res.status(400).json({ message: "가격과 재고는 0보다 커야 합니다." });
  }

  const Newproduct = {
    id: products.length + 1,
    name,
    price,
    stock,
    category,
  };

  products.push(Newproduct);
  res.status(201).json({ message: "제품이 등록되었습니다." });
});

app.patch("/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find((m) => m.id === id);

  const { price, stock } = req.body;
  if (price !== undefined) product.price = price;
  if (stock !== undefined) product.stock = stock;

  res.json({ message: "상품이 수정되었습니다." });
});

app.listen(PORT, () => {
  console.log("상품관리 서버가 실행 중 입니다.");
});

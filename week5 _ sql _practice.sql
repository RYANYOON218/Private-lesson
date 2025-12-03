CREATE TABLE products(
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL,
price INTEGER NOT NULL,
stock INTEGER NOT NULL
);

INSERT INTO products (name, price, stock) VALUES
('김치', 50000, 500), ('라면', 1500, 1000), ('김밥', 4500, 90);

SELECT * FROM products WHERE price >=10000;

UPDATE products SET stock = 2 WHERE id = 3;

DELETE FROM products WHERE id = 2;
DROP TABLE accountBook;
CREATE TABLE accountBook
(
  account_book_id SERIAL NOT NULL,
  sender_id TEXT NOT NULL,
  useDate DATE NOT NULL,
  money INTEGER NOT NULL,
  category TEXT NOT NULL,
  insert_date TIMESTAMP NOT NULL,
  update_date TIMESTAMP NOT NULL
);

DROP TABLE shoppingList;
--CREATE TABLE shoppingList
--(
--  shopping_id SERIAL NOT NULL,
--  sender_id TEXT NOT NULL,
--  shopping_name TEXT NOT NULL,
--  plan_to_buy_flg BOOLEAN NOT NULL,
--  insert_date TIMESTAMP NOT NULL,
--  update_date TIMESTAMP NOT NULL
--);

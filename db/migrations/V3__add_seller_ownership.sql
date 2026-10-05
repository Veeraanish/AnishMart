ALTER TABLE products
ADD COLUMN seller_id INT NULL AFTER id;

SET @default_seller = (
    SELECT id
    FROM users
    WHERE role = 'seller'
    ORDER BY id
    LIMIT 1
);

UPDATE products
SET seller_id = @default_seller
WHERE seller_id IS NULL
AND @default_seller IS NOT NULL;

ALTER TABLE products
ADD INDEX idx_products_seller_id (seller_id);

ALTER TABLE products
ADD CONSTRAINT fk_products_seller
FOREIGN KEY (seller_id)
REFERENCES users(id)
ON DELETE SET NULL;
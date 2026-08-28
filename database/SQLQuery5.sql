USE ITAssetManagement;

INSERT INTO Users (FullName, Email, PasswordHash)
VALUES (
    'Admin User',
    'admin@gmail.com',
    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
);

SELECT * FROM Users;
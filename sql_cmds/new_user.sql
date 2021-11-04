INSERT INTO users (username,password)
VALUES (LEFT(UUID(),8),
        LEFT(UUID(),8))

CREATE TABLE IF NOT EXISTS sessions (
    session_id VARCHAR(128) NOT NULL,
    expires INT UNSIGNED NOT NULL,
    data MEDIUMTEXT,
    PRIMARY KEY (session_id),
    INDEX idx_sessions_expires (expires)
) ENGINE=InnoDB;
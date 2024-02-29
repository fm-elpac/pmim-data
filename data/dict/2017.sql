-- pmim-data/data/dict/2017.sql
--
-- > sqlite3 --version
-- 3.45.1 2024-01-30 16:01:20 e876e51a0ed5c5b3126f52e532044363a014bc594cfefa87ffb5b82257ccalt1 (64-bit)
--
-- 使用此命令创建数据库:
-- > cat 2017.sql | sqlite3 2017.db

BEGIN TRANSACTION;

CREATE TABLE dict_2017 (
  -- 文本
  t TEXT PRIMARY KEY UNIQUE NOT NULL,
  -- 计数
  c INT NOT NULL DEFAULT 0
);

COMMIT;

-- 清理
ANALYZE;
VACUUM;

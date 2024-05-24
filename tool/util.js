// pmim_sys.db 工具函数

// 数据库 元数据
const PMIM_DB_VERSION = "pmim_sys_db version 0.1.0";
const PMIM_VERSION = "pmim version 0.1.0";

// 写入 数据库 元数据
export async function 写入元数据(kv, 数据库名称) {
  await kv.set(["pmim_db", "version"], PMIM_DB_VERSION);
  await kv.set(["pmim_db", "v"], {
    pmim: PMIM_VERSION,
    deno_version: Deno.version,
    n: 数据库名称,
    _last_update: new Date().toISOString(),
  });
}

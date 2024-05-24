#!/usr/bin/env -S deno run -A --unstable-kv
// pmim-data/tool/gen_db_sys.js
// 生成 pmim_sys.db 数据库
//
// 命令行示例:
// > deno run -A --unstable-kv gen_db_sys.js pmim_sys.db .
import { join } from "@std/path";
import { batch_set, chunk_set } from "@fm-elpac/deno-kv-util";

import { 写入元数据 } from "./util.js";

const 数据库名称 = "胖喵拼音内置数据库 (0) v0.1.3 (不含词库)";

// 读取拼音数据
async function 读拼音(文件名) {
  // DEBUG
  console.log(文件名);

  const 文本 = await Deno.readTextFile(文件名);
  const o = [];
  for (const i of 文本.split("\n")) {
    // 忽略注释和空行
    if (i.startsWith("#")) {
      continue;
    }
    if (i.trim().length < 1) {
      continue;
    }
    o.push(i.split(" "));
  }
  return o;
}

// 读取字符频率数据
async function 读频率(文件名, 不检查注释) {
  // DEBUG
  console.log(文件名);

  const 文本 = await Deno.readTextFile(文件名);
  const o = [];
  for (const i of 文本.split("\n")) {
    // 忽略注释和空行
    if (i.startsWith("#")) {
      if (!不检查注释) {
        continue;
      }
    }
    if (i.trim().length < 1) {
      continue;
    }
    const p = i.split(" ");
    o.push([p[0], Number.parseInt(p[1])]);
  }
  return o;
}

function 清理拼音(p) {
  // 去除声调, 去重
  const o = {};
  for (let i of p) {
    // 移除最后的数字
    const e = i.at(-1);
    if (e < "a") {
      i = i.slice(0, i.length - 1);
    }
    o[i] = 1;
  }
  const r = Object.keys(o);
  r.sort();
  return r;
}

function 预加载拼音(pinyin) {
  const o = {
    pc: {},
    cp: {},
  };
  // 字符至拼音
  for (const i of pinyin) {
    o.cp[i[0]] = 清理拼音(i.slice(1));
  }
  // 拼音至字符
  for (const i of Object.keys(o.cp)) {
    for (const j of o.cp[i]) {
      if (null == o.pc[j]) {
        o.pc[j] = [i];
      } else {
        o.pc[j].push(i);
      }
    }
  }
  for (const i of Object.keys(o.pc)) {
    o.pc[i].sort();
  }
  return o;
}

async function 全拼表(p, 目录) {
  // 保存全拼表: tmp/pinyin.txt
  const pinyin = Object.keys(p.pc);
  pinyin.sort();

  const 文本 = pinyin.join("\n") + "\n";
  const 文件 = join(目录, "tmp/pinyin.txt");
  console.log(文件);
  await Deno.writeTextFile(文件, 文本);
}

function 预加载汉字频率(freq) {
  const o = {};
  for (const i of freq) {
    o[i[0]] = i[1];
  }
  return o;
}

function 预加载ascii频率(freq) {
  freq.sort((a, b) => (b[1] - a[1]));
  return freq;
}

async function 预加载双拼表(kv, 目录) {
  const 文件 = join(目录, "data/2p_zirjma.json");
  console.log(文件);
  const 文本 = await Deno.readTextFile(文件);
  const 自然码 = JSON.parse(文本);
  await kv.set(["data", "preload", "2p_zirjma"], 自然码);
}

async function 拼音数据(kv, p, pinyin_d) {
  const 写入 = [];
  // 拼音至字符
  const pc = {};
  for (const i of pinyin_d) {
    // 跳过 pinyin_tgh
    if (null != p.cp[i[0]]) {
      continue;
    }
    const char = i[0];
    const pinyin = 清理拼音(i.slice(1));
    写入.push([["data", "pinyin", char], pinyin]);

    for (const j of pinyin) {
      if (null != pc[j]) {
        pc[j].push(char);
      } else {
        pc[j] = [char];
      }
    }
  }
  // 保存拼音至字符
  for (const i of Object.keys(pc)) {
    pc[i].sort();
    写入.push([["data", "pinyin", i], pc[i]]);
  }
  await batch_set(kv, 写入, 1000);
}

async function 频率数据(kv, freq_d, freq_o) {
  const 写入 = [];
  for (const i of freq_d) {
    写入.push([["data", "freq_d", i[0]], i[1]]);
  }
  for (const i of freq_o) {
    写入.push([["data", "freq_o", i[0]], i[1]]);
  }
  await batch_set(kv, 写入, 1000);
}

async function 处理(kv, 目录) {
  // 读取字符频率数据
  const freq_tgh = await 读频率(join(目录, "data/char_freq/2017_tgh8105.txt"));
  const freq_ascii = await 读频率(
    join(目录, "data/char_freq/2017_ascii.txt"),
    true,
  );
  const freq_d = await 读频率(join(目录, "data/char_freq/2017_d.txt"));
  const freq_o = await 读频率(join(目录, "data/char_freq/2017_o.txt"));

  // 读取拼音数据
  const pinyin_tgh = await 读拼音(join(目录, "tmp/pinyin_kTGHZ2013.txt"));
  const pinyin_d = await 读拼音(join(目录, "tmp/pinyin_kMandarin.txt"));

  // 预加载
  console.log("  预加载");
  const p = 预加载拼音(pinyin_tgh);
  await 全拼表(p, 目录);

  await chunk_set(kv, ["data", "preload", "pinyin_tgh"], p);
  await kv.set(["data", "preload", "freq_tgh"], 预加载汉字频率(freq_tgh));
  await kv.set(["data", "preload", "freq_ascii"], 预加载ascii频率(freq_ascii));
  await 预加载双拼表(kv, 目录);

  console.log("  拼音数据");
  await 拼音数据(kv, p, pinyin_d);
  console.log("  频率数据");
  await 频率数据(kv, freq_d, freq_o);

  console.log("  元数据");
  await 写入元数据(kv, 数据库名称);
}

async function main() {
  const 输出 = Deno.args[0];
  const 目录 = Deno.args[1];
  console.log(`${输出} ${目录}`);

  // 打开数据库
  const kv = await Deno.openKv(输出);

  await 处理(kv, 目录);

  // 记得关闭数据库
  kv.close();
}

if (import.meta.main) main();

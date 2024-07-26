#!/usr/bin/env -S deno run -A --unstable-kv
// pmim-data/tool/gen_db_sys_dict.js
// 生成 pmim_sys.db 数据库 (词库)
//
// 命令行示例:
// > sqlite3 2017.db "select * from dict_2017 order by c desc" \
// | deno run -A --unstable-kv gen_db_sys_dict.js pmim_sys.db
import { join } from "@std/path";
import { TextLineStream } from "@std/streams";
import { batch_set, chunk_get } from "@fm-elpac/deno-kv-util";

import { 写入元数据 } from "./util.js";

const 数据库名称 = "胖喵拼音内置数据库 v0.1.5 (6w)";

async function 读取stdin() {
  const 行 = Deno.stdin.readable
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TextLineStream());

  const o = [];
  for await (const i of 行) {
    o.push(i.split("|"));
  }
  return o;
}

class 拼音读取器 {
  constructor(kv) {
    this.kv = kv;
    this.cache = {};
  }

  async 初始化() {
    // 加载 preload/pinyin_tgh
    this.pt = await chunk_get(this.kv, ["data", "preload", "pinyin_tgh"]);
  }

  // 获取汉字对应的拼音
  async 拼音(c) {
    if (this.pt.cp[c] != null) {
      return this.pt.cp[c];
    }

    if (this.cache[c] != null) {
      return this.cache[c];
    }

    const { value } = await this.kv.get(["data", "pinyin", c]);
    if (value != null) {
      this.cache[c] = value;
      return value;
    }
    throw new Error("无法获取拼音 " + c);
  }
}

async function 处理(kv, 数据, p) {
  console.log("处理()");

  const 写入 = [];
  // 收集所有前缀
  const pt = {};
  // 拼音至前缀
  const pp = {};
  for (const [词, 频率] of 数据) {
    // 词至少是 2 个字
    if (词.length < 2) {
      continue;
    }
    // 前缀是词的前 2 个字
    const 前缀 = 词.slice(0, 2);
    // 频率
    写入.push([["data", "dict", 前缀, 词], Number.parseInt(频率)]);
    // 收集前缀
    if (pt[前缀] != null) {
      pt[前缀].push(词);
    } else {
      pt[前缀] = [词];
    }

    // 生成拼音至前缀
    const p1 = await p.拼音(前缀[0]);
    const p2 = await p.拼音(前缀[1]);
    // TODO 正确处理 多音字 ?
    for (const i of p1) {
      for (const j of p2) {
        const pin_yin = i + "_" + j;
        if (pp[pin_yin] != null) {
          pp[pin_yin].push(前缀);
        } else {
          pp[pin_yin] = [前缀];
        }
      }
    }
  }
  // DEBUG
  console.log("  前缀 -> 词: " + 写入.length);
  console.log("  前缀 " + Object.keys(pt).length);
  console.log("  拼音 -> 前缀 " + Object.keys(pp).length);
  // 保存前缀
  for (const i of Object.keys(pt)) {
    写入.push([["data", "dict", i], pt[i]]);
  }
  // 保存拼音
  for (const i of Object.keys(pp)) {
    写入.push([["data", "dict", i], pp[i]]);
  }
  await batch_set(kv, 写入, 1000);

  console.log("  元数据");
  await 写入元数据(kv, 数据库名称);
}

async function main() {
  const 输出 = Deno.args[0];
  console.log(`${输出}`);

  const 数据 = await 读取stdin();

  // 打开数据库
  const kv = await Deno.openKv(输出);

  const p = new 拼音读取器(kv);
  await p.初始化();
  await 处理(kv, 数据, p);

  // 记得关闭数据库
  kv.close();
}

if (import.meta.main) main();

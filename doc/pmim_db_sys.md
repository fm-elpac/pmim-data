# pmim_sys.db

胖喵输入法内置 (系统) 数据库.

数据库文件位置: `~/.config/pmim/pmim_sys.db`

数据库格式: `deno-kv` <https://deno.com/kv>

## 数据库结构

- 1 元数据
- 2 预加载
- 3 拼音数据
- 4 频率数据
- 5 词库

### 1 元数据

关于数据库自身的描述数据.

- `["pmim_db", "version"]` `"pmim_sys_db version 0.1.0"`

  数据库版本字符串.

- `["pmim_db", "v"]` `{}`

  详细版本信息.

  ```json
  {
    "pmim": "pmim version 0.1.0",
    "deno_version": {
      "deno": "1.40.5",
      "v8": "12.1.285.27",
      "typescript": "5.3.3"
    },
    "n": "胖喵拼音内置数据库 (6w)",
    "_last_update": "2024-02-29T22:30:23.595Z"
  }
  ```

  - `n`: 数据库名称 (用户可读)

- (可选) `["pmim_db", "sys_dict_nc"]` = `1`

  配置标记: 词库没有词的频率数据. 根据汉字平均频率估算词的频率.

- (可选) `["pmim_db", "sys_dict_nc"]` = `1`

  配置标记: 词库没有词的频率数据. 根据汉字平均频率估算词的频率.

### 2 预加载

启动时加载一次, 然后常驻内存.

- `["data", "preload", "pinyin_tgh"]` `{ pc: {}, cp: {} }`

  拼音数据 `pinyin_kTGHZ2013.txt`

  通用规范汉字 8105 个.

- `["data", "preload", "freq_tgh"]` `{}`

  汉字频率数据 `2017_tgh8105.txt`

- `["data", "preload", "freq_ascii"]` `[]`

  ASCII 符号频率数据 `2017_ascii.txt`

- `["data", "preload", "2p_zirjma"]` `{}`

  双拼表 (自然码) `2p_zirjma.json`

### 3 拼音数据

拼音和汉字的对照关系. 只读, 带缓存.

- `["data", "pinyin", pinyin]` `[char]`

- `["data", "pinyin", char]` `[pinyin]`

其余汉字拼音数据 `pinyin_kMandarin.txt`

### 4 频率数据

字符频率数据. 只读, 带缓存.

- `["data", "freq_d", char]` `count`

  其余汉字频率数据 `2017_d.txt`

- `["data", "freq_o", char]` `count`

  其余字符频率数据 `2017_o.txt`

### 5 词库

词库 (词典). 只读, 带缓存.

- `["data", "dict", pin_yin]` `[prefix]`

  拼音至前缀 (2 字).

- `["data", "dict", prefix]` `[text]`

  前缀至词.

  - `["data", "dict", prefix]` `"chunk"`

    由于值过大 (超过 deno-kv 65536 字节的限制), 采用分片方式存储.

- `["data", "dict", prefix, text]` `count`

  词至对应的频率.

TODO

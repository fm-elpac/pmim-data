# pmim-data/data/dict

词库.

## 数据集 (2017)

来源: 使用爬虫随机抓取大量中文网页, 提取其中的中文文本 (原始语料),
使用工具进行分词, 并进行统计.

数据采集时间: 2017 年

文件:

- `2017.db.zst`

解压命令:

```sh
zstd -d 2017.db.zst -o 2017.db
```

数据格式: (详见 `2017.sql`)

```
> sqlite3 2017.db
SQLite version 3.45.1 2024-01-30 16:01:20
Enter ".help" for usage hints.
sqlite> .tables
dict_2017
sqlite> select count(*) from dict_2017;
63814
sqlite> .headers on
sqlite> select * from dict_2017 order by c desc limit 10;
t|c
自己|10000768
什么|8271971
没有|7657341
一个|7578341
知道|6134567
怎么|4655979
这个|4578240
他们|4321784
我们|4012100
已经|3846160
sqlite> select * from dict_2017 order by c asc limit 10;
t|c
一百零八|1000
五十八|1000
五郎|1000
何沁舞|1000
凌雨涵|1000
单据|1000
吉川|1000
同谋|1000
土御门|1000
夏佐|1000
sqlite>
```

TODO

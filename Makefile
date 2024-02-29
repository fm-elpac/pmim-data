# pmim-data/Makefile

# 默认目标
tmp/pmim_sys.db: tmp tmp/pinyin_diff.txt tmp/2017.db
	deno run -A --unstable-kv tool/gen_db_sys.js tmp/pmim_sys.db .
	sqlite3 tmp/2017.db "select * from dict_2017 order by c desc" | deno run -A --unstable-kv tool/gen_db_sys_dict.js tmp/pmim_sys.db

# 创建 tmp/ 目录
tmp:
	mkdir -p tmp

# 清理
clean:
	rm -r tmp

# 解压词库数据
tmp/2017.db: data/dict/2017.db.zst
	zstd -d data/dict/2017.db.zst -o tmp/2017.db

# 下载 Unihan 数据库
tmp/Unihan.zip:
	cd tmp && wget "https://www.unicode.org/Public/UCD/latest/ucd/Unihan.zip"

# 解压 Unihan 数据库
tmp/unihan: tmp/Unihan.zip
	mkdir -p tmp/unihan
	cd tmp/unihan && unzip ../Unihan.zip

# 从 unihan 提取拼音数据
tmp/pinyin_kMandarin.txt: tmp/unihan
	python tool/unicode/unihan_readings.py kMandarin tmp/unihan/Unihan_Readings.txt tmp/pinyin_kMandarin.txt

tmp/pinyin_kTGHZ2013.txt: tmp/unihan
	python tool/unicode/unihan_readings.py kTGHZ2013 tmp/unihan/Unihan_Readings.txt tmp/pinyin_kTGHZ2013.txt

# 拼音数据对比
tmp/pinyin_diff.txt: tmp/pinyin_kMandarin.txt tmp/pinyin_kTGHZ2013.txt
	python tool/unicode/pinyin_diff.py tmp/pinyin_kMandarin.txt tmp/pinyin_kTGHZ2013.txt > tmp/pinyin_diff.txt

# TODO

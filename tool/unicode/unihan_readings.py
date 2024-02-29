#!/usr/bin/env python
# pmim-data/tool/unicode/unihan_readings.py
#
# > python --version
# Python 3.11.7
#
# 命令行格式 (举例):
# > python unihan_readings.py kMandarin Unihan_Readings.txt pinyin.txt
import sys
import io

# 读取文本文件
def 读文件(文件名):
    with io.open(文件名, "r", encoding="utf-8") as f:
        return f.read()

# 写文本文件
def 写文件(文件名, 文本):
    with io.open(文件名, "w", encoding="utf-8") as f:
        f.write(文本)

# 对拼音进行统一格式处理
def 统一拼音(拼音):
    o = []
    # 首先使用空格分隔
    for i in 拼音.split(" "):
        # 如果存在 `:` 字符, 只保留 `:` 后的内容
        c = i.find(":")
        if c > 0:
            p = i[(c + 1):]
        else:
            p = i
        # 将 `,` 替换为空格
        p = p.replace(",", " ")

        o.append(p)
    return (" ").join(o)

# 读取 Unihan_Readings.txt
#
# k: kMandarin, kTGHZ2013, kHanyuPinyin
def 读取数据(文件名, k):
    print(文件名)

    文本 = 读文件(文件名)
    o = []
    for i in 文本.split("\n"):
        # 忽略注释
        if i.startswith("#"):
            continue
        # 忽略空行
        if len(i.strip()) < 1:
            continue

        # 处理 k
        p = i.split("	")  # 分隔符: 制表符 (tab)
        if p[1] == k:
            汉字 = chr(int(p[0][2:], 16))
            o.append([汉字, 统一拼音(p[2])])
    return o

# 统计拼音中出现的字符
def 统计拼音(数据):
    o = {}
    for i in 数据:
        for c in i[1]:
            if (ord(c) > ord("z")) or (ord(c) < ord("a")):
                o[c] = 1
    字符 = list(o.keys())
    字符.sort()

    print(字符)

# 拼音字符对照表 (声调)
拼音表 = {
    "ā": ("a", 1),
    "á": ("a", 2),
    "ǎ": ("a", 3),
    "à": ("a", 4),

    "ē": ("e", 1),
    "é": ("e", 2),
    "ě": ("e", 3),
    "è": ("e", 4),

    "ī": ("i", 1),
    "í": ("i", 2),
    "ǐ": ("i", 3),
    "ì": ("i", 4),

    "ō": ("o", 1),
    "ó": ("o", 2),
    "ǒ": ("o", 3),
    "ò": ("o", 4),

    "ū": ("u", 1),
    "ú": ("u", 2),
    "ǔ": ("u", 3),
    "ù": ("u", 4),

    "ü": ("v", 0),
    "ǘ": ("v", 2),
    "ǚ": ("v", 3),
    "ǜ": ("v", 4),

    "ń": ("n", 2),
    "ň": ("n", 3),
    "ǹ": ("n", 4),

    "ḿ": ("m", 2),

    "ê": ("e", 0),
    "ế": ("e", 0),
    "ề": ("e", 0),
    chr(0x300): ("", 0),
    chr(0x304): ("", 0),
    chr(0x30c): ("", 0),
}

# 对拼音的每个字符进行处理
def 处理单个拼音(文本):
    声调 = 0
    o = ""

    for c in 文本:
        if ord(c) > ord("z"):
            数据 = 拼音表[c]
            声调 = 数据[1]
            o += 数据[0]
        else:
            o += c
    # 标注声调
    if 声调 > 0:
        o += str(声调)
    return o

# 对原始拼音数据进行处理
def 处理拼音(数据):
    o = {}
    # 集中每个汉字的所有拼音
    for i in 数据:
        # 多音字
        拼音列表 = i[1].split(" ")
        for j in 拼音列表:
            拼音 = 处理单个拼音(j)
            汉字 = i[0]
            if o.get(汉字) == None:
                o[汉字] = [拼音]
            else:
                o[汉字].append(拼音)
    # 转换输出数据格式
    输出 = []
    列表 = list(o.keys())
    列表.sort()
    for i in 列表:
        行 = [i] + o[i]
        # DEBUG
        if len(o[i]) > 1:
            print(行)

        输出.append((" ").join(行))
    return ("\n").join(输出) + "\n"

def main():
    # 获取命令行参数
    k = sys.argv[1]
    输入 = sys.argv[2]
    输出 = sys.argv[3] if len(sys.argv) > 3 else None

    数据 = 读取数据(输入, k)

    if 输出 != None:
        结果 = 处理拼音(数据)
        写文件(输出, 结果)
    else:
        统计拼音(数据)

if __name__ == "__main__":
    main()

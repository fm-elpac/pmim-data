#!/usr/bin/env python
# pmim-data/tool/unicode/pinyin_diff.py
#
# > python --version
# Python 3.11.7
#
# 命令行格式 (举例):
# > python pinyin_diff.py pinyin_kMandarin.txt pinyin_kTGHZ2013.txt
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

# 读取 pinyin_*.txt
def 读取数据(文件名):
    文本 = 读文件(文件名)
    o = []
    for i in 文本.split("\n"):
        # 忽略注释
        if i.startswith("#"):
            continue
        # 忽略空行
        if len(i.strip()) < 1:
            continue

        o.append(i.split(" "))
    return o

# 执行集合对比
def 对比(文件a, 文件b):
    print(文件a + " -> " + 文件b)

    a = 读取数据(文件a)
    b = 读取数据(文件b)

    # a 的所有汉字 (及对应拼音)
    sa = {}
    for i in a:
        sa[i[0]] = i[1:]
    # b 的所有汉字 (及对应拼音)
    sb = {}
    for i in b:
        sb[i[0]] = i[1:]

    # b 新增的汉字
    sba = {}
    for i in b:
        if sa.get(i[0]) == None:
            sba[i[0]] = 1

    # b 缺失的汉字
    sab = {}
    for i in a:
        if sb.get(i[0]) == None:
            sab[i[0]] = 1

    # a, b 包含汉字的数量
    print("  " + str(len(sa)) + " -> " + str(len(sb)))
    # b 新增和缺失的汉字数量
    print("  新增: " + str(len(sba)) + "  缺失: " + str(len(sab)))

    # 查找相同和不同的拼音
    ss = {}
    sd = {}

    for i in b:
        if sa.get(i[0]) != None:
            pa = sa[i[0]]
            pb = sb[i[0]]

            if pa != pb:
                sd[i[0]] = (pa, pb)
            else:
                ss[i[0]] = pa
    print("\n  拼音: 相同 " + str(len(ss)) + "  不同 " + str(len(sd)))

    for i in sd.keys():
        print("  " + i + ": " + (" ").join(sd[i][0]) + " -> " + (" ").join(sd[i][1]))

def main():
    # 获取命令行参数
    a = sys.argv[1]
    b = sys.argv[2]

    对比(a, b)

if __name__ == "__main__":
    main()

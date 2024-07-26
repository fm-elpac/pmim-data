# pmim-data

<https://github.com/fm-elpac/pmim-data>

胖喵输入法: 数据

![CI](https://github.com/fm-elpac/pmim-data/actions/workflows/ci.yml/badge.svg)

镜像:

- <https://bitbucket.org/fm-elpac/pmim-data/>
- <https://codeberg.org/fm-elpac/pmim-data>
- <https://notabug.org/fm-elpac/pmim-data>
- <https://gitlab.com/fm-elpac/pmim-data>

## 目录

- `doc/` 文档

- `tool/` 工具

- `data/` 数据集

## 例行更新维护策略

适用于本仓库 (pmim-data). 当下列条件任意一条满足时,
本仓库的软件需要发布新的维护版本 (版本号 `x.y.z` 其中 `z` + 1). "更新所有依赖"
并重新编译 (构建):

- deno 发布新版本 (版本号 `x.y.z` 其中 `x` 或 `y` 变化)

- Unicode 发布新版本 (版本号 `x.y.z` 其中 `x` 变化)

- 各依赖或本仓库发布重要的安全更新 (修复比较严重的安全漏洞)

当前重要依赖的版本号:

- deno 1.45.3

  <https://github.com/denoland/deno>

- Unicode 15.1.0

  <https://www.unicode.org/versions/latest/>

## 相关文章

- 《从 Unicode 标准提取拼音数据》
  - <https://www.bilibili.com/read/cv31310500/>
  - <https://zhuanlan.zhihu.com/p/682228507>
  - <https://juejin.cn/post/7343902139821686820>
  - <https://blog.csdn.net/secext2022/article/details/136110314>

- 《双拼 (自然码) 的简单实现》
  - <https://www.bilibili.com/read/cv31311490/>
  - <https://zhuanlan.zhihu.com/p/682352730>
  - <https://juejin.cn/post/7343889290433200139>
  - <https://blog.csdn.net/secext2022/article/details/136120779>

## LICENSE

[`CC-BY-SA 4.0+`](https://creativecommons.org/licenses/by-sa/4.0/)

本仓库的内容使用 创意共享-署名-相同方式共享 (CC-BY-SA 4.0) 许可 (LICENSE). This
repository is released under Creative Common (CC-BY-SA 4.0) license.

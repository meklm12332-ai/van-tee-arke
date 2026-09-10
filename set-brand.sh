#!/bin/bash
# 用法:  ./set-brand.sh "你的品牌名"
# 把 index.html 里所有占位品牌名 VANDÉAC 替换成你输入的名字。
set -e
[ -z "$1" ] && { echo "用法: ./set-brand.sh \"你的品牌名\""; exit 1; }
NEW="$1"
cd "$(dirname "$0")"
# 备份
cp index.html "index.html.bak.$(date +%s)"
# 替换（含 <title>、导航、页脚、正文、图片 alt）
perl -CSD -i -pe "s/VANDÉAC/\Q$NEW\E/g" index.html
echo "已把品牌名改为: $NEW"
echo "已备份原文件为 index.html.bak.*"
echo "如需重新生成单文件 share.html，请再运行一次打包步骤。"

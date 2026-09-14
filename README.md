# VANDÉAC — Haute Joaillerie (working draft)

一个高级珠宝品牌官网。**VANDÉAC 只是占位品牌名**，请替换成你自己的原创名字
（避免 "Van X & Y" 这类会和现有品牌混淆的结构）。

## 预览

```bash
cd 钻石网站
python3 -m http.server 8080   # http://localhost:8080
```

或双击 `share.html`（单文件版本，样式/脚本/图片全部内嵌，发给别人直接能打开）。

## 页面结构与品牌叙事

| 区块 | 内容 |
|---|---|
| Hero | 极简，柔和的高级背景（渐变光晕 + 淡钻石几何 + 模糊色彩，不挡字） |
| The Maison | 品牌起源故事：「建在光与水相遇之处的珠宝之家」 |
| The House Code | 品牌三条准则：光先于装饰 / 宝石主导 / 一室一客 |
| Collections | 四个系列叙事 |
| Signature | 本季臻品 |
| Savoir-Faire | 工艺四阶段（已改为网格，不再左右滑动） |
| The Salon | 你们的实际场地：维港之上的沙龙 |
| Le Journal | 品牌志刊 |
| By Appointment | 预约邀约（创始人口吻） |
| Visit | 到访信息（香港沙龙 · 预约制） |

## 放入你们的场地照片（5 张）

把你发的 5 张实景照按下面命名，放进 `assets/images/`。放进去之前显示金色渐变占位，不破版。

| 文件名 | 用在 | 建议用哪张 |
|---|---|---|
| `salon-hero.jpg` | The Salon 全屏通栏（横向、暗调最佳） | 吊灯 + 展台 + 维港那张 |
| `salon-hall.jpg` | The Salon 图组 · 左（横向） | 沙龙全景、一排展柜 |
| `salon-centre.jpg` | The Salon 图组 · 右（竖向更佳） | 中央圆形花瓣展台 |
| `salon-lounge.jpg` | By Appointment 背景 | 米白单椅 + 紫色沙发休息区 |
| `salon-vitrines.jpg` | Visit 配图（竖向 4:5） | 云石柱 + 金框展柜那排 |

想换其他区块的图：把 `assets/images/` 里对应文件（`hero.jpg` `coll-*.jpg` `savoir-*.jpg` `journal-*.jpg` `signature.jpg`）替换成你自己的即可，HTML 不用改。

## 改文案 / 品牌名 / 配色

- 品牌名：改 `index.html` 里的 `VANDÉAC`（导航、页脚、`<title>`）
- 叙事文案：直接改 `index.html` 各区块段落
- 配色：`assets/css/style.css` 顶部 `:root` 的 `--gold` `--noir` `--paper`
- 地址 / 邮箱 / 营业时间：Visit 区块里的 `salon@vandeac.example` 等占位符

## 邮箱订阅（Netlify Forms）

页面最下面的订阅表单已经接上 **Netlify Forms**，提交的邮箱会自动存进 Netlify 后台，不需要自己搭数据库。

**怎么看提交记录：**
1. 打开 https://app.netlify.com → 选中这个站点
2. 左侧 **Forms** → 会看到一个叫 `newsletter` 的表单
3. 每条提交（邮箱地址、时间）都在列表里，右上角可以 **导出 CSV**
4. Forms → 右上角 **Settings** 里可以设置「每次有人提交就发邮件通知我」

**重要 —— 第一次生效前必做：**
Netlify 是在**部署时**扫描 HTML 里的 `<form data-netlify="true">` 来注册表单的。
如果你是**改完代码后重新部署**（重新拖文件夹 / `git push`），表单会自动被识别，什么都不用做。
如果表单在后台一直没出现：确认部署的是最新的 `index.html`，重新触发一次 Deploy。

**注意：**
- `share.html`（单文件版）不是部署在 Netlify 上的，里面的订阅表单**不会真的保存邮箱**（提交会失败并提示重试），这个文件只用于预览/分享效果，不要用来收集邮箱。
- 表单里加了一个隐藏的"蜜罐"字段（`bot-field`）用来挡垃圾机器人提交，正常用户看不到、不用管。

## 说明

内置的产品 / 工艺 / 志刊图片来自 Unsplash（可免费商用），正式上线请替换为你持有版权的素材。
场地照片由你自行提供。品牌叙事为本站原创撰写，可自由修改。

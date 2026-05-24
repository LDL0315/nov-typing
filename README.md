# 🧬 nov-typing

<p align="center">
  <b>诺如病毒分型工具 | Norovirus Genotyping Platform</b><br>
  一个基于浏览器的轻量级诺如病毒基因型别鉴定工具
</p>

<p align="center">
  <a href="https://nov-typing.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/在线演示-点击访问-brightgreen?style=flat-square&logo=vercel" alt="在线演示">
  </a>
  <img src="https://img.shields.io/badge/技术栈-纯前端-blue?style=flat-square" alt="技术栈">
  <img src="https://img.shields.io/badge/状态-已上线-success?style=flat-square" alt="状态">
</p>

---

## 📖 简介

**nov-typing** 是一个纯前端实现的诺如病毒（Norovirus）基因型别自动鉴定工具。用户可直接在浏览器中提交 FASTA 格式序列，系统通过本地参考库进行无缺口滑动重叠比对，自动输出 VP1 和 RdRp 片段的组合分型结果。

无需安装任何软件，无需配置服务器环境，打开网页即可使用。

> 🔗 **在线体验**：https://nov-typing.vercel.app/

---

## ✨ 功能特点

- ✅ **完全离线可用** — 参考库随项目本地加载，无需联网调用外部 API
- ✅ **支持多种输入格式** — FASTA、多 FASTA、原始核酸序列直接粘贴
- ✅ **双片段联合分型** — 同时分析 VP1 和 RdRp，输出组合型别（如 `GII.P17_GII.4`）
- ✅ **双向比对** — 自动尝试正向与反向互补序列
- ✅ **参数可调** — 支持自定义重叠长度阈值、身份阈值、k-mer 大小及候选数上限
- ✅ **结果导出** — 一键导出 CSV 格式的分型报告
- ✅ **零后端依赖** — 纯 HTML/CSS/JS 实现，可部署至任何静态托管平台

---

## 🚀 快速开始

### 方式一：在线使用（推荐）

直接访问部署好的站点：

👉 **[https://nov-typing.vercel.app/](https://nov-typing.vercel.app/)**

### 方式二：本地运行

```bash
# 克隆仓库
git clone https://github.com/LDL0315/nov-typing.git
cd nov-typing

# 启动本地服务器（必须，否则浏览器会阻止读取 reference 目录）
python3 -m http.server 4173

# 浏览器打开
open http://localhost:4173
```

> ⚠️ **注意**：直接双击 `index.html` 打开可能导致 `reference/` 目录读取失败，请务必通过本地服务器访问。

---

## 🧪 分型逻辑

1. **参考库加载**：自动读取 `reference/` 目录下的 `nov-vp1-*.fa` 和 `nov-rdrp-*.fa` 参考序列
2. **基因型解析**：从序列标题中自动提取基因型标签（如 `GII.4`、`GII.P17`）
3. **序列预处理**：对输入序列同时尝试 **正向** 与 **反向互补** 两种方向
4. **滑动比对**：使用无缺口滑动重叠比对，计算身份度（Identity）、匹配数、重叠长度
5. **结果筛选**：
   - 默认最小重叠长度：**100 nt**
   - VP1 身份阈值：**80%**
   - RdRp 身份阈值：**85%**
6. **分型输出**：
   - 双片段均通过 → 输出组合分型（如 `GII.P17_GII.17`）
   - 仅单片段通过 → 输出单片段结果

### 性能参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| 最小重叠长度 | 100 nt | 低于此长度的匹配将被忽略 |
| VP1 身份阈值 | 80% | VP1 片段判定阈值 |
| RdRp 身份阈值 | 85% | RdRp 片段判定阈值 |
| k-mer 大小 | 13 | 用于快速预筛选的 k-mer 长度 |
| 候选数上限 | 20 | 保留的最佳候选数 |

> 💡 **提示**：对于全基因组序列，建议使用默认参数；对于短片段，可适当降低重叠长度阈值。

---

## 📁 项目结构

```
nov-typing/
├── index.html          # 页面结构与 UI
├── styles.css          # 界面样式
├── app.js              # 核心逻辑：FASTA 解析、参考库加载、比对算法、CSV 导出
├── reference/          # 本地参考序列库
│   ├── nov-vp1-*.fa    # VP1 参考序列
│   └── nov-rdrp-*.fa   # RdRp 参考序列
└── README.md           # 本文件
```

---

## 🌐 数据库更新

本软件参考  **[杯状病毒委员会Human Calicivirus数据库](https://calicivirustypingtool.cdc.gov/becerance.cgi)**
已同步更新为April 27, 2026版本
感谢杯状病毒委员会的工作和支持！

## 📝 更新日志

- **2026-05** — 项目上线，支持 VP1 / RdRp 双片段联合分型
- **2026-05** — 新增 k-mer 预筛选与候选数上限配置，优化全基因组比对性能

---

## 🤝 贡献

欢迎提交 Issue 或 PR：
- 补充更多参考序列
- 优化比对算法性能
- 改进 UI 交互体验

---

## 📄 许可

本项目仅供学术研究使用。

---

<p align="center">
  Made by <a href="https://github.com/LDL0315">LDL0315</a>
</p>

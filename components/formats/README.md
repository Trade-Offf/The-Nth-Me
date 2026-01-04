# 格式工厂 (Format Factory)

纯前端图片格式转换工具集，无需服务器，隐私安全。

## ✅ 已实现功能（7个工具）

### 📊 压缩工具对比

| 工具 | 输入 | 输出 | 适用场景 |
|------|------|------|----------|
| **WebP 转换器** | JPG/PNG | **WebP** | 网站优化、需要透明背景、现代浏览器 |
| **JPEG 压缩器** | 任意格式 | **JPEG** | 快速压缩、批量处理、兼容性优先 |

### 无需额外依赖（2个）

1. **WebP 转换器** (`WebPConverter.tsx`)
   - **定位**：Web 现代格式转换
   - JPG/PNG → WebP（网页优化，更小文件）
   - WebP → JPG/PNG（兼容性转换）
   - 质量可调（高质量 90% / 平衡 80% / 压缩 60%）
   - 批量转换，实时显示对比
   - **适用场景**：网站图片优化、需要更好的压缩率

2. **JPEG 压缩器** (`CompressTool.tsx`)
   - **定位**：通用极限压缩工具
   - 任意格式 → JPEG（统一输出）
   - 质量滑块调节（10%-100%）
   - 可设置最大宽度/高度限制
   - 批量处理，显示压缩对比
   - **适用场景**：快速减小文件、批量处理、不需要透明背景

### 已安装依赖（4个）

3. **Live Photo 转换器** (`HeicConverter.tsx`) ✅
   - **HEIC/HEIF 转换**：静态图 → JPG/PNG
   - **MOV 视频选帧**：从 Live Photo 视频中提取关键帧
   - **智能检测**：自动识别文件类型（HEIC 或 MOV）
   - **时间轴交互**：拖动滑块实时预览每一帧
   - **多帧选择**：可选择导出单帧或全部帧
   - **视频信息**：显示时长、时间戳、帧编号
   - 质量可调、批量处理

4. **PDF 转图片** (`Pdf2ImgConverter.tsx`) ✅
   - **单页模式**：PDF 每页拆分为独立图片
   - **长图模式**：所有页面纵向拼接成一张长图
   - 可选页码范围（全部/自定义）
   - 清晰度可调（标准 1x / 高清 2x / 超清 3x）
   - 实时预览

5. **图片转 PDF** (`Img2PdfConverter.tsx`) ✅
   - 多张图片合并成 PDF
   - 拖拽调整顺序
   - 页面尺寸（A4 / Letter / 自动）
   - 支持 JPG/PNG/WebP

6. **ICO 生成器** (`IcoGenerator.tsx`) ✅
   - 多尺寸 PNG 图标生成（16/32/48/64/128/256px）
   - 可自由选择需要的尺寸
   - **ZIP 打包下载**：一次性下载所有尺寸的独立 PNG 文件
   - 适用于 favicon、应用图标等
   - 纯 Canvas 实现，使用 JSZip 打包

7. **视频转 GIF** (`Video2GifConverter.tsx`) ✅
   - 视频转 GIF 动图（限制 10 秒或 20MB）
   - 帧率可调（5/10/15/30 FPS）
   - 尺寸缩放（原始/50%/25%）
   - 自定义时间范围（开始/结束时间）
   - 实时预览和进度显示
   - 使用 gif.js 编码

## 已安装依赖

当前已安装：

```bash
# ✅ 已安装（完整功能）
npm install heic2any        # HEIC 转换器
npm install pdfjs-dist      # PDF 转图片
npm install jspdf           # 图片转 PDF
npm install gif.js          # 视频转 GIF
npm install jszip file-saver # 辅助工具
```

**重要**：Worker 文件配置
- **gif.js**：已复制到 `public/gif.worker.js`
- **pdfjs-dist**：已复制到 `public/pdf.worker.min.mjs`

## 文件结构

```
components/formats/
├── README.md                    # 本文档
├── ToolCard.tsx                 # 工具卡片组件
├── ToolModal.tsx                # 工具弹窗容器
└── tools/
    ├── WebPConverter.tsx        # ✅ WebP 转换器
    ├── CompressTool.tsx         # ✅ 批量压缩
    ├── HeicConverter.tsx        # ✅ HEIC 转换器
    ├── Pdf2ImgConverter.tsx     # ✅ PDF 转图片
    ├── Img2PdfConverter.tsx     # ✅ 图片转 PDF
    ├── Video2GifConverter.tsx   # ✅ 视频转 GIF
    └── IcoGenerator.tsx         # ✅ ICO 生成器
```

## 使用说明

### 访问页面

```
/formats
```

### 添加新工具

1. 在 `tools/` 目录创建新组件
2. 在 `ToolModal.tsx` 中注册
3. 在 `app/formats/page.tsx` 的 `toolOrder` 中添加
4. 在 i18n 翻译文件中添加文案

## 技术特点

- ✅ **纯前端处理**：所有转换在浏览器本地完成
- ✅ **隐私安全**：文件不上传到服务器
- ✅ **批量处理**：支持多文件同时转换
- ✅ **实时预览**：转换结果即时显示
- ✅ **无使用限制**：文件数量和大小无限制
- ✅ **响应式设计**：桌面端和移动端自适应

## 性能优化

- Canvas API 高质量缩放
- 批量转换并发控制
- 及时释放 Blob URL
- 进度状态实时反馈

## 浏览器兼容性

- Chrome 80+
- Edge 18+
- Firefox 65+
- Safari 11+

## 当前功能完成度

- ✅ **核心功能**: 7/7 已完成（100%）
- 📊 **依赖状态**: 所有必需依赖已安装
- 🎯 **状态**: 格式特工功能完整可用

## 功能特点总结

### 图片格式转换
- ✅ WebP 双向转换
- ✅ HEIC → JPG/PNG（iPhone 照片）
- ✅ 批量智能压缩

### 文档处理
- ✅ PDF → 图片（单页/长图）
- ✅ 图片 → PDF（拖拽排序）

### 动图/图标
- ✅ 视频 → GIF（限制 10s/20MB）
- ✅ ICO 多尺寸图标生成

### 核心优势
- 🔒 **纯前端处理**：文件不上传，隐私安全
- ⚡ **即时转换**：本地处理，秒级完成
- 🎯 **无限制**：文件数量和次数无限制
- 🎨 **赛博朋克 UI**：与网站风格统一


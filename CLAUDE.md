# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

这是一个图片转ASCII艺术的Web应用项目，支持将PNG/JPEG图片转换为ASCII艺术字符。主要功能包括：
- 图片上传（支持拖拽）
- OCR文字识别（中文、日文、英文）
- 图像转ASCII艺术
- 结果复制和下载

## Project Structure

```
asciiArt/
├── index.html      # 主页面，包含完整的UI结构
├── style.css       # 样式文件，包含响应式设计和动画效果
├── script.js       # 核心JavaScript功能
└── CLAUDE.md       # 项目文档
```

## Development Commands

这是一个纯前端项目，无需构建步骤：
- 直接在浏览器中打开 `index.html` 即可运行
- 适合部署到GitHub Pages
- 使用CDN加载Tesseract.js库

## Architecture Notes

### 核心类结构
- `ASCIIArtConverter` 类：主要的功能类，包含所有转换逻辑
  - 图片上传和预览
  - OCR文字识别（使用Tesseract.js）
  - 图像到ASCII转换算法
  - 用户交互处理

### 关键功能实现
1. **图片处理**：使用Canvas API处理图片，调整尺寸和获取像素数据
2. **OCR识别**：集成Tesseract.js，支持多语言文字识别
3. **ASCII转换**：基于灰度值映射到ASCII字符集的算法
4. **响应式设计**：支持移动端和桌面端

## Dependencies

- **Tesseract.js v4**: OCR文字识别库，通过CDN加载
- **纯HTML/CSS/JavaScript**: 无需额外构建工具

## GitHub Pages部署

确保 `index.html` 在根目录，GitHub Pages会自动识别并部署。

## 特殊注意事项

- OCR识别需要加载较大的语言模型，首次使用时会有下载时间
- ASCII字符映射使用 `@%#*+=-:. ` 字符集，从暗到亮排列
- 图片尺寸会影响转换效果，建议使用40-120字符宽度范围
- 支持拖拽上传，提升用户体验
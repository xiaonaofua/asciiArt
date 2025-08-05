# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

这是一个基于图像轮廓的ASCII艺术生成器，专注于通过智能边缘检测创造高质量的ASCII艺术。主要功能包括：
- 图片上传（支持拖拽）
- Sobel边缘检测算法
- 高斯模糊和形态学噪音过滤
- 智能ASCII字符映射
- 精细参数控制
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
- `OutlineASCIIConverter` 类：主要的功能类，包含所有转换逻辑
  - 图片上传和预览
  - 图像预处理（灰度转换、高斯模糊）
  - Sobel边缘检测算法
  - 形态学操作（腐蚀、膨胀）
  - 智能ASCII字符映射
  - 用户交互处理

### 关键功能实现
1. **图片处理**：Canvas API处理图片，调整尺寸和获取像素数据
2. **边缘检测**：Sobel算子计算图像梯度，识别轮廓信息
3. **噪音过滤**：高斯模糊平滑 + 形态学操作清理噪点
4. **ASCII转换**：双重字符集策略，边缘用块状字符，内部用渐变字符
5. **参数控制**：可调节边缘敏感度、噪音过滤强度、输出宽度等
6. **响应式设计**：支持移动端和桌面端

## Dependencies

- **纯HTML/CSS/JavaScript**: 无需外部依赖库，纯前端实现
- **Canvas API**: 图像处理和像素操作
- **现代浏览器特性**: 支持ES6+语法

## GitHub Pages部署

确保 `index.html` 在根目录，GitHub Pages会自动识别并部署。

## 特殊注意事项

### 算法核心
- **边缘检测**: 使用Sobel算子，可通过边缘敏感度参数调节检测强度
- **噪音过滤**: 结合高斯模糊和形态学操作，有效去除图像噪点
- **字符映射**: 双重策略
  - 边缘字符集: `█▉▊▋▌▍▎▏` (块状字符表现轮廓)
  - 填充字符集: `@%#*+=-:. ` (渐变字符表现内部)

### 参数调节指导
- **ASCII宽度**: 40-120字符，影响输出精细度
- **边缘敏感度**: 50-200，数值越高检测的边缘越多
- **噪音过滤**: 0-10，数值越高过滤效果越强
- **反转颜色**: 适用于不同背景色的显示需求

### 性能优化
- 纯JavaScript实现，无外部依赖
- 算法经过优化，处理速度快
- 支持实时参数调节和预览
# ASCII Art Generator - React + TypeScript 版本

这是一个基于 React 和 TypeScript 重写的 ASCII 艺术生成器。

## 项目结构

```
asciiArt/
├── src/
│   ├── components/
│   │   └── App.tsx           # 主应用组件
│   ├── hooks/
│   │   ├── useASCIIConverter.ts  # ASCII 转换 Hook
│   │   └── useI18n.ts         # 国际化 Hook
│   ├── styles/
│   │   └── App.css           # 应用样式
│   └── main.tsx              # 入口文件
├── index.html                # HTML 模板
├── package.json              # 项目依赖
├── tsconfig.json             # TypeScript 配置
├── vite.config.ts            # Vite 配置
└── README-REACT.md           # 本文档
```

## 安装依赖

```bash
npm install
```

## 开发运行

```bash
npm run dev
```

## 构建生产版本

```bash
npm run build
```

## 预览生产构建

```bash
npm run preview
```

## 技术栈

- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **CSS** - 样式系统

## 主要功能

1. **图片上传** - 支持拖拽和点击选择
2. **智能参数调整** - 根据图片大小自动调整 ASCII 宽度
3. **实时转换** - 上传后自动转换
4. **参数控制**:
   - ASCII 宽度 (40-360)
   - 边缘敏感度 (50-200)
   - 噪音过滤 (0-10)
   - 反转颜色
   - 自动优化参数
5. **多语言支持** - 中文、英文、日文
6. **结果导出** - 文字版和图片版
7. **响应式设计** - 支持移动端

## 核心架构

### Hooks

#### useASCIIConverter
- 管理图片转换逻辑
- 高斯模糊算法
- 图像特征分析
- 最佳参数计算
- ASCII 字符映射

#### useI18n
- 多语言支持
- 本地存储语言偏好
- 动态切换语言

### 组件结构

- **App.tsx** - 主组件,包含所有 UI 和交互逻辑
- 使用 React Hooks 管理状态
- 响应式设计,适配各种屏幕尺寸

## 算法说明

### 图像预处理
1. 灰度转换
2. 高斯模糊(可选)
3. 噪音过滤

### ASCII 转换
使用灰度映射算法:
```
字符集: '@%#*+=-:. '
映射: 灰度值 → 字符索引
```

### 智能优化
- 根据图像对比度调整边缘敏感度
- 根据噪音水平调整过滤强度
- 根据图片尺寸智能调整输出宽度

## 部署

### GitHub Pages
```bash
npm run build
# 将 dist 文件夹部署到 GitHub Pages
```

### 其他平台
构建后的 `dist` 文件夹可部署到任何静态托管平台。

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

需要支持 ES2020+ 特性。

## License

MIT

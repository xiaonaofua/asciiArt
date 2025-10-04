# 部署指南

## GitHub Pages 自动部署

本项目已配置 GitHub Actions 自动部署到 GitHub Pages。

### 🚀 自动部署流程

1. **触发条件**:
   - 推送到 `master` 分支时自动触发
   - 也可以在 GitHub Actions 页面手动触发

2. **部署步骤**:
   - 安装依赖 (`npm ci`)
   - 构建项目 (`npm run build`)
   - 上传构建产物到 GitHub Pages
   - 自动部署

### ⚙️ GitHub Pages 设置

首次部署需要在 GitHub 仓库中配置:

1. 进入仓库的 **Settings** → **Pages**
2. 在 **Source** 下选择:
   - Source: **GitHub Actions**
3. 保存设置

### 🌐 访问地址

部署成功后,可以通过以下地址访问:

```
https://xiaonaofua.github.io/asciiArt/
```

### 📝 配置文件

- **`.github/workflows/deploy.yml`** - GitHub Actions 工作流配置
- **`vite.config.ts`** - Vite 构建配置 (base: '/asciiArt/')

### 🔍 查看部署状态

1. 进入仓库的 **Actions** 标签页
2. 查看最新的 "Deploy to GitHub Pages" 工作流
3. 绿色 ✅ 表示部署成功
4. 红色 ❌ 表示部署失败,点击查看错误日志

### 🛠️ 本地构建测试

在推送前可以本地测试构建:

```bash
# 构建
npm run build

# 预览构建结果
npm run preview
```

### 📦 手动部署 (可选)

如果需要手动部署:

```bash
# 1. 构建项目
npm run build

# 2. 进入 dist 目录
cd dist

# 3. 初始化 git 并推送到 gh-pages 分支
git init
git add -A
git commit -m 'deploy'
git push -f git@github.com:xiaonaofua/asciiArt.git master:gh-pages

# 4. 返回项目根目录
cd ..
```

### ⚠️ 注意事项

1. **base 路径**: 确保 `vite.config.ts` 中的 `base` 设置为 `/asciiArt/` (与仓库名一致)
2. **权限**: GitHub Actions 需要有写入 Pages 的权限 (已在 workflow 中配置)
3. **分支保护**: 如果启用了分支保护,确保 GitHub Actions 可以推送

### 🔄 更新部署

每次推送到 `master` 分支都会自动触发部署:

```bash
git add .
git commit -m "更新功能"
git push
```

等待 1-2 分钟,访问网站即可看到更新。

### 🐛 常见问题

1. **404 错误**
   - 检查 GitHub Pages 是否已启用
   - 确认 base 路径配置正确

2. **样式丢失**
   - 检查 vite.config.ts 中 base 路径
   - 确保资源引用使用相对路径

3. **部署失败**
   - 查看 Actions 日志
   - 检查 package.json 依赖是否正确
   - 确认 Node 版本兼容性

### 📚 相关文档

- [GitHub Pages 文档](https://docs.github.com/en/pages)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Vite 部署文档](https://vitejs.dev/guide/static-deploy.html)

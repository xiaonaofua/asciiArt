class OutlineASCIIConverter {
    constructor() {
        this.currentImage = null;
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        // 获取DOM元素
        this.uploadArea = document.getElementById('uploadArea');
        this.imageInput = document.getElementById('imageInput');
        this.selectButton = document.getElementById('selectButton');
        this.previewSection = document.getElementById('previewSection');
        this.previewImage = document.getElementById('previewImage');
        this.loadingSection = document.getElementById('loadingSection');
        this.loadingText = document.getElementById('loadingText');
        this.resultSection = document.getElementById('resultSection');
        this.asciiOutput = document.getElementById('asciiOutput');
        this.convertButton = document.getElementById('convertButton');
        this.copyButton = document.getElementById('copyButton');
        this.downloadButton = document.getElementById('downloadButton');
        this.resetButton = document.getElementById('resetButton');
        
        // 新的控制元素
        this.asciiWidth = document.getElementById('asciiWidth');
        this.widthValue = document.getElementById('widthValue');
        this.edgeThreshold = document.getElementById('edgeThreshold');
        this.thresholdValue = document.getElementById('thresholdValue');
        this.noiseReduction = document.getElementById('noiseReduction');
        this.noiseValue = document.getElementById('noiseValue');
        this.invertColors = document.getElementById('invertColors');
        this.autoOptimize = document.getElementById('autoOptimize');
    }

    bindEvents() {
        // 文件选择事件
        this.selectButton.addEventListener('click', () => this.imageInput.click());
        this.imageInput.addEventListener('change', (e) => this.handleFileSelect(e));

        // 拖拽事件
        this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));

        // 转换按钮
        this.convertButton.addEventListener('click', () => this.convertToASCII());

        // 控制按钮
        this.copyButton.addEventListener('click', () => this.copyResult());
        this.downloadButton.addEventListener('click', () => this.downloadResult());
        this.resetButton.addEventListener('click', () => this.reset());

        // 控制滑块
        this.asciiWidth.addEventListener('input', (e) => {
            this.widthValue.textContent = e.target.value;
        });
        
        this.edgeThreshold.addEventListener('input', (e) => {
            this.thresholdValue.textContent = e.target.value;
        });
        
        this.noiseReduction.addEventListener('input', (e) => {
            this.noiseValue.textContent = e.target.value;
        });
    }

    handleDragOver(e) {
        e.preventDefault();
        this.uploadArea.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.processFile(file);
        }
    }

    processFile(file) {
        if (!this.isValidImageFile(file)) {
            alert('请选择有效的PNG或JPEG图片文件！');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.currentImage = new Image();
            this.currentImage.onload = () => {
                this.showPreview(e.target.result);
            };
            this.currentImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    isValidImageFile(file) {
        const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        return validTypes.includes(file.type);
    }

    showPreview(imageSrc) {
        this.previewImage.src = imageSrc;
        this.previewSection.style.display = 'block';
        this.resultSection.style.display = 'none';
    }

    showLoading(message = '正在处理图片...') {
        this.loadingText.textContent = message;
        this.loadingSection.style.display = 'block';
        this.previewSection.style.display = 'none';
        this.resultSection.style.display = 'none';
    }

    hideLoading() {
        this.loadingSection.style.display = 'none';
    }

    async convertToASCII() {
        if (!this.currentImage) return;

        try {
            // 创建canvas处理图片
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            const targetWidth = parseInt(this.asciiWidth.value);
            const aspectRatio = this.currentImage.height / this.currentImage.width;
            const targetHeight = Math.floor(targetWidth * aspectRatio * 0.5);

            canvas.width = targetWidth;
            canvas.height = targetHeight;
            
            ctx.drawImage(this.currentImage, 0, 0, targetWidth, targetHeight);
            
            // 获取图像数据
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            
            let bestParams = {
                edgeThreshold: parseInt(this.edgeThreshold.value),
                noiseReduction: parseInt(this.noiseReduction.value)
            };
            
            // 如果启用自动优化，寻找最佳参数
            if (this.autoOptimize.checked) {
                this.showLoading('正在分析图像特征...');
                bestParams = await this.findOptimalParameters(imageData, canvas.width, canvas.height);
                
                // 更新UI显示最佳参数
                this.edgeThreshold.value = bestParams.edgeThreshold;
                this.thresholdValue.textContent = bestParams.edgeThreshold;
                this.noiseReduction.value = bestParams.noiseReduction;
                this.noiseValue.textContent = bestParams.noiseReduction;
            }
            
            this.showLoading('正在生成ASCII艺术...');
            
            // 使用最佳参数生成ASCII
            const asciiResult = this.generateOptimizedASCII(imageData, canvas.width, canvas.height, bestParams);
            
            this.showResult(asciiResult);

        } catch (error) {
            console.error('转换失败:', error);
            alert('转换过程中出现错误，请重试！');
            this.hideLoading();
        }
    }


    applyGaussianBlur(data, width, height, radius) {
        const output = new Uint8ClampedArray(data);
        const kernel = this.generateGaussianKernel(radius);
        const kernelSize = kernel.length;
        const half = Math.floor(kernelSize / 2);
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let sum = 0;
                let weightSum = 0;
                
                for (let ky = -half; ky <= half; ky++) {
                    for (let kx = -half; kx <= half; kx++) {
                        const px = Math.max(0, Math.min(width - 1, x + kx));
                        const py = Math.max(0, Math.min(height - 1, y + ky));
                        const weight = kernel[ky + half][kx + half];
                        
                        sum += data[(py * width + px) * 4] * weight;
                        weightSum += weight;
                    }
                }
                
                const index = (y * width + x) * 4;
                const blurred = Math.round(sum / weightSum);
                output[index] = blurred;
                output[index + 1] = blurred;
                output[index + 2] = blurred;
            }
        }
        
        data.set(output);
    }

    generateGaussianKernel(radius) {
        const size = radius * 2 + 1;
        const kernel = [];
        const sigma = radius / 3;
        const sigma2 = 2 * sigma * sigma;
        const sqrtPi2Sigma = Math.sqrt(2 * Math.PI) * sigma;
        
        for (let y = 0; y < size; y++) {
            kernel[y] = [];
            for (let x = 0; x < size; x++) {
                const dx = x - radius;
                const dy = y - radius;
                const distance2 = dx * dx + dy * dy;
                kernel[y][x] = Math.exp(-distance2 / sigma2) / sqrtPi2Sigma;
            }
        }
        
        return kernel;
    }


    // 自动寻找最佳参数
    async findOptimalParameters(imageData, width, height) {
        const data = new Uint8ClampedArray(imageData.data);
        
        // 分析图像特征
        const imageStats = this.analyzeImageFeatures(data, width, height);
        
        // 基于图像特征确定最佳参数
        let bestEdgeThreshold, bestNoiseReduction;
        
        // 根据图像对比度调整边缘检测阈值
        if (imageStats.contrast < 0.3) {
            bestEdgeThreshold = 60; // 低对比度图像使用较低阈值
        } else if (imageStats.contrast > 0.7) {
            bestEdgeThreshold = 120; // 高对比度图像使用较高阈值
        } else {
            bestEdgeThreshold = 80; // 中等对比度使用默认值
        }
        
        // 根据图像噪音水平调整过滤强度
        if (imageStats.noiseLevel > 0.6) {
            bestNoiseReduction = 5; // 高噪音图像需要更强过滤
        } else if (imageStats.noiseLevel < 0.3) {
            bestNoiseReduction = 1; // 低噪音图像使用轻微过滤
        } else {
            bestNoiseReduction = 3; // 中等噪音使用默认值
        }
        
        return {
            edgeThreshold: bestEdgeThreshold,
            noiseReduction: bestNoiseReduction
        };
    }

    // 分析图像特征
    analyzeImageFeatures(data, width, height) {
        let totalBrightness = 0;
        let minBrightness = 255;
        let maxBrightness = 0;
        let gradientSum = 0;
        let totalPixels = width * height;
        
        // 转换为灰度并计算统计信息
        const grayData = new Uint8ClampedArray(totalPixels);
        for (let i = 0; i < data.length; i += 4) {
            const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
            const pixelIndex = i / 4;
            grayData[pixelIndex] = gray;
            
            totalBrightness += gray;
            minBrightness = Math.min(minBrightness, gray);
            maxBrightness = Math.max(maxBrightness, gray);
        }
        
        // 计算对比度
        const avgBrightness = totalBrightness / totalPixels;
        const contrast = (maxBrightness - minBrightness) / 255;
        
        // 计算噪音水平（通过局部梯度变化）
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const center = grayData[y * width + x];
                const neighbors = [
                    grayData[(y-1) * width + x],
                    grayData[(y+1) * width + x],
                    grayData[y * width + (x-1)],
                    grayData[y * width + (x+1)]
                ];
                
                let localVariance = 0;
                neighbors.forEach(neighbor => {
                    localVariance += Math.pow(neighbor - center, 2);
                });
                gradientSum += Math.sqrt(localVariance / 4);
            }
        }
        
        const noiseLevel = (gradientSum / (totalPixels * 255)) * 2; // 归一化噪音水平
        
        return {
            avgBrightness: avgBrightness / 255,
            contrast: contrast,
            noiseLevel: Math.min(noiseLevel, 1) // 限制在0-1范围
        };
    }

    // 优化的ASCII生成算法
    generateOptimizedASCII(imageData, width, height, params) {
        const data = new Uint8ClampedArray(imageData.data);
        
        // 预处理图像
        const processedData = this.preprocessImageWithParams(data, width, height, params.noiseReduction);
        
        // 检测边缘
        const edgeData = this.detectEdgesWithParams(processedData, width, height, params.edgeThreshold);
        
        // 生成更好的ASCII艺术
        return this.generateEnhancedASCII(processedData, edgeData, width, height);
    }

    // 带参数的预处理
    preprocessImageWithParams(data, width, height, noiseLevel) {
        // 转换为灰度图
        for (let i = 0; i < data.length; i += 4) {
            const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
            data[i] = gray;     // R
            data[i + 1] = gray; // G
            data[i + 2] = gray; // B
        }
        
        // 应用适度的高斯模糊
        if (noiseLevel > 0) {
            this.applyGaussianBlur(data, width, height, noiseLevel);
        }
        
        return data;
    }

    // 带参数的边缘检测
    detectEdgesWithParams(data, width, height, threshold) {
        const edges = new Uint8ClampedArray(width * height);
        
        // Sobel边缘检测
        const sobelX = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
        const sobelY = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];
        
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                let gx = 0, gy = 0;
                
                for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                        const pixel = data[((y + ky) * width + (x + kx)) * 4];
                        gx += pixel * sobelX[ky + 1][kx + 1];
                        gy += pixel * sobelY[ky + 1][kx + 1];
                    }
                }
                
                const magnitude = Math.sqrt(gx * gx + gy * gy);
                edges[y * width + x] = magnitude > threshold ? 255 : 0;
            }
        }
        
        return edges;
    }

    // 增强的ASCII生成算法
    generateEnhancedASCII(grayData, edgeData, width, height) {
        // 优化的字符集 - 更好的渐变效果
        const chars = ' .\'`^",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$';
        const edgeChars = '█▉▊▋▌▍▎▏';
        const invert = this.invertColors.checked;
        
        let ascii = '';
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const pixelIndex = y * width + x;
                const grayValue = grayData[pixelIndex * 4];
                const edgeValue = edgeData[pixelIndex];
                
                let char;
                
                if (edgeValue > 128) {
                    // 强边缘区域使用边缘字符
                    const intensity = edgeValue / 255;
                    const charIndex = Math.floor(intensity * (edgeChars.length - 1));
                    char = edgeChars[invert ? edgeChars.length - 1 - charIndex : charIndex];
                } else {
                    // 非边缘区域使用灰度映射
                    const intensity = grayValue / 255;
                    const charIndex = Math.floor(intensity * (chars.length - 1));
                    char = chars[invert ? chars.length - 1 - charIndex : charIndex];
                }
                
                ascii += char;
            }
            ascii += '\n';
        }
        
        return ascii;
    }

    showResult(asciiArt) {
        this.asciiOutput.textContent = asciiArt;
        this.hideLoading();
        this.resultSection.style.display = 'block';
    }

    copyResult() {
        const text = this.asciiOutput.textContent;
        navigator.clipboard.writeText(text).then(() => {
            this.showCopySuccess();
        }).catch(err => {
            console.error('复制失败:', err);
            this.fallbackCopy(text);
        });
    }

    fallbackCopy(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            this.showCopySuccess();
        } catch (err) {
            alert('复制失败，请手动选择文本复制');
        }
        document.body.removeChild(textArea);
    }

    showCopySuccess() {
        const notification = document.createElement('div');
        notification.className = 'copy-success';
        notification.textContent = '✅ 已复制到剪贴板';
        document.body.appendChild(notification);

        setTimeout(() => {
            document.body.removeChild(notification);
        }, 2000);
    }

    downloadResult() {
        const text = this.asciiOutput.textContent;
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'outline-ascii-art.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
    }

    reset() {
        // 只重置结果区域，保留图片预览
        this.loadingSection.style.display = 'none';
        this.resultSection.style.display = 'none';
        this.asciiOutput.textContent = '';
        
        // 如果有图片，保持预览状态可见
        if (this.currentImage) {
            this.previewSection.style.display = 'block';
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new OutlineASCIIConverter();
});

// 防止页面意外关闭时丢失进度
window.addEventListener('beforeunload', (e) => {
    const loadingSection = document.getElementById('loadingSection');
    if (loadingSection && loadingSection.style.display !== 'none') {
        e.preventDefault();
        e.returnValue = '正在处理中，确定要离开吗？';
    }
});
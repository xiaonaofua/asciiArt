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
            this.showLoading('正在分析图像轮廓...');

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
            
            this.showLoading('正在进行边缘检测...');
            
            // 进行图像预处理和边缘检测
            const processedData = this.preprocessImage(imageData);
            const edgeData = this.detectEdges(processedData, canvas.width, canvas.height);
            
            this.showLoading('正在生成ASCII艺术...');
            
            // 转换为ASCII
            const asciiResult = this.generateASCIIFromEdges(edgeData, canvas.width, canvas.height);
            
            this.showResult(asciiResult);

        } catch (error) {
            console.error('转换失败:', error);
            alert('转换过程中出现错误，请重试！');
            this.hideLoading();
        }
    }

    preprocessImage(imageData) {
        const data = new Uint8ClampedArray(imageData.data);
        const width = imageData.width;
        const height = imageData.height;
        const noiseLevel = parseInt(this.noiseReduction.value);
        
        // 转换为灰度图
        for (let i = 0; i < data.length; i += 4) {
            const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
            data[i] = gray;     // R
            data[i + 1] = gray; // G
            data[i + 2] = gray; // B
        }
        
        // 噪音过滤 - 高斯模糊
        if (noiseLevel > 0) {
            this.applyGaussianBlur(data, width, height, noiseLevel);
        }
        
        return data;
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

    detectEdges(data, width, height) {
        const threshold = parseInt(this.edgeThreshold.value);
        const edges = new Uint8ClampedArray(width * height);
        
        // Sobel边缘检测
        const sobelX = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
        const sobelY = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];
        
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                let gx = 0, gy = 0;
                
                // 应用Sobel算子
                for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                        const pixel = data[((y + ky) * width + (x + kx)) * 4];
                        gx += pixel * sobelX[ky + 1][kx + 1];
                        gy += pixel * sobelY[ky + 1][kx + 1];
                    }
                }
                
                // 计算梯度强度
                const magnitude = Math.sqrt(gx * gx + gy * gy);
                edges[y * width + x] = magnitude > threshold ? 255 : 0;
            }
        }
        
        // 应用形态学操作来清理边缘
        return this.morphologicalOperations(edges, width, height);
    }

    morphologicalOperations(edges, width, height) {
        // 先腐蚀后膨胀，去除噪点
        let result = this.erode(edges, width, height);
        result = this.dilate(result, width, height);
        return result;
    }

    erode(data, width, height) {
        const result = new Uint8ClampedArray(width * height);
        const kernel = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],  [0, 0],  [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];
        
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                let minVal = 255;
                for (let [ky, kx] of kernel) {
                    const px = x + kx;
                    const py = y + ky;
                    if (px >= 0 && px < width && py >= 0 && py < height) {
                        minVal = Math.min(minVal, data[py * width + px]);
                    }
                }
                result[y * width + x] = minVal;
            }
        }
        
        return result;
    }

    dilate(data, width, height) {
        const result = new Uint8ClampedArray(width * height);
        const kernel = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],  [0, 0],  [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];
        
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                let maxVal = 0;
                for (let [ky, kx] of kernel) {
                    const px = x + kx;
                    const py = y + ky;
                    if (px >= 0 && px < width && py >= 0 && py < height) {
                        maxVal = Math.max(maxVal, data[py * width + px]);
                    }
                }
                result[y * width + x] = maxVal;
            }
        }
        
        return result;
    }

    generateASCIIFromEdges(edgeData, width, height) {
        // 不同强度的ASCII字符集
        const edgeChars = '█▉▊▋▌▍▎▏';  // 块状字符表示强边缘
        const fillChars = '@%#*+=-:. '; // 填充字符表示内部区域
        const invert = this.invertColors.checked;
        
        let ascii = '';
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const edgeStrength = edgeData[y * width + x];
                let char;
                
                if (edgeStrength > 128) {
                    // 强边缘区域 - 使用块状字符
                    const charIndex = Math.floor((edgeStrength / 255) * (edgeChars.length - 1));
                    char = edgeChars[invert ? edgeChars.length - 1 - charIndex : charIndex];
                } else {
                    // 内部区域 - 根据周围边缘密度选择填充字符
                    const density = this.calculateLocalDensity(edgeData, x, y, width, height);
                    const charIndex = Math.floor(density * (fillChars.length - 1));
                    char = fillChars[invert ? fillChars.length - 1 - charIndex : charIndex];
                }
                
                ascii += char;
            }
            ascii += '\n';
        }
        
        return ascii;
    }

    calculateLocalDensity(edgeData, x, y, width, height) {
        let sum = 0;
        let count = 0;
        const radius = 2;
        
        for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
                const px = x + dx;
                const py = y + dy;
                
                if (px >= 0 && px < width && py >= 0 && py < height) {
                    sum += edgeData[py * width + px];
                    count++;
                }
            }
        }
        
        return count > 0 ? (sum / count) / 255 : 0;
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
        this.currentImage = null;
        this.imageInput.value = '';
        this.previewSection.style.display = 'none';
        this.loadingSection.style.display = 'none';
        this.resultSection.style.display = 'none';
        this.asciiOutput.textContent = '';
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
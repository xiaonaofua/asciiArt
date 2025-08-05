class ASCIIArtConverter {
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
        this.enableOCR = document.getElementById('enableOCR');
        this.enableOutline = document.getElementById('enableOutline');
        this.asciiWidth = document.getElementById('asciiWidth');
        this.widthValue = document.getElementById('widthValue');
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

        // 宽度滑块
        this.asciiWidth.addEventListener('input', (e) => {
            this.widthValue.textContent = e.target.value;
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
            this.showLoading('正在分析图片...');

            // 创建canvas来处理图片
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            const targetWidth = parseInt(this.asciiWidth.value);
            const aspectRatio = this.currentImage.height / this.currentImage.width;
            const targetHeight = Math.floor(targetWidth * aspectRatio * 0.5); // ASCII字符高度比宽度大

            canvas.width = targetWidth;
            canvas.height = targetHeight;
            
            ctx.drawImage(this.currentImage, 0, 0, targetWidth, targetHeight);
            
            let asciiResult = '';

            // 如果启用OCR，先进行文字识别
            if (this.enableOCR.checked) {
                asciiResult += await this.performOCR(canvas);
                asciiResult += '\n\n--- 图像转ASCII ---\n\n';
            }

            // 转换图像为ASCII
            const imageASCII = this.imageToASCII(canvas, ctx);
            asciiResult += imageASCII;

            this.showResult(asciiResult);

        } catch (error) {
            console.error('转换失败:', error);
            alert('转换过程中出现错误，请重试！');
            this.hideLoading();
        }
    }

    async performOCR(canvas) {
        this.showLoading('正在识别文字...');
        
        try {
            const { data: { text } } = await Tesseract.recognize(
                canvas,
                'chi_sim+chi_tra+jpn+eng', // 支持中文简体、繁体、日文、英文
                {
                    logger: m => {
                        if (m.status === 'recognizing text') {
                            const progress = Math.round(m.progress * 100);
                            this.showLoading(`正在识别文字... ${progress}%`);
                        }
                    }
                }
            );

            if (text.trim()) {
                return `--- 识别的文字 ---\n${text.trim()}\n`;
            } else {
                return '--- 未识别到文字 ---\n';
            }
        } catch (error) {
            console.error('OCR识别失败:', error);
            return '--- 文字识别失败 ---\n';
        }
    }

    imageToASCII(canvas, ctx) {
        this.showLoading('正在转换为ASCII...');

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        
        // ASCII字符集，从暗到亮
        const asciiChars = '@%#*+=-:. ';
        
        let ascii = '';
        
        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                const i = (y * canvas.width + x) * 4;
                const r = pixels[i];
                const g = pixels[i + 1];
                const b = pixels[i + 2];
                
                // 计算灰度值
                const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
                
                // 将灰度值映射到ASCII字符
                const charIndex = Math.floor((gray / 255) * (asciiChars.length - 1));
                ascii += asciiChars[charIndex];
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
            // 降级方案
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
        a.download = 'ascii-art.txt';
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
    new ASCIIArtConverter();
});

// 防止页面意外关闭时丢失进度
window.addEventListener('beforeunload', (e) => {
    const loadingSection = document.getElementById('loadingSection');
    if (loadingSection && loadingSection.style.display !== 'none') {
        e.preventDefault();
        e.returnValue = '正在处理中，确定要离开吗？';
    }
});
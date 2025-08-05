// 多语言支持
class I18n {
    constructor() {
        this.currentLang = localStorage.getItem('preferred-language') || 'zh';
        this.translations = {
            zh: {
                title: '🎨 智能ASCII艺术',
                subtitle: '智能ASCII艺术生成器 - 支持文字识别与图像轮廓',
                upload_title: '选择或拖拽图片',
                upload_desc: '支持PNG、JPEG格式',
                select_image: '选择图片',
                preview_title: '原图预览',
                ascii_width: 'ASCII宽度:',
                edge_sensitivity: '边缘敏感度:',
                noise_filter: '噪音过滤:',
                invert_colors: '反转颜色',
                enable_ocr: '启用文字识别 (OCR)',
                auto_optimize: '自动优化参数',
                convert_button: '🎯 智能转换ASCII',
                processing: '正在处理图片...',
                result_title: 'ASCII艺术结果',
                copy_result: '📋 复制结果',
                download_txt: '💾 下载txt',
                reset: '🔄 重新开始',
                footer: '智能ASCII艺术生成器 - 支持文字识别与图像轮廓 | 纯前端实现',
                analyzing_image: '正在分析图像特征...',
                recognizing_text: '正在识别文字...',
                generating_ascii: '正在生成ASCII艺术...',
                copy_success: '✅ 已复制到剪贴板',
                copy_failed: '复制失败，请手动选择文本复制',
                invalid_file: '请选择有效的PNG或JPEG图片文件！',
                conversion_error: '转换过程中出现错误，请重试！',
                recognized_text: '--- 识别的文字 ---',
                no_text_found: '--- 未识别到文字 ---',
                text_recognition_failed: '--- 文字识别失败 ---',
                image_to_ascii: '--- 图像转ASCII ---',
                width_adjusted: '智能调整宽度',
                image_size: '图片尺寸',
                no_image_selected: '请先上传图片',
                download_image: '🖼️ 下载图片',
                text_result: '文字版',
                image_result: '图片版'
            },
            en: {
                title: '🎨 Smart ASCII Art',
                subtitle: 'Smart ASCII Art Generator - Text Recognition & Image Outline',
                upload_title: 'Select or Drag Image',
                upload_desc: 'Supports PNG, JPEG formats',
                select_image: 'Select Image',
                preview_title: 'Image Preview',
                ascii_width: 'ASCII Width:',
                edge_sensitivity: 'Edge Sensitivity:',
                noise_filter: 'Noise Filter:',
                invert_colors: 'Invert Colors',
                enable_ocr: 'Enable Text Recognition (OCR)',
                auto_optimize: 'Auto Optimize Parameters',
                convert_button: '🎯 Smart Convert ASCII',
                processing: 'Processing image...',
                result_title: 'ASCII Art Result',
                copy_result: '📋 Copy Result',
                download_txt: '💾 Download txt',
                reset: '🔄 Reset',
                footer: 'Smart ASCII Art Generator - Text Recognition & Image Outline | Pure Frontend',
                analyzing_image: 'Analyzing image features...',
                recognizing_text: 'Recognizing text...',
                generating_ascii: 'Generating ASCII art...',
                copy_success: '✅ Copied to clipboard',
                copy_failed: 'Copy failed, please select text manually',
                invalid_file: 'Please select a valid PNG or JPEG image file!',
                conversion_error: 'An error occurred during conversion, please try again!',
                recognized_text: '--- Recognized Text ---',
                no_text_found: '--- No Text Found ---',
                text_recognition_failed: '--- Text Recognition Failed ---',
                image_to_ascii: '--- Image to ASCII ---',
                width_adjusted: 'Width Auto-Adjusted',
                image_size: 'Image Size',
                no_image_selected: 'Please upload an image first',
                download_image: '🖼️ Download Image',
                text_result: 'Text Version',
                image_result: 'Image Version'
            },
            ja: {
                title: '🎨 スマートASCIIアート',
                subtitle: 'スマートASCIIアート生成器 - テキスト認識と画像輪郭',
                upload_title: '画像を選択またはドラッグ',
                upload_desc: 'PNG、JPEG形式をサポート',
                select_image: '画像を選択',
                preview_title: '画像プレビュー',
                ascii_width: 'ASCII幅:',
                edge_sensitivity: 'エッジ感度:',
                noise_filter: 'ノイズフィルター:',
                invert_colors: '色を反転',
                enable_ocr: 'テキスト認識を有効にする (OCR)',
                auto_optimize: 'パラメータを自動最適化',
                convert_button: '🎯 スマート変換ASCII',
                processing: '画像を処理中...',
                result_title: 'ASCIIアート結果',
                copy_result: '📋 結果をコピー',
                download_txt: '💾 txtをダウンロード',
                reset: '🔄 リセット',
                footer: 'スマートASCIIアート生成器 - テキスト認識と画像輪郭 | 純粋なフロントエンド',
                analyzing_image: '画像特徴を分析中...',
                recognizing_text: 'テキストを認識中...',
                generating_ascii: 'ASCIIアートを生成中...',
                copy_success: '✅ クリップボードにコピーしました',
                copy_failed: 'コピーに失敗しました。手動でテキストを選択してください',
                invalid_file: '有効なPNGまたはJPEG画像ファイルを選択してください！',
                conversion_error: '変換中にエラーが発生しました。再試行してください！',
                recognized_text: '--- 認識されたテキスト ---',
                no_text_found: '--- テキストが見つかりません ---',
                text_recognition_failed: '--- テキスト認識に失敗しました ---',
                image_to_ascii: '--- 画像からASCIIへ ---',
                width_adjusted: '幅を自動調整',
                image_size: '画像サイズ',
                no_image_selected: 'まず画像をアップロードしてください',
                download_image: '🖼️ 画像をダウンロード',
                text_result: 'テキスト版',
                image_result: '画像版'
            }
        };
    }

    t(key) {
        return this.translations[this.currentLang][key] || key;
    }

    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('preferred-language', lang);
        this.updateUI();
    }

    updateUI() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.t(key);
        });

        // 更新语言按钮状态
        document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`lang${this.currentLang.charAt(0).toUpperCase() + this.currentLang.slice(1)}`).classList.add('active');
    }
}

class OutlineASCIIConverter {
    constructor() {
        this.currentImage = null;
        this.i18n = new I18n();
        this.initializeElements();
        this.bindEvents();
        this.i18n.updateUI();
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
        this.downloadImageButton = document.getElementById('downloadImageButton');
        this.textTab = document.getElementById('textTab');
        this.imageTab = document.getElementById('imageTab');
        this.textResult = document.getElementById('textResult');
        this.imageResult = document.getElementById('imageResult');
        this.asciiCanvas = document.getElementById('asciiCanvas');
        this.placeholderPreview = document.getElementById('placeholderPreview');
        
        // 新的控制元素
        this.asciiWidth = document.getElementById('asciiWidth');
        this.widthValue = document.getElementById('widthValue');
        this.edgeThreshold = document.getElementById('edgeThreshold');
        this.thresholdValue = document.getElementById('thresholdValue');
        this.noiseReduction = document.getElementById('noiseReduction');
        this.noiseValue = document.getElementById('noiseValue');
        this.invertColors = document.getElementById('invertColors');
        this.enableOCR = document.getElementById('enableOCR');
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
        this.downloadImageButton.addEventListener('click', () => this.downloadImageResult());
        this.resetButton.addEventListener('click', () => this.reset());
        
        // Tab切换
        this.textTab.addEventListener('click', () => this.switchTab('text'));
        this.imageTab.addEventListener('click', () => this.switchTab('image'));

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

        // 语言切换事件
        document.getElementById('langZh').addEventListener('click', () => this.i18n.setLanguage('zh'));
        document.getElementById('langEn').addEventListener('click', () => this.i18n.setLanguage('en'));
        document.getElementById('langJa').addEventListener('click', () => this.i18n.setLanguage('ja'));
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
            alert(this.i18n.t('invalid_file'));
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
        this.previewImage.style.display = 'block';
        this.placeholderPreview.style.display = 'none';
        this.resultSection.style.display = 'none';
        
        // 根据图片大小智能调整ASCII宽度
        this.adjustASCIIWidthByImageSize();
        
        // 自动开始转换ASCII
        this.autoConvertToASCII();
    }

    async autoConvertToASCII() {
        // 延迟一秒后自动开始转换，让用户看到调整提示
        setTimeout(async () => {
            await this.convertToASCII();
        }, 1000);
    }

    adjustASCIIWidthByImageSize() {
        if (!this.currentImage) return;
        
        const imageWidth = this.currentImage.naturalWidth;
        const imageHeight = this.currentImage.naturalHeight;
        
        // 计算建议的ASCII宽度
        let suggestedWidth;
        
        if (imageWidth <= 400) {
            // 小图片：使用较小的ASCII宽度
            suggestedWidth = 80;
        } else if (imageWidth <= 800) {
            // 中等图片：使用中等ASCII宽度
            suggestedWidth = 150;
        } else if (imageWidth <= 1200) {
            // 大图片：使用较大ASCII宽度
            suggestedWidth = 220;
        } else if (imageWidth <= 2000) {
            // 超大图片：使用很大ASCII宽度
            suggestedWidth = 300;
        } else {
            // 极大图片：使用最大ASCII宽度
            suggestedWidth = 360;
        }
        
        // 考虑图片的宽高比
        const aspectRatio = imageWidth / imageHeight;
        if (aspectRatio > 2) {
            // 宽图片：增加宽度
            suggestedWidth = Math.min(360, Math.round(suggestedWidth * 1.2));
        } else if (aspectRatio < 0.5) {
            // 高图片：减少宽度
            suggestedWidth = Math.max(80, Math.round(suggestedWidth * 0.8));
        }
        
        // 更新UI
        this.asciiWidth.value = suggestedWidth;
        this.widthValue.textContent = suggestedWidth;
        
        // 显示智能调整提示
        this.showWidthAdjustmentNotice(imageWidth, imageHeight, suggestedWidth);
    }

    showWidthAdjustmentNotice(imageWidth, imageHeight, suggestedWidth) {
        // 创建临时提示信息
        const notice = document.createElement('div');
        notice.className = 'width-adjustment-notice';
        notice.innerHTML = `
            <div class="notice-content">
                <span class="notice-icon">🎯</span>
                <span class="notice-text">${this.i18n.t('width_adjusted')}: ${suggestedWidth}</span>
                <span class="notice-detail">${this.i18n.t('image_size')}: ${imageWidth}×${imageHeight}</span>
            </div>
        `;
        
        document.body.appendChild(notice);
        
        // 3秒后自动移除
        setTimeout(() => {
            if (document.body.contains(notice)) {
                document.body.removeChild(notice);
            }
        }, 3000);
    }

    showLoading(message = null) {
        this.loadingText.textContent = message || this.i18n.t('processing');
        this.loadingSection.style.display = 'block';
        // 保持预览区域始终可见
        // this.previewSection.style.display = 'none';
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
                this.showLoading(this.i18n.t('analyzing_image'));
                bestParams = await this.findOptimalParameters(imageData, canvas.width, canvas.height);
                
                // 更新UI显示最佳参数
                this.edgeThreshold.value = bestParams.edgeThreshold;
                this.thresholdValue.textContent = bestParams.edgeThreshold;
                this.noiseReduction.value = bestParams.noiseReduction;
                this.noiseValue.textContent = bestParams.noiseReduction;
            }
            
            let asciiResult = '';

            // 如果启用OCR，先进行文字识别
            if (this.enableOCR.checked) {
                this.showLoading(this.i18n.t('recognizing_text'));
                const ocrResult = await this.performOCR(canvas);
                asciiResult += ocrResult;
                asciiResult += `\n${this.i18n.t('image_to_ascii')}\n\n`;
            }

            this.showLoading(this.i18n.t('generating_ascii'));
            
            // 使用原始算法生成图像ASCII（更接近原图）
            const imageASCII = this.generateOriginalStyleASCII(imageData, canvas.width, canvas.height, bestParams);
            asciiResult += imageASCII;
            
            this.showResult(asciiResult);

        } catch (error) {
            console.error('转换失败:', error);
            alert(this.i18n.t('conversion_error'));
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

    // OCR文字识别功能
    async performOCR(canvas) {
        try {
            const { data: { text } } = await Tesseract.recognize(
                canvas,
                'chi_sim+chi_tra+jpn+eng', // 支持中文简体、繁体、日文、英文
                {
                    logger: m => {
                        if (m.status === 'recognizing text') {
                            const progress = Math.round(m.progress * 100);
                            this.showLoading(`${this.i18n.t('recognizing_text')} ${progress}%`);
                        }
                    }
                }
            );

            if (text.trim()) {
                return `${this.i18n.t('recognized_text')}\n${text.trim()}\n`;
            } else {
                return `${this.i18n.t('no_text_found')}\n`;
            }
        } catch (error) {
            console.error('OCR识别失败:', error);
            return `${this.i18n.t('text_recognition_failed')}\n`;
        }
    }

    // 原始风格的ASCII转换算法（更接近原图）
    generateOriginalStyleASCII(imageData, width, height, params) {
        const data = new Uint8ClampedArray(imageData.data);
        
        // 预处理图像
        const processedData = this.preprocessImageWithParams(data, width, height, params.noiseReduction);
        
        // 使用原始的基于灰度的字符映射方法
        return this.imageToASCIIOriginal(processedData, width, height);
    }

    // 原始的图像转ASCII算法
    imageToASCIIOriginal(data, width, height) {
        // 使用原始的ASCII字符集，从暗到亮，效果更接近原图
        const asciiChars = '@%#*+=-:. ';
        const invert = this.invertColors.checked;
        
        let ascii = '';
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4;
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                
                // 计算灰度值
                const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
                
                // 将灰度值映射到ASCII字符
                const charIndex = Math.floor((gray / 255) * (asciiChars.length - 1));
                const selectedChar = asciiChars[invert ? asciiChars.length - 1 - charIndex : charIndex];
                
                ascii += selectedChar;
            }
            ascii += '\n';
        }
        
        return ascii;
    }

    showResult(asciiArt) {
        this.asciiOutput.textContent = asciiArt;
        
        // 生成ASCII图片版本
        this.generateASCIIImage(asciiArt);
        
        this.hideLoading();
        this.resultSection.style.display = 'block';
    }

    generateASCIIImage(asciiText) {
        const canvas = this.asciiCanvas;
        const ctx = canvas.getContext('2d');
        
        // 设置字体和样式
        const fontSize = 8;
        const lineHeight = fontSize * 1.1;
        ctx.font = `${fontSize}px "Courier New", monospace`;
        ctx.textBaseline = 'top';
        
        // 计算画布尺寸
        const lines = asciiText.split('\n');
        const maxLineLength = Math.max(...lines.map(line => line.length));
        const canvasWidth = maxLineLength * fontSize * 0.6; // 字符宽度约为字体大小的0.6倍
        const canvasHeight = lines.length * lineHeight;
        
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        
        // 设置背景色为白色
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 设置文字颜色为黑色
        ctx.fillStyle = '#000000';
        
        // 绘制ASCII文字
        lines.forEach((line, index) => {
            const y = index * lineHeight;
            ctx.fillText(line, 0, y);
        });
    }

    switchTab(tabType) {
        if (tabType === 'text') {
            this.textTab.classList.add('active');
            this.imageTab.classList.remove('active');
            this.textResult.style.display = 'block';
            this.imageResult.style.display = 'none';
        } else {
            this.imageTab.classList.add('active');
            this.textTab.classList.remove('active');
            this.textResult.style.display = 'none';
            this.imageResult.style.display = 'block';
        }
    }

    downloadImageResult() {
        const canvas = this.asciiCanvas;
        const link = document.createElement('a');
        link.download = 'ascii-art.png';
        link.href = canvas.toDataURL();
        link.click();
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
            alert(this.i18n.t('copy_failed'));
        }
        document.body.removeChild(textArea);
    }

    showCopySuccess() {
        const notification = document.createElement('div');
        notification.className = 'copy-success';
        notification.textContent = this.i18n.t('copy_success');
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
        // 重置结果区域
        this.loadingSection.style.display = 'none';
        this.resultSection.style.display = 'none';
        this.asciiOutput.textContent = '';
        
        // 清空canvas
        if (this.asciiCanvas) {
            const ctx = this.asciiCanvas.getContext('2d');
            ctx.clearRect(0, 0, this.asciiCanvas.width, this.asciiCanvas.height);
        }
        
        // 切换回文字版tab
        this.switchTab('text');
        
        // 确保预览区域始终可见
        this.previewSection.style.display = 'block';
        
        // 如果有图片，确保预览图片显示，隐藏占位符
        if (this.currentImage && this.previewImage.src) {
            this.previewImage.style.display = 'block';
            this.placeholderPreview.style.display = 'none';
        } else {
            // 如果没有图片，显示占位符
            this.previewImage.style.display = 'none';
            this.placeholderPreview.style.display = 'block';
        }
        
        // 不重置参数，让用户保持当前调整的设置
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
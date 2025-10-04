import { useState, useCallback } from 'react';

export interface ConversionParams {
  edgeThreshold: number;
  noiseReduction: number;
}

export interface ImageStats {
  avgBrightness: number;
  contrast: number;
  noiseLevel: number;
}

export const useASCIIConverter = () => {
  const [currentImage, setCurrentImage] = useState<HTMLImageElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  // 高斯模糊
  const applyGaussianBlur = useCallback((
    data: Uint8ClampedArray,
    width: number,
    height: number,
    radius: number
  ) => {
    const output = new Uint8ClampedArray(data);
    const kernel = generateGaussianKernel(radius);
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
  }, []);

  // 生成高斯核
  const generateGaussianKernel = (radius: number): number[][] => {
    const size = radius * 2 + 1;
    const kernel: number[][] = [];
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
  };

  // 分析图像特征
  const analyzeImageFeatures = useCallback((
    data: Uint8ClampedArray,
    width: number,
    height: number
  ): ImageStats => {
    let totalBrightness = 0;
    let minBrightness = 255;
    let maxBrightness = 0;
    let gradientSum = 0;
    const totalPixels = width * height;

    const grayData = new Uint8ClampedArray(totalPixels);
    for (let i = 0; i < data.length; i += 4) {
      const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
      const pixelIndex = i / 4;
      grayData[pixelIndex] = gray;

      totalBrightness += gray;
      minBrightness = Math.min(minBrightness, gray);
      maxBrightness = Math.max(maxBrightness, gray);
    }

    const avgBrightness = totalBrightness / totalPixels;
    const contrast = (maxBrightness - minBrightness) / 255;

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const center = grayData[y * width + x];
        const neighbors = [
          grayData[(y - 1) * width + x],
          grayData[(y + 1) * width + x],
          grayData[y * width + (x - 1)],
          grayData[y * width + (x + 1)]
        ];

        let localVariance = 0;
        neighbors.forEach(neighbor => {
          localVariance += Math.pow(neighbor - center, 2);
        });
        gradientSum += Math.sqrt(localVariance / 4);
      }
    }

    const noiseLevel = (gradientSum / (totalPixels * 255)) * 2;

    return {
      avgBrightness: avgBrightness / 255,
      contrast,
      noiseLevel: Math.min(noiseLevel, 1)
    };
  }, []);

  // 寻找最佳参数
  const findOptimalParameters = useCallback(
    async (imageData: ImageData, width: number, height: number): Promise<ConversionParams> => {
      const data = new Uint8ClampedArray(imageData.data);
      const imageStats = analyzeImageFeatures(data, width, height);

      let bestEdgeThreshold: number;
      let bestNoiseReduction: number;

      if (imageStats.contrast < 0.3) {
        bestEdgeThreshold = 60;
      } else if (imageStats.contrast > 0.7) {
        bestEdgeThreshold = 120;
      } else {
        bestEdgeThreshold = 80;
      }

      if (imageStats.noiseLevel > 0.6) {
        bestNoiseReduction = 5;
      } else if (imageStats.noiseLevel < 0.3) {
        bestNoiseReduction = 1;
      } else {
        bestNoiseReduction = 3;
      }

      return {
        edgeThreshold: bestEdgeThreshold,
        noiseReduction: bestNoiseReduction
      };
    },
    [analyzeImageFeatures]
  );

  // 预处理图像
  const preprocessImageWithParams = useCallback(
    (data: Uint8ClampedArray, width: number, height: number, noiseLevel: number) => {
      for (let i = 0; i < data.length; i += 4) {
        const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
        data[i] = gray;
        data[i + 1] = gray;
        data[i + 2] = gray;
      }

      if (noiseLevel > 0) {
        applyGaussianBlur(data, width, height, noiseLevel);
      }

      return data;
    },
    [applyGaussianBlur]
  );

  // 原始风格ASCII转换
  const imageToASCIIOriginal = useCallback(
    (data: Uint8ClampedArray, width: number, height: number, invertColors: boolean) => {
      const asciiChars = '@%#*+=-:. ';
      let ascii = '';

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const i = (y * width + x) * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
          const charIndex = Math.floor((gray / 255) * (asciiChars.length - 1));
          const selectedChar = asciiChars[invertColors ? asciiChars.length - 1 - charIndex : charIndex];

          ascii += selectedChar;
        }
        ascii += '\n';
      }

      return ascii;
    },
    []
  );

  // 主转换函数
  const convertToASCII = useCallback(
    async (
      image: HTMLImageElement,
      width: number,
      params: ConversionParams,
      invertColors: boolean,
      autoOptimize: boolean
    ): Promise<string> => {
      setIsLoading(true);

      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas context not available');

        const targetWidth = width;
        const aspectRatio = image.height / image.width;
        const targetHeight = Math.floor(targetWidth * aspectRatio * 0.5);

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        ctx.drawImage(image, 0, 0, targetWidth, targetHeight);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        let bestParams = params;

        if (autoOptimize) {
          setLoadingMessage('analyzing_image');
          bestParams = await findOptimalParameters(imageData, canvas.width, canvas.height);
        }

        setLoadingMessage('generating_ascii');

        const data = new Uint8ClampedArray(imageData.data);
        const processedData = preprocessImageWithParams(
          data,
          canvas.width,
          canvas.height,
          bestParams.noiseReduction
        );

        const asciiResult = imageToASCIIOriginal(
          processedData,
          canvas.width,
          canvas.height,
          invertColors
        );

        setIsLoading(false);
        return asciiResult;
      } catch (error) {
        setIsLoading(false);
        throw error;
      }
    },
    [findOptimalParameters, preprocessImageWithParams, imageToASCIIOriginal]
  );

  // 生成ASCII图片
  const generateASCIIImage = useCallback((asciiText: string): string => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    const fontSize = 8;
    const lineHeight = fontSize * 1.1;
    ctx.font = `${fontSize}px "Courier New", monospace`;
    ctx.textBaseline = 'top';

    const lines = asciiText.split('\n');
    const maxLineLength = Math.max(...lines.map(line => line.length));
    const canvasWidth = maxLineLength * fontSize * 0.6;
    const canvasHeight = lines.length * lineHeight;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#000000';
    lines.forEach((line, index) => {
      const y = index * lineHeight;
      ctx.fillText(line, 0, y);
    });

    return canvas.toDataURL();
  }, []);

  // 计算建议的ASCII宽度
  const calculateOptimalWidth = useCallback((image: HTMLImageElement): number => {
    const imageWidth = image.naturalWidth;
    const imageHeight = image.naturalHeight;

    let suggestedWidth: number;

    if (imageWidth <= 400) {
      suggestedWidth = 80;
    } else if (imageWidth <= 800) {
      suggestedWidth = 150;
    } else if (imageWidth <= 1200) {
      suggestedWidth = 220;
    } else if (imageWidth <= 2000) {
      suggestedWidth = 300;
    } else {
      suggestedWidth = 360;
    }

    const aspectRatio = imageWidth / imageHeight;
    if (aspectRatio > 2) {
      suggestedWidth = Math.min(360, Math.round(suggestedWidth * 1.2));
    } else if (aspectRatio < 0.5) {
      suggestedWidth = Math.max(80, Math.round(suggestedWidth * 0.8));
    }

    return suggestedWidth;
  }, []);

  return {
    currentImage,
    setCurrentImage,
    isLoading,
    loadingMessage,
    convertToASCII,
    generateASCIIImage,
    calculateOptimalWidth
  };
};

import { useState, useRef, useCallback } from 'react';
import { useI18n } from '../hooks/useI18n';
import { useASCIIConverter, ConversionParams } from '../hooks/useASCIIConverter';
import '../styles/App.css';

type TabType = 'text' | 'image';

function App() {
  const { currentLang, t, setLanguage } = useI18n();
  const {
    isLoading,
    loadingMessage,
    convertToASCII,
    generateASCIIImage,
    calculateOptimalWidth
  } = useASCIIConverter();

  const [previewSrc, setPreviewSrc] = useState<string>('');
  const [asciiResult, setAsciiResult] = useState<string>('');
  const [asciiImageSrc, setAsciiImageSrc] = useState<string>('');
  const [activeTab, setActiveTab] = useState<TabType>('text');
  const [showResult, setShowResult] = useState(false);
  const [currentImage, setCurrentImageState] = useState<HTMLImageElement | null>(null);

  const [asciiWidth, setAsciiWidth] = useState(80);
  const [edgeThreshold, setEdgeThreshold] = useState(80);
  const [noiseReduction, setNoiseReduction] = useState(3);
  const [invertColors, setInvertColors] = useState(false);
  const [autoOptimize, setAutoOptimize] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      alert(t('invalid_file'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setCurrentImageState(img);
        setPreviewSrc(e.target?.result as string);
        setShowResult(false);

        const optimalWidth = calculateOptimalWidth(img);
        setAsciiWidth(optimalWidth);

        showWidthNotice(img.naturalWidth, img.naturalHeight, optimalWidth);

        setTimeout(() => {
          handleConvert(img, optimalWidth);
        }, 1000);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, [t, calculateOptimalWidth]);

  const showWidthNotice = (width: number, height: number, suggestedWidth: number) => {
    const notice = document.createElement('div');
    notice.className = 'width-adjustment-notice';
    notice.innerHTML = `
      <div class="notice-content">
        <span class="notice-icon">🎯</span>
        <span class="notice-text">${t('width_adjusted')}: ${suggestedWidth}</span>
        <span class="notice-detail">${t('image_size')}: ${width}×${height}</span>
      </div>
    `;

    document.body.appendChild(notice);

    setTimeout(() => {
      if (document.body.contains(notice)) {
        document.body.removeChild(notice);
      }
    }, 3000);
  };

  const handleConvert = async (image?: HTMLImageElement, width?: number) => {
    const img = image || currentImage;
    const targetWidth = width || asciiWidth;

    if (!img) return;

    try {
      const params: ConversionParams = {
        edgeThreshold,
        noiseReduction
      };

      const result = await convertToASCII(img, targetWidth, params, invertColors, autoOptimize);
      setAsciiResult(result);

      const imageSrc = generateASCIIImage(result);
      setAsciiImageSrc(imageSrc);

      setShowResult(true);
    } catch (error) {
      console.error('转换失败:', error);
      alert(t('conversion_error'));
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(asciiResult);
      showCopySuccess();
    } catch (err) {
      console.error('复制失败:', err);
      const textArea = document.createElement('textarea');
      textArea.value = asciiResult;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        showCopySuccess();
      } catch (e) {
        alert(t('copy_failed'));
      }
      document.body.removeChild(textArea);
    }
  };

  const showCopySuccess = () => {
    const notification = document.createElement('div');
    notification.className = 'copy-success';
    notification.textContent = t('copy_success');
    document.body.appendChild(notification);

    setTimeout(() => {
      document.body.removeChild(notification);
    }, 2000);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([asciiResult], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ascii-art.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadImage = () => {
    const a = document.createElement('a');
    a.href = asciiImageSrc;
    a.download = 'ascii-art.png';
    a.click();
  };

  const handleReset = () => {
    setShowResult(false);
    setAsciiResult('');
    setAsciiImageSrc('');
    setActiveTab('text');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">{t('title')}</h1>
        <p className="subtitle">{t('subtitle')}</p>
        <div className="language-switcher">
          <button
            className={`lang-btn ${currentLang === 'zh' ? 'active' : ''}`}
            onClick={() => setLanguage('zh')}
          >
            中文
          </button>
          <button
            className={`lang-btn ${currentLang === 'en' ? 'active' : ''}`}
            onClick={() => setLanguage('en')}
          >
            EN
          </button>
          <button
            className={`lang-btn ${currentLang === 'ja' ? 'active' : ''}`}
            onClick={() => setLanguage('ja')}
          >
            日本語
          </button>
        </div>
      </header>

      <div
        className="upload-area"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="upload-icon">📤</div>
        <h3>{t('upload_title')}</h3>
        <p>{t('upload_desc')}</p>
        <button
          className="select-button"
          onClick={() => fileInputRef.current?.click()}
        >
          {t('select_image')}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg"
          style={{ display: 'none' }}
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
        />
      </div>

      {previewSrc && (
        <div className="preview-section">
          <h3 className="section-title">{t('preview_title')}</h3>
          <img src={previewSrc} alt="Preview" className="preview-image" />

          <div className="controls">
            <div className="control-group">
              <label>
                {t('ascii_width')} <span className="value">{asciiWidth}</span>
              </label>
              <input
                type="range"
                min="40"
                max="360"
                value={asciiWidth}
                onChange={(e) => setAsciiWidth(Number(e.target.value))}
              />
            </div>

            <div className="control-group">
              <label>
                {t('edge_sensitivity')} <span className="value">{edgeThreshold}</span>
              </label>
              <input
                type="range"
                min="50"
                max="200"
                value={edgeThreshold}
                onChange={(e) => setEdgeThreshold(Number(e.target.value))}
              />
            </div>

            <div className="control-group">
              <label>
                {t('noise_filter')} <span className="value">{noiseReduction}</span>
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={noiseReduction}
                onChange={(e) => setNoiseReduction(Number(e.target.value))}
              />
            </div>

            <div className="control-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={invertColors}
                  onChange={(e) => setInvertColors(e.target.checked)}
                />
                {t('invert_colors')}
              </label>
            </div>

            <div className="control-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={autoOptimize}
                  onChange={(e) => setAutoOptimize(e.target.checked)}
                />
                {t('auto_optimize')}
              </label>
            </div>

            <button className="convert-button" onClick={() => handleConvert()}>
              {t('convert_button')}
            </button>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="loading-section">
          <div className="loading-spinner"></div>
          <p className="loading-text">{t(loadingMessage)}</p>
        </div>
      )}

      {showResult && (
        <div className="result-section">
          <h3 className="section-title">{t('result_title')}</h3>

          <div className="tabs">
            <button
              className={`tab ${activeTab === 'text' ? 'active' : ''}`}
              onClick={() => setActiveTab('text')}
            >
              {t('text_result')}
            </button>
            <button
              className={`tab ${activeTab === 'image' ? 'active' : ''}`}
              onClick={() => setActiveTab('image')}
            >
              {t('image_result')}
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'text' && (
              <pre className="ascii-output">{asciiResult}</pre>
            )}
            {activeTab === 'image' && asciiImageSrc && (
              <div className="image-result">
                <img src={asciiImageSrc} alt="ASCII Art" />
              </div>
            )}
          </div>

          <div className="action-buttons">
            <button className="action-button" onClick={handleCopy}>
              {t('copy_result')}
            </button>
            <button className="action-button" onClick={handleDownloadTxt}>
              {t('download_txt')}
            </button>
            <button className="action-button" onClick={handleDownloadImage}>
              {t('download_image')}
            </button>
            <button className="action-button reset-button" onClick={handleReset}>
              {t('reset')}
            </button>
          </div>
        </div>
      )}

      <footer className="footer">
        <p>{t('footer')}</p>
      </footer>
    </div>
  );
}

export default App;

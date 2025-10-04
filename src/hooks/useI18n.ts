import { useState, useEffect, useCallback } from 'react';

export type Language = 'zh' | 'en' | 'ja';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
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
    copy_failed: '复制失败,请手动选择文本复制',
    invalid_file: '请选择有效的PNG或JPEG图片文件!',
    conversion_error: '转换过程中出现错误,请重试!',
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
    invalid_file: '有効なPNGまたはJPEG画像ファイルを選択してください!',
    conversion_error: '変換中にエラーが発生しました。再試行してください!',
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

export const useI18n = () => {
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    const saved = localStorage.getItem('preferred-language');
    return (saved as Language) || 'zh';
  });

  const t = useCallback(
    (key: string): string => {
      return translations[currentLang][key] || key;
    },
    [currentLang]
  );

  const setLanguage = useCallback((lang: Language) => {
    setCurrentLang(lang);
    localStorage.setItem('preferred-language', lang);
  }, []);

  return { currentLang, t, setLanguage };
};

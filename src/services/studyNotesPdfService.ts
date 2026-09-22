import { ParsedScene, WatermarkSettings } from '../types';

/**
 * Downloads a specific slide as a high-resolution PNG image.
 * Uses an offscreen HTML5 canvas to composit the slide elements:
 * - 1920x1080 Full HD resolution
 * - Dark high-contrast background (#0b1329 to #030712)
 * - Title and category badge
 * - High-contrast bullet cards
 * - Deterministic visual diagram
 * - Narration subtitle bar
 * - The authentic SatyaGyana logo watermark
 */
export async function downloadSlideAsPng(
  scene: ParsedScene,
  watermarkSettings: WatermarkSettings,
  resolution: '1080p' | '4k' | string = '1080p',
  hideCommandTags = true
): Promise<void> {
  const canvas = document.createElement('canvas');
  const is4k = resolution === '4k';
  const targetWidth = is4k ? 3840 : 1920;
  const targetHeight = is4k ? 2160 : 1080;
  const scale = is4k ? 2 : 1;
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.scale(scale, scale);
  const width = 1920;
  const height = 1080;

  // 1. Premium Dark Radial/Linear Background
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#091326');
  bgGrad.addColorStop(0.5, '#050c1b');
  bgGrad.addColorStop(1, '#020611');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle grid lines
  ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
  ctx.lineWidth = 1;
  for (let x = 60; x < width; x += 120) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 60; y < height; y += 120) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // 2. Outer Frame
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 4;
  ctx.strokeRect(30, 30, width - 60, height - 60);

  // 2.5 Document Background Watermark (Rendered behind text & diagrams, non-obstructive)
  if (watermarkSettings.enableDocumentBackgroundWatermark !== false) {
    ctx.save();
    const bgOpacity = Math.min(0.12, Math.max(0.02, watermarkSettings.documentWatermarkOpacity ?? 0.06));
    ctx.globalAlpha = bgOpacity;
    ctx.translate(width / 2, height / 2);
    ctx.rotate(((watermarkSettings.documentWatermarkAngle ?? -22) * Math.PI) / 180);
    const bgScale = watermarkSettings.documentWatermarkScale ?? 0.85;
    ctx.scale(bgScale, bgScale);

    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 76px serif';
    ctx.fillText('Satya Gyan • सत्य ज्ञान • ସତ୍ୟ ଜ୍ଞାନ', 0, -25);
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('LEARN • GROW • SUCCEED', 0, 45);
    ctx.restore();
  }

  // 3. Top Header Bar
  // Slide Badge
  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  ctx.roundRect(80, 70, 160, 36, 8);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText(`SLIDE ${scene.slideNumber}`, 110, 94);

  // Command Badges or Clean Student Badge
  if (!hideCommandTags && scene.commands.length > 0) {
    let badgeX = 260;
    scene.commands.forEach((cmd) => {
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(badgeX, 70, cmd.length * 12 + 30, 36, 8);
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 14px monospace';
      ctx.fillText(`[${cmd}]`, badgeX + 14, 94);
      badgeX += cmd.length * 12 + 42;
    });
  } else {
    // Clean Student Badge (no distracting [HIGHLIGHT] text)
    ctx.fillStyle = 'rgba(14, 165, 233, 0.15)';
    ctx.beginPath();
    ctx.roundRect(260, 70, 210, 36, 8);
    ctx.fill();
    ctx.strokeStyle = 'rgba(14, 165, 233, 0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('STUDY MASTERCLASS', 278, 93);
  }

  // Slide Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 44px sans-serif';
  ctx.fillText(scene.title, 80, 165);

  // 4. Left Content Column: Bullet Points & High-Retention Cards
  const leftX = 80;
  let currentY = 230;
  const cardWidth = 820;

  scene.contentLines.forEach((line) => {
    // Card background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.beginPath();
    ctx.roundRect(leftX, currentY, cardWidth, 68, 12);
    ctx.fill();
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Bullet dot
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(leftX + 26, currentY + 34, 6, 0, Math.PI * 2);
    ctx.fill();

    // Line text
    ctx.fillStyle = '#f1f5f9';
    ctx.font = '500 22px sans-serif';
    ctx.fillText(line, leftX + 50, currentY + 42);

    currentY += 86;
  });

  // 5. Right Column: Deterministic Scientific Model Card
  const rightX = 960;
  const rightY = 230;
  const rightWidth = 880;
  const rightHeight = 620;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.beginPath();
  ctx.roundRect(rightX, rightY, rightWidth, rightHeight, 16);
  ctx.fill();
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Model Card Header
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('DETERMINISTIC PEDAGOGICAL MODEL', rightX + 30, rightY + 45);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText(scene.visualData.title || scene.title, rightX + 30, rightY + 85);

  // Divider
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(rightX + 30, rightY + 105);
  ctx.lineTo(rightX + rightWidth - 30, rightY + 105);
  ctx.stroke();

  // Draw Model Graph Axes & Curves inside Card
  const graphOriginX = rightX + 110;
  const graphOriginY = rightY + 520;

  // Axes
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 3;
  // Y Axis
  ctx.beginPath();
  ctx.moveTo(graphOriginX, graphOriginY);
  ctx.lineTo(graphOriginX, rightY + 160);
  ctx.stroke();
  // X Axis
  ctx.beginPath();
  ctx.moveTo(graphOriginX, graphOriginY);
  ctx.lineTo(rightX + rightWidth - 80, graphOriginY);
  ctx.stroke();

  // Labels
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText(scene.visualData.yAxisLabel || 'Price (P)', graphOriginX - 80, rightY + 160);
  ctx.fillText(scene.visualData.xAxisLabel || 'Quantity (Q)', rightX + rightWidth - 160, graphOriginY + 45);

  // Supply Curve (Green)
  ctx.strokeStyle = '#34d399';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(graphOriginX + 60, graphOriginY - 50);
  ctx.lineTo(rightX + rightWidth - 140, rightY + 200);
  ctx.stroke();
  ctx.fillStyle = '#34d399';
  ctx.fillText('S (Supply)', rightX + rightWidth - 120, rightY + 210);

  // Demand Curve (Blue)
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(graphOriginX + 60, rightY + 200);
  ctx.lineTo(rightX + rightWidth - 140, graphOriginY - 50);
  ctx.stroke();
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('D (Demand)', rightX + rightWidth - 120, graphOriginY - 40);

  // Equilibrium Point
  const eqX = graphOriginX + 270;
  const eqY = rightY + 360;
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(eqX, eqY, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('E₀ (Equilibrium)', eqX + 15, eqY - 10);

  // 6. Bottom Narration Bar
  const bottomY = height - 150;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.beginPath();
  ctx.roundRect(80, bottomY, width - 160, 80, 14);
  ctx.fill();
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('TEACHER NARRATION:', 110, bottomY + 32);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'italic 20px sans-serif';
  const cleanNarration = scene.narration.length > 130 ? scene.narration.slice(0, 127) + '...' : scene.narration;
  ctx.fillText(`"${cleanNarration}"`, 110, bottomY + 62);

  // 7. Authentic SatyaGyana Watermark (Top Right)
  const displayMode = watermarkSettings.displayMode || 'both';
  const logoShape = watermarkSettings.logoShape || 'squircle';

  const showLogo = displayMode === 'both' || displayMode === 'logo-only';
  const showText = displayMode === 'both' || displayMode === 'text-only';

  const wmWidth = displayMode === 'logo-only' ? 76 : displayMode === 'text-only' ? 220 : 290;
  const wmHeight = 68;
  const wmX = width - wmWidth - 80;
  const wmY = 60;

  // Watermark Card
  ctx.fillStyle = 'rgba(6, 15, 36, 0.92)';
  ctx.beginPath();
  ctx.roundRect(wmX, wmY, wmWidth, wmHeight, 14);
  ctx.fill();
  ctx.strokeStyle = 'rgba(14, 165, 233, 0.4)';
  ctx.lineWidth = 2;
  ctx.stroke();

  let textStartX = wmX + 16;

  // Watermark Emblem (Circle or Squircle)
  if (showLogo) {
    const emblemX = wmX + 10;
    const emblemY = wmY + 10;
    const emblemSize = 48;

    ctx.fillStyle = '#08142c';
    ctx.beginPath();
    if (logoShape === 'circle') {
      ctx.arc(emblemX + 24, emblemY + 24, 24, 0, Math.PI * 2);
    } else {
      ctx.roundRect(emblemX, emblemY, emblemSize, emblemSize, 12);
    }
    ctx.fill();
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // White Book Pages
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(emblemX + 24, emblemY + 34);
    ctx.lineTo(emblemX + 8, emblemY + 30);
    ctx.lineTo(emblemX + 12, emblemY + 14);
    ctx.lineTo(emblemX + 24, emblemY + 18);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(emblemX + 24, emblemY + 34);
    ctx.lineTo(emblemX + 40, emblemY + 30);
    ctx.lineTo(emblemX + 36, emblemY + 14);
    ctx.lineTo(emblemX + 24, emblemY + 18);
    ctx.fill();

    // Center Cyan Upward Arrow
    ctx.fillStyle = '#00b4d8';
    ctx.beginPath();
    ctx.moveTo(emblemX + 24, emblemY + 6);
    ctx.lineTo(emblemX + 29, emblemY + 16);
    ctx.lineTo(emblemX + 19, emblemY + 16);
    ctx.fill();
    ctx.fillRect(emblemX + 22.5, emblemY + 14, 3, 16);

    textStartX = emblemX + 58;
  }

  // Text: SatyaGyana & Tagline
  if (showText) {
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('Satya', textStartX, wmY + 36);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('Gyana', textStartX + 56, wmY + 36);

    // Tagline: LEARN • GROW • SUCCEED
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 8.5px sans-serif';
    ctx.fillText('LEARN • GROW • SUCCEED', textStartX, wmY + 52);
  }

  // Convert canvas to download link
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const cleanTitle = scene.title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30);
    link.download = `SatyaGyana_Slide_${scene.slideNumber}_${resolution.toUpperCase()}_${cleanTitle}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 'image/png');
}

/**
 * Generates and downloads a comprehensive, print-ready PDF Study Notes booklet
 * with the exact SatyaGyana branding and watermark on every page.
 */
export function downloadStudyNotesAsPdf(
  scenes: ParsedScene[],
  watermarkSettings: WatermarkSettings,
  lectureTitle = 'Economic & Scientific Masterclass',
  targetExam = 'Competitive Exam (UPSC / State PSC / College)'
): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to download the SatyaGyana Study Notes PDF.');
    return;
  }

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const totalDuration = scenes.reduce((acc, s) => acc + s.estimatedDurationSec, 0);
  const minutes = Math.round(totalDuration / 60);

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SatyaGyana Study Notes — ${lectureTitle}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');

    @page {
      size: A4;
      margin: 14mm 14mm 16mm 14mm;
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 0;
      font-size: 13px;
      line-height: 1.6;
    }

    /* Print action bar on screen */
    .screen-controls {
      background: #091326;
      color: #ffffff;
      padding: 12px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .btn-print {
      background: #0284c7;
      color: #ffffff;
      border: none;
      padding: 8px 18px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .btn-print:hover {
      background: #0369a1;
    }

    @media print {
      .screen-controls {
        display: none !important;
      }
      .page-break {
        page-break-after: always;
        break-after: page;
      }
    }

    /* Document Container */
    .document-body {
      max-width: 900px;
      margin: 0 auto;
      padding: 24px;
    }

    /* Authentic Header */
    .doc-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 18px;
      border-bottom: 2.5px solid #0284c7;
      margin-bottom: 24px;
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .logo-svg-box {
      width: 52px;
      height: 52px;
      background: #08142c;
      border-radius: 14px;
      border: 1.5px solid #1e293b;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .brand-title {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin: 0;
      line-height: 1.1;
      color: #0f172a;
    }
    .brand-title span {
      color: #0284c7;
    }

    .brand-tagline {
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 1.5px;
      color: #64748b;
      margin-top: 3px;
      text-transform: uppercase;
    }

    .doc-meta {
      text-align: right;
      font-size: 11px;
      color: #475569;
    }
    .doc-meta strong {
      color: #0f172a;
      display: block;
      font-size: 12px;
    }

    /* Masterclass Overview Hero Card */
    .hero-card {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border: 1.5px solid #bae6fd;
      border-radius: 12px;
      padding: 18px 22px;
      margin-bottom: 28px;
      position: relative;
    }

    .hero-title {
      font-size: 20px;
      font-weight: 800;
      color: #0369a1;
      margin: 0 0 6px 0;
    }

    .hero-stats {
      display: flex;
      gap: 20px;
      font-size: 11px;
      color: #0c4a6e;
      font-weight: 600;
      margin-top: 8px;
    }

    .stat-pill {
      background: #ffffff;
      padding: 4px 10px;
      border-radius: 6px;
      border: 1px solid #7dd3fc;
    }

    /* Slide Study Note Card */
    .study-card {
      border: 1.5px solid #e2e8f0;
      border-radius: 12px;
      margin-bottom: 26px;
      background: #ffffff;
      overflow: hidden;
      box-shadow: 0 2px 6px rgba(0,0,0,0.03);
      position: relative;
    }

    /* Watermark background on each study card */
    .watermark-bg {
      position: absolute;
      right: 15px;
      bottom: 15px;
      opacity: 0.06;
      pointer-events: none;
      width: 160px;
      height: 160px;
    }

    .card-header {
      background: #f8fafc;
      border-bottom: 1.5px solid #e2e8f0;
      padding: 12px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .slide-badge {
      background: #0284c7;
      color: #ffffff;
      font-weight: 800;
      font-size: 11px;
      padding: 3px 10px;
      border-radius: 6px;
      letter-spacing: 0.5px;
    }

    .slide-title {
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
      flex: 1;
      margin-left: 14px;
    }

    .tag-badge {
      background: #f1f5f9;
      color: #475569;
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      padding: 2px 8px;
      border-radius: 4px;
      border: 1px solid #cbd5e1;
      margin-left: 6px;
    }

    .card-body {
      padding: 18px;
    }

    /* Concept & Bullets */
    .concept-title {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #0284c7;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .bullet-list {
      margin: 0 0 16px 0;
      padding: 0;
      list-style: none;
    }

    .bullet-item {
      padding: 8px 12px;
      margin-bottom: 6px;
      background: #f8fafc;
      border-left: 3px solid #0284c7;
      border-radius: 0 6px 6px 0;
      font-size: 12.5px;
      color: #1e293b;
    }

    /* Visual Model Simulation Box */
    .model-box {
      background: #091326;
      color: #ffffff;
      border-radius: 10px;
      padding: 16px;
      margin-bottom: 16px;
    }

    .model-header {
      font-size: 11px;
      font-weight: 700;
      color: #38bdf8;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 4px;
    }

    .model-sub {
      font-size: 14px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 10px;
    }

    .model-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      background: rgba(255,255,255,0.05);
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 11.5px;
      color: #cbd5e1;
    }

    /* Teacher Narration Script Box */
    .narration-box {
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-radius: 8px;
      padding: 12px 16px;
      margin-top: 12px;
    }

    .narration-header {
      font-size: 11px;
      font-weight: 700;
      color: #b45309;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .narration-text {
      font-size: 12.5px;
      color: #78350f;
      font-style: italic;
      margin: 0;
      line-height: 1.5;
    }

    /* Footer */
    .doc-footer {
      border-top: 1.5px solid #e2e8f0;
      padding-top: 14px;
      margin-top: 36px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 10px;
      color: #64748b;
    }

    /* Document Background Watermark (Non-obstructive background layer) */
    .pdf-bg-watermark {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(${watermarkSettings.documentWatermarkAngle ?? -22}deg) scale(${watermarkSettings.documentWatermarkScale ?? 0.85});
      opacity: ${Math.min(0.07, Math.max(0.02, watermarkSettings.documentWatermarkOpacity ?? 0.045))};
      pointer-events: none;
      user-select: none;
      z-index: 0;
      text-align: center;
      width: 720px;
      color: #0f172a;
    }

    .document-body {
      position: relative;
    }

    .document-body > header,
    .document-body > main,
    .document-body > footer,
    .document-body > div.hero-card,
    .document-body > div.slide-card {
      position: relative;
      z-index: 2;
    }
  </style>
</head>
<body>

  <!-- Background Watermark rendered strictly behind text and diagrams -->
  <div class="pdf-bg-watermark">
    <div style="font-size: 48px; font-weight: 800; font-family: serif; letter-spacing: 2px;">
      ${watermarkSettings.documentWatermarkText || 'Satya Gyan • सत्य ज्ञान • ସତ୍ୟ ଜ୍ଞାନ'}
    </div>
    <div style="font-size: 18px; font-weight: 700; letter-spacing: 5px; margin-top: 8px;">
      • LEARN • GROW • SUCCEED •
    </div>
  </div>

  <!-- Screen Top Bar with Instant Print Action -->
  <div class="screen-controls">
    <div style="display:flex; align-items:center; gap:12px;">
      <strong>SatyaGyana Study Notes & Script Package</strong>
      <span style="font-size:11px; color:#94a3b8;">${scenes.length} Slides • ${minutes} Min Lecture</span>
    </div>
    <div style="display:flex; gap:10px;">
      <button class="btn-print" onclick="window.print()">
        🖨️ Save as PDF / Print
      </button>
    </div>
  </div>

  <div class="document-body">
    <!-- Header with Authentic Logo -->
    <header class="doc-header">
      <div class="logo-container">
        <div class="logo-svg-box">
          <svg width="40" height="40" viewBox="0 0 192 192" fill="none">
            <rect x="6" y="6" width="180" height="180" rx="46" fill="#08142c" />
            <circle cx="96" cy="68" r="42" fill="#0077b6" opacity="0.6" />
            <!-- Book -->
            <path d="M 94 123 C 78 115 58 110 42 112 L 48 58 C 64 58 80 64 94 72 Z" fill="#ffffff" />
            <path d="M 98 123 C 114 115 134 110 150 112 L 144 58 C 128 58 112 64 98 72 Z" fill="#ffffff" />
            <!-- Circuits -->
            <path d="M 88 115 C 80 110 72 105 70 94 L 70 78" stroke="#0084ff" stroke-width="3" stroke-linecap="round" fill="none" />
            <circle cx="70" cy="76" r="3.5" fill="#0084ff" />
            <path d="M 104 115 C 112 110 120 105 122 94 L 122 78" stroke="#0084ff" stroke-width="3" stroke-linecap="round" fill="none" />
            <circle cx="122" cy="76" r="3.5" fill="#0084ff" />
            <!-- Arrow -->
            <rect x="93" y="52" width="6" height="74" rx="2" fill="#00b4d8" />
            <path d="M 96 36 L 109 54 L 83 54 Z" fill="#00b4d8" />
          </svg>
        </div>
        <div>
          <h1 class="brand-title">Satya<span>Gyana</span></h1>
          <div class="brand-tagline">— LEARN • GROW • SUCCEED —</div>
        </div>
      </div>

      <div class="doc-meta">
        <strong>HIGH-RETENTION STUDY NOTES</strong>
        <div>Target: ${targetExam}</div>
        <div>Generated: ${currentDate}</div>
      </div>
    </header>

    <!-- Masterclass Overview -->
    <div class="hero-card">
      <h2 class="hero-title">${lectureTitle}</h2>
      <p style="margin:0; font-size:12px; color:#0369a1;">
        Structured pedagogical slide notes, mathematical models, key equations, and teacher narration transcripts.
      </p>
      <div class="hero-stats">
        <span class="stat-pill">📚 ${scenes.length} Learning Modules</span>
        <span class="stat-pill">⏱️ ~${minutes} Minutes Estimated Runtime</span>
        <span class="stat-pill">🎯 SatyaGyana Verified Curriculum</span>
      </div>
    </div>

    <!-- Slide Cards -->
    ${scenes
      .map(
        (sc) => `
      <div class="study-card">
        <!-- Subtle Watermark -->
        <svg class="watermark-bg" viewBox="0 0 192 192" fill="none">
          <circle cx="96" cy="96" r="80" stroke="#0284c7" stroke-width="4" />
          <path d="M 94 123 C 78 115 58 110 42 112 L 48 58 C 64 58 80 64 94 72 Z" fill="#0284c7" />
          <path d="M 98 123 C 114 115 134 110 150 112 L 144 58 C 128 58 112 64 98 72 Z" fill="#0284c7" />
        </svg>

        <div class="card-header">
          <div style="display:flex; align-items:center;">
            <span class="slide-badge">MODULE #${sc.slideNumber}</span>
            <h3 class="slide-title">${sc.title}</h3>
          </div>
          <div>
            ${sc.commands.map((cmd) => `<span class="tag-badge">[${cmd}]</span>`).join('')}
          </div>
        </div>

        <div class="card-body">
          <!-- Bullet Point Highlights -->
          <div class="concept-title">📌 Core Concepts & Visual Takeaways</div>
          <ul class="bullet-list">
            ${sc.contentLines.map((line) => `<li class="bullet-item">• ${line}</li>`).join('')}
          </ul>

          <!-- Model / Visualization Summary -->
          <div class="model-box">
            <div class="model-header">Visual Model Architecture: ${sc.visualData.category.toUpperCase()}</div>
            <div class="model-sub">${sc.visualData.title || sc.title}</div>
            <div class="model-details">
              <div>
                <strong>Primary Metric:</strong> ${sc.visualData.equilibriumPoint?.price || sc.visualData.keyParameters?.[0]?.value || 'Calculated Coordinate Point'}<br>
                <strong>Axes:</strong> ${sc.visualData.yAxisLabel || 'Vertical Response'} vs. ${sc.visualData.xAxisLabel || 'Horizontal Factor'}
              </div>
              <div>
                <strong>Model Class:</strong> ${sc.visualData.subtitle || 'High-Retention Scientific Representation'}<br>
                <strong>Method:</strong> Deterministic Coordinate Graphing
              </div>
            </div>
          </div>

          <!-- Explanatory Narration Script -->
          <div class="narration-box">
            <div class="narration-header">🎙️ Teacher's Spoken Lecture Notes</div>
            <p class="narration-text">"${sc.narration}"</p>
          </div>
        </div>
      </div>
    `
      )
      .join('')}

    <!-- Document Footer -->
    <footer class="doc-footer">
      <div>
        <strong>SatyaGyana</strong> • Educational Video & Content Studio
      </div>
      <div>
        Page generated by ARPITON Studio • Confidential & Educational
      </div>
    </footer>
  </div>

  <script>
    // Automatically trigger print dialog on desktop
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>
`;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}

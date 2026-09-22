import { ParsedScene, WatermarkSettings } from '../types';
import { ttsService } from './ttsService';

export interface VideoExportOptions {
  resolution: '1080p' | '4k' | '720p';
  watermarkSettings: WatermarkSettings;
  fps?: number;
  hideCommandTags?: boolean;
  onProgress?: (progress: number, message: string) => void;
}

export const RESOLUTION_DIMENSIONS = {
  '720p': { width: 1280, height: 720, label: '720p HD (1280x720)' },
  '1080p': { width: 1920, height: 1080, label: '1080p Full HD (1920x1080)' },
  '4k': { width: 3840, height: 2160, label: '4K Ultra HD (3840x2160)' },
};

export async function exportLectureVideo(
  scenes: ParsedScene[],
  options: VideoExportOptions
): Promise<Blob> {
  const { resolution, watermarkSettings, hideCommandTags = true, onProgress } = options;
  const { width, height } = RESOLUTION_DIMENSIONS[resolution] || RESOLUTION_DIMENSIONS['1080p'];
  const scaleFactor = resolution === '4k' ? 2.0 : resolution === '720p' ? 0.667 : 1.0;

  if (scenes.length === 0) {
    throw new Error('No slides to export.');
  }

  onProgress?.(5, `Initializing ${resolution.toUpperCase()} video pipeline (${width}x${height})...`);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { alpha: false });

  if (!ctx) {
    throw new Error('Canvas 2D context is not available.');
  }

  drawSlideFrame(ctx, scenes[0], 0, scenes.length, width, height, scaleFactor, watermarkSettings, hideCommandTags);

  // 1. Setup Canvas Video Stream
  const canvasStream = canvas.captureStream(30);

  // 2. Setup Web Audio API Destination
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  const audioCtx = new AudioContextClass();
  const audioDest = audioCtx.createMediaStreamDestination();

  // 3. Combine Video and Audio
  const combinedStream = new MediaStream([
    ...canvasStream.getVideoTracks(),
    ...audioDest.stream.getAudioTracks()
  ]);

  let mimeType = 'video/webm;codecs=vp9,opus';
  if (!MediaRecorder.isTypeSupported(mimeType)) {
    mimeType = 'video/webm;codecs=vp8,opus';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm';
    }
  }

  const mediaRecorder = new MediaRecorder(combinedStream, {
    mimeType,
    videoBitsPerSecond: resolution === '4k' ? 25000000 : 8000000,
  });

  const chunks: Blob[] = [];
  mediaRecorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) {
      chunks.push(e.data);
    }
  };

  return new Promise<Blob>((resolve, reject) => {
    mediaRecorder.onstop = () => {
      const finalBlob = new Blob(chunks, { type: mimeType });
      onProgress?.(100, `${resolution.toUpperCase()} Video render complete!`);
      if (audioCtx.state !== 'closed') audioCtx.close();
      resolve(finalBlob);
    };
    
    mediaRecorder.onerror = reject;
    mediaRecorder.start();

    let sceneIdx = 0;
    const totalScenes = scenes.length;

    async function renderNextSlide() {
      if (sceneIdx >= totalScenes) {
        setTimeout(() => mediaRecorder.stop(), 1000);
        return;
      }

      const scene = scenes[sceneIdx];
      let slideDurationMs = 5000;

      try {
        onProgress?.(
          Math.round(((sceneIdx) / totalScenes) * 90),
          `Synthesizing Audio for Slide ${sceneIdx + 1}...`
        );

        const ttsResponse = await ttsService.synthesizeSpeech({
          text: scene.narration,
          language: 'English', 
          voice: 'default',
          speakingStyle: 'Professional lecturer',
          speed: 1.0
        });

        if (ttsResponse.success && ttsResponse.audioUrl) {
          const audioResponse = await fetch(ttsResponse.audioUrl);
          const arrayBuffer = await audioResponse.arrayBuffer();
          const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
          
          slideDurationMs = audioBuffer.duration * 1000;

          const sourceNode = audioCtx.createBufferSource();
          sourceNode.buffer = audioBuffer;
          sourceNode.connect(audioDest);
          sourceNode.start();
        } else {
          slideDurationMs = Math.max(5000, scene.estimatedDurationSec * 1000);
        }
      } catch (err) {
        console.warn('TTS Audio failed for scene, falling back to silent frame', err);
        slideDurationMs = Math.max(5000, scene.estimatedDurationSec * 1000);
      }

      onProgress?.(
        Math.round(((sceneIdx + 1) / totalScenes) * 90),
        `Rendering Slide ${sceneIdx + 1} of ${totalScenes} (${Math.round(slideDurationMs/1000)}s)...`
      );

      const startTime = Date.now();
      
      const frameInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        if (elapsed >= slideDurationMs) {
          clearInterval(frameInterval);
          sceneIdx++;
          renderNextSlide();
        } else {
          drawSlideFrame(
            ctx!,
            scene,
            sceneIdx,
            totalScenes,
            width,
            height,
            scaleFactor,
            watermarkSettings,
            hideCommandTags
          );
        }
      }, 33);
    }

    renderNextSlide();
  });
}

export function drawSlideFrame(
  ctx: CanvasRenderingContext2D,
  scene: ParsedScene,
  sceneIndex: number,
  totalScenes: number,
  width: number,
  height: number,
  scale: number,
  watermark: WatermarkSettings,
  hideCommandTags: boolean = true
) {
  ctx.fillStyle = '#060b17';
  ctx.fillRect(0, 0, width, height);

  const ambientGrad = ctx.createRadialGradient(
    width * 0.5,
    0,
    10,
    width * 0.5,
    height * 0.4,
    width * 0.7
  );
  ambientGrad.addColorStop(0, 'rgba(14, 165, 233, 0.12)');
  ambientGrad.addColorStop(1, 'rgba(6, 11, 23, 0)');
  ctx.fillStyle = ambientGrad;
  ctx.fillRect(0, 0, width, height);

  drawWatermarkOnCanvas(ctx, watermark, width, height, scale);

  const padX = 60 * scale;
  const padY = 50 * scale;

  const badgeText = `SLIDE ${scene.slideNumber} / ${totalScenes}`;
  ctx.font = `bold ${13 * scale}px ui-monospace, SFMono-Regular, monospace`;
  const badgeWidth = ctx.measureText(badgeText).width + 24 * scale;
  const badgeHeight = 26 * scale;
  ctx.fillStyle = 'rgba(14, 165, 233, 0.18)';
  ctx.strokeStyle = 'rgba(14, 165, 233, 0.45)';
  ctx.lineWidth = 1.5 * scale;
  roundRect(ctx, padX, padY, badgeWidth, badgeHeight, 6 * scale);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#38bdf8';
  ctx.fillText(badgeText, padX + 12 * scale, padY + 18 * scale);

  if (!hideCommandTags) {
    let tagOffset = padX + badgeWidth + 12 * scale;
    scene.commands.slice(0, 2).forEach((cmd) => {
      const tagStr = `[${cmd}]`;
      ctx.font = `bold ${11 * scale}px monospace`;
      const tw = ctx.measureText(tagStr).width + 16 * scale;
      ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
      ctx.strokeStyle = 'rgba(71, 85, 105, 0.6)';
      roundRect(ctx, tagOffset, padY, tw, badgeHeight, 6 * scale);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(tagStr, tagOffset + 8 * scale, padY + 18 * scale);
      tagOffset += tw + 8 * scale;
    });
  }

  const titleY = padY + 54 * scale;
  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${28 * scale}px "Plus Jakarta Sans", system-ui, -apple-system, sans-serif`;
  ctx.fillText(scene.title, padX, titleY);

  const middleY = titleY + 32 * scale;
  const middleHeight = height - middleY - (110 * scale);
  const colWidth = (width - padX * 2 - (40 * scale)) / 2;
  const leftX = padX;
  let curBulletY = middleY + (10 * scale);
  const maxBullets = 4;
  const contentItems = scene.contentLines.slice(0, maxBullets);

  contentItems.forEach((line) => {
    const cleanLine = line.replace(/^[ \-\*]\s*/, '').trim();
    const colonIdx = cleanLine.indexOf(':');
    let label = '';
    let body = cleanLine;

    if (colonIdx > 0 && colonIdx < 28) {
      label = cleanLine.slice(0, colonIdx + 1);
      body = cleanLine.slice(colonIdx + 1).trim();
    }

    const cardH = 56 * scale;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.7)';
    ctx.lineWidth = 1 * scale;
    roundRect(ctx, leftX, curBulletY, colWidth, cardH, 10 * scale);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(leftX + 20 * scale, curBulletY + 28 * scale, 4 * scale, 0, Math.PI * 2);
    ctx.fill();

    const textStartX = leftX + 36 * scale;
    if (label) {
      ctx.font = `bold ${14 * scale}px system-ui, sans-serif`;
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(label, textStartX, curBulletY + 26 * scale);
      const labelW = ctx.measureText(label).width;
      ctx.font = `normal ${13.5 * scale}px system-ui, sans-serif`;
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(truncateText(ctx, body, colWidth - (60 * scale) - labelW), textStartX + labelW + (6 * scale), curBulletY + 26 * scale);
    } else {
      ctx.font = `500 ${14 * scale}px system-ui, sans-serif`;
      ctx.fillStyle = '#e2e8f0';
      ctx.fillText(truncateText(ctx, body, colWidth - (50 * scale)), textStartX, curBulletY + 32 * scale);
    }
    curBulletY += cardH + (12 * scale);
  });

  const rightX = leftX + colWidth + (40 * scale);
  drawScientificDiagramOnCanvas(ctx, scene.visualData, rightX, middleY, colWidth, middleHeight, scale);

  const bottomBarY = height - (85 * scale);
  const bottomBarW = width - padX * 2;
  const bottomBarH = 46 * scale;

  ctx.fillStyle = 'rgba(2, 6, 23, 0.88)';
  ctx.strokeStyle = 'rgba(30, 41, 59, 0.9)';
  ctx.lineWidth = 1.5 * scale;
  roundRect(ctx, padX, bottomBarY, bottomBarW, bottomBarH, 12 * scale);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(padX + 22 * scale, bottomBarY + (23 * scale), 4 * scale, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#f1f5f9';
  ctx.font = `italic ${13.5 * scale}px system-ui, sans-serif`;
  const narText = truncateText(ctx, scene.narration || '', bottomBarW - (130 * scale));
  ctx.fillText(`"${narText}"`, padX + 38 * scale, bottomBarY + (28 * scale));

  const timeStr = `~${scene.estimatedDurationSec}s`;
  ctx.font = `bold ${11.5 * scale}px monospace`;
  ctx.fillStyle = '#38bdf8';
  ctx.fillText(timeStr, padX + bottomBarW - (55 * scale), bottomBarY + (28 * scale));
}

function drawWatermarkOnCanvas(
  ctx: CanvasRenderingContext2D,
  watermark: WatermarkSettings,
  canvasWidth: number,
  canvasHeight: number,
  scaleFactor: number
) {
  const displayMode = watermark.displayMode || 'both';
  const logoShape = watermark.logoShape || 'circle';
  const userScale = (watermark.scale || 1.0) * scaleFactor;
  const opacity = watermark.opacity || 0.92;

  ctx.save();
  ctx.globalAlpha = opacity;

  let x = canvasWidth - (240 * userScale);
  let y = 35 * userScale;

  if (watermark.position === 'top-left') {
    x = 40 * userScale;
    y = 35 * userScale;
  } else if (watermark.position === 'bottom-left') {
    x = 40 * userScale;
    y = canvasHeight - (90 * userScale);
  } else if (watermark.position === 'bottom-right') {
    x = canvasWidth - (240 * userScale);
    y = canvasHeight - (90 * userScale);
  }

  if (displayMode === 'logo-only') {
    const badgeSize = 48 * userScale;
    const emblemX = x + (180 * userScale) - badgeSize;

    ctx.fillStyle = '#08142c';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2 * userScale;

    if (logoShape === 'circle') {
      ctx.beginPath();
      ctx.arc(emblemX + badgeSize / 2, y + badgeSize / 2, badgeSize / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else {
      roundRect(ctx, emblemX, y, badgeSize, badgeSize, 12 * userScale);
      ctx.fill();
      ctx.stroke();
    }
    drawEmblemVectors(ctx, emblemX, y, badgeSize, userScale);
  } else if (displayMode === 'text-only') {
    const padW = 180 * userScale;
    const padH = 40 * userScale;

    ctx.fillStyle = 'rgba(4, 11, 24, 0.88)';
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.lineWidth = 1.5 * userScale;
    roundRect(ctx, x, y, padW, padH, 10 * userScale);
    ctx.fill();
    ctx.stroke();

    ctx.font = `bold ${16 * userScale}px system-ui, sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Satya', x + 16 * userScale, y + 22 * userScale);
    const satyaW = ctx.measureText('Satya').width;
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('Gyana', x + 16 * userScale + satyaW, y + 22 * userScale);

    if (watermark.showTagline) {
      ctx.font = `bold ${7.5 * userScale}px system-ui, sans-serif`;
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('LEARN   GROW   SUCCEED', x + 16 * userScale, y + 33 * userScale);
    }
  } else {
    const padW = 210 * userScale;
    const padH = 48 * userScale;

    ctx.fillStyle = 'rgba(4, 11, 24, 0.9)';
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.lineWidth = 1.5 * userScale;
    roundRect(ctx, x, y, padW, padH, 12 * userScale);
    ctx.fill();
    ctx.stroke();

    const emblemSize = 34 * userScale;
    const emblemX = x + 8 * userScale;
    const emblemY = y + 7 * userScale;

    ctx.fillStyle = '#08142c';
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1.5 * userScale;

    if (logoShape === 'circle') {
      ctx.beginPath();
      ctx.arc(emblemX + emblemSize / 2, emblemY + emblemSize / 2, emblemSize / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else {
      roundRect(ctx, emblemX, emblemY, emblemSize, emblemSize, 8 * userScale);
      ctx.fill();
      ctx.stroke();
    }
    
    drawEmblemVectors(ctx, emblemX, emblemY, emblemSize, userScale);

    const textX = emblemX + emblemSize + 10 * userScale;
    ctx.font = `bold ${15 * userScale}px system-ui, sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Satya', textX, y + 24 * userScale);
    const satyaW = ctx.measureText('Satya').width;
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('Gyana', textX + satyaW, y + 24 * userScale);

    ctx.beginPath();
    ctx.arc(textX + satyaW + ctx.measureText('Gyana').width + 8 * userScale, y + 20 * userScale, 3 * userScale, 0, Math.PI * 2);
    ctx.fillStyle = '#38bdf8';
    ctx.fill();

    if (watermark.showTagline) {
      ctx.font = `bold ${7.5 * userScale}px system-ui, sans-serif`;
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('LEARN   GROW   SUCCEED', textX, y + 37 * userScale);
    }
  }
  ctx.restore();
}

function drawEmblemVectors(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  scale: number
) {
  const cx = x + size / 2;
  const cy = y + size / 2;

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(cx - 2 * scale, cy + 6 * scale);
  ctx.bezierCurveTo(cx - 7 * scale, cy + 3 * scale, cx - 12 * scale, cy + 2 * scale, cx - 14 * scale, cy + 4 * scale);
  ctx.lineTo(cx - 13 * scale, cy - 6 * scale);
  ctx.bezierCurveTo(cx - 9 * scale, cy - 8 * scale, cx - 5 * scale, cy - 7 * scale, cx - 2 * scale, cy - 3 * scale);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(cx + 2 * scale, cy + 6 * scale);
  ctx.bezierCurveTo(cx + 7 * scale, cy + 3 * scale, cx + 12 * scale, cy + 2 * scale, cx + 14 * scale, cy + 4 * scale);
  ctx.lineTo(cx + 13 * scale, cy - 6 * scale);
  ctx.bezierCurveTo(cx + 9 * scale, cy - 8 * scale, cx + 5 * scale, cy - 7 * scale, cx + 2 * scale, cy - 3 * scale);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#00b4d8';
  ctx.strokeStyle = '#90e0ef';
  ctx.lineWidth = 1 * scale;
  ctx.fillRect(cx - 1.5 * scale, cy - 5 * scale, 3 * scale, 11 * scale);
  ctx.beginPath();
  ctx.moveTo(cx, cy - 10 * scale);
  ctx.lineTo(cx + 4.5 * scale, cy - 4 * scale);
  ctx.lineTo(cx - 4.5 * scale, cy - 4 * scale);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#0084ff';
  ctx.beginPath();
  ctx.arc(cx - 8 * scale, cy - 2 * scale, 1.2 * scale, 0, Math.PI * 2);
  ctx.arc(cx + 8 * scale, cy - 2 * scale, 1.2 * scale, 0, Math.PI * 2);
  ctx.fill();
}

function drawScientificDiagramOnCanvas(
  ctx: CanvasRenderingContext2D,
  visualData: any,
  x: number,
  y: number,
  w: number,
  h: number,
  scale: number
) {
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.strokeStyle = 'rgba(51, 65, 85, 0.8)';
  ctx.lineWidth = 1.5 * scale;
  roundRect(ctx, x, y, w, h, 12 * scale);
  ctx.fill();
  ctx.stroke();

  const pad = 16 * scale;
  ctx.font = `bold ${10.5 * scale}px system-ui, sans-serif`;
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('DETERMINISTIC ECONOMIC MODEL', x + pad, y + 20 * scale);

  ctx.font = `bold ${14 * scale}px system-ui, sans-serif`;
  ctx.fillStyle = '#f8fafc';
  ctx.fillText(truncateText(ctx, visualData?.title || 'Market Equilibrium', w - (120 * scale)), x + pad, y + 38 * scale);

  const cpW = 85 * scale;
  ctx.fillStyle = 'rgba(14, 165, 233, 0.15)';
  ctx.strokeStyle = 'rgba(14, 165, 233, 0.35)';
  roundRect(ctx, x + w - pad - cpW, y + 14 * scale, cpW, 22 * scale, 4 * scale);
  ctx.fill();
  ctx.stroke();
  ctx.font = `bold ${9.5 * scale}px system-ui, sans-serif`;
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('Ceteris Paribus', x + w - pad - cpW + (8 * scale), y + 29 * scale);

  const graphTop = y + 54 * scale;
  const graphBottom = y + h - (55 * scale);
  const graphLeft = x + (50 * scale);
  const graphRight = x + w - (40 * scale);
  const graphH = graphBottom - graphTop;
  const graphW = graphRight - graphLeft;

  ctx.strokeStyle = 'rgba(51, 65, 85, 0.5)';
  ctx.lineWidth = 1 * scale;
  ctx.setLineDash([3 * scale, 3 * scale]);
  ctx.beginPath();
  ctx.moveTo(graphLeft, graphTop + graphH * 0.33);
  ctx.lineTo(graphRight, graphTop + graphH * 0.33);
  ctx.moveTo(graphLeft, graphTop + graphH * 0.66);
  ctx.lineTo(graphRight, graphTop + graphH * 0.66);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2 * scale;
  ctx.beginPath();
  ctx.moveTo(graphLeft, graphBottom + (5 * scale));
  ctx.lineTo(graphLeft, graphTop - (5 * scale));
  ctx.stroke();

  ctx.fillStyle = '#94a3b8';
  ctx.beginPath();
  ctx.moveTo(graphLeft, graphTop - (10 * scale));
  ctx.lineTo(graphLeft - 4 * scale, graphTop);
  ctx.lineTo(graphLeft + 4 * scale, graphTop);
  ctx.closePath();
  ctx.fill();

  ctx.font = `bold ${12 * scale}px system-ui, sans-serif`;
  ctx.fillStyle = '#f8fafc';
  ctx.fillText('P', graphLeft - (18 * scale), graphTop + (4 * scale));

  ctx.font = `normal ${9.5 * scale}px system-ui, sans-serif`;
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('Price ($)', graphLeft - (42 * scale), graphTop + graphH * 0.5);

  ctx.beginPath();
  ctx.moveTo(graphLeft - (5 * scale), graphBottom);
  ctx.lineTo(graphRight + (10 * scale), graphBottom);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(graphRight + (15 * scale), graphBottom);
  ctx.lineTo(graphRight + (6 * scale), graphBottom - 4 * scale);
  ctx.lineTo(graphRight + (6 * scale), graphBottom + 4 * scale);
  ctx.closePath();
  ctx.fill();

  ctx.font = `bold ${12 * scale}px system-ui, sans-serif`;
  ctx.fillStyle = '#f8fafc';
  ctx.fillText('Q', graphRight + (18 * scale), graphBottom + (4 * scale));

  ctx.font = `normal ${10 * scale}px system-ui, sans-serif`;
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('Quantity (Units)', graphLeft + graphW * 0.35, graphBottom + (24 * scale));

  ctx.strokeStyle = '#34d399';
  ctx.lineWidth = 3 * scale;
  ctx.beginPath();
  ctx.moveTo(graphLeft + (20 * scale), graphBottom - (15 * scale));
  ctx.lineTo(graphRight - (20 * scale), graphTop + (15 * scale));
  ctx.stroke();

  ctx.font = `bold ${13 * scale}px system-ui, sans-serif`;
  ctx.fillStyle = '#34d399';
  ctx.fillText('S', graphRight - (12 * scale), graphTop + (20 * scale));

  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3 * scale;
  ctx.beginPath();
  ctx.moveTo(graphLeft + (20 * scale), graphTop + (15 * scale));
  ctx.lineTo(graphRight - (20 * scale), graphBottom - (15 * scale));
  ctx.stroke();

  ctx.font = `bold ${13 * scale}px system-ui, sans-serif`;
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('D', graphRight - (12 * scale), graphBottom - (15 * scale));

  const eqX = graphLeft + graphW * 0.5;
  const eqY = graphTop + graphH * 0.5;

  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.5 * scale;
  ctx.setLineDash([4 * scale, 3 * scale]);
  ctx.beginPath();
  ctx.moveTo(graphLeft, eqY);
  ctx.lineTo(eqX, eqY);
  ctx.lineTo(eqX, graphBottom);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(eqX, eqY, 5 * scale, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = `bold ${11 * scale}px system-ui, sans-serif`;
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('E0', eqX + (8 * scale), eqY - (8 * scale));

  ctx.font = `bold ${10.5 * scale}px system-ui, sans-serif`;
  ctx.fillText('P0', graphLeft - (20 * scale), eqY + (4 * scale));
  ctx.fillText('Q0', eqX - (6 * scale), graphBottom + (16 * scale));

  const paramBarY = y + h - (32 * scale);
  ctx.fillStyle = 'rgba(2, 6, 23, 0.7)';
  roundRect(ctx, x + pad, paramBarY, w - pad * 2, 24 * scale, 4 * scale);
  ctx.fill();
  ctx.font = `normal ${9 * scale}px system-ui, sans-serif`;
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('Slope of Demand: ΔQ < 0     Slope of Supply: ΔQ > 0     Condition: Stable Equilibrium', x + pad + (10 * scale), paramBarY + (16 * scale));
}

function truncateText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let truncated = text;
  while (truncated.length > 0 && ctx.measureText(truncated + '...').width > maxWidth) {
    truncated = truncated.slice(0, -1);
  }
  return truncated + '...';
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
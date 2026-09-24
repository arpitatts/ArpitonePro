import pptxgen from 'pptxgenjs';
import { ParsedScene, WatermarkSettings } from '../types';
import { drawSlideFrame } from './videoExportService';

export async function exportToPptx(scenes: ParsedScene[], watermarkSettings: WatermarkSettings) {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9'; // Sets standard 1920x1080 widescreen ratio

  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    const slide = pres.addSlide();

    // 1. Create a temporary HTML5 Canvas
    const canvas = document.createElement('canvas');
    const width = 1920;
    const height = 1080;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // 2. Paint the high-resolution slide exactly as it appears in the video
      drawSlideFrame(ctx, scene, i, scenes.length, width, height, 1, watermarkSettings, true);

      // 3. Convert the painted canvas to a Base64 Image
      const dataUrl = canvas.toDataURL('image/png');

      // 4. Stretch the image perfectly across the PowerPoint slide
      slide.addImage({ data: dataUrl, x: 0, y: 0, w: '100%', h: '100%' });

      // 5. Inject the Spoken Narration into the PPT Speaker Notes!
      slide.addNotes(`SLIDE ${scene.slideNumber} NARRATION:\n\n${scene.narration}`);
    }
  }

  // Generate clean filename and trigger download
  const cleanTitle = scenes[0]?.title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30) || 'Masterclass';
  await pres.writeFile({ fileName: `SatyaGyana_${cleanTitle}.pptx` });
}
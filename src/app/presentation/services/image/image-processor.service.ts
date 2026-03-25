import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ImageProcessorService {
  async generatePlaceholder(file: File, maxSize = 64): Promise<File> {
    const bitmap = await createImageBitmap(file);

    let { width, height } = bitmap;

    const ratio = Math.min(maxSize / width, maxSize / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('No context');

    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);

    const blur = Math.max(8, Math.min(width, height) / 3);
    ctx.filter = `blur(${blur}px)`;

    ctx.drawImage(bitmap, 0, 0, width, height);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Blob failed'))), file.type, 0.5);
    });

    const extension = file.type.split('/')[1] || 'webp';

    return new File([blob], `placeholder.${extension}`, {
      type: file.type,
    });
  }
}

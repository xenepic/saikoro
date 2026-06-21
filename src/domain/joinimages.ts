import sharp from 'sharp';

interface ImageAttr {
  width: number;
  height: number;
  buf: Buffer;
}

async function loadImageAttr(path: string): Promise<ImageAttr> {
  const image = sharp(path);
  const meta = await image.metadata();
  const buf = await image.toBuffer();
  return { width: meta.width ?? 0, height: meta.height ?? 0, buf };
}

/** 麻雀牌の画像群を横に連結し、1枚のPNGファイルとして出力する。 */
async function joinImages(paths: string[], outFile = 'output.png'): Promise<void> {
  const imageAttrs = await Promise.all(paths.map(loadImageAttr));

  const outputImgWidth = imageAttrs.reduce((acc, cur) => acc + cur.width, 0);
  const outputImgHeight = Math.max(...imageAttrs.map((v) => v.height));
  let totalLeft = 0;
  const compositeParams = imageAttrs.map((image) => {
    const left = totalLeft;
    totalLeft += image.width;
    return {
      input: image.buf,
      gravity: 'northwest' as const,
      left,
      top: 0,
    };
  });

  let succeeded = false;
  while (!succeeded) {
    try {
      await sharp({
        create: {
          width: outputImgWidth,
          height: outputImgHeight,
          channels: 4,
          background: { r: 255, g: 255, b: 255, alpha: 0 },
        },
      })
        .composite(compositeParams)
        .toFile(outFile);
      succeeded = true;
    } catch {
      console.log('sharp error\ntry again');
    }
  }
}

export { joinImages };

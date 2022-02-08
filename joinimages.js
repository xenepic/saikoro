const sharp = require("sharp");


async function joinImages(paths, outFile = 'output.png') {

    const imagePaths = paths;
    const imageAttrs = [];
    // console.log(paths);
    // 連結する画像の情報取得
    const promises = [];
    const imagePromise = path =>
        new Promise(async (resolve, reject) => {
            try {
                const image = await sharp(path);
                let width = 0,
                    height = 0;
                await image
                    .metadata()
                    .then(meta => ([width, height] = [meta.width, meta.height]));
                const buf = await image.toBuffer();
                resolve({ width, height, buf });
            } catch (e) {
                console.log('sharp error');
                console.log(e);
                reject();
            }

        });
    imagePaths.forEach(path => promises.push(imagePromise(path)));
    await Promise.all(promises).then(values => {
        values.forEach(value => imageAttrs.push(value));
    });
    // console.log('画像情報取得終了');

    // outputする画像の設定
    const outputImgWidth = imageAttrs.reduce((acc, cur) => acc + cur.width, 0);
    const outputImgHeight = Math.max(...imageAttrs.map(v => v.height));
    let totalLeft = 0;
    const compositeParams = imageAttrs.map(image => {
        const left = totalLeft;
        totalLeft += image.width;
        return {
            input: image.buf,
            gravity: "northwest",
            left: left,
            top: 0
        };
    });
    // console.log('出力設定終了');
    let flag = true;
    while (flag) {
        try {
            // 連結処理
            await sharp({
                    create: {
                        width: outputImgWidth,
                        height: outputImgHeight,
                        channels: 4,
                        background: { r: 255, g: 255, b: 255, alpha: 0 }
                    }
                })
                .composite(compositeParams)
                .toFile(outFile);
            flag = false;


        } catch {
            console.log('sharp error\ntry again')
        }
    }

    // console.log('画像連結終了');

}

module.exports = { joinImages };
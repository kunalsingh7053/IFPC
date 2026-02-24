const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

async function uploadImage(file, folder) {
  const res = await imagekit.upload({
    file: file.buffer,
    fileName: file.originalname,
    folder
  });
  return res.url;
}

async function uploadMultiple(files, folder) {
  const urls = [];

  for (const file of files) {
    const res = await imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
      folder
    });
    urls.push(res.url);
  }

  return urls;
}

module.exports = { uploadImage, uploadMultiple };
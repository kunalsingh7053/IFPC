const ImageKit = require("imagekit");

let imagekitClient = null;

function getImageKitClient() {
  if (imagekitClient) return imagekitClient;

  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

  if (!publicKey || !privateKey || !urlEndpoint) {
    throw new Error(
      "ImageKit configuration missing. Set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY and IMAGEKIT_URL_ENDPOINT"
    );
  }

  imagekitClient = new ImageKit({
    publicKey,
    privateKey,
    urlEndpoint,
  });

  return imagekitClient;
}

async function uploadImage(file, folder) {
  const imagekit = getImageKitClient();

  const res = await imagekit.upload({
    file: file.buffer,
    fileName: file.originalname,
    folder
  });
  return res.url;
}

async function uploadMultiple(files, folder) {
  const imagekit = getImageKitClient();
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
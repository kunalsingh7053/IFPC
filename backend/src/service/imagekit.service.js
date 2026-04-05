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
  const asset = await uploadImageAsset(file, folder);
  return asset.url;
}

async function uploadImageAsset(file, folder) {
  const imagekit = getImageKitClient();

  const res = await imagekit.upload({
    file: file.buffer,
    fileName: file.originalname,
    folder
  });
  return {
    url: res.url,
    fileId: res.fileId,
  };
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

async function deleteImageByFileId(fileId) {
  if (!fileId) return false;

  try {
    const imagekit = getImageKitClient();
    await imagekit.deleteFile(fileId);
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = { uploadImage, uploadImageAsset, uploadMultiple, deleteImageByFileId };
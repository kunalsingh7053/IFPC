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
  const assets = await uploadMultipleAssets(files, folder);
  return assets.map((asset) => asset.url);
}

async function uploadMultipleAssets(files, folder) {
  const imagekit = getImageKitClient();
  const assets = [];

  for (const file of files) {
    const res = await imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
      folder
    });
    assets.push({
      url: res.url,
      fileId: res.fileId,
    });
  }

  return assets;
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

async function deleteImagesByFileIds(fileIds = []) {
  const uniqueFileIds = [...new Set((fileIds || []).filter(Boolean))];
  if (uniqueFileIds.length === 0) {
    return { deleted: 0, failed: 0 };
  }

  let deleted = 0;
  let failed = 0;

  for (const fileId of uniqueFileIds) {
    const ok = await deleteImageByFileId(fileId);
    if (ok) deleted += 1;
    else failed += 1;
  }

  return { deleted, failed };
}

module.exports = {
  uploadImage,
  uploadImageAsset,
  uploadMultiple,
  uploadMultipleAssets,
  deleteImageByFileId,
  deleteImagesByFileIds,
};
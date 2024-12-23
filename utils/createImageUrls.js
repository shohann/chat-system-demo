function createImageUrls(filesArray, baseUrl) {
  return filesArray.map((file) => `${baseUrl}/${file.filename}`);
}

module.exports = createImageUrls;

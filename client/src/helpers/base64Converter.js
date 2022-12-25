export default function base64Converter(data) {
  return new Promise((resolve) => {
    let baseURL = "";

    // Make new FileReader
    const reader = new FileReader();

    // Convert the file to base64 text
    reader.readAsDataURL(data);

    reader.onload = () => {
      baseURL = reader.result;
      return resolve(baseURL);
    };
  });
}

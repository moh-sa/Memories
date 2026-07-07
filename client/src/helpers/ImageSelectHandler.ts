import imageSizeValidate from "./imageSizeValidate";
import base64Converter from "./base64Converter";

export default async function ImageSelectHandler(data: File) {
  const validate = imageSizeValidate(data);

  if (!validate) {
    return validate;
  }

  return await base64Converter(data);
}

export default function imageSizeValidate({ size }) {
  const fileSizeLimit = 30_000_000; //30MB
  return size <= fileSizeLimit;
}

export default function imageSizeValidate({ size }: { size: number }) {
  const fileSizeLimit = 30_000_000; // 30MB
  return size <= fileSizeLimit;
}

export default function descriptionHandler(data: string) {
  return data.replaceAll("\n", " ").substring(0, 100);
}

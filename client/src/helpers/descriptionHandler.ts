export default async function descriptionHandler(data: string) {
  return await data.replaceAll("\n", " ").substring(0, 100);
}

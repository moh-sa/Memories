export default async function descriptionHandler(data) {
  return await data.replaceAll("\n", " ").substring(0, 100);
}

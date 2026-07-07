export default function tagsHandler(data: string[]) {
  return data.map((tag) => tag.trim().toLowerCase().replaceAll(" ", "_"));
}

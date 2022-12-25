export default function tagsHandler(data) {
  return data.map((tag) => tag.trim().toLowerCase().replaceAll(" ", "_"));
}

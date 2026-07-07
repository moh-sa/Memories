export default function genImageUrl(public_id: string, options: string) {
  return `https://res.cloudinary.com/tno/image/upload/${options}/${public_id}.webp`;
}

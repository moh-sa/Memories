export default function genImageUrl(public_id, options) {
  return `https://res.cloudinary.com/tno/image/upload/${options}/${public_id}.webp`;
}

export function convertBiographyToHtml(biography: string): string {
  // Replace [i] and [/i] with <i> and </i>
  biography = biography.replace(/\[i\]/g, '<i>').replace(/\[\/i\]/g, '</i>');

  // Replace [b] and [/b] with <b> and </b>
  biography = biography.replace(/\[b\]/g, '<b>').replace(/\[\/b\]/g, '</b>');

  // Replace [a=...] with <a href="https://www.discogs.com/artist/{id}">{name}</a>
  biography = biography.replace(/\[a=(.*?)\]/g, (_, p1) => {
    const [name] = p1.split('=');
    return name;
  });

  // Replace [l=...] with <a href="https://www.discogs.com/label/{id}">{name}</a>
  biography = biography.replace(/\[l=(.*?)\]/g, (_, p1) => {
    const [name] = p1.split('=');
    return name;
  });

  // Links with just the Id
  // [a1812708] to <a href="https://www.discogs.com/artist/[a1812708]" target="_blank">[a1812708]</a>
  biography = biography.replace(/\[a([0-9]{5,7})\]/g, (match, id) => {
    return `<a href="https://www.discogs.com/artist/${id}" target="_blank">${match}</a>`;
  });

  biography = biography.replace(/\[l([0-9]{5,7})\]/g, (match, id) => {
    return `<a href="https://www.discogs.com/label/${id}" target="_blank">${match}</a>`;
  });
  return biography;
}

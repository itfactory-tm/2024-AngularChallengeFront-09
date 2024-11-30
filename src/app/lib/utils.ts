export function convertBiographyToHtml(biography: string): string {
  // Helper function to remove sentences with matching links
  const removeMatchingSentences = (text: string): string => {
    const sentenceRegex = /[^.!?]+[.!?]/g; // Matches sentences ending with punctuation
    const sentences = text.match(sentenceRegex) || [text]; // Split by sentences or use the whole text
    const filteredSentences = sentences.filter(sentence => {
      // Remove sentence if it contains a matching [a...] or [l...]
      return !/\[a([0-9]{5,7})\]/g.test(sentence) && !/\[l([0-9]{5,7})\]/g.test(sentence);
    });
    return filteredSentences.join(''); // Reconstruct text
  };

  // Replace formatting tags
  biography = biography.replace(/\[i\]/g, '<i>').replace(/\[\/i\]/g, '</i>');
  biography = biography.replace(/\[b\]/g, '<b>').replace(/\[\/b\]/g, '</b>');

  // Replace artist links with just names
  biography = biography.replace(/\[a=(.*?)\]/g, (_, p1) => {
    const [name] = p1.split('=');
    return name;
  });

  // Replace label links with just names
  biography = biography.replace(/\[l=(.*?)\]/g, (_, p1) => {
    const [name] = p1.split('=');
    return name;
  });

  // Remove sentences containing specific links
  biography = removeMatchingSentences(biography);

  return biography;
}

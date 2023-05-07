export function titleCase(string: string) {
  let sentence = string.toLowerCase().split(" ");
  for (var i = 0; i < sentence.length; i++) {
    if (sentence[i][0])
      sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
  }
  return sentence.join(" ");
}

export default function createLineBreaks(string) {
  let array = string.split('\\n');
  const withLineBreaks = array.reduce((acc, curr, index) => acc.concat(curr, <br key={index} />), []).slice(0, -1);
  return withLineBreaks;
}

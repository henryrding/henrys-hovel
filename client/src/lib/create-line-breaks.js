export default function createLineBreaks(string) {
  let array = string.split('\\n');
  const withLineBreaks = array.reduce((acc, curr) => acc.concat(curr, <br />), []).slice(0, -1);
  return withLineBreaks;
}

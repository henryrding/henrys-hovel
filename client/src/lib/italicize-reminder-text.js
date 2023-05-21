export default function italicizeReminderText(text) {
  const textArray = text.split(/(\([^)]+\))/g);
  return textArray.map((section, index) => {
    if (section.startsWith('(') && section.endsWith(')')) {
      return <em key={index}>{section}</em>;
    }
    return section;
  });
}

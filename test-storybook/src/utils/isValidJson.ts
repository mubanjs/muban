export default function isValidJson(text: string) {
  try {
    JSON.parse(text);
    return true;
  } catch {
    return false;
  }
}

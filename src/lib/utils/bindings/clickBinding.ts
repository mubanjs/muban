export default function (
  target: HTMLElement,
  fn: (event: HTMLElementEventMap['click']) => void,
): () => void {
  target.addEventListener('click', fn);
  return () => {
    target.removeEventListener('click', fn);
  };
}

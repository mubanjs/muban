export function getDirectChildComponents(container: HTMLElement): Array<HTMLElement> {
  return Array.from(container.querySelectorAll<HTMLElement>(`[data-component]`)).filter(
    (element) =>
      element.parentElement?.closest(`[data-component]`) === container.closest(`[data-component]`),
  );
}

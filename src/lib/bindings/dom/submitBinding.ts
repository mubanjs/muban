export function submitBinding(
  target: HTMLFormElement,
  fn: (event: HTMLElementEventMap['submit']) => void | boolean,
) {
  const submitHandler = (event: SubmitEvent) => {
    const returnValue = fn(event);
    // by default, prevent default form execution, unless explicitly returned by the handler
    if (returnValue !== true) {
      event.preventDefault();
    }
  };
  target.addEventListener('submit', submitHandler);
  return () => {
    target.removeEventListener('submit', submitHandler);
  };
}

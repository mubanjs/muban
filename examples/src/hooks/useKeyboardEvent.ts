import { Key } from 'ts-key-enum';

type KeyPressCallback = (event: KeyboardEvent) => void;

export const useKeyboardEvent = (
  keys: Key | Array<Key>,
  callback: KeyPressCallback,
): (() => void) => {
  const onKeydown = (event: KeyboardEvent) => {
    if (Array.isArray(keys) ? keys.includes(event.key as Key) : event.key === keys) {
      callback(event);
    }
  };

  document.addEventListener('keydown', onKeydown);

  return () => document.removeEventListener('keydown', onKeydown);
};

export const useEscapeKeyEvent = (callback: KeyPressCallback) =>
  useKeyboardEvent(Key.Escape, callback);

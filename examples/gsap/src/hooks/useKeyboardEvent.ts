import { Key } from 'ts-key-enum';
import { onMounted, onUnmounted } from '../../../../src';

type KeyPressCallback = (event: KeyboardEvent) => void;

export const useKeyboardEvent = (keys: Key | Array<Key>, callback: KeyPressCallback): void => {
  const onKeydown = (event: KeyboardEvent) => {
    if (Array.isArray(keys) ? keys.includes(event.key as Key) : event.key === keys) {
      callback(event);
    }
  };

  onMounted(() => {
    document.addEventListener('keydown', onKeydown);
  });
  onUnmounted(() => {
    document.removeEventListener('keydown', onKeydown);
  });
};

export const useEscapeKeyEvent = (callback: KeyPressCallback) =>
  useKeyboardEvent(Key.Escape, callback);

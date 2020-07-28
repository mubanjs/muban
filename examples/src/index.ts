/* eslint-disable no-restricted-properties */
import './components/toggle-expand/ToggleExpand';
import './index.css';
import RequireContext = __WebpackModuleApi.RequireContext;

const cache: Record<string, string> = {};

function importAll(r: RequireContext) {
  // eslint-disable-next-line no-return-assign
  r.keys().forEach((key) => (cache[key] = r(key).replace(/^<link.*?[\r\n]/, '')));

  const list = document.querySelector('.component-list');
  list.innerHTML = Object.keys(cache)
    .map((path) => `<li><a href="?path=${path}">${path}</a></li>`)
    .join('');

  const path = new URL(document.location.href).searchParams.get('path');
  if (cache[path]) {
    const componentHeading = document.querySelector('.component-heading');
    componentHeading.textContent = path;
    const content = document.querySelector('.example-content');
    content.innerHTML = cache[path];
  }
}

importAll(require.context('./components/', true, /\.html$/));
// At build-time cache will be populated with all required modules.


import { render } from 'lit-html';

var _global = require("global");

var rootElement = _global.document.getElementById('root');

export default function renderMain({ storyFn, showMain, args,...props}) {
  // console.log('PROPS', props);

  var componentStory = storyFn();
  showMain();

  rootElement.innerText = '';
  const container = document.createElement('div');
  rootElement.appendChild(container);

  // render template
  const result = componentStory.template(args || {});
  render(result, container);
  // init JS component
  componentStory.component && componentStory.component(container.firstElementChild);
}

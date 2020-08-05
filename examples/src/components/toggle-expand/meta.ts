import ToggleExpandKO from './ToggleExpand.Knockout';
import ToggleExpandVue from './ToggleExpand.Vue';
import ToggleExpandReact from './ToggleExpand.React';

export default {
  reactiveVue: () => ToggleExpandVue,
  reactiveKO: () => ToggleExpandKO,
  reactiveReact: () => ToggleExpandReact,
};

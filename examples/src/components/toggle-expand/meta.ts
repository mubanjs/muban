import ToggleExpandKO from './ToggleExpand.Knockout';
import ToggleExpandVue from './ToggleExpand.Vue';
import ToggleExpandReact from './ToggleExpand.React';
import ToggleExpandCycle from './ToggleExpand.Cycle';

export default {
  CycleJS: () => ToggleExpandCycle,
  reactiveVue: () => ToggleExpandVue,
  reactiveKO: () => ToggleExpandKO,
  reactiveReact: () => ToggleExpandReact,
};

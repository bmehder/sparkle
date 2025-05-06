import { createBead } from '../core/createBead.js'

export const withToggle = createBead('toggle', obj => {
  const isOn = !!obj.isOn;

  return {
    toggle: () => ({ isOn: !isOn }),
  };
});

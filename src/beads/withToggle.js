import { createBead } from '../utils/createBead.js';

export const withToggle = createBead('toggle', obj => {
  const isOn = !!obj.isOn;
  return {
    isOn,
    toggle: () => ({ isOn: !isOn }),
  };
});

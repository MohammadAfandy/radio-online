import About from '../../components/About.svelte';
import Drawer from '../../components/UI/Drawer.svelte';
import { render } from '@testing-library/svelte';
import CONFIG from '../../configs';

it('it render app name in about component', async () => {
  const { getByText } = render(About, {
    DrawerComponent: Drawer,
  });

  const appTitle = getByText(CONFIG.APPNAME);

  expect(appTitle).toBeTruthy();
});

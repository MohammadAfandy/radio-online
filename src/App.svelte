<script>
  import { SvelteToast } from '@zerodevx/svelte-toast';
  import AppBar from './components/AppBar.svelte';
  import Player from './components/Player.svelte';
  import FavoriteStation from './components/FavoriteStation.svelte';
  import Container from './components/UI/Container.svelte';
  import Drawer from './components/UI/Drawer.svelte';
  import SearchStation from './components/SearchStation.svelte';
  import Setting from './components/Setting.svelte';

  let isDrawerOpen = false;
  let DrawerComponent = null;

  const handleOpenDrawer = (event) => {
    isDrawerOpen = !isDrawerOpen;
    const { type } = event.detail;
    if (type === 'search') {
      DrawerComponent = SearchStation;
    } else if (type === 'setting') {
      DrawerComponent = Setting;
    }
  };

  $: if (!isDrawerOpen) {
    DrawerComponent = null;
  }

</script>

<main>
  <AppBar on:menu-click={handleOpenDrawer} {isDrawerOpen} />
  <Drawer bind:isOpen={isDrawerOpen}>
    <svelte:component this={DrawerComponent} bind:DrawerComponent />
  </Drawer>
  <Container {isDrawerOpen}>
    <Player />
    <FavoriteStation />
  </Container>
  <SvelteToast options={{ reversed: true, intro: { y: 192 } }} />
</main>

<style>
  main {
    position: relative;
  }

</style>

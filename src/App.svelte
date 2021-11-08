<script>
  import AppBar from './components/AppBar.svelte';
  import Player from './components/Player.svelte';
  import FavoriteStation from './components/FavoriteStation.svelte';
  import Container from './components/UI/Container.svelte';
  import Separator from './components/UI/Separator.svelte';
  import Drawer from './components/UI/Drawer.svelte';
  import SearchStation from './components/SearchStation.svelte';

  let isDrawerOpen = false;
  let DrawerComponent;

  const handleOpenDrawer = (event) => {
    isDrawerOpen = !isDrawerOpen;
    const { type } = event.detail;
    if (type === 'search') {
      DrawerComponent = SearchStation;
    } else {
      // TODO
    }
  };

</script>

<main>
  <AppBar on:menu-click={handleOpenDrawer} />
  <Drawer bind:isOpen={isDrawerOpen}>
    <svelte:component this={DrawerComponent}/>
  </Drawer>
  <Container {isDrawerOpen}>
    <Player />
    <Separator />
    <FavoriteStation />
  </Container>
</main>

<style>
  main {
    position: relative;
  }
</style>

<script>
  import { createEventDispatcher } from 'svelte';
  import IconButton from './UI/IconButton.svelte';
  import CONFIG from '../configs';

  export let isDrawerOpen;
  let showedDrawer;

  const dispatch = createEventDispatcher();

  const handleOpenSearch = () => {
    showedDrawer = 'search';
    dispatch('menu-click', {
      type: 'search',
    });
  };

  const handleOpenSetting = () => {
    showedDrawer = 'setting';
    dispatch('menu-click', {
      type: 'setting',
    });
  };

  $: iconSearch = isDrawerOpen && showedDrawer === 'search' ? 'times' : 'search';
  $: iconSetting = isDrawerOpen && showedDrawer === 'setting' ? 'times' : 'bars';
</script>

<header>
  <nav>
    <div class="logo">
      <h1>
        <a href="/">{CONFIG.APPNAME}</a>
      </h1>
    </div>
    <div class="menu">
      <IconButton size={1.5} iconName={iconSearch} onClick={handleOpenSearch} />
      <IconButton size={1.5} iconName={iconSetting} onClick={handleOpenSetting} />
    </div>
  </nav>
</header>

<style>
  nav {
    display: flex;
    justify-content: space-between;
    position: fixed;
    top: 0;
    z-index: 1000;
    width: 100%;
    padding: 10px;
    align-items: center;
    height: var(--appbar-height);
    background-color: var(--secondary-background);
    box-shadow: 0 8px 8px 0 var(--shadow-color);
  }

  .logo {
    display: flex;
    margin-right: auto;
    justify-content: center;
    align-items: center;
  }

  .menu {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>

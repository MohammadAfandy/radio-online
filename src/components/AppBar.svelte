<script>
  import { createEventDispatcher } from 'svelte';
  import IconButton from './UI/IconButton.svelte';

  const dispatch = createEventDispatcher();

  const handleOpenSearch = () => {
    dispatch('menu-click', {
      type: 'search',
    });
  };

  const handleOpenSetting = () => {
    dispatch('menu-click', {
      type: 'setting',
    });
  };
</script>

<header>
  <nav>
    <div class="logo">
      <h1>
        <a href="/">Radio Online</a>
      </h1>
    </div>
    <div class="menu">
      <IconButton size={1.5} iconName="search" onClick={handleOpenSearch} />
      <IconButton size={1.5} iconName="bars" onClick={handleOpenSetting} />
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

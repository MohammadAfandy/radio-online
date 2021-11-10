<script>
  import IconButton from './UI/IconButton.svelte';
  import About from './About.svelte';

  export let DrawerComponent;
  
  const handleOpenAbout = () => {
    DrawerComponent = About;
  };

</script>

<div>
  <h1>Setting</h1>
    <div>
      <IconButton iconName="info-circle" size={1.5} onClick={handleOpenAbout}>
        <span class="setting-item">About</span>
      </IconButton>
    </div>
</div>

<style>
  h1 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    text-align: center;
  }

  .setting-item {
    margin-left: 1rem;
  }
</style>

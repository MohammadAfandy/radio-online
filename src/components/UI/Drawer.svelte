<script>
  import IconButton from './IconButton.svelte';
  export let isOpen = false;

  let body = document.body;
  $: if (isOpen ) {
    body.style.overflow = 'hidden';
  } else {
    body.style.overflow = null;
  }

</script>

<div class="drawer" class:open={isOpen}>
  <div class="close-button">
    <IconButton iconName="times" size={2} onClick={() => isOpen = false} />
  </div>
  <slot></slot>
</div>

<style>
  .drawer {
    position: fixed;
    width: 100%;
    height: 100%;
    top: var(--appbar-height);
    overflow: hidden;
    background-color: var(--secondary-background);
    padding: 1rem 2rem;
    transform: translate(100%, 0);
    transition: transform 0.3s ease-in-out;
    overflow: auto;
    z-index: 2;
  }

  .open {
    transform: translate(0, 0);
  }

  .close-button {
    display: flex;
    flex-direction: row-reverse;
  }
</style>

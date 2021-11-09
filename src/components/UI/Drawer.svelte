<script>
  export let isOpen = false;

  const handleKeydown = (event) => {
    if (event.key === 'Escape') {
      if (isOpen) isOpen = false;
    }
  };

  let body = document.body;
  $: if (isOpen) {
    body.style.overflow = 'hidden';
  } else {
    body.style.overflow = null;
  }

</script>

<div class="drawer" class:open={isOpen}>
  <slot></slot>
</div>

<svelte:window on:keydown={handleKeydown}/>

<style>
  .drawer {
    position: fixed;
    width: 100%;
    height: 100%;
    top: var(--appbar-height);
    overflow: hidden;
    background-color: var(--secondary-background);
    padding: 1rem;
    transform: translate(100%, 0);
    transition: transform 0.3s ease-in-out;
    overflow: auto;
    z-index: 3;
  }

  .open {
    transform: translate(0, 0);
  }
</style>

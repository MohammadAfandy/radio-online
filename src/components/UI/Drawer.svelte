<script>
  export let isOpen = false;

  let body = document.body;
  $: if (isOpen ) {
    body.style.overflow = 'hidden';
    // window.scrollTo({ top: 0 });
  } else {
    body.style.overflow = null;
  }

</script>

<div class="drawer" class:open={isOpen}>
  <slot></slot>
</div>

<style>
  .drawer {
    position: fixed;
    width: 100%;
    height: 100%;
    top: var(--appbar-height);
    overflow: hidden;
    background-color: var(--main-background);
    padding: 1rem 2rem;
    transform: translate(100%, 0);
    transition: transform 0.3s ease-in-out;
    overflow: auto;
    z-index: 2;
  }

  .open {
    transform: translate(0, 0);
  }

  /* @media screen and (min-width: 768px) {
    .container {
      border-radius: 15px;
      margin: 2rem 4rem;
    }
  } */
</style>

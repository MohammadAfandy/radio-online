<script>
  export let isDrawerOpen = false;

</script>

<div class="container" class:hidden={isDrawerOpen}>
  <slot></slot>
</div>

<style>
  .container {
    position: relative;
    background-color: var(--secondary-background);
    padding: 1rem 2rem;
    margin-top: var(--appbar-height);
  }
  
  .hidden {
    /* display: none; */
  }

  @media screen and (min-width: 768px) {
    .container {
      border-radius: 15px;
      margin: 0 4rem;
      margin-top: calc(var(--appbar-height) + 2rem);
    }
  }
</style>

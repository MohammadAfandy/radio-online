<script>
</script>

<div class="container">
  <slot></slot>
</div>

<style>
  .container {
    position: relative;
    background-color: var(--main-background);
    margin-top: var(--appbar-height);
  }

  @media screen and (min-width: 768px) {
    .container {
      padding: 1rem 2rem;
      border-radius: 15px;
      margin: 0 4rem;
      margin-top: calc(var(--appbar-height) + 2rem);
    }
  }
</style>

<script>
  export let iconName;
  export let onClick = false;
  export let size = 1;
  export let badge = '';
  export let isLoading = false;
</script>

<button
  on:click|stopPropagation={onClick}
  class:clickable={onClick}
  style="font-size: {size}rem"
>
  {#if isLoading}
    <i
      class="fas fa-spinner fa-spin"
      aria-hidden="true">
    </i>
  {:else}
    <i
      class="fa fa-{iconName}"
      aria-hidden="true"
      class:badge-icon={badge}
      data-badge={badge}>
    </i>
  {/if}
  <slot></slot>
</button>

<style>
  button {
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    background: none;
    color: inherit;
  }

  .clickable {
    cursor: pointer;
  }

  button i {
    margin-right: 5px;
    position: relative;
  }

  .badge-icon:after {
    position: absolute;
    left: 75%;
    top: -70%;
    content: attr(data-badge);
    font-size: 55%;
    padding: .3rem;
    border-radius: 10px;
    color: var(--primary-color);
    background: var(--fourth-background);
    text-align: center;
  }

  @media(hover: hover) {    
    button:hover {
      opacity: .5;
    }
  }

</style>

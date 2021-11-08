<script>
  export let iconName;
  export let onClick = false;
  export let size = 1;
  export let badge = '';
</script>

<button
  on:click|stopPropagation={onClick}
  class:clickable={onClick}
  style="font-size: {size}rem"
>
  <i
    class="fa fa-{iconName}"
    aria-hidden="true"
    class:badge-icon={badge}
    data-badge={badge}>
  </i>
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
    left: 90%;
    top: -40%;
    content: attr(data-badge);
    font-size: 40%;
    padding: .4rem;
    border-radius: 10px;
    color: var(--primary-color);
    background: var(--fourth-background);
    text-align: center;
  }
</style>

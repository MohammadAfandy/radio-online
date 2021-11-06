<script>
  export let iconName;
  export let onClick = () => {};
  export let size = 1;
</script>

<button on:click|stopPropagation={onClick} style="font-size: {size}rem">
  <i class="fa fa-{iconName}" aria-hidden="true"></i>
  <slot></slot>
</button>

<style>
  button {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    background: none;
    color: inherit;
    padding: 5px;
  }

  button i {
    margin-right: 5px;
  }
</style>

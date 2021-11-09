<script>
  export let onChange = () => {};
  export let emptyText = '';
  export let size = 1;
  export let items = [];

</script>

<select
  class="select-input"
  style="font-size: {size}rem"
  on:change={onChange}
>
  {#if emptyText}
    <option value="">{emptyText}</option>
  {/if}
  {#each items as { val, text } (val)}
    <option value={val}>{text}</option>
  {/each}
</select>

<style>
  .select-input {
    display: flex;
    border-radius: 10px;
    align-items: center;
    background-color: var(--main-background);
    padding: .5rem;
    min-width: 100px;
    width: 100%;
    color: var(--primary-color);
  }
</style>

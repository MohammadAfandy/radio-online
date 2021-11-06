<script>
  export let onInput = () => {};
  export let placeholder = 'Search';
  export let size = 1;

  let timer;
  const debounce = (event) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			onInput(event);
		}, 750);
	}
</script>

<div class="search-input" style="font-size: {size}rem">
  <i class="fa fa-search search" aria-hidden="true"></i>
  <input
    class=""
    {placeholder}
    on:input|stopPropagation={debounce}
  />
</div>

<style>
  .search-input {
    display: flex;
    border-radius: 10px;
    align-items: center;
    background-color: var(--main-background);
    padding: 2px 4px;
    min-width: 100px;
    color: var(--font-color);
  }

  .search {
    color: inherit;
    font-size: inherit;
    display: inline-block;
    width: 40px;
    opacity: 0.5;
    margin-right: 20px;
    text-align: center;
  }

  input {
    color: inherit;
    font-size: inherit;
    width: 100%;
    outline: none;
    border: none;
    background-color: inherit;
  }

  input::-webkit-input-placeholder {
    font-weight: lighter;
    color:#AFB2B3;
  }

  input::-moz-placeholder {
    font-weight: lighter;
    color:#AFB2B3;
  }

  input::-ms-input-placeholder {
    font-weight: lighter;
    color:#AFB2B3;
  }

</style>

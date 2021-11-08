<script>
  export let src;
  export let height;
  export let width;
  export let fallbackSrc = '';
  export let alt = '';
  export let rounded = false;

  const handleErrorImage = (event) => {
    event.target.onerror = null;
    event.target.src = fallbackSrc;
  };
</script>

<img
  {src}
  {alt}
  {width}
  {height}
  class:rounded={rounded}
  loading="lazy"
  on:error={fallbackSrc && handleErrorImage}
/>

<style>
  img {
    position: relative;
    object-fit: cover;
    object-position: center;
  }

  .rounded {
    border-radius: 50%;
  }
</style>

<div class="card">
  <slot></slot>
</div>

<style>
  .card {
    position: relative;
    background-color: var(--main-background);
    box-shadow: 0 4px 8px 0 var(--shadow-color);
    border-radius: 15px;
    /* padding: 1.5rem 2rem; */
    margin-bottom: 1rem;
  }
</style>

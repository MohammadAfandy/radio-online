<script>
  import { fly, fade } from 'svelte/transition';
  import { clickOutside } from '../../actions/click_outside';
  import { modal } from '../../stores';
</script>

{#if $modal.isOpen}
  <div
    class="overlay"
    in:fade="{{ duration: 200 }}"
    out:fade="{{ delay: 200, duration: 200 }}"
  ></div>
  <div
    class="modal-dialog"
    in:fly="{{
      y: -10,
      delay: 200,
      duration: 200,
    }}"
    out:fly="{{
      y: -10,
      duration: 200,
    }}"
    use:clickOutside on:outclick={() => modal.close()}
  >
    {#if $modal.component}
      <svelte:component this={$modal.component} {...$modal.props} />
    {/if}
  </div>
{/if}

<style>
  .overlay {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    position: fixed;
    user-select: none;
    z-index: 998;
    background: hsla(0, 0%, 0%, 80%);
  }

  .modal-dialog {
    position: fixed;
    z-index: 999;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 30px 40px;
    border-radius: 3px;
    background: var(--secondary-color);
    color: #FFF;
    width: 90vw;
  }

  @media screen and (min-width: 1200px) {
    .modal-dialog {
      width: 70vw;
    }
  }
</style>

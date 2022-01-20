<script>
  import IconButton from './IconButton.svelte';
  export let title = '';
  export let description = '';
  export let cancelTitle = 'Cancel';
  export let confirmTitle = 'Confirm';
  export let handleCancel = null;
  export let handleConfirm = null;
</script>

<div class="confirm">
  <div class="title">
    {title}
  </div>
  <div class="description">
    {description}
  </div>
</div>
<div class="actions">
  <div class="action-item">
    <IconButton iconName="times" onClick={handleCancel}>    
      {cancelTitle}
    </IconButton>
  </div>
  <div class="action-item">
    <IconButton iconName="check" onClick={handleConfirm}>    
      {confirmTitle}
    </IconButton>
  </div>
</div>

<style>
  .confirm {
    margin-bottom: 1rem;
  }

  .title {
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }

  .actions {
    display: flex;
    justify-content: end;
  }

  .action-item {
    margin: 0 1rem;
    border-radius: 10px;
    padding: 0 1rem;
    border: 1px solid var(--primary-color);
  }
</style>

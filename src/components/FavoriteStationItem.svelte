<script>
  import { createEventDispatcher } from 'svelte';
  import { fly } from 'svelte/transition';
  import Image from 'svelte-image';
  import Card from './UI/Card.svelte';
  import IconButton from './UI/IconButton.svelte';
  import { player } from '../stores';

  const dispatch = createEventDispatcher();
  export let favoriteStation;
  export let isFavorite;

  const handlePlay = () => {
    player.setCurrentStation(favoriteStation);
    player.play();
  };

  const handleDelete = () => {
    dispatch('delete', {
      uuid: favoriteStation.stationuuid,
    })
  };

  const handleAdd = () => {
    dispatch('add', {
      uuid: favoriteStation.stationuuid,
    })
  };

  const handleErrorImage = (event) => {
    event.target.onerror = null;
    event.target.src = 'images/placeholder.jpg';
  }
</script>

<Card>
  <div class="favorite-station-item" on:click={handlePlay} transition:fly>
    <div class="station-info">
      <Image
        wrapperClass="station-logo"
        src={favoriteStation.favicon}
        alt="Station logo {favoriteStation.name}"
      />
      <span class="station-title">{favoriteStation.name}</span>
    </div>
    {#if isFavorite}
      <IconButton iconName="heart" onClick={handleDelete} />
    {:else}
      <IconButton iconName="heart-o" onClick={handleAdd} />
    {/if}
  </div>
</Card>

<style>
  .favorite-station-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: .5rem 2rem;
  }

  .station-info {
    display: flex;
    align-items: center;
  }

  .station-info :global(.station-logo) {
    width: 40px !important;
    height: 40px !important;
    min-height: initial !important;
    margin-right: 5px;
  }

  .station-title {
    font-size: 1rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1; /* number of lines to show */
    -webkit-box-orient: vertical;
  }
</style>

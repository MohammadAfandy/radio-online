<script>
  import { createEventDispatcher } from 'svelte';
  import { fly } from 'svelte/transition';
  import Image from 'svelte-image';
  import Card from './UI/Card.svelte';
  import IconButton from './UI/IconButton.svelte';
  import { player, favoriteStations } from '../stores';
  import { radioBrowser } from '../services/api';

  const dispatch = createEventDispatcher();
  export let station;
  export let isFavorite = false;
  export let showVoteCount = false;

  const handlePlay = () => {
    player.setCurrentStation(station);
    player.play();
  };

  const handleDelete = () => {
    favoriteStations.remove(station.stationuuid);
    isFavorite = false;
    dispatch('delete', {
      station,
    });
  };

  const handleAdd = () => {
    favoriteStations.add(station);
    isFavorite = true;
    dispatch('add', {
      station,
    });
  };

  const handleVote = async () => {
    await radioBrowser.get(`vote/${station.stationuuid}`);
    dispatch('vote', {
      station,
    });
  };

  // const handleErrorImage = (event) => {
  //   event.target.onerror = null;
  //   event.target.src = 'images/placeholder.jpg';
  // }
</script>

<Card>
  <div class="station-item" on:click={handlePlay} transition:fly>
    <div class="station-info">
      <div class="station-name">
        <Image
          wrapperClass="station-logo"
          src={station.favicon}
          alt="Station logo {station.name}"
          width={40}
          height={40}
        />
        <span class="station-title">{station.name}</span>
      </div>
      {#if station.homepage}
        <a href={station.homepage} ref="noreferrer" target="_blank">
          <IconButton iconName="external-link" onClick={true} />
        </a>
      {/if}
    </div>
    <div class="station-detail">
      {#if station.tags}
        {#each station.tags.split(',').slice(0, 3) as tag}
          <span class="badge">
            {tag}
          </span>
        {/each}
      {/if}
      {#if station.country}
        <span class="badge">{station.country}</span>
      {/if}
      {#if station.state}
        <span class="badge">{station.state}</span>
      {/if}
      {#if station.bitrate}
        <span class="badge">{station.bitrate} kbps</span>
      {/if}
    </div>
    <div class="station-action">
      {#if isFavorite}
        <IconButton size={1.5} iconName="heart" onClick={handleDelete} />
      {:else}
        <IconButton size={1.5} iconName="heart-o" onClick={handleAdd} />
      {/if}
      <IconButton
        size={1.5}
        iconName="thumbs-up"
        badge={showVoteCount && station.votes}
        onClick={handleVote}
      />
    </div>
  </div>
</Card>

<style>
  .station-item {
    display: flex;
    flex-direction: column;
    /* justify-content: space-between; */
    /* align-items: center; */
    padding: .3rem 2rem;
    cursor: pointer;
  }

  .station-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .station-name {
    display: flex;
    align-items: center;
  }

  .station-info :global(.station-logo) {
    background-color: #fff;
    padding: .2rem;
    width: 40px !important;
    height: 40px !important;
    min-height: initial !important;
    margin-right: 10px;
    border-radius: 10px;
  }

  .station-title {
    font-size: 1rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .station-detail {
    margin-top: .5rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }

  .station-action {
    display: flex;
    margin-top: .5rem;
  }

  .badge {
    font-size: .8em;
    padding: .2rem;
    border-radius: 5px;
    background-color: var(--third-background);
    margin-right: .2rem;
  }
</style>

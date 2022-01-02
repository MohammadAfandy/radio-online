<script>
  import { createEventDispatcher } from 'svelte';
  import { showToast } from '../utils/toast';
  import { abbrNum } from '../utils/helpers';
  import Card from './UI/Card.svelte';
  import Image from './UI/Image.svelte';
  import IconButton from './UI/IconButton.svelte';
  import { player, favoriteStations } from '../stores';
  import { radioBrowser } from '../services/api';

  const dispatch = createEventDispatcher();
  export let station;
  export let isFavorite = false;
  export let showVoteCount = false;
  let isVoteLoading = false;

  const generateFavoriteText = (action = 'add') => {
    if (['add', 'remove'].includes(action) === false) {
      throw new Error('Invalid action');
    }
    return `Success ${action} "${station.name}" ${action === 'add' ? 'to' : 'from'} favorite.`;
  };

  const handlePlay = () => {
    player.setCurrentStation(station);
    player.play(station.url_resolved || station.url);
  };

  const handleDelete = () => {
    favoriteStations.remove(station.stationuuid);
    isFavorite = false;
    showToast(generateFavoriteText('remove'));
    dispatch('delete', {
      station,
    });
  };

  const handleAdd = () => {
    favoriteStations.add(station);
    isFavorite = true;
    showToast(generateFavoriteText('add'));
    dispatch('add', {
      station,
    });
  };

  const handleVote = async () => {
    isVoteLoading = true;
    const { data: vote } = await radioBrowser.get(`vote/${station.stationuuid}`);
    if (vote.ok) {
      showToast(`Vote for "${station.name}" success`, 'success');
    } else {
      showToast(vote.message || `Vote for "${station.name}" failed`, 'danger');
    }
    dispatch('vote', {
      station,
    });
    isVoteLoading = false;
  };

</script>

<Card>
  <div class="station-item" on:click={handlePlay}>
    <div class="station-info">
      <div class="station-name">
        <div class="station-logo">
          <Image
            src={station.favicon}
            alt="Station logo {station.name}"
            width={40}
            height={40}
            fallbackSrc="/images/placeholder.jpg"
            rounded
          />
        </div>
        <span class="station-title" id="station_title">{station.name}</span>
      </div>
      {#if station.country}
        <Image
          src={`https://flagcdn.com/w20/${station.countrycode.toLowerCase()}.png`}
          alt={station.country}
          width={20}
          height={20}
          fallbackSrc="/images/placeholder.jpg"
          rounded
        />
      {/if}
    </div>
    <div class="station-detail">
      {#if station.state}
        <span class="badge">{station.state}</span>
      {/if}
      {#if station.codec}
        <span class="badge">{station.codec}</span>
      {/if}
      {#if station.bitrate}
        <span class="badge">{station.bitrate} kbps</span>
      {/if}
      {#if station.tags}
        {#each station.tags.split(',').slice(0, 5) as tag}
          <span class="badge">
            {tag}
          </span>
        {/each}
      {/if}
    </div>
    <div class="station-action">
      {#if $player.isPlaying && $player.stationuuid === station.stationuuid}
        <div class="equalizer">
          <Image
            src="/images/equalizer.gif"
            width={35}
            height={35}
          />
        </div>
      {/if}
      {#if station.homepage}
        <a href={station.homepage} ref="noreferrer" target="_blank">
          <IconButton
            size={1.2}
            iconName="external-link"
            onClick={true}
          />
        </a>
      {/if}
      {#if isFavorite}
        <IconButton
          size={1.2}
          iconName="heart"
          onClick={handleDelete}
        />
      {:else}
        <IconButton
          size={1.2}
          iconName="heart-o"
          onClick={handleAdd}
        />
      {/if}
      <IconButton
        iconName="thumbs-up"
        size={1.2}
        badge={showVoteCount && abbrNum(Number(station.votes), 1)}
        onClick={handleVote}
        isLoading={isVoteLoading}
      />
    </div>
  </div>
</Card>

<style>
  .station-item {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    padding: .3rem 1rem;
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

  /* .station-info :global(.station-logo) { */
  .station-logo {
    margin-right: 1rem;
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
    align-items: flex-start;
    min-height: 3rem;
  }

  .station-action {
    display: flex;
    justify-content: end;
    margin-top: .5rem;
  }

  .station-action .equalizer {
    margin-right: auto;
    filter: brightness(2);
  }

  .badge {
    display: inline-block;
    font-size: .8em;
    padding: .3rem;
    border-radius: 5px;
    background-color: var(--third-background);
    margin-right: .2rem;
    margin-bottom: .2rem;
    color: #FFF;
  }
</style>

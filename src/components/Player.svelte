<script>
  import Image from 'svelte-image';
  import Separator from './UI/Separator.svelte';
  import IconButton from './UI/IconButton.svelte';
  import FavoriteStation from '../services/db/favorite-station';
  import { player } from '../stores';

  const handleStop = () => {
    player.stop();
  };

  const handlePlay = () => {
    player.play();
  };

  const handlePrev = async () => {
    const favoriteStations = await FavoriteStation.getAll();
    const currentStationIndex = favoriteStations.findIndex((favorite) => favorite.stationuuid === $player.stationuuid);
    let prevStation = favoriteStations[currentStationIndex - 1];
    if (!prevStation) {
      prevStation = favoriteStations[favoriteStations.length - 1];
    }
    player.setCurrentStation(prevStation);
    if ($player.isPlaying) player.play();
  };

  const handleNext = async () => {
    const favoriteStations = await FavoriteStation.getAll();
    const currentStationIndex = favoriteStations.findIndex((favorite) => favorite.stationuuid === $player.stationuuid);
    let nextStation = favoriteStations[currentStationIndex + 1];
    if (!nextStation) {
      nextStation = favoriteStations[0];
    }
    player.setCurrentStation(nextStation);
    if ($player.isPlaying) player.play();
  };

  const handleChangeVolume = (event) => {
    player.setVolume(event.target.value);
  }

</script>

<div>
  <div class="station-info">
    <Image
      wrapperClass="station-logo"
      src={$player.favicon}
      alt="Station logo {$player.name}"
    />
    <div class="station-detail">
      <span class="title">{$player.name}</span>
      <span class="song">{$player.song}</span>
    </div>
  </div>
  <Separator />
  <div class="player">
    <IconButton size={1.5} iconName="step-backward" onClick={handlePrev} />
    {#if ($player.isPlaying)}
      <IconButton size={1.5} iconName="stop" onClick={handleStop} />
    {:else}
      <IconButton size={1.5} iconName="play" onClick={handlePlay} />
    {/if}
    <IconButton size={1.5} iconName="step-forward" onClick={handleNext} />
    <IconButton size={1.5} iconName="volume-off">
      <input type="range" value={$player.volume} on:change={handleChangeVolume} min=0 max=20 />
    </IconButton>
  </div>
</div>

<style>
  .station-info {
    display: flex;
    align-items: end;
    padding: 1rem 0;
  }

  .station-info :global(.station-logo) {
    width: 60px !important;
    height: 60px !important;
    min-height: initial !important;
    margin-right: 5px;
  }

  .station-detail {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
  }

  .station-detail .title {
    font-size: 1.2rem;
    font-weight: 600;
  }

  .station-detail .song {
    font-weight: 400;
  }

  .player {
    display: flex;
    flex-wrap: wrap;
  }

</style>

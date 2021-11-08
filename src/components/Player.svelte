<script>
  import Image from 'svelte-image';
  import Separator from './UI/Separator.svelte';
  import IconButton from './UI/IconButton.svelte';
  import { favoriteStations } from '../stores';
  import { player } from '../stores';
  import { onInterval } from '../utils/interval';
  import { radioLise } from '../services/api';
  import CONFIG from '../configs';

  const { VOLUME_STEP } = CONFIG;

  const handleStop = () => {
    player.stop();
  };

  const handlePlay = () => {
    player.play();
  };

  const handlePrev = async () => {
    const currentStationIndex = $favoriteStations.findIndex((favorite) => favorite.stationuuid === $player.stationuuid);
    let prevStation = $favoriteStations[currentStationIndex - 1];
    if (!prevStation) {
      prevStation = $favoriteStations[$favoriteStations.length - 1];
    }
    player.setCurrentStation(prevStation);
    if ($player.isPlaying) player.play();
  };

  const handleNext = async () => {
    const currentStationIndex = $favoriteStations.findIndex((favorite) => favorite.stationuuid === $player.stationuuid);
    let nextStation = $favoriteStations[currentStationIndex + 1];
    if (!nextStation) {
      nextStation = $favoriteStations[0];
    }
    player.setCurrentStation(nextStation);
    if ($player.isPlaying) player.play();
  };

  const handleChangeVolume = (event) => {
    player.setVolume(event.target.value);
  };

  const updateStationSong = async () => {
    if ($player.url_resolved && $player.isPlaying) {
      const { data: song } = await radioLise.get('', {
        params: {
          url: $player.url_resolved,
        },
      });
      player.updateSong(song.title);
    }
  };

  onInterval(() => {
    updateStationSong();
  }, 20 * 1000);

  $: stationuuid = $player.stationuuid;
  $: stationuuid && updateStationSong();

</script>

<div class="player-container">
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
    <IconButton size={2} iconName="step-backward" onClick={handlePrev} />
    {#if ($player.isPlaying)}
      <IconButton size={2} iconName="stop" onClick={handleStop} />
    {:else}
      <IconButton size={2} iconName="play" onClick={handlePlay} />
    {/if}
    <IconButton size={2} iconName="step-forward" onClick={handleNext} />
  </div>
  <div class="volume">
    <IconButton size={1} iconName="volume-off">
      <input type="range" value={$player.volume} on:change={handleChangeVolume} min=0 max={VOLUME_STEP} />
    </IconButton>
    <IconButton size={1} iconName="volume-up" />
  </div>
</div>

<style>
  .player-container {
    border-radius: 10px;
    padding: 1rem 2rem;
    background-color: var(--secondary-background);
  }

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
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }

  .player {
    margin-top: 1rem;
    display: flex;
    justify-content: space-around;
  }

  .volume {
    display: flex;
    justify-content: end;
  }

  .volume input {
    width: 100vw;
  }

  @media screen and (min-width: 768px) {
    .player {
      justify-content: space-evenly;
    }

    .volume input {
      width: 400px;
    }
  }

</style>

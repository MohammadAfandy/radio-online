<script>
  import { onMount } from 'svelte';
  import Separator from './UI/Separator.svelte';
  import IconButton from './UI/IconButton.svelte';
  import Image from './UI/Image.svelte';
  import { favoriteStations } from '../stores';
  import { player } from '../stores';
  import { onInterval } from '../utils/interval';
  import { radioBrowser, radioLise } from '../services/api';
  import CONFIG from '../configs';

  const { VOLUME_STEP } = CONFIG;

  onMount(async () => {
    const getLastPlayedStation = localStorage.getItem(CONFIG.LOCAL_STORAGE.LAST_PLAYED);
    if (getLastPlayedStation) {
      const { data: currentStation } = await radioBrowser.get('stations/byuuid', {
        params: {
          uuids: getLastPlayedStation,
        },
      });

      if (currentStation.length) {
        player.setCurrentStation(currentStation[0]);
      }
    }
  });

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

  const handleVolumeMute = () => {
    player.setVolume(0);
  };

  const handleVolumeFull = () => {
    player.setVolume(VOLUME_STEP);
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
    <div class="station-logo">
      <Image
        src={$player.favicon}
        alt="Station logo {$player.name}"
        width={50}
        height={50}
        fallbackSrc="images/placeholder.jpg"
        rounded
      />
    </div>
    <div class="station-detail">
      <span class="title">{$player.name}</span>
      <span class="song">{$player.song}</span>
    </div>
  </div>
  <div class="player">
    <IconButton iconName="step-backward" onClick={handlePrev} />
    {#if ($player.isPlaying)}
      <IconButton iconName="stop" onClick={handleStop} />
    {:else}
      <IconButton iconName="play" onClick={handlePlay} />
    {/if}
    <IconButton iconName="step-forward" onClick={handleNext} />
    <div class="volume">
      <IconButton iconName="volume-off" onClick={handleVolumeMute} />
      <input type="range" value={$player.volume} on:change={handleChangeVolume} min=0 max={VOLUME_STEP} />
      <IconButton iconName="volume-up" onClick={handleVolumeFull} />
    </div>
  </div>
  <Separator />
</div>

<svelte:head>
  <title>{$player.stationuuid ? `${CONFIG.APPNAME} - ${$player.name}` : CONFIG.APPNAME}</title>
</svelte:head>

<style>
  .player-container {
    border-radius: 10px;
    background-color: var(--secondary-background);
    position: -webkit-sticky;
    position: sticky;
    top: var(--appbar-height);
    z-index: 2;
  }

  .station-info {
    display: flex;
    align-items: center;
    padding: 1rem 2rem;
  }

  .station-logo {
    margin-right: 1rem;
  }

  .station-detail {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
  }

  .song, .title {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }

  .title {
    font-size: 1.2rem;
    font-weight: 600;
  }

  .song {
    font-weight: 400;
  }

  .player {
    display: flex;
    justify-content: space-around;
    padding: 0 2rem;
  }

  .volume {
    display: flex;
    justify-content: end;
  }

  @media screen and (min-width: 768px) {
    .player {
      justify-content: flex-start;
    }

  }

</style>

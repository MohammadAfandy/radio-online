<script>
  import { onMount } from 'svelte';
  import moment from 'moment';
  import Separator from './UI/Separator.svelte';
  import IconButton from './UI/IconButton.svelte';
  import Image from './UI/Image.svelte';
  import { favoriteStations } from '../stores';
  import { player } from '../stores';
  import { onInterval } from '../utils/interval';
  import LocalStorage from '../utils/local-storage';
  import { radioLise } from '../services/api';
  import CONFIG from '../configs';

  const { VOLUME_STEP } = CONFIG;
  const MAX_LAST_SONGS = 50;

  let isShowLastSongs = false;
  let lastSongs = [];

  onMount(() => {
    const lastPlayedStation = LocalStorage.get(CONFIG.LOCAL_STORAGE.LAST_STATION);
    if (lastPlayedStation && lastPlayedStation.stationuuid) {
      player.setCurrentStation(lastPlayedStation);
    }

    const volume = LocalStorage.get(CONFIG.LOCAL_STORAGE.VOLUME);
    if (!isNaN(volume)) player.setVolume(volume);

    lastSongs = LocalStorage.get(CONFIG.LOCAL_STORAGE.LAST_SONGS) || [];
  });

  const handleStop = () => {
    player.stop();
  };

  const handlePlay = () => {
    player.play(mediaUrl);
  };

  const handlePrev = async () => {
    const currentStationIndex = $favoriteStations.findIndex((favorite) => favorite.stationuuid === $player.stationuuid);
    let prevStation = $favoriteStations[currentStationIndex - 1];
    if (!prevStation) {
      prevStation = $favoriteStations[$favoriteStations.length - 1];
    }
    player.setCurrentStation(prevStation);
    if ($player.isPlaying) player.play(prevStation.url_resolved || prevStation.url);
  };

  const handleNext = async () => {
    const currentStationIndex = $favoriteStations.findIndex((favorite) => favorite.stationuuid === $player.stationuuid);
    let nextStation = $favoriteStations[currentStationIndex + 1];
    if (!nextStation) {
      nextStation = $favoriteStations[0];
    }
    player.setCurrentStation(nextStation);
    if ($player.isPlaying) player.play(nextStation.url_resolved || nextStation.url);
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

  const handleOpenLastSongs = () => {
    isShowLastSongs = !isShowLastSongs;
  };

  const reorderAndSaveLastSongs = (newLastSongs) => {
    lastSongs = newLastSongs.sort((a, b) => {
      // sort by pinned first
      if (a.isPinned && !b.isPinned) return -1;
      if (b.isPinned && !a.isPinned) return 1;

      // sort by date
      return new Date(b.date) - new Date(a.date);
    });
    LocalStorage.set(CONFIG.LOCAL_STORAGE.LAST_SONGS, lastSongs);
  };

  const handlePinSong = (idx) => {
    const tempLastSongs = [...lastSongs];
    if (tempLastSongs[idx]) {
      tempLastSongs[idx].isPinned = !tempLastSongs[idx].isPinned;
      reorderAndSaveLastSongs(tempLastSongs);
    }
  };

  const updateStationSong = async () => {
    if ($player.isPlaying && mediaUrl) {
      const { data: song } = await radioLise.get('', {
        params: {
          url: mediaUrl,
        },
      });

      const { title } = song;
      if (title) {
        player.updateSong(title);

        const songData = {
          station: $player.name,
          title,
          date: new Date(),
        };

        const lastSongsNotPinned = lastSongs.filter((lastSong) => !lastSong.isPinned);
        const lastData = lastSongsNotPinned.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
        if (lastData) {
          // don't add if song title and station is same as last song data
          if (lastData.station === songData.station && lastData.title === songData.title) {
            return;
          }
        }

        const lastSongsPinned = lastSongs.filter((lastSong) => lastSong.isPinned);
        const tempLastSongsNotPinned = [songData, ...lastSongsNotPinned];
        if (tempLastSongsNotPinned.length > MAX_LAST_SONGS - lastSongsPinned.length) {
          tempLastSongsNotPinned.splice(MAX_LAST_SONGS - lastSongsPinned.length - tempLastSongsNotPinned.length);
        }
        reorderAndSaveLastSongs([...lastSongsPinned, ...tempLastSongsNotPinned]);
      }
    }
  };

  let intervalSong;
  const createIntervalSong = () => {
    updateStationSong();
    if (intervalSong) clearInterval(intervalSong);
    intervalSong = onInterval(() => {
      updateStationSong();
    }, 20 * 1000);
  };

  $: mediaUrl = $player.url_resolved || $player.url;
  $: stationuuid = $player.stationuuid;
  $: if (stationuuid) {
    createIntervalSong();
  }

</script>

<div class="player-container">
  <div class="station-info">
    <div class="station-logo">
      <Image
        src={$player.favicon}
        alt="Station logo {$player.name}"
        width={50}
        height={50}
        fallbackSrc="/images/placeholder.jpg"
        rounded
      />
    </div>
    <div class="station-detail">
      <span class="title">{$player.name}</span>
      <span class="song">{$player.song}</span>
    </div>
    <div class="last-songs-button">
      <IconButton iconName="history" size={1.5} onClick={handleOpenLastSongs} />
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

<div class="last-songs-container" class:show={isShowLastSongs}>
  <h2>Last {MAX_LAST_SONGS} Songs Played</h2>
  <div class="last-songs-wrapper">
    {#each lastSongs as lastSong, idx (idx)}
      <div class="last-songs-item" class:pinned={lastSong.isPinned}>
        <div class="last-songs-detail">
          <div class="song">{lastSong.title}</div>
          <div class="title">{lastSong.station}</div>
          {#if lastSong.isPinned}
            <div class="title">{moment(lastSong.date).format('MMM DD YYYY HH:mm:ss')}</div>
          {:else}
            <div class="title">{moment(lastSong.date).fromNow()}</div>
          {/if}
        </div>
        <div>
          {#if lastSong.isPinned}
            <IconButton iconName="star" onClick={() => handlePinSong(idx)} />
          {:else}
            <IconButton iconName="star-o" onClick={() => handlePinSong(idx)} />
          {/if}
        </div>
      </div>
    {/each}
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
    margin-right: auto;
  }

  .last-songs-button {
    align-self: flex-start;
  }

  .station-detail .song,
  .station-detail .title {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
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

  .last-songs-container {
    background-color: var(--secondary-background);
    max-height: 0;
    transition: max-height .25s ease-out;
    overflow: hidden;
  }

  .show {
    max-height: 40rem;
    transition: max-height .25s ease-in;
  }

  .last-songs-container h2 {
    text-align: center;
    padding: 1rem 0;
  }

  .last-songs-wrapper {
    display: flex;
    flex-direction: column;
    font-size: .8rem;
    max-height: 20rem;
    overflow: auto;
  }

  .last-songs-detail {
    margin-right: .5rem;
  }

  .last-songs-item {
    display: flex;
    justify-content: space-between;
    padding: .4rem 1rem;
    opacity: 0.7;
  }

  .last-songs-item.pinned, .last-songs-item:hover {
    opacity: 1;
  }

  .last-songs-item .title {
    font-weight: 400;
    font-size: .8rem;
  }

  .last-songs-item .song {
    font-weight: 600;
  }

</style>

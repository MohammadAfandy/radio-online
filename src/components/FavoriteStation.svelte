<script>
  import { onMount } from 'svelte';
  import StationItem from './StationItem.svelte';
  import { favoriteStations } from '../stores';
  import SearchInput from './UI/SearchInput.svelte';
  import IconButton from './UI/IconButton.svelte';

  let stations = [];
  let searchValue = '';

  onMount(async() => {
    stations = await favoriteStations.init();
  });

  const filterStations = (stations, val) => {
    let result = [];
    if (val.trim() !== '') {
      result = stations.filter((station) => {
        return station.name.toLowerCase().includes(val.toLowerCase());
      });
    } else {
      result = stations;
    }
    return result;
  };

  const handleSearch = async (event) => {
    searchValue = event.target.value;
    stations = filterStations($favoriteStations, searchValue);
  };

  $: stations = filterStations($favoriteStations, searchValue);

</script>

<div class="favorite-station">
  <h1>Favorite Stations ({$favoriteStations.length})</h1>
  {#if stations.length}
    <div class="search">
      <SearchInput
        placeholder="Search favorite station"
        onInput={handleSearch}
      />
    </div>
    <div class="list-wrapper">
      {#each stations as station (station.stationuuid)}
        <StationItem
          {station}
          isFavorite
          showVoteCount={false}
        />
      {/each}
    </div>
  {:else}
    <IconButton iconName="frown">
      You don't have any favorite stations.
    </IconButton>
  {/if}
</div>

<style>
  .favorite-station {
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    padding: 1rem 2rem;
    background-color: var(--secondary-background);
  }

  .list-wrapper {
    display: grid;
    gap: 0 1rem;
  }

  .search {
    margin-bottom: 1rem;
  }

  h1 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  @media screen and (min-width: 768px) {
    .list-wrapper {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media screen and (min-width: 1200px) {
    .list-wrapper {
      grid-template-columns: repeat(3, 1fr);
    }
  }
</style>

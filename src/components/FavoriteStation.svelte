<script>
  import { onMount } from 'svelte';
  import StationItem from './StationItem.svelte';
  import { favoriteStations } from '../stores';
  import SearchInput from './UI/SearchInput.svelte';

  let stations = [];

  onMount(async() => {
    stations = await favoriteStations.init();
  });

  const handleSearch = async (event) => {
    const { value: searchValue } = event.target;
    if (searchValue.trim() !== '') {
      stations = $favoriteStations.filter((station) => {
        return station.name.toLowerCase().includes(searchValue.toLowerCase());
      });
    } else {
      stations = $favoriteStations;
    }
  };

  const handleDeleteFavorite = (event) => {
    stations = stations.filter((station) => station.stationuuid !== event.detail.station.stationuuid);
  };

</script>

<div class="favorite-station">
  <h1>Favorite Stations ({$favoriteStations.length})</h1>
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
        isFavorite={true}
        on:delete={handleDeleteFavorite}
      />
    {/each}
  </div>
</div>

<style>
  .favorite-station {
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    padding: 1rem 2rem;
    background-color: var(--secondary-background);
  }

  .search {
    margin-bottom: 1rem;
  }

  h1 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
</style>

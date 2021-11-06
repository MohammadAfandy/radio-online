<script>
  import { onMount } from 'svelte';
  import FavoriteStationItem from './FavoriteStationItem.svelte';
  import FavoriteStation from '../services/db/favorite-station';
  import SearchInput from './UI/SearchInput.svelte';

  let favoriteStations = [];
  onMount(async() => {
    favoriteStations = await FavoriteStation.getAll();
  })

  const handleDelete = async (event) => {
    const { uuid } = event.detail;
    await FavoriteStation.delete(uuid);
    favoriteStations = favoriteStations.filter((station) => station.stationuuid !== uuid);
  };

  const handleSearch = async (event) => {
    const { value: searchValue } = event.target;
    const allStations = await FavoriteStation.getAll();
    if (searchValue.trim() !== '') {
      favoriteStations = allStations.filter((station) => {
        return station.name.toLowerCase().includes(searchValue.toLowerCase())
      });
    } else {
      favoriteStations = allStations;
    }
  };

</script>

<div class="favorite-station">
	<h1>Favorite Stations</h1>
  <div class="search">
    <SearchInput
      placeholder="Search favorite station"
      onInput={handleSearch}
    />
  </div>
  <div class="list-wrapper">
    {#each favoriteStations as favoriteStation (favoriteStation.stationuuid)}
      <FavoriteStationItem
        {favoriteStation}
        isFavorite={true}
        on:delete={handleDelete}
      />
    {/each}
  </div>
</div>

<style>
  .favorite-station {
    display: flex;
    flex-direction: column;
    padding: 1rem 0;
  }

  .list-wrapper {

  }

  .search {
    margin-bottom: 1rem;
    max-width: 400px;
    align-self: end;
  }

  h1 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
</style>
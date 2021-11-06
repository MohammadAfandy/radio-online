<script>
  import { onMount } from 'svelte';
  import FavoriteStationItem from './FavoriteStationItem.svelte';
  import { api } from '../services/api';
  import FavoriteStation from '../services/db/favorite-station';
  import SearchInput from './UI/SearchInput.svelte';

  let searchedStations = [];
  onMount(async() => {
    // searchedStations = await FavoriteStation.getAll();
  })

  const handleSearch = async (event) => {
    const { value: SearchValue } = event.target;
    console.log({ SearchValue })
    const { data: stations } = await api.get('stations/search', {
      params: {
        name: SearchValue,
      },
    });
    // for (let station of stations) {
    //   await FavoriteStation.put(station);
    // }
    const favoriteStationsUuid = (await FavoriteStation.getAll()).map((station) => station.stationuuid);
    searchedStations = stations.map((station) => ({
      ...station,
      isFavorite: favoriteStationsUuid.includes(station.stationuuid),
    }));
  };

  const handleAdd = async (event) => {
    const { uuid } = event.detail;
    const selectedStation = searchedStations.find((station) => station.stationuuid === uuid);
    if (selectedStation) {
      await FavoriteStation.put(selectedStation);
    } else {
      console.error('aa');
    }
  };

</script>

<div class="search-station">
	<h1>Search Stations</h1>
  <div class="search">
    <SearchInput
      placeholder="Search station"
      onInput={handleSearch}
    />
  </div>
  <div class="list-wrapper">
    {#each searchedStations as searchedStation (searchedStation.stationuuid)}
      <FavoriteStationItem
        favoriteStation={searchedStation}
        isFavorite={searchedStation.isFavorite}
        on:add={handleAdd}
      />
    {/each}
  </div>
</div>

<style>
  .search-station {
    display: flex;
    flex-direction: column;
    padding: 1rem 0;
  }

  .list-wrapper {
    overflow: auto;
    max-height: 550px;
  }

  .search {
    margin-bottom: 1rem;
    width: 100%;
  }

  h1 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
</style>

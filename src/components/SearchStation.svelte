<script>
  import StationItem from './StationItem.svelte';
  import { radioBrowser } from '../services/api';
  import { favoriteStations } from '../stores';
  import SearchInput from './UI/SearchInput.svelte';

  let searchedStations = [];
  let notFound = false;

  const handleSearch = async (event) => {
    const { value: SearchValue } = event.target;
    if (SearchValue.trim() !== '') {
      const { data: stations } = await radioBrowser.get('stations/search', {
        params: {
          name: SearchValue,
        },
      });
      if (stations.length > 0) {
        const favoriteStationsUuid = $favoriteStations.map((station) => station.stationuuid);
        searchedStations = stations.map((station) => ({
          ...station,
          isFavorite: favoriteStationsUuid.includes(station.stationuuid),
        }));
        notFound = false;
      } else {
        notFound = true;
      }
    } else {
      notFound = false;
      searchedStations = [];
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
    {#if notFound}
      <i class="fa fa-frown" aria-hidden="true"></i>
      <span>Sorry, no stations found</span>
    {:else}
      {#each searchedStations as searchedStation (searchedStation.stationuuid)}
        <StationItem
          station={searchedStation}
          isFavorite={searchedStation.isFavorite}
        />
      {/each}
    {/if}
  </div>
</div>

<style>
  .search-station {
    display: flex;
    flex-direction: column;
    padding: 1rem 2rem;
  }

  .list-wrapper {
    overflow: auto;
    max-height: 550px;
    padding: 1rem;
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

<script>
  import { onMount } from 'svelte';
  import { Shadow } from 'svelte-loading-spinners';
  import StationItem from './StationItem.svelte';
  import { radioBrowser } from '../services/api';
  import { favoriteStations } from '../stores';
  import SearchInput from './UI/SearchInput.svelte';
  import SelectInput from './UI/SelectInput.svelte';

  let searchParams = {};
  let countries = [];
  let searchedStations = [];
  let notFound = false;
  let isLoading = false;

  onMount(async () => {
    fetchSearchStations();
    const { data: countryList } = await radioBrowser.get('countries');
    countries = countryList.map(({ name }) => ({
      val: name,
      text: name,
    }));
  });

  const fetchSearchStations = async (additionalParams = {}) => {
    searchParams = {
      ...searchParams,
      ...additionalParams,
      limit: 20,
      order: 'votes',
      reverse: true,
      hideBroken: true,
    };
    isLoading = true;
    try {
      const { data: stations } = await radioBrowser.get('stations/search', {
        params: searchParams,
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
    } catch (error) {
      console.error(error);
    } finally {
      isLoading = false;
    }
  };

  const handleSearch = async (event) => {
    const { value: SearchValue } = event.target;
    await fetchSearchStations({
      name: SearchValue,
    });
  };

  const handleCountryChange = async (event) => {
    const { value: country } = event.target;
    const countryExact = country !== '';
    await fetchSearchStations({
      country,
      countryExact,
    });
  };

</script>

<div class="search-station">
  <h1>Search Stations</h1>
  <div class="search">
    <SearchInput
      placeholder="Search station by name"
      onInput={handleSearch}
    />
    <div class="advanced-search">
      <SelectInput
        emptyText="-- All Country --"
        items={countries}
        onChange={handleCountryChange}
      />
    </div>
  </div>
  <div class="list-wrapper">
    {#if isLoading}
      <div class="loader">
        <Shadow size="4" color="#f0f0f0" unit="rem" duration="1s" />
      </div>
    {:else}
      {#if notFound}
        <i class="fa fa-frown" aria-hidden="true"></i>
        <span>Sorry, no stations found</span>
      {:else}
        {#each searchedStations as searchedStation (searchedStation.stationuuid)}
          <StationItem
            station={searchedStation}
            isFavorite={searchedStation.isFavorite}
            showVoteCount
          />
        {/each}
      {/if}
    {/if}
  </div>
</div>

<style>
  .search-station {
    display: flex;
    flex-direction: column;
    padding: .5rem;
  }

  .list-wrapper {
    overflow: auto;
    height: 60vh;
    padding: .5rem;
  }

  .search {
    width: 100%;
  }

  .loader {
    display: flex;
    justify-content: center;
    padding: 4rem;
  }

  h1 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .advanced-search {
    margin: .5rem 0;
    max-width: 400px;
  }
</style>

<script>
  import { onMount } from 'svelte';
  import { Shadow } from 'svelte-loading-spinners';
  import { showToast } from '../utils/toast';
  import StationItem from './StationItem.svelte';
  import { radioBrowser } from '../services/api';
  import { favoriteStations } from '../stores';
  import SearchInput from './UI/SearchInput.svelte';
  import SelectInput from './UI/SelectInput.svelte';
  import IconButton from './UI/IconButton.svelte';

  const limitStations = 20;
  let searchParams = {};
  let countries = [];
  let searchedStations = [];
  let newStations = [];
  let isLoading = false;
  let hasMore = false;

  onMount(async () => {
    fetchSearchStations();
    const { data: countryList } = await radioBrowser.get('countries');
    countries = countryList.map(({ name }) => ({
      val: name,
      text: name,
    }));
  });

  const fetchSearchStations = async (additionalParams = {}, isReset = false) => {
    searchParams = {
      ...searchParams,
      ...additionalParams,
      limit: limitStations,
      order: 'votes',
      reverse: true,
      hideBroken: true,
    };
    if (isReset) {
      searchedStations = [];
      newStations = [];
      searchParams.offset = 0;
    }

    isLoading = true;
    try {
      const { data: stations } = await radioBrowser.get('stations/search', {
        params: searchParams,
      });
      const favoriteStationsUuid = $favoriteStations.map((station) => station.stationuuid);
      const fetchStations = stations.map((station) => ({
        ...station,
        isFavorite: favoriteStationsUuid.includes(station.stationuuid),
      }));
      if (fetchStations.length < limitStations) {
        hasMore = false;
      } else {
        hasMore = true;
      }

      if (isReset) {
        searchedStations = fetchStations;
      } else {
        newStations = fetchStations;
      }
    } catch (error) {
      console.error(error);
      showToast(error.message, 'danger');
    } finally {
      isLoading = false;
    }
  };

  const handleSearch = async (event) => {
    const { value: SearchValue } = event.target;
    await fetchSearchStations({
      name: SearchValue,
    }, true);
  };

  const handleCountryChange = async (event) => {
    const { value: country } = event.target;
    const countryExact = country !== '';
    await fetchSearchStations({
      country,
      countryExact,
    }, true);
  };

  const handleLoadMore = async () => {
    const { offset = 0 } = searchParams;
    await fetchSearchStations({
      offset: offset + limitStations,
    });
  };

  $: searchedStations = [
    ...searchedStations,
    ...newStations,
  ];

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
    {#if searchedStations.length}
      {#each searchedStations as searchedStation (searchedStation.stationuuid)}
        <StationItem
          station={searchedStation}
          isFavorite={searchedStation.isFavorite}
          showVoteCount
        />
      {/each}
    {:else}
      {#if !isLoading}
        <IconButton iconName="frown">
          Sorry, no stations found.
        </IconButton>
      {/if}
    {/if}

    {#if isLoading}
      <div class="loader">
        <Shadow size="2" color="#f0f0f0" unit="rem" duration="1s" />
      </div>
    {:else}
      {#if searchedStations.length >= 0 && hasMore}
        <div class="load-more">
          <IconButton iconName="chevron-down" size={1.5} onClick={handleLoadMore}>
            Load More
          </IconButton>
        </div>
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
    text-align: center;
  }

  .advanced-search {
    margin: .5rem 0;
    max-width: 400px;
  }

  .load-more {
    display: flex;
    justify-content: center;
  }
</style>

<script>
  import { onMount } from 'svelte';
  import { Shadow } from 'svelte-loading-spinners';
  import { showToast } from '../utils/toast';
  import StationItem from './StationItem.svelte';
  import { radioBrowser } from '../services/api';
  import { favoriteStations } from '../stores';
  import LocalStorage from '../utils/local-storage';
  import SearchInput from './UI/SearchInput.svelte';
  import SelectInput from './UI/SelectInput.svelte';
  import IconButton from './UI/IconButton.svelte';
  import CONFIG from '../configs';

  const { LOCAL_STORAGE } = CONFIG;

  // svelte-ignore unused-export-let
  export let DrawerComponent;

  const limitStations = 18;
  const defaultSort = 'votes';
  const orderList = [
    { val: 'votes', text: 'Votes' },
    { val: 'clickcount', text: 'Clicks' },
    { val: 'name', text: 'Names' },
    { val: 'country', text: 'Countries' },
    { val: 'codec', text: 'Codecs' },
  ];
  let searchParams = {};
  let countries = [];
  let searchedStations = [];
  let newStations = [];
  let reverseSort = true;
  let isLoading = false;
  let hasMore = false;
  let defaultCountry = '';

  onMount(async () => {
    defaultCountry = LocalStorage.get(LOCAL_STORAGE.COUNTRY) || '';
    fetchSearchStations({
      country: defaultCountry,
      countryExact: defaultCountry !== '',
      order: defaultSort,
      reverse: reverseSort,
    });

    const { data: countryList } = await radioBrowser.get('countries');
    countries = countryList.map(({ name, stationcount }) => ({
      val: name,
      text: `${name} (${stationcount})`,
    }));
  });

  const fetchSearchStations = async (additionalParams = {}, isReset = false) => {
    searchParams = {
      ...searchParams,
      ...additionalParams,
      limit: limitStations,
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
    await fetchSearchStations({
      country,
      countryExact: country !== '',
    }, true);
  };

  const handleSortChange = async (event) => {
    const { value: order } = event.target;
    await fetchSearchStations({
      order,
    }, true);
  };

  const handleSortDirectionChange = async () => {
    reverseSort = !reverseSort;
    await fetchSearchStations({
      reverse: reverseSort,
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

  $: iconSort = reverseSort ? 'sort-amount-down' : 'sort-amount-up';

</script>

<div class="search-station">
  <h1>Search Stations</h1>
  <div class="search">
    <SearchInput
      placeholder="Search station by name"
      onInput={handleSearch}
    />
    <div class="filter-wrapper">
      <div class="search-wrapper">
        <IconButton iconName="filter" />
        <SelectInput
          emptyText="-- All Country --"
          items={countries}
          onChange={handleCountryChange}
          selected={defaultCountry}
        />
      </div>
      <div class="search-wrapper">
        <IconButton iconName={iconSort} onClick={handleSortDirectionChange} />
        <SelectInput
          items={orderList}
          onChange={handleSortChange}
          selected={defaultSort}
        />
      </div>
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
  </div>

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

<style>
  .search-station {
    display: flex;
    flex-direction: column;
    padding: .5rem;
  }

  .list-wrapper {
    /* padding: .5rem; */
    display: grid;
    gap: 0 1rem;
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

  .filter-wrapper {
    display: flex;
    flex-direction: column;
  }

  .search-wrapper {
    display: flex;
    margin: .5rem 0;
    max-width: 400px;
  }

  .load-more {
    display: flex;
    justify-content: center;
  }

  @media screen and (min-width: 768px) {
    .list-wrapper {
      grid-template-columns: repeat(2, 1fr);
    }

    .filter-wrapper {
      flex-direction: row;
    }
  }

  @media screen and (min-width: 1200px) {
    .list-wrapper {
      grid-template-columns: repeat(3, 1fr);
    }
  }
</style>

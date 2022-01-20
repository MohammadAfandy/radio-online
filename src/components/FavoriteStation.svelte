<script>
  import { onMount } from 'svelte';
  import StationItem from './StationItem.svelte';
  import { favoriteStations, modal } from '../stores';
  import SearchInput from './UI/SearchInput.svelte';
  import IconButton from './UI/IconButton.svelte';
  import Confirm from './UI/Confirm.svelte';
  import { radioBrowser } from '../services/api';
  import { showToast } from '../utils/toast';

  let stations = [];
  let searchValue = '';
  let isRefreshLoading = false;

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

  const handleRefresh = async () => {
    const uuids = $favoriteStations.map((stat) => stat.stationuuid);
    isRefreshLoading = true;
    const { data: refreshedStations } = await radioBrowser.post('stations/byuuid', {
      uuids,
    });

    // reorder to previous order
    const newStations = refreshedStations.sort((a, b) => {
      return uuids.indexOf(a.stationuuid) - uuids.indexOf(b.stationuuid);
    });

    stations = favoriteStations.set(newStations);
    showToast('Refresh favorite stations success');
    isRefreshLoading = false;
  };

  const handleRemoveAll = async () => {
    modal.open({
      component: Confirm,
      props: {
        title: 'Reset Favorite Stations',
        description: 'Are you sure you want to reset favorite stations ?',
        handleCancel: () => modal.close(),
        handleConfirm: () => {
          favoriteStations.clear();
          modal.close();
          showToast('Remove all favorite stations success');
        },
      },
    });
  };

  $: stations = filterStations($favoriteStations, searchValue);

</script>

<div class="favorite-station">
  <div class="title">
    <h1>Favorite Stations ({$favoriteStations.length})</h1>
    <IconButton
      iconName="refresh"
      isDisabled={$favoriteStations.length === 0}
      onClick={handleRefresh}
      isLoading={isRefreshLoading}
    />
    <IconButton
      iconName="trash"
      isDisabled={$favoriteStations.length === 0}
      onClick={handleRemoveAll}
    />
  </div>

  {#if $favoriteStations.length}
    <div class="search">
      <SearchInput
        placeholder="Search favorite station"
        onInput={handleSearch}
      />
    </div>
    {#if stations.length}
      <div class="list-wrapper">
        {#each stations as station (station.stationuuid)}
          <StationItem
            {station}
            isFavorite
            showVoteCount={true}
          />
        {/each}
      </div>
    {:else}
      <IconButton iconName="frown">
        No stations found.
      </IconButton>
    {/if}
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

  .title {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
  }

  h1 {
    font-size: 1.5rem;
    margin-right: auto;
  }

  .list-wrapper {
    display: grid;
    gap: 0 1rem;
  }

  .search {
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

<script>
  import { onMount } from 'svelte';
  import IconButton from './UI/IconButton.svelte';
  import About from './About.svelte';
  import SelectInput from './UI/SelectInput.svelte';
  import { radioBrowser } from '../services/api';
  import CONFIG from '../configs';
  import { showToast } from '../utils/toast';
  import LocalStorage from '../utils/local-storage';

  const { LOCAL_STORAGE } = CONFIG;

  export let DrawerComponent;
  let countries = [];
  
  // default setting
  const DEFAULT_SETTING = {
    [LOCAL_STORAGE.COUNTRY]: '',
  };

  let setting = DEFAULT_SETTING;

  onMount(async () => {
    const { data: countryList } = await radioBrowser.get('countries');
    countries = countryList.map(({ name }) => ({
      val: name,
      text: name,
    }));

    getFromLocalStorage();
  });

  const getFromLocalStorage = () => {
    const getSetting = {};
    for (const key in setting) {
      getSetting[key] = LocalStorage.get(key);
    }
    setSetting(getSetting);
  };

  const saveToLocalStorage = () => {
    for (const key in setting) {
      LocalStorage.set(key, setting[key]);
    }
  };

  const setSetting = (data) => {
    setting = {
      ...setting,
      ...data,
    };
  };

  const handleOpenAbout = () => {
    DrawerComponent = About;
  };

  const handleCountryChange = (event) => {
    setSetting({
      [LOCAL_STORAGE.COUNTRY]: event.target.value,
    });
  };

  const handleReset = () => {
    setting = DEFAULT_SETTING;
  };

  const handleSave = () => {
    saveToLocalStorage();
    showToast('Setting has been applied', 'success');
  };

</script>

<div class="setting">
  <h1>Setting</h1>
  <div class="setting-list">
    <div class="setting-item">
      <div class="setting-name">
        <IconButton iconName="flag" size={1.5}>
          <span class="setting-label">Country</span>
        </IconButton>
      </div>
      <div class="setting-value">
        <SelectInput
          emptyText="-- No country selected --"
          items={countries}
          onChange={handleCountryChange}
          selected={setting[LOCAL_STORAGE.COUNTRY] || ''}
        />
      </div>
    </div>
    <div class="setting-item">
      <div class="setting-name">
        <IconButton iconName="info-circle" size={1.5} onClick={handleOpenAbout}>
          <span class="setting-label">About</span>
        </IconButton>
      </div>
    </div>
  </div>
  <div class="setting-action">
    <div class="action-item">
      <IconButton iconName="undo" onClick={handleReset}>
        Reset to default
      </IconButton>
    </div>
    <div class="action-item">
      <IconButton iconName="check" onClick={handleSave}>
        Save
      </IconButton>
    </div>
  </div>
</div>

<style>
  .setting {
    padding: .5rem;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  h1 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    text-align: center;
  }

  .setting-list {
    display: flex;
    flex-direction: column;
  }

  .setting-item {
    padding: .5rem 1rem;
    display: flex;
    align-items: flex-end;
  }

  .setting-name {
    margin-right: 2rem;
  }

  .setting-value {
    max-width: 20rem;
    width: 100%;
  }

  .setting-label {
    margin-left: 1rem;
  }

  .setting-action {
    margin-top: auto;
    display: flex;
    justify-content: end;
  }

  .action-item {
    margin: 0 1rem;
  }

</style>

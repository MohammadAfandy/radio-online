<script>
  import Setting from './Setting.svelte';
  import IconButton from './UI/IconButton.svelte';
  import CONFIG from '../configs';

  export let DrawerComponent;
  
  const handleBackSetting = () => {
    DrawerComponent = Setting;
  };

  const handleOpenGithub = () => {
    window.open(CONFIG.GITHUB_URL);
  };


</script>

<div class="about">
  <IconButton iconName="chevron-left" onClick={handleBackSetting}>
    Back to setting
  </IconButton>
  <h1>{CONFIG.APPNAME}</h1>
  <p>
    {CONFIG.APPNAME} is a free application to stream radio from around the world.
  </p>
  <p>
    All stations data were provided thanks to
    <a href="https://www.radio-browser.info/" rel="noreferrer" target="_blank">RadioBrowser</a>
    , and it uses <a href="https://service.radiolise.com/" rel="noreferrer" target="_blank">RadioLise Service</a>
    to get the info of currently playing song.
  </p>
  <p class="external-link">
    <IconButton iconName="github" size={2} onClick={handleOpenGithub} />
  </p>
</div>

<style>
  a {
    text-decoration: underline;
  }

  h1 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    text-align: center;
  }

  p {
    margin-bottom: .5rem;
  }

  .external-link {
    display: flex;
    justify-content: center;
  }

  @media screen and (min-width: 768px) {
    .about {
      width: 50%;
      margin: 0 auto;
    }
  }
</style>

class MyAudio {
  constructor() {
    if (MyAudio._instance) {
      throw new Error('Singleton classes can\'t be instantiated more than once.');
    }
    MyAudio._instance = this;
    this.audio = new Audio();
  }

  async play(url) {
    this.stop();
    this.audio.src = url;
    await this.audio.play();
  }

  stop() {
    this.audio.pause();
  }

  setVolume(volume) {
    this.audio.volume = volume;
  }
}

const myAudio = new MyAudio();

export default myAudio;

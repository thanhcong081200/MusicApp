const $$ = document.querySelectorAll.bind(document);
const $ = document.querySelector.bind(document);
const PLAYER_KEY = 'F8-player';
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const player = $('.player');
const btnPlay = $('.btn-toggle-play');
const cd = $('.cd');
const progress = $('#progress');
const btnPrev = $('.btn-prev');
const btnRepeat = $('.btn-repeat');
const btnNext = $('.btn-next');
const btnRandom = $('.btn-random');
const playlist = $('.playlist');

const app = {
  isRepeat: false,
  isRandom: false,
  isPlaying: false,
  currentIndex: 0,
  config: JSON.parse(localStorage.getItem(PLAYER_KEY)) || {},
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_KEY, JSON.stringify(this.config));
  },
  songs: [
    {
      name: 'Sắp 30',
      singer: 'Trịnh Đình Quang',
      path: 'https://nhacvietnam.mobi/listen/sap-30~trinh-dinh-quang~tsvm0c05q8nvnh',
      image: './assets/image/sap30.jpg',
    },
    {
      name: 'Muộn rồi mà sao còn',
      singer: 'Sơn Tùng MTP',
      path: 'https://tainhacmienphi.biz/get/song/api/283123',
      image: './assets/image/muonroimasaocon.jpg',
    },
    {
      name: 'See You Again',
      singer: 'Wiz Khalifa - Charlie Puth',
      path: 'https://tainhacmienphi.biz/get/song/api/2616',
      image: './assets/image/seeyouagain.jpg',
    },
    {
      name: 'Love Is Gone',
      singer: 'Dylan Mattheww',
      path: 'https://aredir.nixcdn.com/NhacCuaTui1000/LoveIsGoneAcoustic-SlanderDylanMatthew-6288644.mp3?st=QOtKJKlk4TqnZ7dK2JXP5g&e=1626345143',
      image: './assets/image/loveisgone.jpg',
    },
    {
      name: 'Shy',
      singer: 'Jai Waetford',
      path: 'https://tainhacmienphi.biz/get/song/api/2957',
      image: './assets/image/shy.jpg',
    },
   
    {
      name: 'Let Her Go',
      singer: 'Passenger',
      path: 'https://tainhacmienphi.biz/get/song/api/2832',
      image: './assets/image/lethergo.jpg',
    },
    {
      name: 'Đã Lỡ Yêu Em Nhiều',
      singer: 'JustaTee',
      path: 'https://tainhacmienphi.biz/get/song/api/3468',
      image: './assets/image/daloyeuemnhieu.jpg',
    },
    {
      name: 'Chúng Ta Của Hiện Tại',
      singer: 'Sơn Tùng MTP',
      path: 'https://ia801407.us.archive.org/1/items/ctcht/Chung%20Ta%20Cua%20Hien%20Tai%20-%20Son%20Tung%20M-TP.mp3',
      image: './assets/image/chungtacuahientai.jpg',
    },
    {
      name: 'Something Just Like This',
      singer: 'The Chainsmokers & Coldplay',
      path: 'https://aredir.nixcdn.com/Sony_Audio39/SomethingJustLikeThis-TheChainsmokersColdplay-5337136.mp3?st=VQuH6VgNsPlBizbk-c7n3w&e=1623144556',
      image: 'https://avatar-ex-swe.nixcdn.com/song/2017/11/07/a/1/4/5/1510038809679_640.jpg',
    },
    {
      name: 'Anh Thanh Niên',
      singer: 'Huy R',
      path: 'https://tainhacmienphi.biz/get/song/api/131584',
      image: './assets/image/anhthanhnien.jpg',
    },
  ],
  render: function () {
    const htmls = this.songs.map((item, index) => {
      return `        
        <div data-index="${index}" class="song ${
        index === this.currentIndex ? 'active' : ''
      }">
            <div
                class="thumb"
                style="
                background-image: url('${item.image}');
            "
            ></div>
            <div class="body">
                <h3 class="title">${item.name}</h3>
                <p class="author">${item.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>`;
    });
    playlist.innerHTML = htmls.join('');
  },
  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    //xử lý CD quay / dừng
    const cdThumbAnimate = cdThumb.animate(
      [
        {
          transform: 'rotate(360deg)',
        },
      ],
      {
        duration: 10000,
        iterations: Infinity,
      }
    );
    cdThumbAnimate.pause();
    //xử lý phóng to thu nhỏ
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCDwidth = cdWidth - scrollTop;
      cd.style.width = newCDwidth > 0 ? newCDwidth + 'px' : 0;
      cd.style.opacity = newCDwidth / cdWidth;
    };
    //xử lý khi play
    btnPlay.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };
    //xử lý khi nhấn next songs
    btnNext.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      _this.scrollToActiveSong();
      audio.play();
    };
    //xử lý khi nhấn pre songs
    btnPrev.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.preSong();
      }
      _this.scrollToActiveSong();
      audio.play();
    };
    //xử lý khi random
    btnRandom.onclick = function () {
      _this.isRandom = !_this.isRandom;
      _this.setConfig('isRandom', _this.isRandom);
      btnRandom.classList.toggle('active', _this.isRandom);
    };
    //xử lý khi repeat
    btnRepeat.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig('isRepeat', _this.isRepeat);
      btnRepeat.classList.toggle('active', _this.isRepeat);
    };
    // Khi song play
    audio.onplay = function () {
      _this.isPlaying = true;
      cdThumbAnimate.play();
      player.classList.add('playing');
    };
    //Khi song pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove('playing');
      cdThumbAnimate.pause();
    };
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercen = (audio.currentTime / audio.duration) * 100;
        progress.value = progressPercen;
      }
    };
    progress.oninput = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    

    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        btnNext.click();
      }
    };
    //lắng nghe click hành vì click vào playlist
    playlist.onclick = function (e) {
      let songNode = e.target.closest('.song:not(.active)');
      if (songNode || e.target.closest('.option')) {
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          audio.play();
        }
        if (e.target.closest('.option')) {
        }
      }
    };
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (this.currentIndex === newIndex);
    console.log(newIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex > this.songs.length - 1) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  preSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      if (this.currentIndex <= 3) {
        $('.song.active').scrollIntoView({
          behavior: 'smooth',
          block: 'end',
        });
      } else {
        $('.song.active').scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }, 300);
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },
  defineProperty: function () {
    Object.defineProperty(this, 'currentSong', {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;

    if ($('.song.active')) {
      $('.song.active').classList.remove('active');
    }
    const list = $$('.song');
    list.forEach((song) => {
      if (Number(song.getAttribute('data-index')) === this.currentIndex) {
        song.classList.add('active');
      }
    });
  },
  start: function () {
    this.loadConfig();
    btnRandom.classList.toggle('active', this.isRandom);
    btnRepeat.classList.toggle('active', this.isRepeat);
    this.defineProperty();
    this.handleEvents();
    this.loadCurrentSong();
    this.render();
  },
};
app.start();

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const cd = $('.cd');
const cdThumb = $('.cd-thumb')
const heading = $('header h2')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const playing = $('.player')
const progress = $('.progress')
const next = $('.btn-next')
const prev = $('.btn-prev')
const random = $('.btn-random')
const repeat = $('.btn-repeat')
const playlist = $('.playlist')
const PLAYER_STORAGE_KEY = 'Khoa_Player'

const app = {
    arrRandom: [],
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [{
            name: "Infinity",
            singer: "Jaymes Young",
            path: "./assets/music/infinity.mp3",
            img: "./assets/img/infinity.jpg"
        },
        {
            name: "Rockabye",
            singer: "Clean bandit",
            path: "./assets/music/rockabye.mp3",
            img: "./assets/img/rockabe.jpg"
        },
        {
            name: "Body back",
            singer: "Maia Night",
            path: "./assets/music/bodyback.mp3",
            img: "./assets/img/bodyback.jpg"
        },
        {
            name: "Đế Vương",
            singer: "Đình Dũng",
            path: './assets/music/DeVuong.mp3',
            img: "https://i.ytimg.com/vi/qkPgUgkQE4Y/maxresdefault.jpg"
        },
        {
            name: "Wild",
            singer: "Monogem",
            path: './assets/music/wild.mp3',
            img: "https://m.media-amazon.com/images/M/MV5BMGMzZmYzYmUtNTJiYi00MjZjLTkyZmMtZGJhYWRlMDBkMDIyXkEyXkFqcGdeQXVyNjA5MDIyMzU@._V1_.jpg"
        },
        {
            name: "The night",
            singer: "Avicii",
            path: './assets/music/Thenight.mp3',
            img: "https://i.ytimg.com/vi/Nnj3YFlUa3Q/maxresdefault.jpg"
        },
        {
            name: "Tie me down",
            singer: "Gryffin",
            path: './assets/music/tiemedown.mp3',
            img: "https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/cover/2/d/7/2/2d727e2546c1b6f61e2ceb6a2e5230db.jpg"
        },
        {
            name: "Heat Waves",
            singer: "Glass Animals",
            path: './assets/music/heatWaves.mp3',
            img: "https://opensource.glassanimals.com/wp-content/uploads/2020/05/gaos-dreamland-social-1024x538.jpg"
        },
        {
            name: "The Other Side Of Paradise",
            singer: "Glass Animals",
            path: './assets/music/theother.mp3',
            img: "https://opensource.glassanimals.com/wp-content/uploads/2020/05/gaos-dreamland-social-1024x538.jpg"
        },
        {
            name: "Sou Fevela",
            singer: "MC Bruninho, Vitinho Ferrari",
            path: './assets/music/SouFavela.mp3',
            img: "https://daddykool.com/Photo/418459635529"
        },
        {
            name: "idfc x soap",
            singer: "MC Bruninho, Vitinho Ferrari",
            path: './assets/music/idfc.mp3',
            img: "https://i.ytimg.com/vi/iuKdivKTrRU/hqdefault.jpg"
        },
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    defineProperties: function() {
        Object.defineProperty(this, "currentSong", {
            get: function() {
                return this.songs[this.currentIndex]
            },
        })
    },
    render: function() {
        const htmls = this.songs.map(function(song, index) {
            return `
            <div class="song ${index === app.currentIndex ? 'active' : ''}" data-index="${index}">
            <div class="thumb" style="background-image: url('${song.img}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
            </div>
        `
        })
        playlist.innerHTML = htmls.join('')
    },
    handleEvents: function() {
        _this = this
            //scroll màn hình
        const cdWidth = cd.offsetWidth
            //do dùng padding top để làm ảnh nên nếu tắng giảm đọ rộng thì ảnh cũng tằng giảm theo
        document.onscroll = function() {
                const scroll = document.documentElement.scrollTop || window.scrollY
                const newWidthCd = cdWidth - scroll
                cd.style.width = newWidthCd > 0 ? newWidthCd + 'px' : 0
                cd.style.opacity = newWidthCd / cdWidth;
            }
            //amination cd
        const cdAnimation = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 15000, //time quay 1 vòng
            iterations: Infinity, //quay bao nhiêu lần
        })
        cdAnimation.pause()
            //play song , pause song , seek(tour) song
        playBtn.onclick = function() {
            if (_this.isPlaying)
                audio.pause()
            else
                audio.play()

        }
        audio.onplay = function() {
            _this.isPlaying = true
            playing.classList.add("playing")
            cdAnimation.play()
        }
        audio.onpause = function() {
            _this.isPlaying = false
            playing.classList.remove("playing")
            cdAnimation.pause()
        }

        audio.ontimeupdate = function() {
                const seek = audio.currentTime / audio.duration * 100
                if (seek) {
                    progress.value = seek
                }
            }
            //tour song
        progress.oninput = function(e) {
            const seekTime = e.target.value * audio.duration / 100
            audio.currentTime = seekTime
        }


        //next song
        next.onclick = function(e) {
                if (_this.isRandom) {
                    _this.randomSong()
                } else {
                    _this.nextSong()
                }
                audio.play()
                _this.render()
                _this.scrollTopActive()
            }
            //prev song
        prev.onclick = function(e) {
                if (_this.isRandom) {
                    _this.randomSong()
                } else {
                    _this.prevSong()
                }
                audio.play()
                _this.render()
                _this.scrollTopActive()
            }
            //random song
        random.onclick = function(e) {
                _this.isRandom = !_this.isRandom //gán ngược lại vd isRD là true , đang bạt , gán ngược lại false , nếu false xuống dưới nó remove active và ngược lại
                random.classList.toggle('active', _this.isRandom) //đối số thứ 2 của toggle là true hoặc false, true thì add , false thì remove
                _this.setConfig('isRandom', _this.isRandom)

            }
            //Lặp lại 1 bài
        repeat.onclick = function(e) {
                //cách 1
                _this.isRepeat = !_this.isRepeat
                repeat.classList.toggle("active", _this.isRepeat)

                //cách 2
                // if (_this.isRepeat) {
                //     _this.isRepeat = false
                //     repeat.classList.remove('active')
                // } else {
                //     _this.isRepeat = true
                //     repeat.classList.add('active')
                // }
                _this.setConfig('isRepeat', _this.isRepeat)
            }
            //tự động next sau khi hết bài
        audio.onended = function() {
                if (_this.isRepeat)
                    audio.play()
                else
                    next.click()
            }
            //click bài hát ở playlist
        playlist.onclick = function(e) {
            const nodeSong = e.target.closest('.song:not(.active)')
            if (nodeSong || e.target.closest('.option')) {
                if (nodeSong) {
                    _this.currentIndex = Number(nodeSong.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
                if (e.target.closest('.option')) {

                }

            }
        }
    },
    scrollTopActive: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end',
            })
        }, 300)
    },
    nextSong: function() {
        this.currentIndex++
            if (this.currentIndex >= this.songs.length)
                this.currentIndex = 0
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--
            if (this.currentIndex < 0)
                this.currentIndex = this.songs.length - 1
        this.loadCurrentSong()
    },
    randomSong: function() {
        if (this.songs.length == this.arrRandom.length)
            this.arrRandom = []
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex || this.arrRandom.some((value) => value === newIndex))
        this.currentIndex = newIndex
        this.arrRandom.push(this.currentIndex)
        this.loadCurrentSong()
    },
    LoadConfig: function() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat

    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`
        audio.src = this.currentSong.path
    },
    start: function() {
        //Định lại cấu hình cũ lúc trước xài
        this.LoadConfig()

        //Định nghĩa vài thuộc tính
        this.defineProperties()
            // Xử lý
        this.handleEvents()
            //load currentSong
        this.loadCurrentSong()
            //render ra bài hát
        this.render()
        if (this.isRandom)
            random.classList.toggle('active', this.isRandom)
        if (this.isRepeat)
            repeat.classList.toggle("active", this.isRepeat)
    }

}


app.start()
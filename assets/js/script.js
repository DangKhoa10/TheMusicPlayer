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
            name: "Collide",
            singer: "Skye",
            path: './assets/music/12.mp3',
            img: "data:image/jpeg;base64,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"
        },
        {
            name: "Golden hour",
            singer: "jvke",
            path: './assets/music/11.mp3',
            img: "data:image/jpeg;base64,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"
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
            singer: "Black Bear",
            path: './assets/music/idfc.mp3',
            img: "https://i.ytimg.com/vi/iuKdivKTrRU/hqdefault.jpg"
        },
        {
            name: "Normal No More",
            singer: "TYSM",
            path: './assets/music/10.mp3',
            img: "https://i.ytimg.com/vi/iGrN7Gb8DtI/maxresdefault.jpg"
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

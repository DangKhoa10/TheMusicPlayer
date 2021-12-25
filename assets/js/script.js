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
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
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
    ],
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
        progress.onchange = function(e) {
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
                if (_this.isRandom) {
                    _this.isRandom = false
                    random.classList.remove('active')
                } else {
                    _this.isRandom = true
                    random.classList.add('active')
                }
            }
            //Lặp lại 1 bài
        repeat.onclick = function(e) {
                if (_this.isRepeat) {
                    _this.isRepeat = false
                    repeat.classList.remove('active')
                } else {
                    _this.isRepeat = true
                    repeat.classList.add('active')
                }
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
                block: 'nearest',
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
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`
        audio.src = this.currentSong.path
    },
    start: function() {
        //Định nghĩa vài thuộc tính
        this.defineProperties()
            // Xử lý
        this.handleEvents()
            //load currentSong
        this.loadCurrentSong()
            //render ra bài hát
        this.render()
    }

}


app.start()
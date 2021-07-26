const PlayList = document.getElementsByClassName("playlist")[0];
const Header = document.querySelector("header h2");
const CDthmb = document.querySelector(".cd-thumb");
const CD = document.querySelector(".cd");
const audio = document.querySelector("#audio")
const Playbtn = document.querySelector(".btn-toggle-play");
const Player = document.querySelector(".player")
const Nextbtn = document.querySelector(".btn-next");
const Prebtn = document.querySelector(".btn-prev");
const Progress = document.querySelector("#progress")
const Randombtn = document.querySelector(".btn-random")
const Repeatbtn = document.querySelector(".btn-repeat");
console.log(CDthmb.offsetWidth);
const app = {
    songs: [{
            id: 1,
            name: "Once Upon a Time",
            singer: "Max Oza",
            path: "./Music/Once Upon a Time - Moonessa_ Max Oazo.mp3",
            img: "./Img/max.jpg"
        },
        {
            id: 2,
            name: "Dancing with your ghost",
            singer: "Sasha Sloan",
            path: "./Music/Dancing With Your Ghost - Sasha Sloan.mp3",
            img: "./Img/dance.jpg"
        },
        {
            id: 3,
            name: "Once Upon a Time",
            singer: "Max Oza",
            path: "./Music/Once Upon a Time - Moonessa_ Max Oazo.mp3",
            img: "./Img/max.jpg"
        },
        {
            id: 4,
            name: "Dancing with your ghost",
            singer: "Sasha Sloan",
            path: "./Music/Dancing With Your Ghost - Sasha Sloan.mp3",
            img: "./Img/dance.jpg"
        },
        {
            id: 5,
            name: "Once Upon a Time",
            singer: "Max Oza",
            path: "./Music/Once Upon a Time - Moonessa_ Max Oazo.mp3",
            img: "./Img/max.jpg"
        },
        {
            id: 6,
            name: "Dancing with your ghost",
            singer: "Sasha Sloan",
            path: "./Music/Dancing With Your Ghost - Sasha Sloan.mp3",
            img: "./Img/dance.jpg"
        }

    ],
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    Saveconfig: function() {
        localStorage.setItem("Random", JSON.stringify(this.isRandom));
        localStorage.setItem("Repeat", JSON.stringify(this.isRepeat));
    },
    LoadConfig: function() {
        this.isRandom = JSON.parse(localStorage.getItem("Random"));
        Randombtn.classList.toggle("active", this.isRandom);
        this.isRepeat = JSON.parse(localStorage.getItem("Repeat"));
        Repeatbtn.classList.toggle("active", this.isRepeat);
    },
    render: function() {
        const htmls = this.songs.map((item, index) => {
            return `
            <div class="song ${index===this.currentIndex?"active":""}" data-index=${index}>
                <div class="thumb"
                    style="background-image: url('${item.img}')">
                </div>
                <div class="body">
                    <h3 class="title">${item.name}</h3>
                    <p class="author">${item.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        PlayList.innerHTML = htmls.join("");
    },
    Define: function() {
        Object.defineProperty(this, "currentSong", {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },
    LoadCurrentMusic: function() {
        Header.textContent = this.currentSong.name;
        CDthmb.style.backgroundImage = `url(${this.currentSong.img})`;
        audio.src = this.currentSong.path;
    },
    NextSong: function() {
        this.currentIndex = (this.currentIndex == this.songs.length - 1 ? 0 : ++this.currentIndex);
        this.LoadCurrentMusic();
        this.render();
    },
    PreSong: function() {
        this.currentIndex = (this.currentIndex == 0 ? this.songs.length - 1 : --this.currentIndex);
        this.LoadCurrentMusic();
        this.render();

    },
    RandomSong: function() {
        let newIndex = 0;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
    },
    scrollToActive: function() {
        console.log("Scoll");
        if (this.currentIndex === 0) {
            document.documentElement.scrollTop = 0 + "px";
        } else {
            setTimeout(() => {
                document.querySelector(".song.active").scrollIntoView({
                    behavior: "smooth",
                    block: "nearest"
                })
            }, 300)
        }

    },
    //todo handing event
    HandleEvents: function() {
        const _this = this;
        const CDwidth = CD.offsetWidth; // bao gồm cả padding và border
        //todo: xử lý quay CDthmb
        const CDthmbAnimate = CDthmb.animate([{
            transform: "rotate(360deg)"
        }], {
            duration: 10000,
            iterations: Infinity,
        })
        CDthmbAnimate.pause();
        //todo: xử lý Resize CDthmb
        document.onscroll = function() {
                const scrollTop = document.documentElement.scrollTop;
                const newWidth = CDwidth - scrollTop;
                CD.style.width = newWidth > 0 ? newWidth + "px" : 0;
            }
            //todo: xử lí xự kiện khi click vào playbtn
        Playbtn.onclick = function() {
                if (_this.isPlaying) {
                    audio.pause();
                } else {
                    audio.play();
                }
            }
            //! Khi Song đang chạy
        audio.onplay = function() {
                console.log("playing");
                _this.isPlaying = true;
                Player.classList.add("playing");
                CDthmbAnimate.play();
            }
            //! Khi Song dừng
        audio.onpause = function() {
                console.log("pause");
                _this.isPlaying = false;
                Player.classList.remove("playing");
                CDthmbAnimate.pause();
            }
            //! Khi kết thúc
        audio.onended = function() {
                if (_this.isRepeat) {
                    audio.play();
                } else {
                    Nextbtn.onclick();
                    console.log("end");
                }

            }
            //! Next Song
        Nextbtn.onclick = function() {
                if (_this.isRandom) {
                    _this.RandomSong();
                }
                _this.NextSong();
                audio.play();
                _this.scrollToActive();
            }
            //! Pre Song
        Prebtn.onclick = function() {
                _this.PreSong();
                audio.play();
                _this.scrollToActive();

            }
            //! Click playlist
        PlayList.onclick = function(e) {
                const songNode = e.target.closest(".song:not(.active)");
                if (songNode !== null) {
                    _this.currentIndex = Number(songNode.getAttribute("data-index"));
                    _this.LoadCurrentMusic();
                    _this.render();
                    audio.play();
                }
            }
            //!Tua
        Progress.onchange = function(e) {
            // console.log("Progress change");
            const SeekTime = (audio.duration) * (e.target.value) / 100;
            audio.currentTime = SeekTime;
        }
        audio.ontimeupdate = function() {
                if (audio.duration) {
                    const progressCurrent = Math.floor((audio.currentTime / audio.duration) * 100);
                    Progress.value = progressCurrent;
                    // console.log("Time change");
                }
            }
            //! Options Random
        Randombtn.onclick = function() {
                console.log("random");
                _this.isRandom = !_this.isRandom;
                Randombtn.classList.toggle("active", _this.isRandom);
                _this.Saveconfig();
            }
            //! Options Repeat
        Repeatbtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            Repeatbtn.classList.toggle("active", _this.isRepeat);
            _this.Saveconfig();
        }
    },
    start: function() {
        //! Define
        this.Define();
        //! LoadSong Current
        this.LoadCurrentMusic();
        //! Handle Event
        this.HandleEvents();
        //! Load config
        this.LoadConfig();
        //! Render list song
        this.render();
    }

}
app.start();
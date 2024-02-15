// THis function is created for learing purpose  ....

// this is use to each song play on the javascript
let currentsong = new Audio();

let songs;

let currfolder;

function secondsToMinutesSeconds(seconds) {
  // Ensure the input is a non-negative number
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  // Calculate minutes and remaining seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Format the result as "mm:ss"
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

//! Calling the getsongs function from within the playaudio function.....

async function getsongs(folder) {
  currfolder = folder;

  const a = await fetch(`http://127.0.0.1:3000/${folder}/`);

  const data = await a.text();

  // console.log(data);

  let div = document.createElement("div");

  div.innerHTML = data;

  // console.log(div);

  let as = div.getElementsByTagName("a");

  console.log(as);

  // creatr a array becouse all the songs exist in the file
  songs = [];

  // before create a as virable to store the song one by one and after to give the array.
  for (let index = 0; index < as.length; index++) {
    const element = as[index];

    if (element.href.endsWith("mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

  //! Add the songlist through js

  let songUL = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];

  songUL.innerHTML = "";

  for (const song of songs) {
    // how to add this way for beginner
    // songUL.innerHTML += `<li> ${song.replaceAll("%20" , " ")} </li`;

    songUL.innerHTML += `<li> 
     
     <img class="invert" src="music.svg" alt="msu">
   
     <div class="songname">
       <div>${song.replaceAll("%20", " ")} </div>
       <dir>Artist</dir>
     </div>

     <div class="playnow">
        
        <img class="invert" src="play.svg" alt="">
     </div>
     
     </li`;
  }

  //! Attach an event lintener to each song

  Array.from(
    document.querySelector(".songlist").getElementsByTagName("li")
  ).forEach((e) => {
    //  console.log(e.querySelector(".songname").firstElementChild.innerHTML);
    e.addEventListener("click", () => {
      //  console.log(e.querySelector(".songname").firstElementChild.innerHTML);

      playMusic(
        e.querySelector(".songname").firstElementChild.innerHTML.trim()
      );
    });
  });

   return songs
}

// this func call a insside of playaudio func...

const playMusic = (track, pause = false) => {
  // let audio = new Audio( "/songs/" + track);

  // audio.play();

  currentsong.src = `/${currfolder}/` + track;

  if (!pause) {
    currentsong.play();

    Play.src = "pause.svg";
  }

  document.querySelector(".songinfo").innerHTML = decodeURI(track);

  document.querySelector(".songtime").innerHTML = "00:00/00:00";
};

async function display() {
  // console.log("display play")
  const a = await fetch(`/songs/`);

  const response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;
  console.log(div);

  let anchor = div.getElementsByTagName("a");

  let cardcontainer = document.querySelector(".cardcontainer");
  let array = Array.from(anchor)

  for(let index = 0; index < array.length; index++) {
    const e = array[index];
    
  
    if (e.href.includes("/songs")) {
      let folder = e.href.split("/").slice(-2)[0];

      const a = await fetch(`/songs/${folder}/info.json`);

      const response = await a.json();

      console.log(response);

      cardcontainer.innerHTML =
        cardcontainer.innerHTML +
        ` 
         <div data-folder="${folder}" class="card">
         <div class="palybtn">
           <svg
             width="40"
             height="40"
             viewBox="0 0 24 24"
             fill="none"
             xmlns="http://www.w3.org/2000/svg"
             style="background-color: #1ed760; border-radius: 50%"
           >
             <path
               d="M15.4531 12.3948C15.3016 13.0215 14.5857 13.4644 13.1539 14.3502C11.7697 15.2064 11.0777 15.6346 10.5199 15.4625C10.2893 15.3913 10.0793 15.2562 9.90982 15.07C9.5 14.6198 9.5 13.7465 9.5 12C9.5 10.2535 9.5 9.38018 9.90982 8.92995C10.0793 8.74381 10.2893 8.60868 10.5199 8.53753C11.0777 8.36544 11.7697 8.79357 13.1539 9.64983C14.5857 10.5356 15.3016 10.9785 15.4531 11.6052C15.5156 11.8639 15.5156 12.1361 15.4531 12.3948Z"
               fill="black"
               stroke="#141B34"
               stroke-width="1.5"
               stroke-linejoin="round"
             />
           </svg>
         </div>

         <img  src="/songs/${folder}/cover.jpg" alt="" >
         <h2>${response.title}</h2>
         <p>${response.description}</p>
       </div>`;
    }
  }


  
}

//! this is a playoudio func........

async function playaudio() {
  await getsongs("songs/ncs");

  // console.log(songs);

  playMusic(songs[0], true);

  //! Album of playlist

  await display();

  //! Attach an event litener to prevose , play , next.

  Play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      Play.src = "pause.svg";
    } else {
      currentsong.pause();
      Play.src = "play.svg";
    }
  });

  //! listen for timeupdaing event

  currentsong.addEventListener("timeupdate", () => {
    // console.log(currentsong.currentTime, currentsong.duration);

    //! Round the currentTime and duration to whole seconds
    const currentTimeSeconds = Math.round(currentsong.currentTime);
    const durationSeconds = Math.round(currentsong.duration);

    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      currentTimeSeconds
    )}/${secondsToMinutesSeconds(durationSeconds)}`;

    document.querySelector(".circle").style.left =
      (currentTimeSeconds / durationSeconds) * 100 + "%";
  });

  //! Add a event litener to seekbar

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;

    document.querySelector(".circle").style.left = percent + "%";

    currentsong.currentTime = (currentsong.duration * percent) / 100;
  });


   //! Add a event linter to humbuger

   document.querySelector(".humbuger").addEventListener("click" , ()=>{

    document.querySelector(".leftside").style.left = "0";

   });

   //! Add a event leinnter to close button

   document.querySelector(".imgclose").addEventListener("click" , ()=>{

      document.querySelector(".leftside").style.left = "-110%";

   });


  //!Add a event linter to privous button!

  privous.addEventListener("click", () => {
    // console.log("privous clicked");

    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);

    // console.log(songs, index);

    if (index - 1 < songs.length) {
      playMusic(songs[index - 1]);
    }
  });

  //!Add a event linter to next button!

  next.addEventListener("click", () => {
    // console.log("next clicked");

    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);

    // console.log(songs , index);

    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }

    // console.log(length, index);
  });

  //! Add a event linter to value button

  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      // console.log(e.target , e.target.value)

      currentsong.volume = e.target.value / 100;
    });

  //! Add a event linter to mute button

  document.querySelector(".rangebtn>img").addEventListener("click", (e) => {
    // console.log(e.target);
    // console.log("change", e.target.src.split("/").slice(-1));
    if (e.target.src.split("/").slice(-1) == "valume.svg") {
      e.target.src = "mute.svg";

      currentsong.volume = 0;
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 0;
    } else {
      e.target.src = "valume.svg";
      currentsong.volume = 10 / 100;
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 10;
    }
  });

  //! Add to evnet linter to whenever card is clicked...

  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    // console.log(e)

    e.addEventListener("click", async  item => {

      console.log("fetching songs")
      songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0]);


    });
  });

   
}

playaudio();

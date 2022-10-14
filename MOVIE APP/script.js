const API_KEY = 'api_key=566687d0bfd681ee01e6dcfb05e34254';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;
const main = document.getElementById('main');
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';
const search  = document.getElementById('search');
const form = document.getElementById('form');
const searchUrl = BASE_URL + '/search/movie?' + API_KEY;
const tagsEl = document.getElementById('tags');
const prev = document.getElementById('previous')
const next = document.getElementById('next')
const current = document.getElementById('current')

var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lasturl = '';
var totalPages = 100;


const genres =  [
      {
        "id": 28,
        "name": "Action"
      },
      {
        "id": 12,
        "name": "Adventure"
      },
      {
        "id": 16,
        "name": "Animation"
      },
      {
        "id": 35,
        "name": "Comedy"
      },
      {
        "id": 80,
        "name": "Crime"
      },
      {
        "id": 99,
        "name": "Documentary"
      },
      {
        "id": 18,
        "name": "Drama"
      },
      {
        "id": 10751,
        "name": "Family"
      },
      {
        "id": 14,
        "name": "Fantasy"
      },
      {
        "id": 36,
        "name": "History"
      },
      {
        "id": 27,
        "name": "Horror"
      },
      {
        "id": 10402,
        "name": "Music"
      },
      {
        "id": 9648,
        "name": "Mystery"
      },
      {
        "id": 10749,
        "name": "Romance"
      },
      {
        "id": 878,
        "name": "Science Fiction"
      },
      {
        "id": 10770,
        "name": "TV Movie"
      },
      {
        "id": 53,
        "name": "Thriller"
      },
      {
        "id": 10752,
        "name": "War"
      },
      {
        "id": 37,
        "name": "Western"
      }
    ]
var selectedGenre = []    
setGenre();
function setGenre(){
    tagsEl.innerHTML = '';
    genres.forEach(genre =>{
        const t = document.createElement('div');
        t.classList.add('tag');
        t.id = genre.id;
        t.innerText = genre.name;
        t.addEventListener('click',() => {
             if(selectedGenre.length == 0){
                selectedGenre.push(genre.id);
             } else{
                if(selectedGenre.includes(genre.id)){
                    selectedGenre.forEach((id,idx) =>{
                        if(id == genre.id){
                            selectedGenre.splice(idx,1);
                        }
                    })
                } else{
                    selectedGenre.push(genre.id);
                }
             }
             getMovies(API_URL + '&with_genres=' + encodeURI(selectedGenre.join(',')))
             highlightTags();
        })
        tagsEl.append(t);
    })
}

function highlightTags(){
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.classList.remove('highlight')
    })
    clearBtn()
    if(selectedGenre.length !=0){
        selectedGenre.forEach(id => {
            const highlightedTags = document.getElementById(id);
            highlightedTags.classList.add('highlight');
        })
    }
}

function clearBtn(){
    let clearBtn = document.getElementById('clear');
    if(clearBtn){
        clearBtn.classList.add('highlight');
    } else{
        let clear = document.createElement('div');
        clear.classList.add('tag','highlight');
        clear.id= 'clear';
        clear.innerText = 'clear x';
        clear.addEventListener('click',() => {
            selectedGenre= [];
            setGenre();
            getMovies(API_URL);
        })
        tagsEl.append(clear);
    }
    

    
}

getMovies(API_URL);

function getMovies(url){
    lasturl = url;
    fetch(url).then(response => response.json()).then(data =>{
        console.log(data.results)
        if(data.results.length !== 0 ){
            showMovies(data.results);  
            currentPage = data.page;
            nextPage = currentPage + 1;
            prevPage = currentPage - 1;
            totalPages = data.total_pages; 
            current.innerText = currentPage;
            if(currentPage <= 1){
                prev.classList.add('disabled');
                next.classList.remove('disabled')
            }else if(currentPage >= totalPages){
                 prev.classList.remove('disabled');
                 next.classList.add('disabled')
            }else{
                prev.classList.remove('disabled');
                next.classList.remove('disabled')  
            }

            tagsEl.scrollIntoView({behavior : 'smooth'})
        } else{
            main.innerHTML = `<h1 class="no-movie"> No movies found</h1>`
        }
       
    })
}

function showMovies(data){
   main.innerHTML = '';

   data.forEach(movie => {
      const {title , poster_path ,vote_average , overview,id} = movie;
      const movieEl = document.createElement('div');
      movieEl.classList.add('movie');
      movieEl.innerHTML = `
      <img src="${poster_path? IMAGE_URL + poster_path : "https://placeholder.pics/svg/1000x1500" }" alt="${title}">
           <div class="movie-info">
              <h3>${title}</h3>
              <span class="${getColor(vote_average)}">${vote_average}</span>
           </div>
           <div class="overview">
              <h3>overview</h3>
              <div class="info">
                ${overview}
              </div>
              <button class="know-more" id="${id}"> Know more </button>  
           </div>`
           
           
    main.appendChild(movieEl);
    
    document.getElementById(id).addEventListener('click',() => {
        openNav(movie)
    })
   });
}
const overlayContent = document.getElementById('overlay-content');
/* Open when someone clicks on the span element */
function openNav(movie) {
  let id = movie.id;
  fetch(BASE_URL + '/movie/' +id + '/videos?' + API_KEY).then(response => response.json())
  .then(videodata => {
    console.log(videodata);
    if(videodata){
      document.getElementById("myNav").style.width = "100%";
      if(videodata.results.length > 0){
        var embed = [];
        var dots = [];
        videodata.results.forEach((video,idx) => {
          let {name,key,site} = video

          if(site == 'YouTube'){
          embed.push(`<iframe width="560" height="315" src="https://www.youtube.com/embed/${key}"
           title="${name}" class="embed hide" frameborder="0" allow="accelerometer; autoplay; clipboard-write;
            encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`)
          }
             dots.push(`
              <span class="dot">${idx+1}</span>
             `) 
        })
    
        var content = `<h1 class="no-movie"> ${
          movie.original_title}</h1>
          <br/>
          
          ${embed.join('')}
          <br/>
          
          <div class="dots">${dots.join('')}</div>
          `
        overlayContent.innerHTML = content;
        activeSlide = 0;
        showVideos();  
      }else{
        overlayContent.innerHTML = `<h1 class="no-movie"> No movies found</h1>`
      }
    }
  })
}
  

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}

var activeSlide =0;
var totalVideos = 0;
function showVideos(){
let embedel = document.querySelectorAll('.embed');
let dots = document.querySelectorAll('.dot');
totalVideos = embedel.length;
embedel.forEach((embedTag,idx) => {
  if(activeSlide == idx){
    embedTag.classList.add('show');
    embedTag.classList.remove('hide')
  }else{
    embedTag.classList.add('hide');
    embedTag.classList.remove('show')
  }
})
  dots.forEach((dot,indx) => {
    if(activeSlide == indx){
      dot.classList.add('active');
    }else{
      dot.classList.remove('active');
    }
  })
}

const leftArrow = document.getElementById('left-arrow');
const rightArrow = document.getElementById('right-arrow');
leftArrow.addEventListener('click',() => {
  if(activeSlide > 0){
    activeSlide--;
  }else{
    activeSlide = totalVideos-1;
  }
  showVideos()
})

rightArrow.addEventListener('click',() => {
  if(activeSlide < (totalVideos-1)){
    activeSlide++;
  }else{
    activeSlide = 0;
  }
  showVideos()
})

 function getColor(vote){
    if(vote>=8){
        return 'green'
    }
    else if(vote>=5){
        return 'orange'
    } else{
        return 'red'
    }
 }

form.addEventListener('submit', (e) => {
       e.preventDefault();

       const searchTerm  = search.value;
       selectedGenre = [];
       setGenre();
       if(searchTerm){
            getMovies(searchUrl + '&query=' + searchTerm)
       } else{
            getMovies(API_URL)


       }

})

prev.addEventListener('click',() => {
    if(prevPage > 0){
        pageCall(prevPage);
    }
})

next.addEventListener('click',() => {
    if(nextPage <= totalPages){
        pageCall(nextPage);
    }
})

function pageCall(page){
    let urlsplit = lasturl.split('?');
    let queryparams = urlsplit[1].split('&');
    let key = queryparams[queryparams.length - 1].split('=');
    if(key[0]!= 'page'){
       let url = lasturl + '&page='+page
       getMovies(url);
    }else{
        key[1] = page.toString();
        let a = key.join('=');
        queryparams[queryparams.length - 1] = a;
        let b =queryparams.join('&');
        let url = urlsplit[0] + '?' + b
        getMovies(url);
    }

}
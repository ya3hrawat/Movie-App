const apiModule = (function() {

    async function getVideoKey(movieId) {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}//videos?language=en-US&api_key=858636566b5cff69c4bd8db91e2491d4`)
        const movieData = await response.json();
        const movieList = movieData.results;

        let trailerArray = [];
        //Sorting out trailer object
        movieList.forEach((movie) => {
            if(movie.type == "Trailer") {
                trailerArray.push(movie);
            }
        });
        return trailerArray[0].key;
    }  

    async function searchData(item) {
        const response = await fetch(`https://api.themoviedb.org/3/search/multi?query=${item}&api_key=858636566b5cff69c4bd8db91e2491d4`)
        const movieData = await response.json();
        const movieList = movieData.results;
    
        movieList.map((movieArray) => {
            if(movieArray.poster_path) {
                movieArray.poster_path = `https://image.tmdb.org/t/p/w500/${movieArray.poster_path}`;
            }
        })
        return movieList;
    }

    return {
        getVideoKey,
        searchData
    }
})();

const domModule = (function() {
    const containerAll = document.querySelector('.container-all');

    async function displayData(movie) {
        const outerBox = document.querySelector('.outer-box');
        outerBox.innerHTML = ``;
        //changing display from none to flex
        outerBox.style.display = "flex"

        let contentBox = document.createElement('div');
        contentBox.classList.add('content-box');
        let videoKey = await apiModule.getVideoKey(movie.id)
        // console.log(videoKey)
        let videoLink = `https://www.youtube.com/embed/${videoKey}`
        contentBox.innerHTML = `
        <div class="trailer-box">
                    <iframe src=${videoLink} frameborder="0"></iframe>
            </div>
            <div class="info-box">
                <div class="left-box">
                <h1 class="title">${movie.original_title ? movie.original_title : movie.original_name}</h1>
                    <p>${movie.overview}</p>
                </div>
                <div class="right-box">
                    <h2>Language: ${movie.original_language}</h2>
                    <h2>Release Date: ${movie.release_date}</h2>
                    <div class="critics"><i class='bx bxs-star'></i>${movie.vote_average}</div>
                </div>
            </div>
            <span class="contentBox-close"><i class='bx bxs-exit'></i></span>
        `
        outerBox.append(contentBox)
        
        const contentBoxCloseBtn = document.querySelector('.contentBox-close');
        contentBoxCloseBtn.addEventListener("click", () => {
            outerBox.style.display = "none"
            outerBox.innerHTML = ``;
        })
    }

    async function getCardMovie(card) {
        let movieId = parseInt(card.attributes[1].value);
        let movieName = card.attributes[2].value;

        movieList = await apiModule.searchData(movieName);

        movieList.forEach((movie) => {
            if(movie.id === movieId) {
                console.log(movieId)
                displayData(movie);
            }
        })
    }

    function appendCard(item) {
        let card = document.createElement('div');
        card.classList.add('card')
        card.innerHTML = `
            <div class="img-box">
                <img src=${item.poster_path} class="poster-img" alt="">
            </div> 
            <div class="desc">
                <p>${item.overview}</p>
            </div>
            <h2>${item.original_title ? item.original_title : item.original_name}</h2>`
        card.dataset.id = item.id;
        card.dataset.original_title = item.original_title;
        containerAll.append(card)

        card.addEventListener("click", () => {
            getCardMovie(card)
        })
    }

    return {
        appendCard
    }
})();

const searchModule = (function() {
    // searched value below
    let searchVal = localStorage.getItem('searchValue')
    searchVal = searchVal.replace(" ", "%20");

    const searchBar = document.querySelector('#search-box');

    searchBar.addEventListener('keypress', (event) => {
        if(event.key === 'Enter') {
            event.preventDefault();
            window.location.href = './search.html';
            const searchValue = searchBar.value;
            localStorage.setItem('searchValue', searchValue)
        }
    })

    async function getData() {
        const movieList = await apiModule.searchData(searchVal)
        
        movieList.forEach((movie) => {
            if(movie.poster_path) {
                domModule.appendCard(movie);
            }
        });
    }
    getData()

})();

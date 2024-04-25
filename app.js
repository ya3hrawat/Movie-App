const movieModule = (function(){

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

    async function getTrending() {
        const response = await fetch('https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=858636566b5cff69c4bd8db91e2491d4');
        const movieData = await response.json();
        const movieList = movieData.results;

        movieList.map((movieArray) => {
            movieArray.poster_path = `https://image.tmdb.org/t/p/w500/${movieArray.poster_path}`;
        })
        return movieList;
    }

    async function getMovie(type, filter) {
        const response = await fetch(`https://api.themoviedb.org/3/discover/${type}?${filter}&api_key=858636566b5cff69c4bd8db91e2491d4`);
        const movieData = await response.json();
        const movieList = movieData.results;

        movieList.map((movieArray) => {
            movieArray.poster_path = `https://image.tmdb.org/t/p/w500/${movieArray.poster_path}`;
        })
        return movieList;
    }

    return {
        getVideoKey,
        getTrending,
        getMovie,
        searchData
    }
})();

const domModule = (function(){
    const sliders = document.querySelectorAll('.slider');
    const leftBtns = document.querySelectorAll('.left-bg');
    const rightBtns = document.querySelectorAll('.right-bg');

    async function displayData(movie) {
        const outerBox = document.querySelector('.outer-box');
        outerBox.innerHTML = ``;
        //changing display from none to flex
        outerBox.style.display = "flex"

        let contentBox = document.createElement('div');
        contentBox.classList.add('content-box');
        let videoKey = await movieModule.getVideoKey(movie.id)
        // console.log(videoKey)
        let videoLink = `https://www.youtube.com/embed/${videoKey}`
        contentBox.innerHTML = `
        <div class="trailer-box">
                    <iframe width="700" height="350px" src=${videoLink} frameborder="0"></iframe>
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
        `;
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

        movieList = await movieModule.searchData(movieName);

        movieList.forEach((movie) => {
            if(movie.id === movieId) {
                console.log(movieId)
                displayData(movie);
            }
        })
    }

    function appendCard(item, sliderIndex) {
        let card = document.createElement('div');
        card.classList.add('card')
        card.innerHTML = `<div class="img-box">
        <img src=${item.poster_path} class="poster-img" alt=""> 
        <div class="desc"><p>${item.overview}</p></div>
        </div>
        <h2>${item.original_title ? item.original_title : item.original_name}</h2>`

        // adding values to dataset
        card.dataset.id = item.id;
        card.dataset.original_title = item.original_title

        sliders[sliderIndex].append(card);

        card.addEventListener("click", () => {
            getCardMovie(card)
        })
    }
    
    async function getTrendingArray() {
        const movieArray = await movieModule.getTrending();
        movieArray.forEach((movie) => {
            appendCard(movie, 0)
        });
    }
    getTrendingArray()

    async function getData(type, filter, sliderIndex) {
        const movieArray = await movieModule.getMovie(type, filter);
        movieArray.forEach((movie) => {
            appendCard(movie, sliderIndex);
        })
    }
    getData('movie', 'with_origin_country=IN', 1)
    getData('tv', 'sort_by=popularity.desc', 2)

    leftBtns.forEach((leftBtn, index) => {
        leftBtn.addEventListener('click', () => {
            scrollerModule.scrollLeft(index);
        })
    })

    rightBtns.forEach((rightBtn, index) => {
        rightBtn.addEventListener('click', () => {
            scrollerModule.scrollRight(index);
        })
    })

})();

const scrollerModule = (function() {
    const sliders = document.querySelectorAll('.slider');

    function scrollRight(sliderIndex) {
        console.log(window.innerWidth)
        sliders[sliderIndex].scrollBy({
            left: window.innerWidth,
            behavior: 'smooth'
        });
    }
    function scrollLeft(sliderIndex) {
        console.log(window.innerWidth)
        sliders[sliderIndex].scrollBy({
            left: -window.innerWidth,
            behavior: 'smooth'
        });
    }
    
    return {
        scrollLeft,
        scrollRight
    }
})();

const searchbarModule = (function() {
    const searchBar = document.querySelector('#search-box');

    searchBar.addEventListener('keypress', (event) => {
        if(event.key === 'Enter') {
            event.preventDefault();
            window.location.href = './search.html';
            const searchValue = searchBar.value;
            localStorage.setItem('searchValue', searchValue)
        }
    })
})();
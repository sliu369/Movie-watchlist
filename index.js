const movieList = document.querySelector('.movie-list')

let watchList = JSON.parse(localStorage.getItem("watchList")) || []
let currentMovies = []


document.addEventListener('click', function(e) {
    console.log(e.target)
    if (e.target.className === 'search-button'){
        console.log("search clicked")
        const movieName = document.querySelector('.search-input').value
        handleSearch(movieName)
    }
    else if (e.target.closest(".add")){
        console.log("add clicked")
        handleAdd(e.target.closest(".add").dataset.imdbid)
    }
})

function handleAdd (imdbid) {

    if (ifInWatchlist(imdbid)) {
        showNotification("This movie is already in your watchList!")
    }
    else{
        for (let movie of currentMovies){
            if (movie.imdbID === imdbid){
                watchList.push(movie)
                localStorage.setItem("watchList", JSON.stringify(watchList))
                showNotification(`"${movie.Title}" has been added to your watchlist!`)
                break;
            }
        }
    }

    
}

async function handleSearch (movieName) {
    console.log("start handle search")
    const response = await fetch(`/.netlify/functions/getAPI?query=${movieName}}`)
    const data = await response.json()
    
    if (data.Response === "False"){
        movieList.innerHTML = `<p class="error">Unable to find what you’re looking for. Please try another search.</p>`
    }
    else{
        currentMovies = await getDetailedMovies(data.Search)
        renderMovies(currentMovies)
    }
    
}

async function getDetailedMovies (movies) {
    console.log("processing movie: ", movies)
    let detailedMovies = []
    for (let movie of movies){
        const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}&plot=full`)
        const data = await response.json()
        detailedMovies.push(data)
    }
    return detailedMovies
}

function renderMovies (movies) {
    console.log("rendering movies")
    let result = ""
    for (let movie of movies){

        // safety check for missing rating
        if (!movie.Ratings[0]){
            movie.Ratings[0] = {Value: "N/A"}
        }

        result += `
            <div class="movie-item">
                <img 
                    class="poster" 
                    src="${movie.Poster}"
                    >
                <div class="movie-details">
                    <div class="movie-header">
                        <h2 class="movie-title">${movie.Title}</h2>
                        <img class="star-icon" src="./images/star.png" alt="star">
                        <p class="rating">${movie.Ratings[0].Value}</p>
                    </div>
                    <div class="movie-subheader">
                        <p class="movie-runtime">${movie.Runtime}</p>
                        <p class="movie-genre">${movie.Genre}</p>
                        <div class="add" data-imdbid="${movie.imdbID}">
                            <img class="add-icon" src="./images/add.png" alt="add">
                            <p>Watchlist</p>
                        </div>
                    </div>
                    <p class="movie-plot">${movie.Plot}<p>
                    </div>
                </div>
            </div>`
    }

    movieList.innerHTML = result
}

function showNotification(message, duration = 2000) {
  const notification = document.querySelector(".notification");
  notification.textContent = message;
  notification.classList.add("show");

  // Hide after duration
  setTimeout(() => {
    notification.classList.remove("show");
  }, duration);
}

function ifInWatchlist(imdbID) {
    return watchList.some(movie => movie.imdbID === imdbID)
}
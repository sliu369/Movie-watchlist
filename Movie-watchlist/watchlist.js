let watchList = JSON.parse(localStorage.getItem("watchList"))
renderWatchlist()

document.addEventListener('click', (e) => {
    if (e.target.closest(".delete")){
        console.log("delete clicked")
        handleDelete(e.target.closest(".delete").dataset.imdbid)
    }
})

function handleDelete(imdbid) {
    for(let i = 0; i < watchList.length; i++){
        if (watchList[i].imdbID === imdbid){
            showNotification(`${watchList[i].Title} has been removed from your watchlist!`)
            watchList.splice(i,1)
            localStorage.setItem("watchList", JSON.stringify(watchList))
            renderWatchlist()
            break
        }
    }
}

function renderWatchlist() {
    if (watchList.length === 0) {
        document.querySelector('.movie-list').innerHTML = `<p class="error">Your watchlist is looking a little empty... <a href="index.html">Add some movies!</a></p>`
    }
    else{
        let result = ""
        for (let movie of watchList){
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
                        <div class="delete" data-imdbid="${movie.imdbID}">
                            <img class="delete-icon" src="./images/delete.png" alt="delete">
                            <p>Delete</p>
                        </div>
                    </div>
                    <p class="movie-plot">${movie.Plot}<p>
                    </div>
                </div>
            </div>`
        }

        document.querySelector('.movie-list').innerHTML = result
    }
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
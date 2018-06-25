var offset = 0;
var favourites = []
if(localStorage.getItem("favs-list") !== null){
    favourites = JSON.parse(localStorage.getItem("favs-list"));
    refreshFavourites();
}
// var limit = 10;
// Adding shows to watchlist section

$(".fetch-shows").hide();

$("#add-to-watchlist").on("click", function(){
    var tvShow = $("#tv-show-search").val();
    var tvShowButton = $("<button>");
    tvShowButton.text(tvShow);
    tvShowButton.addClass("btn btn-outline-dark tv-show");
    tvShowButton.val(tvShow);
    $("#watch-list").append(tvShowButton);
    console.log(tvShow);
})

$(document.body).on("click", ".tv-show", loadShowdetails);
$(".fav-show").on("click", loadShowdetails);


$(document.body).on("click", ".giphy", function(){
    var state = $(this).attr("data-state");
      if (state === "still") {
        $(this).attr("src", $(this).attr("data-animate"));
        $(this).attr("data-state", "animate");
      } else {
        $(this).attr("src", $(this).attr("data-still"));
        $(this).attr("data-state", "still");
      }
});

function loadShowdetails(){
    $(".fetch-shows").show();

    $("#gifs").empty();
    offset = 0;
    console.log(this);
    console.log($(this).val());
    var tvShows = $(this).val();
    var omdbQueryURL = "https://www.omdbapi.com/?t=" + tvShows + "&y=&plot=short&apikey=trilogy";
    console.log(omdbQueryURL);
    $.ajax({
        url:omdbQueryURL,
        method: "GET",
    })
    .then(function(response){
        $("#poster").attr("src", response.Poster);
        $("#show-name").text(response.Title);
        $("#released").text(response.Released);
        $("#ratings").text(response.Ratings[0].Value);
        $("#genre").text(response.Genre);
        $("#summary").text(response.Plot);
        console.log(response);
    })
    loadGif(tvShows, offset);
    $(".loader").attr("show-name", tvShows);
    $("#add-to-fav").attr("show-name", tvShows);
}

function loadGif(tvShows, offset){
    var giphyQueryURL = "https://api.giphy.com/v1/gifs/search?q=" +
    tvShows + "&api_key=G2EkUPx72RFfmrob0qDTQHDi0KV2DBn7&limit=10&offset=" + offset;
    // $("#load-more").show();

    $.ajax({
        url: giphyQueryURL,
        method: "GET", 
    })
    .then(function(response){
        var results = response.data;
        for (var i=0; i< results.length; i++){
            var tvDiv = $("<div>");
            tvDiv.addClass("float-md-left gif-image");
            var p = $("<p>").text("Rating: " + results[i].rating);
            p.addClass("overlay");
            var dwn = $("<a>");
            dwn.attr("href", results[i].images.original.url);
            dwn.attr("download", "giphy.gif");
            dwn.attr("target", "blank");
            dwn.addClass("dwn-btn fa fa-download");
            var tvImage = $("<img>");
            tvImage.attr("data-state", "still");
            tvImage.attr("src", results[i].images.fixed_height_still.url);
            tvImage.attr("data-animate", results[i].images.fixed_height.url);
            tvImage.attr("data-still", results[i].images.fixed_height_still.url)
            tvImage.addClass("img-fluid giphy");
            tvDiv.append(p);
            tvDiv.append(dwn);
            tvDiv.append(tvImage);
            $("#gifs").prepend(tvDiv);

        }
    })

}

$(document.body).on("click", ".loader", function(){
    var tvShow = $(".loader").attr("show-name");
    console.log(".........");
    console.log(tvShow);
    offset += 10;
    loadGif(tvShow, offset);
});

$(document.body).on("click", "#add-to-fav", function(){
    event.preventDefault();
    var tvShow = $("#add-to-fav").attr("show-name");
    console.log(tvShow);
    favourites.push(tvShow);
    console.log(favourites);
    localStorage.setItem("favs-list", JSON.stringify(favourites));
    refreshFavourites();
});

function refreshFavourites (){
    var favItemsArray = JSON.parse(localStorage.getItem("favs-list"));
    $("#favs").empty();

    for(var i = 0; i < favItemsArray.length; i++){
        var favShowButton = $("<button>");
        favShowButton.text(favItemsArray[i]);
        favShowButton.addClass("btn btn-outline-dark fav-show");
        favShowButton.val(favItemsArray[i]);
        $("#favs").append(favShowButton);
    }
    
}

// Initial array of celebs
var celebs = ["Cristiano Ronaldo", "Wayne Rooney", "Tom Brady", "Kobe Bryant", "Usain Bolt", "Tom Cruise", "Eminem", "Micheal Jackson"];

// API KEY
var API_KEY = "vAKXLviQ1e5XAFKLqWhjiOqccWT1fJh8";

// baseURL
var baseURL = "https://api.giphy.com/v1/gifs/search?api_key=" + API_KEY;

// Boolean to check gif state
var isStill = true;

// Function for displaying buttons
function renderButtons() {

  $("#buttons-view").empty();

  for (var i = 0; i < celebs.length; i++) {

    var celebBtn = $("<button>");
    celebBtn.attr({
      id: 'btn_'+i,
      'data-name': celebs[i],
      class: 'celeb celeb-btn btn btn-warning'
    });
    celebBtn.text(celebs[i]);

    $("#buttons-view").append(celebBtn);
  }

}

// Function to get 10 GIFs when button is clicked
function displayGIFs(){

  // Clear the div
  $("#gifs-view").empty();

  // Get the 'data-name' attribute from the button clicked
  var celeb = $(this).attr('data-name');

  // AJAX Request
  $.ajax({
    url: baseURL + "&limit=10&q=" + encodeURI(celeb),
    method: 'GET',
  })
  .done(function(response) {
    console.log(response);
    
    var results = response.data;

    // Loops through the data array in response
    for(var i = 0; i < results.length; i++) {
      
      // Get gif rating
      var rating = results[i].rating;

      // Set img properties
      var img = $("<img>").attr("src", results[i].images.fixed_height_still.url);
      img.attr({
        'id': i,
        'gif-id': results[i].id,
        'gif-still': results[i].images.fixed_height_still.url,
        'gif-animate': results[i].images.fixed_height.url,
        'gif-state': 'still'
        });
      
      img.addClass('gif-img');
      img.css('display', 'inline');

      // Create a div to hold rating and img
      var gifItem = $("<div class='gif-item'>");

      // Append rating and img to giItem
      gifItem.append('<p> Rating: ' + rating + '</p>');
      gifItem.append(img);
      gifItem.css('display', 'inline');

      // Append gifItem to wrapper div
      $("#gifs-view").append(gifItem);

      isStill = true;
      
    }
  })

  .fail(function() {
    console.log("AJAX Request Errored Out");
  })

  .always(function() {
    console.log("AJAX Request Completed");
  });
  
}

// Function to switch gifs between still and animate states
function switchImg() {
  if (isStill === true) {
    var animatedURL = $(this).attr('gif-animate');
    $(this).attr({
      'gif-state': 'animate',
      'src': animatedURL
    });

    isStill = false;
  }
  else if (isStill === false) {
    var stillURL = $(this).attr('gif-still');
    $(this).attr({
      'gif-state': 'still',
      'src': stillURL
    });

    isStill = true;
  }
}

// Adding click event listeners to all elements with a class of "celeb-btn"
$(document).on("click", ".celeb-btn", displayGIFs);

// Adding click event listeners to all elements with a class of 'gif-img'
$(document).on('click', '.gif-img', switchImg);

$("#btn-add").on('click', function() {
  
  var input = $("#inputCeleb").val().trim();
  
  if (input === "") {
    alert("Please enter something before clicking Add");
    return;
  }
  else {
    celebs.push(input);

    $("#buttons-view").empty();
    $("#inputCeleb").val() = "";
    
    renderButtons();
  }
  
});

$("#btn-clear").on("click", function() {
  $("#gifs-view").empty();
});

// Calling the renderButtons function to display the initial list of buttons
renderButtons();

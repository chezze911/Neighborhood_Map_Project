
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    // var $nytHeaderElem = $('#nytimes-header');
    // var $nytElem = $('#nytimes-articles');
    var $instagramHeaderElem = $('#instagram-header');
    var $instagramElem = $('#rudr_instafeed');
    // var $flickrHeaderElem = $('flickr-header');
    // var $flickrElem = $('flickr-images');
    var $wuHeaderElem = $('#weather-underground-header');
    var $wuElem = $('#weather-underground-forecast');

    // clear out old data before new request
    $wikiElem.text("");
    // $nytElem.text("");
    $instagramElem.text("");
    // $flickrElem.text("");
    $wuElem.text("");


    // load streetview
    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var stateStr = $('#state').val();
    var address = streetStr + ', ' + cityStr + ', ' + stateStr;


    var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '';
    $body.append('<img class="bgimg" src = " ' + streetviewUrl + '">');


    // weather underground AJAX request goes here
    // append weather forecast for Mountain View, CA to wuElem, weather-underground-forecast
    // display error messsage if we cannot get JSON
    var weatherundergroundUrl = "http://api.wunderground.com/api/65646c8c86b0eefe/conditions/q/" + stateStr  + "/" + cityStr + ".json";

    $.getJSON(weatherundergroundUrl, function(data) {  
      
      $wuHeaderElem.text('The current weather in ' + cityStr + ', ' + stateStr + ':');
      info = data.current_observation;

      $wuElem.append('<ul>' + info.weather + '<br>' + ('<img src= " ' + info.icon_url + '" alt="weather Icon">') + '</ul>');
      $wuElem.append('<ul>' + Math.round(info.temp_f) + '°F' + ' / ' + Math.round(info.temp_c) + '°C</ul>');
      $wuElem.append('<ul> Humidity: ' +  info.relative_humidity + '</ul>');
    }).error(function(e){
        $wuHeaderElem.text("Sorry, weather underground could not be loaded. Please try again.");
    });


    // nytimes AJAX request

    // var nytimesUrl = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + cityStr + '&sort=newest&api-key=3bfc87ca82bb435fa1dd7b941c229aa6";

    // $.getJSON(nytimesUrl, function(data) {

    //     $nytHeaderElem.text('New York Times Article About ' + cityStr);

    //     articles = data.response.docs;

    //     for (var i=0; i < articles.length; i++) {
    //         var article = articles[i];
    //         $nytElem.append('<li class="article">'+'<a href="'+article.web_url+'">'+article.headline.main+'</a>'+'<p>' + article.snippet + '</p>'+'</li>');
    //     };

    // }).error(function(e){
    //     $nytHeaderElem.text('New York Times article could not be loaded');
    // });

    // instagram images AJAX request
    // source:  https://rudrastyh.com/api/instagram-with-pure-javascript.html
    var token = '179587194.551f369.ce100fd77ea748c19d88f1c55fdecb64',
    num_photos = 10, // maximum 20
    container = document.getElementById( 'rudr_instafeed' ), // it is our <ul id="rudr_instafeed">
    scrElement = document.createElement( 'script' );
 
    window.mishaProcessResult = function( data ) {
        for( x in data.data ){
            container.innerHTML += '<li><img src="' + data.data[x].images.low_resolution.url + '"></li>';
        }
    }
 
    scrElement.setAttribute( 'src', 'https://api.instagram.com/v1/users/self/media/recent?access_token=' + token + '&count=' + num_photos + '&callback=mishaProcessResult' );
    document.body.appendChild( scrElement );

    //Flickr AJAX request

    // var flickrUrl = "http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=9d25e28c8203f729d00a03bf45e803b0&tags=" + cityStr + stateStr + "&safe_search=1&per_page=20" + "&format=json&jsoncallback=?";
    // var src;
    // $.getJSON(flickrUrl, function(data){
    //     $.each(data.photos.photo, function(i,item){
    //         src = "http://farm"+ item.farm +".static.flickr.com/"+ item.server +"/"+ item.id +"_"+ item.secret +"_m.jpg";
    //         $("<img/>").attr("src", src).appendTo('#flickr-images');
    //         if ( i == 3 ) return false;
    //     });
    // }).error(function(e){
    //     $flickrHeaderElem.text('flickr images could not be loaded');
    //     });;

    
    // Wikipedia AJAX request
    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json&callback=wikiCallback';

    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("failed to get wikipedia resources");
    }, 8000);

    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        // jsonp: "callback",
        success: function(response) {
            var articleList = response[1];

            for (var i = 0; i < articleList.length; i++) {
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
            };

            clearTimeout(wikiRequestTimeout);
        }
    });
    return false;

}

$('#form-container').submit(loadData);

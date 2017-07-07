
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $wuHeaderElem = $('#weather-underground-header');
    var $wuElem = $('#weather-underground-forecast');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");
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
      $wuElem.append('<li> Weather: ' + info.weather + '<br>' + info.icon_url + '</li>');
      $wuElem.append('<li> Temperature: ' + info.temp_f + '°F' + ' / ' + info.temp_c + '°C</li>');
    }).error(function(e){
        $wuHeaderElem.text("Sorry, weather underground could not be loaded. Please try again.");
    });


    // nytimes AJAX request goes here

    var nytimesUrl = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + cityStr + '&sort=newest&api-key=3bfc87ca82bb435fa1dd7b941c229aa6";

    $.getJSON(nytimesUrl, function(data) {

        $nytHeaderElem.text('New York Times Article About ' + cityStr);

        articles = data.response.docs;

        for (var i=0; i < articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li class="article">'+'<a href="'+article.web_url+'">'+article.headline.main+'</a>'+'<p>' + article.snippet + '</p>'+'</li>');
        };

    }).error(function(e){
        $nytHeaderElem.text('New York Times article could not be loaded');
    });

    
    // Wikipedia AJAX request goes here
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

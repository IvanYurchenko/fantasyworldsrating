/**
 * Created by Ivan Yurchenko on 7/4/17.
 */
function httpGet(url, callback) {
    var request = new XMLHttpRequest();
    request.onload = function () {
        if (request.status == 200) {
            callback(request.response);
        } else {
            request.onerror()
        }
    }

    request.onerror = function () {
        console.log('Request failed ' + request.statusText);
        $('div.container').append('An error has occurred. Detailed info: '
            + request.statusText)
    }

    request.open('GET', url, true);
    request.send(null);
}

$(document).ready(function() {
    httpGet('https://api.fantasy-worlds.org/books', function (response) {
        var items = JSON.parse(response).items;
        var books = items.map(function (item) {
            var ratingStr = item[6];
            var book = {
                id: parseInt(item[0]),
                authorName: item[1],
                authorSurname: item[2],
                titleRu: item[3],
                titleEn: item[4],
                year: item[7],
                rating: parseFloat(ratingStr),
                peopleRated: parseInt(ratingStr.substr(ratingStr.indexOf('/') + 1))
            };

            return book;
        });

        books.sort(function (a, b) {
            return b.rating - a.rating || b.peopleRated - a.peopleRated;
        });

        var container = $('div.container');
        var div = $('<div></div>');
        for (var i = 0; i < books.length; i++) {
            var innerDiv = $('<div></div>');
            var a = $('<a></a>');
            a.attr('href', 'https://fantasy-worlds.org/lib/id' + books[i].id);
            a.text('(' + books[i].rating + '|' + books[i].peopleRated
                + 'ratings) ' + books[i].titleRu);
            innerDiv.append(a);
            div.append(innerDiv);
        }
        container.append(div);
    });
});
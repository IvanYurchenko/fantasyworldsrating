/**
 * Created by Ivan Yurchenko on 7/4/17.
 */
$(document).ready(function () {
    function httpGet(url, callback) {
        var request = new XMLHttpRequest();
        request.onload = function () {
            if (request.status == 200) {
                callback(request.response);
            } else {
                request.onerror();
            }
        }

        request.onerror = function () {
            console.log('Request failed ' + request.statusText);
            $('div.container').append('An error has occurred. Detailed info: '
                + request.statusText);
        }

        request.open('GET', url, true);
        request.send(null);
    }

    function showSpinner() {
        // Spinner configuration
        var opts = { lines: 13, length: 26, width: 12, radius: 36, scale: 0.5 };
        var target = document.getElementById('spinner');
        var spinner = new Spinner(opts).spin(target);

        return function() {
            spinner.stop();
        };
    }

    // Show spinner and store function that stops it
    var stopSpinner = showSpinner();

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
            const bRating = b.peopleRated > 0 ? Math.log2(b.peopleRated) * b.rating : 0;
            const aRating = a.peopleRated > 0 ? Math.log2(a.peopleRated) * a.rating : 0;
            const result = bRating - aRating;
            return result;
        });

        // Append all books to the document
        var container = $('div.container');
        var div = $('<div></div>');
        for (var i = 0; i < books.length; i++) {
            var book = books[i];
            var a = $('<a></a>');
            var innerDiv = $('<div></div>');
            a.attr('href', 'https://fantasy-worlds.org/lib/id' + book.id);
            
            var text = '(' + book.rating + '/10 от ' + book.peopleRated + ') ' + book.titleRu + ' - ' 
                   + book.authorName + ' ' + book.authorSurname;
            if(!!book.year) {
                text += ' [' + book.year + ']';
            }
            a.text(text);
            innerDiv.append(a);
            div.append(innerDiv);
        }
        container.append(div);

        // Stop the spinner
        stopSpinner();
    });
});

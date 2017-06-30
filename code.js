$(function () {

    function createCORSRequest(method, url) {
        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {
            // XHR has 'withCredentials' property only if it supports CORS
            xhr.open(method, url, true);
        } else if (typeof XDomainRequest != "undefined") { // if IE use XDR
            xhr = new XDomainRequest();
            xhr.open(method, url);
        } else {
            xhr = null;
        }
        return xhr;
    }

    function fillPage() {

        var books = [];
        var promises = [];

        function createRequestOnPage(number, resolve) {

            var request = createCORSRequest("get", "https://fantasy-worlds.org/lib/" + number);
            if (request) {
                request.onload = function () {
                    console.log('success');

                    var elements = $.makeArray($('div.news_footer > span > div', request.response));
                    var links = $.makeArray($('div.news_title > a', request.response));
                    //elements = [ "a", "b", "c", "d", "e" ];
                    books = books.concat(elements.map(function (el, index) {
                        var rating = parseFloat($(el).text().split(/\s+/)[1]);
                        var link = 'https://fantasy-worlds.org' + $(links[index]).attr('href');
                        var title = $(links[index]).text();
                        return {
                            rating: rating,
                            title: title,
                            link: link
                        };
                    }));
                    resolve();

                };
                // Send request
                request.send();
            }
        }

        for (var i = 1; i <= 1229; i++) {
            var promise = new Promise(function (resolve, reject) {
                createRequestOnPage(i, resolve);
            });
            promises.push(promise);
        }

        Promise.all(promises).then(function () {
            books.sort(function (a, b) {
                return b.rating - a.rating;
            });

            var container = $('div.container');
            var div = $('<div></div>');
            for (var i = 0; i < books.length; i++) {
                var innerDiv = $('<div></div>');
                var a = $('<a></a>');
                a.attr('href', books[i].link);
                a.text('(' + books[i].rating + ') ' + books[i].title);
                innerDiv.append(a);
                div.append(innerDiv);
            }
            container.append(div);
        });
    }

    fillPage();
    // $.ajax({
    //     url:"https://fantasy-worlds.org/lib/1",
    //     dataType: 'jsonp', // Notice! JSONP <-- P (lowercase)
    //     headers: {"Access-Control-Allow-Origin": "*"},
    //     success:function(json){
    //         // do stuff with json (in this case an array)
    //         alert("Success");
    //     },
    //     error:function(e){
    //         alert(e);
    //     }
    // });

    // $.get("https://fantasy-worlds.org/lib/1", function(data, status){
    //     alert("Data: " + data + "\nStatus: " + status);
    // });

    // var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
    // saveAs(blob, "hello world.txt");
});
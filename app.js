checkStream();

setInterval(function () {
    checkStream();
}, 10000);

function checkStream() {
    $.ajax({
        url: 'https://api.twitch.tv/helix/streams?user_login=froggedtv',
        method: 'GET',
        headers: {
            'Client-ID': '9eiompg6or8ukso45cd7yd7fapuhrw',
            'Accept': 'application/vnd.twitchtv.v5+json'
        }
    }).done(function (response) {
        if (response.data[0].type === 'live') {
            chrome.storage.sync.get('title', function (data) {
                if (typeof data.title === 'undefined') {
                    chrome.storage.sync.set({'title': response.data[0].title}, function (data) {
                        chrome.browserAction.setIcon({ path: "img/ftv-green.png" });
                        chrome.notifications.create('Live', {
                            type: 'basic',
                            iconUrl: 'img/ftv-green.png',
                            title: 'La FroggedTV est en live',
                            message: response.data[0].title,
                        });

                        chrome.notifications.clear('Live');

                        $('#type').html('En live');
                        $('#title').html(response.data[0].title);
                        $('#viewers-count').html(response.data[0].viewer_count + ' viewers');
                    })
                } else {
                    chrome.storage.onChanged.addListener(function (changes, namespace) {
                        for (var key in changes) {
                            if (key === 'title') {
                                chrome.storage.sync.set({'title': response.data[0].title}, function (data) {
                                    chrome.browserAction.setIcon({ path: "img/ftv-green.png" });
                                    chrome.notifications.create('Live', {
                                        type: 'basic',
                                        iconUrl: 'img/ftv-green.png',
                                        title: 'La FroggedTV est en live',
                                        message: response.data[0].title,
                                    });

                                    chrome.notifications.clear('Live');
                                });
                            }
                        }
                    });

                    $('#type').html('En live');
                    $('#title').html(response.data[0].title);
                    $('#viewers-count').html(response.data[0].viewer_count + ' viewers');
                }
            });
            chrome.notifications.clear('Live');
        } else {
            chrome.notifications.create('NoLive', {
                type: 'basic',
                iconUrl: 'img/ftv_red.jpeg',
                title: 'FroggedTV',
                message: 'La FroggedTV n\'est plus en live'
            });

            chrome.notifications.clear('NoLive');
        }
    });
}
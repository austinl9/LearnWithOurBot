const FACEBOOK_ACCESS_TOKEN = 'EAADNbvWjXEkBAKKNADN9abtlNDiY5jbwlwANCcVfHjGIrHqb4LzlfWPNouwolvMzPIZBSefr8udQkMZC33Fyt3PgDBa5DEhtZBA7SFWT00qyTZAarNrCLJBLC6sH7H2pYpa8bPAQ3bVeJaiuzOJVB5CEIUE21HU4tZAK5BSSG2wZDZD';
const DOGE_IMAGE_URL = 'https://upload.wikimedia.org/wikipedia/en/5/5f/Original_Doge_meme.jpg';
const watchYoutubeUrl = "https://www.youtube.com/watch?v=";

const request = require('request');
const YouTube = require('youtube-node');

var youTube = new YouTube();

youTube.setKey('AIzaSyCP0JVGJYBjDA0xtUBZHQihEQmSoeWBePs');

var youtubeReadModel;
var youtubeItemList;
var videoId = "";

//youtube templates
var l1Title;
var l1ImageUrl;
var l1VideoUrl;
var l2Title;
var l2ImageUrl;
var l2VideoUrl;

module.exports = (event) => {
    const senderId = event.sender.id;
    const message = event.message.text.replace("search", "");
    var data;
    console.log("here");
    youTube.search(message, 2, function (error, result) {
        if (error) {
            console.log(error);
        }
        else {
            data = JSON.stringify(result, null, 2);
            youtubeReadModel = JSON.parse(data);
            youtubeItemList = youtubeReadModel.items;
            for (var i = 0; i < youtubeItemList.length; i++) {
                var item = youtubeItemList[i];
                if (item.id.kind == "youtube#video") {
                    if (i == 0) {
                        l1Title = item.snippet.title;
                        l1ImageUrl = item.snippet.thumbnails.default.url;
                        l1ActionUrl = item.id.videoId
                        console.log(l1Title + " " + l1ImageUrl + " " + l1ActionUrl);
                    }
                    if (i == 1) {
                        l2Title = item.snippet.title;
                        l2ImageUrl = item.snippet.thumbnails.default.url;
                        l2ActionUrl = item.id.videoId;
                        console.log(l2Title + " " + l2ImageUrl + " " + l2ActionUrl);
                    }
                }
            }
            request({
                url: 'https://graph.facebook.com/v2.6/me/messages',
                qs: { access_token: FACEBOOK_ACCESS_TOKEN },
                method: 'POST',
                json: {
                    recipient: { id: senderId },
                    "message": {
                        "attachment": {
                            "type": "template",
                            "payload": {
                                "template_type": "list",
                                "elements": [
                                    {
                                        "title": l1Title,
                                        "image_url": l1ImageUrl,
                                        // "default_action": {
                                        //     "type": "web_url",
                                        //     "url": "https://diario.mx/Local/2017-01-05_f62a689b/sin-saber-vivio-casi-un-mes-entre-muertos/",
                                        //     "messenger_extensions": true,
                                        //     "webview_height_ratio": "tall",
                                        //     "fallback_url": "https://diario.mx/"
                                        // }
                                    },
                                    {
                                         "title": l2Title,
                                        "image_url": l2ImageUrl,
                                        // "default_action": {
                                        //     "type": "web_url",
                                        //     "url": "https://peterssendreceiveapp.ngrok.io/view?item=100",
                                        //     "messenger_extensions": true,
                                        //     "webview_height_ratio": "tall",
                                        //     "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
                                        // }
                                    }
                                ]
                            }
                        }
                    }
                }
            });
        }
    });


};
const fetch = require('node-fetch');
const entities = require("entities");
let accounts = [];

module.exports = class Greeting {
    constructor(username) {
        this.user = username;        
        this.traductor = {
            "Abonnements": "following",
            "Abonnés": "follower",
            " J'aime": "like"
        };
        this.object = {
                "user": {
                    "username": "No username was provided.",
                    "profilName": this.user,
                    "avatar": "No avatar was provided.",
                    "description": "No description provided.",
                    "certified": false
                },
                "stats": {
                    "following": 0,
                    "follower": 0,
                    "like": 0
                }
            };

    }

    callNumber(data, object) {
        const res = this.getNumber(data.split(object));
        return res;
    }

    getData(data) {
        const array = ["Abonnements", "Abonnés", " J'aime"];
        array.forEach(res => {
            this.getStats(data, res);
        });

        return true;
    }

    getStats(data, response) {
        const res = this.callNumber(data, `<strong title="${response}">`);
        this.object.stats[this.traductor[response]] = res;
        return true;
    }

    getNumber(data) {
        if (!data || !data[1]) return 0;
        const res = data[1].split("<")[0];
        return res;
    }

    entitiesDetect(data) {
        data = entities.decodeHTML(data);
        return data;
    }

    pushToArray(object){
        object.date = new Date().getTime();
        accounts.push(object);
    }

    getStats() {
        const _this = this;
        return new Promise(async resolve => {
            const d = new Date().getTime();
            if(accounts.find(r => r.user.profilName == _this.user && d - r.date <= 3600000)){
                resolve(accounts.find(r => r.user.profilName == _this.user))
            }
            if(accounts.find(r => r.user.profilName == _this.user && d - r.date > 3600000)){
                const page = accounts.findIndex(r => r.user.profilName == _this.user && d - r.date > 3600000);
                accounts.splice(page, 1);
            }

            const header = {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:86.0) Gecko/20100101 Firefox/86.0',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3',
                    'Accept-Encoding': 'gzip, deflate, br'
                }
            }

            let data = await fetch(`https://www.tiktok.com/@${_this.user}?lang=fr`, header);
            data = await data.text();
                if (!data || data == " " || data.includes("jsx-4111167561 title")) {
                    resolve({
                        "code": 404,
                        "error": "This account cannot be found."
                    });
                    return false;
                }
                if(data.includes(`<div class="app_icon"></div>
            <div class="verify-wrap">
                <div id="verify-ele"></div>
            </div>
`)){
                    resolve({
                        "code": 429,
                        "error": "The page cannot load."
                    });
                    return false;
                }

                _this.getData(data);

                let certified = data.indexOf(`<circle cx="24" cy="24" r="24" fill="#20D5EC"></circle>`);
                certified > -1 ? certified = true : certified = false;
                if (certified && certified == true) _this.object.user.certified = true;

                const description = _this.callNumber(data, `<h2 class="share-desc mt10">`);
                if (description && description != 0) _this.object.user.description = _this.entitiesDetect(description);

                const userName = _this.callNumber(data, `<h1 class="share-sub-title">`);
                if (userName && userName != 0) _this.object.user.username = _this.entitiesDetect(userName);
                
                let avatar = data.split(`<span class="tiktok-avatar tiktok-avatar-circle avatar jsx-3659161049" style="cursor:unset;width:116px;height:116px">`);
                if (avatar) {
                    if (certified && certified == true) {
                        avatar = avatar[1].split(`<`)[1].replace(`img alt="${_this.object.user.username} TikTok" src="`, "").replace(`"/>`, "").replace(/amp;/g, "");
                    } else {
                        avatar = avatar[1].split(`<`)[1].replace(`img alt="" src="`, "").replace(`"/>`, "").replace(/amp;/g, "");
                    }

                    _this.object.user.avatar = avatar;
                }

                _this.pushToArray(_this.object);

                resolve(_this.object);
            });
    }

}

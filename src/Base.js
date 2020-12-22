const puppeteer = require('puppeteer');

module.exports = class Greeting {
	constructor() {
    this.user = "pioupia_dev";
  }

  setUsername(value){
  	this.user = value;
    return this;
  }
	async getStats(){
  	return new Promise(async (resolve, reject) => {
		  const browser = await puppeteer.launch({args: ['--no-sandbox']});
		  const page = await browser.newPage();

		  await page.setViewport({
		  width: 1440,
		  height: 900,
		  deviceScaleFactor: 1,
		  });

		  await page.goto(`https://www.tiktok.com/@${this.user}?lang=fr`);
		  setTimeout(async () => {
		  	await page.evaluate(async () => {
		  	let profil;
		  	const number = document.getElementsByClassName("number");
		  	if(!number[0]){
		  		profil = {"code": 404, "error": "This account cannot be found"}
		  		return profil;
		  	}
		  	const abonnements = number[0].children[0].innerHTML;
		  	const abo = number[1].children[0].innerHTML;
		  	const likes = number[2].children[0].innerHTML;
		  	const certificate = document.getElementsByClassName("share-title")[0].classList[2] ? true : false;
		  	const name = document.getElementsByClassName("share-title")[0].innerText.replace(/ /g, "");
		  	const subName = document.getElementsByClassName("share-sub-title").innerHTML;
		  	const description = document.getElementsByClassName("share-desc")[0].innerHTML;
		  	const avatar_URL = document.getElementsByClassName("tiktok-avatar")[5].children[0].src;
		  	const videos = document.getElementsByClassName("video-feed-item") ? document.getElementsByClassName("video-feed-item").length : 0;
		  		profil = {
	                        'user':{
	                        'username': subName,
	                        'profileName': name,
	                        'avatar': avatar_URL,
	                        'description': description,
	                        'certified': certificate
	                        },
	                        'stats':{
	                          'following': parseInt(abonnements),
	                          'follower': parseInt(abo),
	                          'like': parseInt(likes),
	                          'videoCount': videos
	                        }
	                      }
		  	return profil;
		  	}).then(async profil => {
		  		resolve(profil)
		  		await browser.close();
		  	});
		  }, 1000)
    });
  }
}
# tiktok-stats

This package gives you the statistics of which user tiktok !

[![downloadsBadge](https://img.shields.io/npm/dt/tiktok-stats?style=for-the-badge)](https://npmjs.com/tiktok-stats)
[![versionBadge](https://img.shields.io/npm/v/tiktok-stats?style=for-the-badge)](https://npmjs.com/tiktok-stats)

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install tiktok-stats.

```bash
npm i tiktok-stats
```

## Usage

```javascript
const tiktokStats = require("tiktok-stats");
const stats = await new tiktokStats.Stats("account").getStats();
console.log(stats) // Return all accounts informations
```

## Return

Exemple of return :
```json
{
  "user": {
    "username": "Pioupia",
    "profileName": "pioupia_dev",
    "avatar": "https://p77-sign-sg.tiktokcdn.com/aweme/720x720/tos-alisg-avt-0068/f8ca5ba97d27cb3f90c02afc140bc7db.jpeg?x-expires=1605636000&x-signature=0awvFhUVv82Kj%2BZtDEG%2B8WKYAYw%3D",
    "description": "Développeur de site web & de bots Discord.",
    "certified": false
  },
  "stats": { "following": 2, "follower": 1, "like": 29, "videoCount": 3 }
}
```

If the user does not exist, package return :
```json
{
  "code": 404,
  "error": "This account cannot be found"
}
```

## Last patch

● **Patch of a launch bug under ubuntu.**

● **Sends statistics in string, now in int.**

● **Added the verified accounts and the number of user videos to the statistics.**

## Credits
Made by Pioupia with ❤️


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
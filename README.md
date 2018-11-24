## What is Lazy Slack?
Lazy Slack contains a programmer API for mass downloading and uploading Slack icons.

## How does Lazy Slack work?
I made this by reverse engineering how Slack uploads and downloads emojis via Chrome Dev Tools and Postman. In other words, this should be _highly unstable_.

## How do I run it?
```bash
npm install
```
Fill out `.env` with the appropriate variables.
```bash
npm run go
```
This script is configured download one page of emojis and then upload a single test emoji. After running the script for the first time, you should:
* see images in your `./images` directory.
* see a file called `emoji-list.json`.
* see a new emoji in your workspace with the name `nanners_1553058717`, or something close to it.


## What do I do with it?
Rather than building a comand line interface or anything like that, I left the implementation rather open ended. This is the API, and with it you can do pretty much whatever you want in your `main()` method. So, you know, go nanners.
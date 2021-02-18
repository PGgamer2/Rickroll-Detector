# [Rickroll Detector](https://pggamer2.github.io/Rickroll-Detector/)
Detect any Rickroll in some seconds!

*I had to Rickroll myself multiple times to make this*.

## Q&A

### What's a Rickroll?
Everybody knows what it is. There's also a [Wikipedia](https://wikipedia.org/wiki/Rickrolling) and a [Know Your Meme](https://knowyourmeme.com/memes/rickroll) article.

### It doesn't detect *this* link! Can you add it?
Sure. Report it in the issue tab or make a PR.

### How does it work?
It basically detects if the video's ID is inside a "blacklist" contained inside *rickrolls.json*. Then it checks if the video's author is between another blacklist and after that, if nothing has been detected, it checks if the video's description and title contain the word "rickroll".
Also, I added a "history" of previous rickrolls that have been detected by the user. These are stored using cookies.

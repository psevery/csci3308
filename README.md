# csci3308
Project for csci3308 


To install node js and node express on a mac:
	First install homebrew (if you are a mac user you should have this anyways, it is like ubuntu's apt)
	   ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
	Then install node and npm (node package manager which is nodes "apt")
	    brew install node
	To install node express (A beatiful, simple framework for node.js)
	    npm install express --save 
	Link to express info: http://expressjs.com/ 
	There ya have it! (If you are on ubuntu it is basically the same but you may need to mess with $PATH a bit, if you are on Windows, download and install an ubuntu partition =P)

The basic file layout as I have it (Feel free to change it to whatever makes more sense):
	app.js is the server. 
		I would think this is where we would store and perform most of our game's state and logic. 
	Public is the stuff stored on the browser. 
		Inside this is  our HTML files, Images (for pieces and stuff), and CSS stylesheet. 
	To start the app on local host cd into DoubleJump and run node app.js. Then open up your browser, go to 127.0.0.1:3000 



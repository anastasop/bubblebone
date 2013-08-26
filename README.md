
Bubblebone
==========

Bubblebone is a demo for backbone.js. A single page application written with backbone.js
maintains a set of lists of random numbers. It sorts each one of them with bubble sort
_(bubblesort + backbone.js = bubblebone)_, animates the sorting and resyncs the lists
 with the server. The backend is a simple node.js/express application.

To install bubblebone, assuming that node.js and npm are already installed, do once
```
git clone https://github.com/anastasop/bubblebone
cd bubblebone
npm install
```

To demo, start the server with `node server.js` and then open a browser to `http://localhost:8080`.
It is recommended to arrange the windows on screen so that both the browser and the server
console are visible, so that you can observe how backbone.js syncs with the server.

The application code is in the _app_ directory and contains some useful comments.

Enjoy!!

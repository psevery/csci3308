var express = require('express');

var app = express();


app.get('/easteregg', function (req, res) {
  res.send('Hidden page, so sick');
});

app.use(express.static('public'));
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

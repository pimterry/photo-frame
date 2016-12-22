const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Hello World!')
})

exports.start = function (port) {
    return new Promise((resolve, reject) => {
        app.listen(port, function () {
            console.log('Example app listening on port ' + port);
            resolve();            
        });
    });
}
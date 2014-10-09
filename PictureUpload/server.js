var express = require('express'),
    http = require('http'),
    path = require('path'),
    main = require('./main'),
    app = express();

app.use(express.logger("dev"));

app.use(express.bodyParser({
    uploadDir: __dirname + '/uploads',
    keepExtensions: true
}));

app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, './uploads')));

app.post('/images', main.addImage); 
app.get('/images', main.getImages); 

app.listen(5001, function () {
    console.log('Picture server listening on port 5001');
});

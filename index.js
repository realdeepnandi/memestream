const express = require('express');
var MongoClient = require('mongodb').MongoClient
const bodyParser = require("body-parser")
const path = require('path');
var uniqid = require("uniqid");
const generateUniqueId = require('generate-unique-id');
const app = express();


app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'pug')






//Routes
/////////////////////////////////////Homepage to display meme////////////////////////////////////////////////
app.get('/', function (req, res) {
    // res.sendFile('public/wall.html', { root: __dirname });
    MongoClient.connect('mongodb://localhost:27017/meme', { useUnifiedTopology: true }, function (err, client) {
        if (err) throw err

        const db = client.db('meme')
        const col = db.collection('data')
        // var arr;
        col.find({}).sort({ date: -1 }).limit(100).toArray(function (err, result) {
            if (err) throw err;
            var arr = result;
            res.render('display', { items: arr });
        });
    })
})
/////////////////////////////////////Homepage to display meme [ends]/////////////////////////////////////////





/////////////////////////////////////route for form//////////////////////////////////////////////////////////
app.get('/submit', function (req, res) {
    res.sendFile('public/submit.html', { root: __dirname });
})
////////////////////////////////////route for form [ends]///////////////////////////////////////////////////




/////////////////////////////////////////////////////meme endpoint (POST)////////////////////////////////////////
app.post('/meme', function (req, res) {
    var fetch = req.body;

    //DB Connection
    MongoClient.connect('mongodb://localhost:27017/meme', { useUnifiedTopology: true }, function (err, client) {
        if (err) throw err
        global.datat = 0;
        const db = client.db('meme')
        const col = db.collection('data')
        const uid = uniqid();
        fetch.id = uid;
        fetch.date = new Date(Date.now()).toISOString();
        col.insertOne(fetch, function (err, doc) {
            if (err) throw err;
            const id = { "id": fetch.id };
            res.json(id);
            // res.redirect('../')

        });
    })
})
/////////////////////////////////////////////meme endpoint (POST) [ends] ///////////////////////////////////////





/////////////////////////////////////////////meme endpoint (GET)////////////////////////////////////////////////
app.get('/meme', function (req, res) {
    MongoClient.connect('mongodb://localhost:27017/meme', { useUnifiedTopology: true }, function (err, client) {
        if (err) throw err

        const db = client.db('meme')
        const col = db.collection('data')
        col.find({}, { projection: { _id: 0, date: 0 } }).sort({ date: -1 }).limit(100).toArray(function (err, result) {
            if (err) throw err;
            var arr = result;
            res.json(arr);
        });
    })
})

/////////////////////////////////meme endpoint (GET) [ends]////////////////////////////////////////////////////




/////////////////////////////////////////////meme endpoint (GET)////////////////////////////////////////////////
app.get('/meme/:id/', function (req, res, err) {
    var par = req.params.id;
    MongoClient.connect('mongodb://localhost:27017/meme', { useUnifiedTopology: true }, function (err, client) {
        if (err) throw err

        const db = client.db('meme')
        const col = db.collection('data')
        col.find({ id: par }, { projection: { _id: 0, date: 0 } }).toArray(function (err, result) {
            if (err) throw err;
            var arr = result;
            if (arr.length == 1) { res.json(arr); }
            else {
                res.status(404);
                res.json({ "status": "404 Meme not found" });
            };
        });
    })


})
// app.listen(8012)
/////////////////////////////////meme endpoint (GET) [ends]////////////////////////////////////////////////////


app.listen(8081)
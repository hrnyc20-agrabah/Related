const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const port = process.env.PORT || 3006;

let app = express();

const db = new sqlite3.Database('./data.db', (err) => {
    if(err) console.log('Something went wrong with connecting to the db', err)
    console.log('connected to the db')
}); 

const router = express.Router();
app.use(router);
app.use(express.static(__dirname));
app.use(bodyParser.json());

router.get(`/buy/:title/related/firstEight`, (req, res)=> {
    const title = req.params.title
    db.all(`select * from element where category = (select category from element where title = "${title}") LIMIT 8`, (err, data)=>{
        if(err) console.log('Something went wrong with getting 8 related items [/related/first8] @ server.js',err)

        res.json(data).status(200) 
        console.log('first 8 related items successfully found');
    })
})

router.get(`/buy/:title/related/all`, (req, res)=> {
    const title = req.params.title;
    db.all(`select * from element where category = (select category from element where title = "${title}")`, (err, data)=>{
        if(err) console.log('Something went wrong with getting all related items [/related/all] @ server.js',err)

        res.json(data).status(200)
        console.log('all related items successfully found');
    })
})

router.get(`/buy/:title/like_item`, (req, res) => {
    const title = req.params.title;
    db.get(`insert into  liked_elements (element_id) select id from element where title = "${title}"`, (err, data) => {
        if(err) console.log('Something went wrong with LIKE [router.get/like_item @ server.js]', err)

        res.send('Liked! Yay ^^').status(201);
    })
})

router.get(`/buy/:title/unlike_item`, (req, res) => {
    const title = req.params.title;
    db.all(`delete from liked_elements where (select id from element where title = "${title}")`, (err, data) => {
        if(err) console.log('Something went wrong with UNLIKE [router.js @ /ulike_item]', err)
        res.send('Unliked! Bummer >_<').status(200)
    })
})

router.get(`/buy/:title/save_item`, (req, res) => {
    const title = req.params.title;
    db.get(`insert into  saved_elements (element_id) select id from element where title = "${title}"`, (err, data) => {
        if(err) console.log('Something went wrong with SAVE [router.get/save_item @ server.js]', err)
        res.send('Saved! Yay ^^').status(201)
    })
})

router.get(`/buy/:title/delete_item`, (req, res) => {
    const title = req.params.title;
    db.all(`delete from saved_elements where (select id from element where title = "${title}")`, (err, data) => {
        if(err) console.log('Something went wrong with DELETE [router.js @ /Delete_item]', err)
        res.send('Deleted...! Bummer >_<').status(200)
    })
})


app.listen(port, function () {
  console.log(`listening on port ${port}`);
});
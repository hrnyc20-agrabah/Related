const express = require('express');
const bodyParser = require('body-parser');

let app = express();

app.use(express.static(__dirname))
app.use(bodyParser.json())

app.get('/', (req, res)=> {
    
})

const port = 3006; 

app.listen(port, function () {
  console.log(`listening on port ${port}`);
});
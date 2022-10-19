
const express = require('express');
const path = require ('path');


const port =  process.env.PORT || 8080;
const app = express();




app.use(express.static(__dirname))

app.get('*', (req, res) => {
    if (req.path.endsWith('bundle.js')) {
        res.sendFile(path.resolve(__dirname, './docs/bundle.js'));
    } else {
        res.sendFile(path.resolve(__dirname, './docs/index.html'));
    }
    
    //res.sendFile(path.resolve(__dirname, './docs/index.html'));
    

  
});

app.listen(port);
console.log('Server started');
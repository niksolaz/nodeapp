const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const giocatori = require('./dataTest.json');
const players = require('./data.json');
const fetch = require("node-fetch");
const path = require('path');
const url = require('url');

const header = {'Content-Type': 'text/html'};

const send = (source, destination, status = 200, headers = header) => {
    destination.writeHead(status,headers);
    fs.createReadStream(source).pipe(destination);
};

const template = fs.readFileSync('index.ejs').toString();

const template2 = fs.readFileSync('link1.ejs').toString();


const utente = giocatori;
const player = JSON.parse(JSON.stringify(players));

fetch('https://jsonplaceholder.typicode.com/posts')
.then(response => response.json())
.then(json => {
    const readDataFileJson = fs.readFileSync('data.json').toString();
    //const buf = Buffer.from(JSON.stringify(json));
    if(readDataFileJson.includes(JSON.stringify(json))) {
        return;
    } else {
        fs.writeFileSync('data.json',JSON.stringify(json));
    }
})

const dataTemplate2 = fs.readFileSync('data.json').toString();
const buf = Buffer.from(dataTemplate2);

const server = http.createServer((req,res) => {
    var pathname = url.parse(req.url).pathname;
    var ext = path.extname(pathname);
    console.log(pathname);
    if(ext){
        if(ext === '.css'){
            res.writeHead(200, {'Content-Type': 'text/css'});
        }
        else if(ext === '.js'){
            res.writeHead(200, {'Content-Type': 'text/javascript'});
        }
        res.write(fs.readFileSync(__dirname + pathname, 'utf8'));
    } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        const urlRoot = req.url;
        const output = ejs.render(template, {utente});
        const output_player = ejs.render(template2, {player})
        
        if (urlRoot === '/' || /^\/index\/?$/.test(urlRoot)) {
            res.end(output);
        } else if (/^\/link1\/?$/.test(urlRoot)) {
            if(buf.includes(dataTemplate2)) {
                res.end(output_player);
            } else {
                return;
            }
        }  else if (/^\/link2\/?$/.test(urlRoot)) {
            return send('link2.ejs',res);
        } else {
            return send('404.ejs', res, 404, {});
        }
    }
    res.end();
}) 
    /*
    const url = req.url;
    const output = ejs.render(template, {utente});
    const output_player = ejs.render(template2, {player})
    
    if (url === '/' || /^\/index\/?$/.test(url)) {
        res.end(output);
    } else if (/^\/link1\/?$/.test(url)) {
        if(buf.includes(dataTemplate2)) {
            res.end(output_player);
        } else {
            return;
        }
    }  else if (/^\/link2\/?$/.test(url)) {
        return send('link2.ejs',res);
    } else {
        return send('404.ejs', res, 404, {});
    }
*/


const callback = () => {
    const address = server.address().address;
    const port = server.address().port;
    console.log(`
    Server avviato all'indirizzo http://${address}:${port}
    `);
}

server.listen(
    8000,
    'localhost',
    callback
)

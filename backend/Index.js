function doGet(e) { return Sheetbase.HTTP.get(e) }
function doPost(e) { return Sheetbase.HTTP.post(e) }

// Init Sheetbase, see config at Config.ts
var app = Sheetbase.initialize(SHEETBASE_CONFIG());



app.get('/', function (req, res) {
    return res.html(
        '<h1>Sheetbase Starter Backend</h1>'+
        '<p>Homepage: <a href="https://sheetbase.net">https://sheetbase.net</a></p>'+
        '<p>Docs: <a href="https://sheetbase.net/docs">https://sheetbase.net/docs</a></p>'
    );
});

app.post('/', function (req, res) {
    return res.standard({
    'title': 'Sheetbase Starter Backend',
    'homepage': 'https://sheetbase.net',
    'docs': 'https://sheetbase.net/docs'
    });
});
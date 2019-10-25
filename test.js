const GoogleSpreadsheet = require('google-spreadsheet');
const { promisify } = require('util');
const tokens = require('./access.json');


var express        =        require("express");
var bodyParser     =        require("body-parser");
var test           =        express();
test.use(bodyParser.urlencoded({ extended: false }));
test.use(bodyParser.json());

test.use('/', express.static('files'));


async function read(pfname, pfemail, pfphone, pfuniversity, pffaculty, pfgraduationYear, pfworkshop){
    const sheet = new GoogleSpreadsheet('1UCADbfkgWLT2ZkVkYqtECNGeD32_5yWuCdZJ2jsKCEI');
    await promisify(sheet.useServiceAccountAuth)(tokens);
    const data = await promisify(sheet.getInfo)();
    const doc = data.worksheets[0];
    console.log(`name: ${doc.title}, Rows: ${doc.rowCount}`);


    const row = {
        studentname: pfname,
        email: pfemail,
        mobilenumber: pfphone,
        University: pfuniversity,
        Faculty: pffaculty,
        GradYear: pfgraduationYear,
        WorkShop: pfworkshop
    }

    await promisify(doc.addRow)(row);
}
test.post('/reg',function(req,res){
    var user_name = req.body.pfname;
    if(user_name == null){
      res.end("must enter username");
      return;
    }
    if(user_name.length < 4)
    {
      res.end("username length must be 4 chars or more");
      return;
    }

    // lol ana zh2t mesh h3mel checks

    read(req.body.pfname, req.body.pfemail, req.body.pfphone, req.body.pfuniversity, req.body.pffaculty, req.body.pfgraduationYear, req.body.pfworkshop);
    res.end("Done");
});

test.listen(3000,function(){
  console.log("Started on PORT 3000");
})
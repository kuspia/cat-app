const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors')
const app = express();
app.use(cors())
const path = require('path')
const buildPath = path.join(__dirname, '..', 'build');
app.use(express.static(buildPath));

const buildPath1 = path.join(__dirname);
app.use(express.static(buildPath1));

const bodyparser = require("body-parser")
app.use(bodyparser.urlencoded({extended:false}))

app.use(express.json())

const DB = "mongodb+srv://kuspia:kushagra@cluster0.a7rq8.mongodb.net/rohit?retryWrites=true&w=majority";


mongoose.connect(DB)
	.then(() => {
		console.log("Connection successfull");
	})	
	.catch((err) => console.log(err));



const schema = mongoose.Schema({
    title: { type: String },
    content: { type: String}
})
const model = mongoose.model("note", schema)


async function add( tit , con ) { 
	try {
		let doc = {
			title: tit,
			content: con 
		}
        let ResDoc = new model(doc)
        await ResDoc.save()
		return 1 ;

    } catch (err) {
    
        console.log(err.message || err)
		return 0 ;

    } 
}

function del( tit , con ) { 
model.deleteOne({ title: tit , content: con  }).then(function(){
    return 1 ;

}).catch(function(error){
    console.log(error); 
	return 0 ;
});
}

app.post("/delit" ,  (req , res) =>{
	tits = req.body.tit ; 
	cons = req.body.con ;

del( tits , cons) ;
res.send(200)
} )
app.post("/addit" ,  (req , res) =>{
	tits = req.body.tit ; 
	cons = req.body.con ;
add( tits , cons) ;
res.send(200)
})


app.get("/getall", async (req, res) => {
	try {
        let doc =await model.find({
            title:{$regex:".*", $options:"i"},
            content: { $regex: ".*" , $options: "i" }
        })

        res.send(Object.assign(doc,{key:doc._id}))
	} catch (err) {
        res.status(400).send(err.message)
    }
});


app.get("/", (req, res) => {
	res.send("Hello world from servers");

});

app.get('/healthcheck', (req, res) => {
	res.status(200).send('OK');
});

app.get('/ping', (req, res) => {
	ipAddresses = req.headers['x-forwarded-for'] || req.connection.remoteAddress
	console.log("WakeUP <--", ipAddresses) 
	res.sendStatus(200);
});

// Danger ZONEEEEEEEEEEE  <><<Meant to be used during productions>><>
app.get("/dropme524626t22525dsgste5rwt45rtseszq5q3qtaegsgs", (req, res) => {
	model.collection.drop();
	   res.send("Erased");
   });  

   //////////////////////////////////////////////////////////////////////////////////////////////////////////////


   const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log("Server started on port 5000");
});


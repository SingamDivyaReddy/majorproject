let mongoose=require("mongoose");
let initData=require("./data.js");
let Listings=require("../Models/listing.js");

main().then(()=>{
    console.log("Connected to db");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Wonderlust');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

let initDb=(async()=>{
    await Listings.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner: "67fb550622e650ea0189a28b" }));
    await Listings.insertMany(initData.data);
    console.log("Data")
})
initDb();
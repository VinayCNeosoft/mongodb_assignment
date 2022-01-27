const express=require('express');
const mongoose=require('mongoose');

const PORT=8899;
const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.set('view engine','ejs')

//RegEx
const RegForName = /^[a-zA-Z ]{2,100}$/;
const RegForEmail = RegExp('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.com$')
const RegForCity = /^[a-zA-Z ]{2,100}$/;


//db connection
const db="mongodb://localhost:27017/mongocrud";
const connectDB=async()=>{
    try{
      await mongoose.connect(db,{useNewUrlParser:true});
      console.log("MongoDb Connected");
    }
    catch(err){
      console.log(err.message);
    }
  }
  connectDB();
//end
const catModel=require('./db/categorySchema');

//routes / ejs
app.get("/",(req,res)=>{
    catModel.find({},(err,data)=>{
        if(err) throw err;
        res.render('table',({user:data}))
    })
})

//get register ejs
app.get('/register',(req,res)=>{
    const error = {name:'',email:'',age:'',city:''};
    res.render("register",({error:error}))
})

//post register
app.post("/insert_register",(req,res)=>{
    const error = {name:'',email:'',age:'',city:''};
    error.name=RegForName.test(req.body.name)?'':'* Please Enter Valid Name'
    error.email=RegForEmail.test(req.body.email)?'':'* Please enter valid email. e.g. :- abc@gmail.com'
    error.age=(req.body.age >= 18 && req.body.age < 100)?'':'* Age must me greater than 18 '
    error.city=RegForCity.test(req.body.city)?'':'* Plane Enter Valid City name'

    //insert data
    if(error.name!=='' || error.email!=='' || error.age!=='' ||error.city!==''){
        res.render('register',({error:error}))
        console.log(error)
    }
    else{
        let ins=new catModel({name:req.body.name,email:req.body.email,age:req.body.age,city:req.body.city});
        ins.save((err)=>{
            if(err){ res.send("Already Added")}
            else{
            res.redirect('/')
            }
        })
    }
})

app.get("/delete/:email",(req,res)=>{
    let id=req.params.email;
    catModel.deleteOne({email:id},(err)=>{
        if(err) throw err
        res.redirect('/')
    })
})

app.get("/update/:email",(req,res)=>{
    console.log("Update Get")
    const error = {name:'',email:'',age:'',city:''};
    catModel.find({email:req.params.email},(err,data)=>{
        if(err) throw err;
        // res.send(data)
        res.render('updateData',({error:error,user:data[0]}))
    })
})

app.post("/update/:email",(req,res)=>{
    let name=req.body.name;
    let email=req.body.email;
    let age=req.body.age;
    let city=req.body.city;
    const error = {name:'',email:'',age:'',city:''};
    error.name=RegForName.test(name)?'':'* Please Enter Valid Name'
    error.email=RegForEmail.test(email)?'':'* Please enter valid email. e.g. :- abc@gmail.com'
    error.age=(age >= 18 &&age < 100)?'':'* Age must me greater than 18 '
    error.city=RegForCity.test(city)?'':'* Plane Enter Valid City name'

    if(error.name!=='' || error.email!=='' || error.age!=='' ||error.city!==''){
        res.render('register',({error:error}))
        console.log(error)
    }
    else{
        catModel.updateOne({email:email},{$set:{name:name,email:email,age:age,city:city}},(err)=>{
            if(err) throw err;
            else {
                // res.end("Category Updated");
                res.redirect('/')
            }
        })
    }
})


app.listen(PORT,(err)=>{
    if(err) throw err;
    console.log(`Work on ${PORT}`)
})



/* app.delete("/delcategory/:id",(req,res)=>{
    let id=req.params.id;
    catModel.deleteOne({_id:id},(err)=>{
        if(err) throw err
        res.send("Category Deleted")
    })
}) */
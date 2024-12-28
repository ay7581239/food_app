import express from "express"
const app=express();
import logger from "./logger.js";
import morgan from "morgan";
app.use(express.json())


const morganFormat = ":method :url :status :response-time ms";
 
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

const PORT=3000;
let fooddata=[];
let index=1;

//post
app.post('/food',(req,res)=>{
    const {name,price}=req.body
    const newfood={id:index++,name,price}
    fooddata.push(newfood)
    res.status(201).send(newfood)
})
// get all data
app.get('/food',(req,res)=>{
    res.status(200).send(fooddata);
})

// get specific id data
app.get('/food/:id',(req,res)=>{
    const fooditem=fooddata.find(t=>t.id===parseInt(req.params.id));
    if(fooditem){
        res.status(200).send(fooditem);
    }
    else
    res.status(404).send("food not found");
})

// update food
app.put('/food/:id',(req,res)=>{
    const fooditem=fooddata.find(t=>t.id===parseInt(req.params.id));
    if(fooditem){
        const {name,price}=req.body;
        fooditem.name=name;
        fooditem.price=price;
        res.status(201).send(fooditem);
    }
    else
    res.status(404).send("food not found");
})

// delete
app.delete('/food/:id',(req,res)=>{
    const ind=fooddata.findIndex(t=>t.id===parseInt(req.params.id));
    if(ind!=-1){
        fooddata.splice(ind, 1);
        res.status(204).send('deleted');
    }
    else
    res.status(404).send("food not found");
})

app.listen(PORT,()=>{
    console.log(`server started at port: ${PORT}`);
})
const express = require('express')
var cors = require('cors');
const {createInvoice} = require("./commen/createPDF");
const path=require(`path`)
const multer  = require('multer');
const { v4: uuidv4 } = require('uuid');
const connectDB = require('./DataBase/connectDB')
const { userRouter, postRouter } = require('./router/allRouter');
const sendEmail = require('./commen/email');
const userModel = require('./DataBase/model/user.model');

require('dotenv').config()
const app = express()
const port = process.env.port
require('dotenv').config()

app.use(express.json())
// app.use(`/uploadImages`,express.static(path.join(__dirname , "uploadImages")))
app.use('/uploadImages',express.static(path.join(__dirname , 'uploadImages')))

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploadImages')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    console.log(uniqueSuffix);
      cb(null,uuidv4()+"_shady_" +uniqueSuffix+file.originalname )
    }
  })
  function fileFilter (req, file, cb) {

    if(file){
        cb(null, true)
    }else{
        cb(`sorry invalid extention`, false)
    }

  }
  const upload = multer({ dest:'uploadImages',fileFilter,storage });


  app.use(upload.array(`image`,2))

app.get('/', (req, res) => res.send('Hello World!'))
// var corsOptions = {
//     origin: 'http://localhost:4200/',
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
//   }
app.use(cors());

app.use(userRouter,postRouter);


const invoice = {
  shipping: {
    name: "John Doe",
    address: "1234 Main Street",
    city: "San Francisco",
    state: "CA",
    country: "US",
    postal_code: 94111
  },
  items: [
    {
      item: "TC 100",
      description: "Toner Cartridge",
      quantity: 2,
      amount: 6000
    },
    {
      item: "USB_EXT",
      description: "USB Cable Extender",
      quantity: 1,
      amount: 2000
    }
  ],
  subtotal: 8000,
  paid: 0,
  invoice_nr: 1234
};
app.get(`/pdf`,async (req,res)=>{
    const invoice=await userModel.findOne({confirmed:true}).select(`-password`)
     
    const myPath=path.join(__dirname ,'./pdf' )
    createInvoice(invoice,myPath+"/one.pdf")
    await sendEmail(`chemist.mohammedkhamis@gmail.com`,`<p>plz find attachment</p>`,[{
        fileNmae:`/one.pdf`,
        path:myPath+"/one.pdf",
        contentType:`application/pdf`
    }])
    res.end()
})
createInvoice(invoice, "invoice.pdf");
connectDB()
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
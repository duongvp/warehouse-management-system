require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();
const nanoid = require("nanoid");


const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const unitRoutes = require('./routes/unit.routes');
const productRoutes = require('./routes/product.routes');
const supplierRoutes = require('./routes/supplier.routes');
const receiptRoutes = require('./routes/warehouseReceipt.routes');
const deliveryRoutes = require('./routes/warehouseDelivery.routes');
const customerRoutes = require('./routes/customer.routes');
const categoryRoutes = require('./routes/category.routes');
const roleRoutes = require('./routes/role.routes');
const permissionRoutes =  require('./routes/permission.routes');
const webScrapingRoutes = require('./routes/webscraping.routes');
const warehouseRoutes = require('./routes/warehouse.routes');
const reportRoutes = require('./routes/report.routes');
const inspectionRoutes = require('./routes/warehouseInspection.routes');
const Category = require('./model/Category');
const Product = require('./model/Product');
const Warehouse = require('./model/Warehouse');
const Permission = require('./model/Permission');
const Role = require('./model/Role');

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

app.use(express.json({ extended: false }));

// Connect Database
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => console.log(`***mongodb connected`))
  .catch(err => console.log(err));


  // const generateID = () => {
  //  return 'SP' + nanoid(5)
  // }
  // const arr = [];
  // let id ="";
  // for(let i =0;i<10;i++) {
  //   id = generateID();
  //   arr.push({
  //     _id: id,
  //     name: "Innisfree Perfect UV",
  //     image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1u2XYPygr_t5Y6mZvITLNf5mm07G-ovdfJRSoM43sVNxy5KlXzc2Z6YEHI2sWG1dsmLk&usqp=CAU",
  //     status: true,
  //     importPrice: 45000,
  //     costPrice: 50000,
  //     unitId: "DVT12rewf",
  //     categoryId: "DM12345",
  //     warehouse: [{
  //       warehouseId: "KHO12345",
  //       instock: 30,
  //     },
  //     {
  //       warehouseId: "KHO67890",
  //       instock: 10,
  //     },
  //     {
  //       warehouseId: "KHO23111",
  //     }]
  //   })
  // }
  // Product.insertMany(arr);
  // Category.insertMany([{
  //   _id: "DM12345",
  //   name:"Mỹ phẩm"
  // }]);
  // Customer.insertMany([{
  //   _id: "KH12345",
  //   name:"Anh Quân",
  //   phone:"09381313",
  //   email: "quan@gmail.com",
  //   address: "Hà Nội"
  // }]);
  // Warehouse.insertMany([{
  //   _id: "KHO67890",
  //   name:"Kho Móng Cái",
  //   phone:"0682349081",
  //   email: "KML@gmail.com",
  //   address: "TP Quảng Ninh"
  // },
  // {
  //   _id: "KHO23111",
  //   name:"Kho Hải Phòng",
  //   phone:"0987347612",
  //   email: "KHP@gmail.com",
  //   address: "Tp Hải Phòng"
  // }]);

//   Permission.insertMany([{
//     name:"viewRole",
//     parentName:"role",
//     parentDescription: "Quản lý vai trò thành viên",
//     description: "Danh sách vai trò"
// },
// {
//     name:"createRole",
//     parentName:"role",
//     parentDescription: "Quản lý vai trò thành viên",
//     description: "Thêm vai trò"
// },
// {
//   name:"editRole",
//   parentName:"role",
//   parentDescription: "Quản lý vai trò thành viên",
//   description: "Chỉnh sửa thông tin"
// },
// {
// name:"deleteRole",
// parentName:"role",
// parentDescription: "Quản lý vai trò thành viên",
// description: "Xóa vai trò thành viên"
// }
// ]);
// Role.insertMany([{
//     name:"admin1",
//     description:"",
//     permissions: ['6465cba9cc87810bd4d21e9b','6465cca87da5c62070a42879']
//   }]);
  


app.use(cors());
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/unit', unitRoutes);
app.use('/api/product', productRoutes);
app.use('/api/supplier', supplierRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/role', roleRoutes);
app.use('/api/permission', permissionRoutes);
app.use('/api/warehouse', warehouseRoutes);
app.use('/api/warehouseReceipt', receiptRoutes);
app.use('/api/warehouseInspection', inspectionRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/warehouseDelivery', deliveryRoutes);
app.use('/webs/item', webScrapingRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(process.env.PORT, () =>
  console.log(`server running on port ${process.env.PORT}`)
);

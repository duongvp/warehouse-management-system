const express = require('express');
const router = express.Router();

const Warehouse = require('../model/Warehouse');
const Product = require('../model/Product');

router.get("/get", async (req, res) => {
    let name = req.query.name;
    const fillter = { name: { $regex: name, $options: 'i' } }
    const data = await Warehouse.find(name ? fillter : {});
    res.json(data)
})


router.get("/detail/:id", async (req, res) => {
    let _id = req.params.id
    const data = await Warehouse.find({ _id });
    res.json(...data)
})

router.post("/create", async (req, res) => {
    const params = req.body;
    const newUnit = new Warehouse(params)
    const data = await newUnit.save();
    await Product.updateMany({}, { $addToSet: { warehouse: { warehouseId: data._id, instock: 0 } } }, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Field updated in all documents");
        }
    });
    res.send(data);
})

router.put("/edit/:id", async (req, res) => {
    try {
        const body = req.body;
        const updateData = await Warehouse.findOneAndUpdate({ _id: req.params.id }, {
            name: body.name,
            email: body.email,
            phone: body.phone,
            address: body.address
        }, {
            returnOriginal: false
        })
        res.status(200).json(updateData)
    } catch (error) {
        console.log(error);
        res.status(403).json(error)
    }
})

router.delete("/delete/:id", async (req, res) => {
    const params = req.params;
    Warehouse.findOneAndDelete({ _id: params.id }, function (error) {
        if (error) {
            // handle error
            res.status(403).send(error);
        } else {
            // document successfully removed
            res.status(200).send('Xóa thành công!')
        }
    });
})

module.exports = router;
const express = require('express');
const router = express.Router();

const Supplier = require('../model/Supplier');

router.get("/get", async (req, res) => {
    let name = req.query.name;
    let phone = req.query.phone
    const fillter = { name: { $regex: name, $options: 'i' }, phone: { $regex: phone, $options: 'i' } }
    const data = await Supplier.find((name || phone) ? fillter : {});
    res.json(data)
})

router.get("/detail/:id", async (req, res) => {
    let _id = req.params.id
    const data = await Supplier.find({ _id });
    res.json(...data)
})

router.post("/create", async (req, res) => {
    const params = req.body;
    const newUnit = new Supplier(params)
    const data = newUnit.save();
    res.send(data);
})

router.put("/edit/:id", async (req, res) => {
    try {
        const params = req.params;
        const body = req.body
        const updateData = await Supplier.findOneAndUpdate({ _id: params.id },
            {
                name: body.name,
                email: body.email,
                phone: body.phone,
                address: body.address
            }
            ,
            {
                returnOriginal: false
            })
        res.status(200).json(updateData)
    } catch (error) {
        res.status(403).json(error)
    }
})

router.delete("/delete/:id", async (req, res) => {
    const params = req.params;
    Supplier.findOneAndDelete({ _id: params.id }, function (error) {
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
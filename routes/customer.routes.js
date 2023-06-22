const express = require('express');
const router = express.Router();

const Customer = require('../model/Customer');

router.get("/get", async (req, res) => {
    let name = req.query.name;
    let phone = req.query.phone
    const fillter = { name: { $regex: name, $options: 'i' }, phone: { $regex: phone, $options: 'i' } }
    const data = await Customer.find((name || phone) ? fillter : {});
    res.json(data)
})

router.get("/detail/:id", async (req, res) => {
    let _id = req.params.id
    const data = await Customer.find({ _id });
    res.json(...data)
})

router.post("/create", async (req, res) => {
    const params = req.body;
    const newUnit = new Customer(params)
    const data = newUnit.save();
    res.send(data);
})

router.put("/edit/:id", async (req, res) => {
    try {
        const params = req.params;
        const body = req.body
        const updateData = await Customer.findOneAndUpdate({ _id: params.id },
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
    Customer.findOneAndDelete({ _id: params.id }, function (error) {
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
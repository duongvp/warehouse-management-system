const express = require('express');
const router = express.Router();

const Unit = require('../model/Unit');
const nanoid = require('nanoid');
const generateID = () => {
    return 'DVT' + nanoid(5)
}

router.get("/get", async (req, res) => {
    let name = req.query.name;
    const fillter = { name: { $regex: name, $options: 'i' } }
    const data = await Unit.find(name ? fillter : {});
    res.json(data)
})

router.get("/detail/:id", async (req, res) => {
    let _id = req.params.id
    const data = await Unit.find({ _id });
    res.json(...data)
})

router.post("/create", async (req, res) => {
    const params = req.body;
    const newUnit = new Unit({ ...params, _id: generateID() })
    const data = newUnit.save();
    res.send(data);
})

router.put("/edit/:id", async (req, res) => {
    try {
        const params = req.params;
        const body = req.body
        const updateData = await Unit.findOneAndUpdate({ _id: params.id },
            {
                name: body.name,
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
    Unit.findOneAndDelete({ _id: params.id }, function (error) {
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
const express = require('express');
const nanoid = require("nanoid");
const router = express.Router();

const Product = require('../model/Product');
const WarehouseInspection = require('../model/WarehouseInspection');
const WarehouseInspectionLine = require('../model/WarehouseInspectionLine');

const generateID = () => {
    return 'KTK' + nanoid(5)
}

router.get("/get", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const startIndex = (page - 1) * perPage;
    const warehouseId = req.query.warehouseId.toString() || "";
    const totalPages = Math.ceil(await WarehouseInspection.countDocuments() / perPage);
    await WarehouseInspection
        .find({ warehouseId })
        .skip(startIndex)
        .limit(perPage)
        .populate('employId', 'name -_id')
        .exec(function (err, data) {
            if (err) res.status(403).send(err);
            return res.status(200).json({
                data: data,
                totalPages: totalPages,
            })
        });
})

router.get("/detail/:id", async (req, res) => {
    let _id = req.params.id
    const data = await WarehouseInspection.find({ _id });
    const dataLine = await WarehouseInspectionLine.find({ warehouseInspectionId: _id });
    res.json({ data, dataLine })
})

router.post("/create", async (req, res) => {
    try {
        const data = req.body;
        const productImport = data.productImport
        const dataInspection = {
            _id: data.idInspection || generateID(),
            totalDiffAmount: Number(data.totalDiffAmount),
            totalDiffPrice: data.totalDiffPrice,
            totalAmount: data.totalAmount,
            note: data.note,
            employId: data.employId,
            warehouseId: data.warehouseId,
        }
        const WHInspection = new WarehouseInspection(dataInspection);
        WHInspection.save();
        await WarehouseInspectionLine.insertMany(productImport.map(item => ({
            productId: item.id,
            productName: item.label,
            warehouseInspectionId: dataInspection._id,
            actualAmount: item.amount,
            unit: item.unit,
            instock: item.instock,
            diffAmount: item.diffAmount,
            diffPrice: item.diffPrice
        })))
        productImport.map(async item => {
            const res = await Product.findOneAndUpdate({ _id: item.id, "warehouse.warehouseId": data.warehouseId },
                {
                    $set: { 'warehouse.$.instock': Number(item.amount) }
                }, {
                new: true,
                rawResult: true
            })
            console.log(res);
        })
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(403).send(error);
    }
})

router.delete("/delete/:id", async (req, res) => {
    const params = req.params;
    Product.findOneAndDelete({ _id: params.id }, function (error) {
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
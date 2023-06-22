const express = require('express');
const nanoid = require("nanoid");
const router = express.Router();

const Product = require('../model/Product');
const WarehouseReceipt = require('../model/WarehouseReceipt');
const WarehouseReceiptLine = require('../model/WarehouseReceiptLine');

const generateID = () => {
    return 'PN' + nanoid(5)
}

router.get("/get", async (req, res) => {
    const objQuery = req.query.objQuery ? JSON.parse(req.query.objQuery) : ""
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const startIndex = (page - 1) * perPage;
    const warehouseId = req.query.warehouseId.toString() || "";
    //  const results = await WarehouseReceipt.aggregate([
    //     { $match : {warehouseId} }, 
    //     {
    //         $lookup: {
    //            from: "suppliers",
    //            localField: "supplierId",
    //            foreignField: "_id",
    //            as: "suppliers"
    //         }
    //     },
    //     {
    //         $project: {
    //             debt:1,
    //             createdAt: 1,
    //             supplierName: "$suppliers.name"
    //         }
    //     },
    //     {
    //         $group: {
    //             _id: null,
    //             totalAge: { $sum: "$debt" }
    //         }
    //     },
    //     {   $skip: startIndex },
    //     {   $limit: perPage }
    // ])
    // res.status(200).json({
    //     data: results,
    //     totalPages: totalPages
    // })
    const fillter = objQuery && {
        _id: { $regex: (objQuery.proName == 'undefined' ? '' : objQuery.code), $options: 'i' },
        ...(objQuery.supplier && { supplierId: objQuery.supplier })
    }
    console.log('fillter', fillter);
    const totalPages = Math.ceil(await WarehouseReceipt.countDocuments({ ...(fillter && fillter) }) / perPage);
    const result = await WarehouseReceipt.aggregate([
        { $match: { warehouseId, ...(fillter && fillter) } },
        { $group: { _id: null, totalDebt: { $sum: "$debt" }, totalPrice: { $sum: "$paidSupplier" } } }
    ])
    console.log(result);
    await WarehouseReceipt
        .find({ warehouseId, ...(fillter && fillter) }, { debt: 1, createdAt: 1, status: 1, paidSupplier: 1 })
        .sort({ createdAt: -1 })
        .skip(startIndex)
        .limit(perPage)
        .populate('supplierId', 'name -_id')
        .exec(function (err, data) {
            if (err) res.status(403).send(err);
            return res.status(200).json({
                data: data,
                totalDebt: result[0]?.totalDebt || 0,
                totalPages: totalPages,
                totalAmount: result[0]?.totalPrice || 0,
            })
        });
})

router.get("/getTotal", async (req, res) => {
    const result = await WarehouseReceipt.aggregate([
        { $group: { _id: null, totalPrice: { $sum: "$paidSupplier" } } }
    ])
    res.status(200).json(result[0]?.totalPrice || 0)
})


router.get("/detail/:id", async (req, res) => {
    let _id = req.params.id
    const data = await WarehouseReceipt.find({ _id })
        .populate('supplierId')
        .populate('employId')
        .populate('warehouseId', 'name');
    const dataLine = await WarehouseReceiptLine.find({ warehouseReceiptId: _id });
    res.json({ data, dataLine })
})

router.post("/create", async (req, res) => {
    try {
        const data = req.body;
        const productImport = data.productImport
        const dataReceipt = {
            _id: data.idReceipt || generateID(),
            supplierId: data.selectedSupplierOption,
            discountMount: Number(data.discount),
            paidSupplier: Number(data.needPaySupplier),
            debt: Number(data.debt),
            totalPrice: data.totalPricePro,
            note: data.note,
            status: data.status,
            employId: data.employId,
            warehouseId: data.warehouseId
        }
        const newWarehouseReceipt = new WarehouseReceipt(dataReceipt);
        newWarehouseReceipt.save();
        await WarehouseReceiptLine.insertMany(productImport.map(item => ({
            productId: item.id,
            productName: item.label,
            warehouseReceiptId: dataReceipt._id,
            quantity: item.amount,
            unit: item.unit,
            price: item.price,
            totalPrice: item.totalPrice
        })))
        productImport.map(async item => {
            const res = await Product.findOneAndUpdate({ _id: item.id, "warehouse.warehouseId": data.warehouseId },
                {
                    $inc: { 'warehouse.$.instock': item.amount }
                }, {
                new: true,
                rawResult: true
            })
            console.log(res);
        })
        res.status(200).json(data);
    } catch (error) {
        res.status(403).send(error);
    }
})

router.put("/edit", async (req, res) => {
    try {
        const data = req.body;
        const updateData = await WarehouseReceipt.findOneAndUpdate({ _id: data.idReceipt },
            {
                debt: Number(data.debt),
                discountMount: Number(data.discount),
                paidSupplier: Number(data.needPaySupplier),
            }, {
            returnOriginal: false
        })
        res.status(200).json(updateData)
    } catch (error) {
        res.status(403).json(error)
    }
})

router.delete("/delete/:id/:idWH", async (req, res) => {
    const params = req.params;
    try {
        let productImport = []
        productImport = await WarehouseReceiptLine.find({ warehouseReceiptId: params.id }, 'productId warehouseReceiptId quantity')
        await Promise.all(productImport?.map(async item => {
            await Product.findOneAndUpdate({ _id: item.productId, "warehouse.warehouseId": params.idWH },
                {
                    $inc: { 'warehouse.$.instock': Number(-item.quantity) }
                }, {
                new: true,
                rawResult: true
            })
        }))
        await WarehouseReceipt.findOneAndDelete({ _id: params.id })
        await WarehouseReceiptLine.deleteMany({ warehouseReceiptId: params.id })
        res.status(200).send('Xóa thành công!');
    } catch (error) {
        console.log(error);
        res.status(403).send(error);
    }
})

module.exports = router;
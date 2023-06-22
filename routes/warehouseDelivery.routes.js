const express = require('express');
const nanoid = require("nanoid");
const router = express.Router();

const Product = require('../model/Product');
const WarehouseDelivery = require('../model/WarehouseDelivery');
const WarehouseDeliveryLine = require('../model/WarehouseDeliveryLine');

const generateID = () => {
    return 'PX' + nanoid(5)
}

router.get("/get", async (req, res) => {
    const objQuery = req.query.objQuery ? JSON.parse(req.query.objQuery) : ""
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const startIndex = (page - 1) * perPage;
    const warehouseId = req.query.warehouseId.toString() || "";
    const fillter = objQuery && {
        _id: { $regex: (objQuery.proName == 'undefined' ? '' : objQuery.code), $options: 'i' },
        ...(objQuery.supplier && { supplierId: objQuery.supplier })
    }
    const totalPages = Math.ceil(await WarehouseDelivery.countDocuments({ ...(fillter && fillter) }) / perPage);
    const result = await WarehouseDelivery.aggregate([
        { $match: { warehouseId, ...(fillter && fillter) } },
        { $group: { _id: null, totalDebtors: { $sum: "$debtors" }, totalPrice: { $sum: "$customerPaid" } } }
    ])
    await WarehouseDelivery
        .find({ warehouseId, ...(fillter && fillter) }, { debtors: 1, createdAt: 1, status: 1, customerPaid: 1 })
        .sort({ createdAt: -1 })
        .skip(startIndex)
        .limit(perPage)
        .populate('customerId', 'name -_id')
        .exec(function (err, data) {
            if (err) res.status(403).send(err);
            return res.status(200).json({
                data: data,
                totalDebtors: result[0]?.totalDebtors || 0,
                totalPages: totalPages,
                totalAmount: result[0]?.totalPrice || 0,
            })
        });
})

router.get("/getTotal", async (req, res) => {
    const result = await WarehouseDelivery.aggregate([
        { $group: { _id: null, totalPrice: { $sum: "$customerPaid" } } }
    ])
    res.status(200).json(result[0]?.totalPrice || 0)
})

router.get("/getRevenue", async (req, res) => {
    const listWH = await Warehouse.find({}, "_id, name");
    const array = await Promise.all(listWH.map(async (item) => {
        let totalRevenue = 0;
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        let detail = await WarehouseDelivery.aggregate([
            { $match: { warehouseId: item._id } },
            { $group: { _id: null, totalPrice: { $sum: "$customerPaid" } } }
        ])
        if (detail.length) {
            totalRevenue = detail[0].totalPrice
        }
        return {
            'id': item.id,
            'name': item.name,
            "totalRevenue": totalRevenue,
            "color": color
        };
    }));
    console.log(array);
    res.json(array)
})

router.get("/detail/:id", async (req, res) => {
    let _id = req.params.id
    const data = await WarehouseDelivery
        .find({ _id })
        .populate('customerId')
        .populate('employId')
        .populate('warehouseId', 'name');
    const dataLine = await WarehouseDeliveryLine.find({ warehouseDeliveryId: _id });
    res.json({ data, dataLine })
})

router.post("/create", async (req, res) => {
    try {
        const data = req.body;
        const productImport = data.productImport
        const dataReceipt = {
            _id: data.idDelivery || generateID(),
            customerId: data.selectedCustomerOption,
            discountMount: Number(data.discount),
            customerPaid: Number(data.customerNeedPay),
            debtors: Number(data.debtors),
            totalPrice: data.totalPricePro,
            note: data.note,
            status: data.status,
            employId: data.employId,
            warehouseId: data.warehouseId,
            totalAmount: data.totalAmount
        }
        const WHDelivery = new WarehouseDelivery(dataReceipt);
        WHDelivery.save();
        await WarehouseDeliveryLine.insertMany(productImport.map(item => ({
            productId: item.id,
            productName: item.label,
            warehouseDeliveryId: dataReceipt._id,
            quantity: item.amount,
            unit: item.unit,
            price: item.price,
            totalPrice: item.totalPrice
        })))
        productImport.map(async item => {
            const res = await Product.findOneAndUpdate({ _id: item.id, "warehouse.warehouseId": data.warehouseId },
                {
                    $inc: { 'warehouse.$.instock': Number(-item.amount) }
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

router.put("/edit", async (req, res) => {
    try {
        const data = req.body;
        const updateData = await WarehouseDelivery.findOneAndUpdate({ _id: data.idDelivery },
            {
                debtors: Number(data.debtors),
                discountMount: Number(data.discount),
                customerPaid: Number(data.customerNeedPay),
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
        productImport = await WarehouseDeliveryLine.find({ warehouseDeliveryId: params.id }, 'productId  quantity')
        await Promise.all(productImport?.map(async item => {
            await Product.findOneAndUpdate({ _id: item.productId, "warehouse.warehouseId": params.idWH },
                {
                    $inc: { 'warehouse.$.instock': Number(item.quantity) }
                }, {
                new: true,
                rawResult: true
            })
        }))
        await WarehouseDelivery.findOneAndDelete({ _id: params.id })
        await WarehouseDeliveryLine.deleteMany({ warehouseDeliveryId: params.id })
        res.status(200).send('Xóa thành công!');
    } catch (error) {
        console.log(error);
        res.status(403).send(error);
    }
})

module.exports = router;
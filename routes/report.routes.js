const express = require('express');
const router = express.Router();

const WarehouseDeliveryLine = require('../model/WarehouseDeliveryLine');
const WarehouseDelivery = require('../model/WarehouseDelivery');


router.get("/get", async (req, res) => {
    const objQuery = req.query.objQuery ? JSON.parse(req.query.objQuery) : ""
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const startIndex = (page - 1) * perPage;
    const warehouseId = req.query.warehouseId.toString() || "";
    const idWHDelivery = await WarehouseDelivery.find({ warehouseId });
    const arrayOfIds = idWHDelivery.flatMap(item => item._id)
    const data = await WarehouseDeliveryLine.aggregate([
        {
            $match: {
                "warehouseDeliveryId": { "$in": arrayOfIds },
                ...((objQuery && (objQuery.inputDate || objQuery.outputDate)) && {
                    "createdAt": {
                        ...((objQuery.inputDate) && { '$gte': new Date(objQuery.inputDate) }),
                        ...((objQuery.outputDate) && { '$lte': new Date(objQuery.outputDate) })
                    }
                })
            }
        },
        { $group: { _id: "$productId", name: { "$first": "$productName" }, price: { "$first": "$price" }, totalQuantity: { $sum: "$quantity" }, totalPrices: { $sum: "$totalPrice" } } },
        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "_id",
                as: "product"
            }
        },
        { $limit: perPage },
        { $skip: startIndex },
    ])
    res.json({
        data,
        totalPages: Math.ceil(data.length / perPage) || 1,
        totalAmount: data.reduce((accumulator, item) => accumulator + item.totalPrices, 0),
        totalQuantitys: data.reduce((accumulator, item) => accumulator + item.totalQuantity, 0)
    })
})


module.exports = router;
const express = require('express');
const router = express.Router();

const Product = require('../model/Product');
const Warehouse = require('../model/Warehouse');
const nanoid = require('nanoid');

const generateID = () => {
    return 'SP' + nanoid(5)
}


router.get("/get", async (req, res) => {
    const objQuery = req.query.objQuery ? JSON.parse(req.query.objQuery) : ""
    console.log(objQuery);
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const warehouseId = req.query.warehouseId?.toString() || "";
    const startIndex = (page - 1) * perPage;
    const fillter = objQuery && {
        name: { $regex: (objQuery.proName == 'undefined' ? '' : objQuery.proName), $options: 'i' },
        ...(objQuery.unitName && { unitId: objQuery.unitName }),
        ...(objQuery.cateName && { categoryId: objQuery.cateName }),
        ...(objQuery.status && { status: objQuery.status == 'true' ? true : false })
    }
    const totalPages = Math.ceil(await Product.countDocuments({ ...(fillter && fillter) }) / perPage);
    await Product
        .find({ "warehouse.warehouseId": warehouseId, ...(fillter && fillter) })
        .sort({ createdAt: -1 })
        .skip(startIndex)
        .limit(perPage)
        .populate('unitId', 'name -_id')
        .populate('categoryId', 'name -_id')
        .exec(function (err, data) {
            if (err) res.status(403).send(err);
            data.forEach(item => {
                item.warehouse = item.warehouse.find(ele => ele.warehouseId == warehouseId)
            })
            return res.status(200).json({
                data: data,
                totalPages: totalPages
            })
        });
    // const results = await Product.aggregate([
    //     {
    //         $lookup: {
    //            from: "units",
    //            localField: "unitId",
    //            foreignField: "_id",
    //            as: "unit"
    //         }
    //     },
    //     {
    //         $project: {
    //             unitName: "$unit.name"
    //         }
    //     },
    //     {   $skip: startIndex },
    //     {   $limit: perPage }
    // ])
})

router.get("/detail/:id/warehouse/:warehouseId", async (req, res) => {
    const params = req.params;
    if (params.id) {
        await Product
            .findOne({ _id: params.id })
            .exec(function (err, data) {
                if (err) res.status(403).send(err);
                if (data.warehouse.length) {
                    data.warehouse = data.warehouse.find(ele => ele.warehouseId == params.warehouseId)
                }
                return res.status(200).json(data)
            });
    }
})

router.post("/create", async (req, res) => {
    try {
        const data = req.body;
        const _id = data._id ? data._id : generateID();
        const warehouseId = await Warehouse.find({}).select({ "_id": 1 });
        const warehouse = warehouseId.map(item => ({
            instock: (item._id === data.warehouseId) ? data.instock : 0,
            warehouseId: item._id
        }))
        const newProduct = new Product({
            _id: _id,
            name: data.name,
            image: data.image,
            status: data.status,
            importPrice: data.importPrice,
            costPrice: data.costPrice,
            warehouse: warehouse,
            unitId: data.unit,
            note: data.note ? data.note : "",
            categoryId: data.category
        })
        const response = newProduct.save();
        res.status(200).send(response);
    } catch (error) {
        res.status(403).send(error);
    }
})

router.put("/edit/:id", async (req, res) => {
    try {
        const data = req.body;
        const _id = req.params.id;
        console.log(data, _id);
        const updateData = await Product.findOneAndUpdate({ _id, "warehouse.warehouseId": data.warehouseId },
            {
                name: data.name,
                image: data.image,
                status: data.status,
                importPrice: data.importPrice,
                costPrice: data.costPrice,
                unitId: data.unit,
                note: data.note ? data.note : "",
                categoryId: data.category,
                $set: { 'warehouse.$.instock': Number(data.instock) }
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
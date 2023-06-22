const express = require('express');
const router = express.Router();

const Role = require('../model/Role');
const Permission = require('../model/Permission');

router.get("/get", async (req, res) => {
    let name = req.query.name;
    const fillter = { name: { $regex: name, $options: 'i' } }
    const data = await Role
        .find(name ? fillter : {})
        .populate('permissions', 'description -_id')
    let count = await Permission.countDocuments();
    const response = data.map(item => {
        if (item.permissions.length == count) {
            return {
                _id: item._id,
                name: item.name,
                description: item.description,
                permissions: "Toàn bộ hệ thống"
            }
        }
        return {
            _id: item._id,
            name: item.name,
            description: item.description,
            permissions: item.permissions.map(ele => ele.description)
        }
    })
    res.json(response)
})

router.get("/detail/:id", async (req, res) => {
    const params = req.params;
    const RoleData = await Role.find({ _id: params.id })
    console.log("RoleData", RoleData);
    const permissionData = await Permission.find({});
    const parentNameList = [...new Set(permissionData.map(item => item.parentName))]
    const response = parentNameList.map(ele => {
        const newData = permissionData.filter(item => item.parentName === ele)
        return {
            id: ele,
            name: newData[0].parentDescription,
            isChecked: newData.every(per => RoleData[0].permissions?.includes(per._id)),
            permissions: newData.map(per => ({
                id: per._id,
                label: per.description,
                isChecked: RoleData[0].permissions?.includes(per._id)
            }))
        }
    })
    res.json({
        data: response,
        name: RoleData[0].name,
        description: RoleData[0].description
    })
})

router.get("/listPermissionActive/:id", async (req, res) => {
    const params = req.params;
    const RoleData = await Role.find({ _id: params.id })
    await Permission.find({
        _id: { $in: RoleData[0].permissions }
    }, 'name -_id', function (err, docs) {
        if (err) return res.status(403).json(err)
        res.status(200).json(docs.map(item => item.name))
    });
})

router.post("/create", async (req, res) => {
    const data = req.body;
    const newRole = new Role(data)
    const response = newRole.save();
    res.status(200).json(response)
})

router.put("/edit/:id", async (req, res) => {
    try {
        const data = req.body;
        const updateData = await Role.findOneAndUpdate({ _id: req.params.id },
            data, {
            returnOriginal: false
        })
        res.status(200).json(updateData)
    } catch (error) {
        res.status(403).json(error)
    }
})

router.delete("/delete/:id", async (req, res) => {
    const params = req.params;
    Role.findOneAndDelete({ _id: params.id }, function (error) {
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
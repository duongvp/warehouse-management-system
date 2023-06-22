const express = require('express');
const router = express.Router();

const Permission = require('../model/Permission');

router.get("/", async (req, res) => {
    const data = await Permission.find({});
    const parentNameList = [...new Set(data.map(item => item.parentName))]
    const response = parentNameList.map(ele => {
        const newData = data.filter(item => item.parentName === ele) 
        return {
            id: ele,
            name: newData[0].parentDescription,
            isChecked: false,
            permissions: newData.map(per => ({
                id : per._id,
                label: per.description,
                isChecked: false 
            }))
        }
    }) 
    res.json(response)
})

module.exports = router;
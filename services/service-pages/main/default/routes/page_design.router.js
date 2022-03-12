const express = require("express");
const router = express.Router();

router.get('/api/pageDesign', async function (req, res) {
    try {
        res.set('Content-Type', 'text/html');
        res.sendFile(__dirname+'/design.html') 
    } catch (error) {
        res.status(500).send({ message: error.message });
    }

});
exports.default = router;
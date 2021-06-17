const express = require('express');
const router = express.Router();

const { getRooms } = require('../services/RoomService');

router.get('/', (req, res) => {
    res.send('Hello Asksuite World!');
});

// Search route
router.post('/search', async (req, res) => {
    const { checkin, checkout } = req.body;

    // If checkin or checkout dates are missing
    if(!checkin || !checkout)
        res.status(400).json({ error: 'Missing checkin or checkout dates!' })

    else {
        const rooms = await getRooms(checkin, checkout);
        
        // If rooms were successfully found
        if(rooms)
            res.json(rooms);

        // If no rooms were found
        else
            res.status(404).json({ error: 'No rooms were found!' })
    }
});

module.exports = router;

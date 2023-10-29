const Events = require('../models/Events')

module.exports = {
    getIndex: (req, res) => {
        res.render('index.ejs')
    },
    getEvents: async (req, res) => {
        // (!req.params.account) ? req.params.account = '' : req.params.account
        (!req.query.asofdate) ? req.query.asofdate = new Date() : req.query.asofdate

        try {
            events = await Events.find({account: req.params.account, date: {$gt: req.query.asofdate}}).sort({date: 1}).lean()
            res.render('cashflow.ejs', {events: events})
        } catch (err) {
            res.status(400).send(err)
        }
    },
    getEvent: async (req, res) => {
        try {
            selected = await Events.findById(req.query.id, {account: 0, __v: 0})
            res.send({message: `Sending event ${selected._id}`, selected})
        } catch (err) {
            res.status(400).send(err)
        }
    },
    postEvent: async (req, res) => {
        try {
            created = await Events.create(req.body)
            res.status(201).json({message: `Event ${created._id} created!`})
        } catch (err) {
            res.status(400).send(err)
        }
    },
    putEvent: async (req, res) => {
        try {
            if (!req.body.group) {
                removed = await Events.findOneAndUpdate({_id: req.body.id}, {$unset: {group: ''}})
            }
            updated = await Events.findOneAndUpdate({_id: req.body.id}, req.body, {returnDocument: 'after'})
            res.status(201).json({message: `Event ${updated._id} updated!`})
        } catch (err) {
            res.status(400).send(err)
        }
    },
    // putEvents: async (req, res) => {
    //     try {
    //         if (req.body.type === 'category') {
    //             await Events.updateMany({category: req.body.currentValue},{$set: {category: req.body.newValue}})
    //         } else if (req.body.type === 'date') {
    //             await Events.updateMany({date: req.body.currentValue},{$set: {date: req.body.newValue}})
    //         }
    //         res.status(201).json({message: 'Events updated!'})
    //     } catch (err) {
    //         res.status(400).send(err)
    //     }
    // },
}
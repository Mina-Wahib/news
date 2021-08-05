const express = require("express");
const Reporter = require("../models/reporter");
const auth = require('../middlware/auth')

const router = new express.Router();



router.post("/reporters", async(req, res) => {
    const reporter = new Reporter(req.body);
    try {
        await reporter.save()
        const token = await reporter.generateToken()
        res.status(200).send({ reporter, token })
    } catch (e) {
        res.status(400).send(e)
    }
});



router.get("/reporters", auth, (req, res) => {
    Reporter.find({})
        .then((users) => {
            res.status(200).send(users);
        })
        .catch((e) => {
            res.status(500).send(e);
        });
});



router.get("/reporters/:id", auth, (req, res) => {
    const _id = req.params.id;
    Reporter.findById(_id)
        .then((reporter) => {
            if (!reporter) {
                return res.status(400).send("Unable to find user");
            }
            res.status(200).send(reporter);
        })
        .catch((e) => {
            res.status(500).send("Unable to connect to database");
        });
});



router.patch('/reporters/:id', async(req, res) => {
    const _id = req.params.id
    try {
        const reporter = await User.findByIdAndUpdate(_id, req.body, {
            new: true,
            runValidators: true
        })
        if (!reporter) {
            return res.status(400).send('No user is found')
        }
        res.status(200).send(reporter)
    } catch (e) {
        res.status(400).send(e)
    }
})



router.patch("/reporters/:id", auth, async(req, res) => {
    const updates = Object.keys(req.body);
    console.log(updates);

    const allowedUpdates = ["name", "password"];
    var isValid = updates.every((el) => allowedUpdates.includes(el));
    console.log(isValid);

    if (!isValid) {
        return res.status(400).send("Sorry cannot update");
    }
    const _id = req.params.id;
    try {
        const reporter = await Reporter.findById(_id)
        updates.forEach((el) => (reporter[el] = req.body[el]))
        await reporter.save()
        console.log(reporter)
        if (!reporter) {
            return res.send('No user is found')
        }
        res.status(200).send(reporter)
    } catch (e) {
        res.status(400).send(e)
    }
});



router.delete('/reporters/:id', auth, async(req, res) => {
    const _id = req.params.id
    try {
        const reporter = await Reporter.findByIdAndDelete(_id)
        if (!reporter) {
            return res.status(400).send('No user is found')
        }
        res.status(200).send(reporter)
    } catch (e) {
        res.status(400).send(e)
    }
})



router.post('/reporters/login', async(req, res) => {
    try {
        const reporter = await Reporter.findByCredentials(req.body.email, req.body.password)
        const token = await reporter.generateToken()
        res.send({ reporter, token })
    } catch (e) {
        res.status(400).send('Error is ' + e)
    }
})



router.get('/profile', auth, async(req, res) => {
    res.send(req.reporter)
})




router.delete('/logout', auth, async(req, res) => {
    try {
        req.reporter.tokens = req.reporter.tokens.filter((el) => {
            return el.token !== req.token
        })

        await req.reporter.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }

})




router.post('/logoutAll', auth, async(req, res) => {
    try {
        req.reporter.tokens = []
        await req.reporter.save()
        res.send('Logout all was done successsfully')
    } catch (e) {
        res.send('Please login')
    }
})

module.exports = router;
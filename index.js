const express = require('express')
const Reporter = require('./models/reporter')
const cors = require('cors')
const reporterRouter = require('./routers/reporter')
const newsRouter = require('./routers/news')
const app = express()

const port = 3000 || process.env.PORT

require('./db/mongoose')

//Parse incmoming json
app.use(express.json())



app.use(cors())

app.use(reporterRouter)
app.use(newsRouter)



const bcrypt = require('bcryptjs')



///////////////////////////////////////////////////////////////////////////////////////////


// Populate 

const main = async() => {
    const user = await User.findById('60f012c73a068f437045bb57')
    await user.populate('userTasks').execPopulate()
    console.log(user.userTasks)
    main()
}


app.listen(port, () => {
    console.log('Server is running')
})
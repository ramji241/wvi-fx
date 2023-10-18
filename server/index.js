const path = require('path')
const express = require('express')
const port = process.env.port || 3001
const app = express()

app.use(express.static(path.resolve(__dirname, '../client/build')))
app.get('/api', (req, res) => res.json({message: 'Hello from server!'}))
app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../client/build', 'index.html')))
app.listen(port, () => console.log(`Server listening on ${port}...`))
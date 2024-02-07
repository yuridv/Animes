console.log(`[FrontEnd]=> Starting...`)
const express = require('express')

express()
  .use(express.static(__dirname + '/HTML'))

  .get('*', async function(req, res) {
    res.sendFile(__dirname + '/HTML/index.html')
  })

  .listen(process.env.PORT || 80, async (err) => {
    if (err) return console.log(`[FrontEnd]=> Error Loading:\n${err}`)
    console.log(`[FrontEnd]=> Successfully Loaded!`)
  });
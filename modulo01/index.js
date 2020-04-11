const express = require('express')

const server = express()

server.use(express.json())

/**
 *  Query Params -  ?name=carlos
 *  Route Params -  /users/1
 *  Request body = { "name": "Carlos", "Email": "carlos@empresa.local"}
 */

/**
 * GRUD - Create-POT, Read-GET, Update-POT, Delete-DELETE
 */

const users = ['Diego', 'Cláudio', 'Victor']

server.use((req, res, next) => {
  console.time('Request')
  console.log(`Método: ${req.method}; URL ${req.url}`)

  next()

  console.timeEnd('Request')
})

function checkUserExists(req, res, next) {
  const { name } = req.body
  
  if (!name) {
    return res.status(400).json({ error: 'User name is requet'})
  }

  return next()
}

function checkUserInArray(req, res, next) {
  const user = users[req.params.index]
  
  if (!user) {
    return res.status(400).json({ error: 'User does not exists'})
  }

  req.user = user

  return next()
}

server.get('/users', (req, res) => {
  return res.json(users)
})

server.get('/users/:index', checkUserInArray, (req, res) => {
  /* Query Params - req.query.name */
  /* Route Params - req.params.id */

  // const { index } = req.params

  return res.json(req.user)
})

server.post('/users', checkUserExists, (req, res) => {
  const { name } = req.body

  users.push(name)

  return res.json(users)
})

server.put('/users/:index', checkUserInArray, checkUserExists , (req, res) => {
  const { index } = req.params
  const { name } = req.body

  users[index] = name

  return res.json(users)
})

server.delete('/users/:index', checkUserInArray, (req, res) => {
  const { index } = req.params

  users.splice(index, 1)

  return res.send()
})

server.listen(3000)

const express = require('express')

const petsRouter = express.Router()

const db = require('../utils/database')

petsRouter.get('/', (req, res) => {

    const selectAllPetsQuery = "SELECT * FROM pets"

    db.query(selectAllPetsQuery)
        .then(databaseResult => {

            console.log(databaseResult)

            res.json({ pets: databaseResult.rows })
        })

        .catch(error => {
            res.status(500)
            res.json({ error: 'unexpected Error' })
            console.log(error)
        })
})

petsRouter.get('/:id', (req, res) => {

    const selectSinglePetQuery = "SELECT * FROM pets WHERE id = $1"

    const queryValues = [
        req.params.id
    ]

    db.query(selectSinglePetQuery, queryValues)
        .then(function (databaseResult) {

            if (databaseResult.rowCount === 0) {
                res.status(404)
                res.json({ error: 'pet does not exist' })
            } else {

                res.json({ pet: databaseResult.rows[0] })
            }
        })
        .catch(error => {
            res.status(500)
            res.json({ error: 'unexpected Error' })
            console.log(error)
        })
})


// delete /pet/10
petsRouter.delete('/:id', (req, res) => {
    const deletePetsQuery = `DELETE from pets WHERE id = $1 RETURNING *`

    const deleteValues = [
        req.params.id //$1 - the pet id
    ]

    db.query(deletePetsQuery, deleteValues)
        .then(databaseResult => {
            console.log(databaseResult)
            if (databaseResult.rowCount === 0) {
                res.status(404)
                res.json({ error: 'pet does not exist' })
            }
            else {
                res.json({ book: databaseResult.rows[0] })
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500)
            res.json({ error: 'unexpected error' })
        })
})


//put /book/:id - update a book
petsRouter.put('/:id', (req, res) => {

    const updatePetQuery = `
    UPDATE pets SET
    name = $1,
      age = $2,
      type = $3,
      breed = $4,
      microchip = $5
    WHERE id = $6
    Returning *
    `
    const updateValues = [
        req.body.name, //$1 = name
        req.body.age, //$2 = age
        req.body.type, //$3 = type
        req.body.breed, //$4 = breed
        req.body.microchip, //$5 = microchip
        req.params.id, //$6 = id
    ]

    db.query(updatePetQuery, updateValues)
        .then(databaseResult => {
            console.log(databaseResult)
            if (databaseResult.rowCount === 0) {
                res.status(404)
                res.json({ error: 'pet does not exist' })
            }
            else {
                res.json({ pet: databaseResult.rows[0] })
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500)
            res.json({ error: 'unexpected error' })
        })
})


petsRouter.patch('/:id', (req, res) => {
    const updatePetQuery = `
    UPDATE pets SET
    name = $1,
      age = $2,
      type = $3,
      breed = $4,
      microchip = $5
    WHERE id = $6
    Returning *
    `

    const updateValues = [
        req.body.name, //$1 = name
        req.body.age, //$2 = age
        req.body.type, //$3 = type
        req.body.breed, //$4 = breed
        req.body.microchip, //$5 = microchip
        req.params.id, //$6 = id
    ]

    db.query(updatePetQuery, updateValues)
        .then(databaseResult => {
            console.log(databaseResult)
            if (databaseResult.rowCount === 0) {
                res.status(404)
                res.json({ error: 'pet does not exist' })
            }
            else {
                res.json({ pet: databaseResult.rows[0] })
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500)
            res.json({ error: 'unexpected error' })
        })
   
})






petsRouter.post('/', (req, res) => {

    const insertPetsQuery = `
    INSERT INTO pets(
      name, 
      age, 
      type,
      breed, 
      microchip)
    VALUES($1, $2, $3, $4, $5)
    RETURNING *`

    const petValues = [
        req.body.name, //$1 = name
        req.body.age,  //$2 = age
        req.body.type, //$3 = type
        req.body.breed, //$4 = breed
        req.body.microchip //$5 = microchip
    ]

    db.query(insertPetsQuery, petValues)
        .then(databaseResult => {
            console.log(databaseResult)
            res.json({ book: databaseResult.rows[0] })
        })
        .catch(error => {
            console.log(error)
            res.status(500)
            res.json({ error: 'unexpected error' })
        })
})

module.exports = petsRouter
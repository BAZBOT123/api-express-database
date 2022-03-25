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
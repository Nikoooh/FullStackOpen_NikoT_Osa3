const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Numbers = require('./models/puhelinluettelo')

const app = express()

app.use(express.json())
app.use(morgan((tokens, req, res) => {
    return `${tokens.method(req, res)} ${tokens.url(req, res)} ${tokens.status(req, res)} ${tokens.req(req, res, 'content-length')} - ${tokens['response-time'](req,res)} ms ${JSON.stringify(req.body)}`   
}))

app.use(cors())
app.use(express.static('build'))

const errorHandler = (error, request, response, next) => {
  
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    if (error === 'not found') {
        return response.status(404).send({error: 'no numbers found with this id'})
    }

    if (error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
    }

    if (error === 'NotUnique') {
        return response.status(400).json({error: 'Name must be unique'})
    }

    next(error)
}

const unknownEndpoint = (req, res) => {
    res.status(404).send({error: 'unknown endpoint'})
}

app.get('/info', async (req, res) => {

    const currentDate = new Date()
    let phonebookLength = await Numbers.countDocuments()

    res.send(`
        <p>Phonebook has info for ${phonebookLength} people</p> 
        <p> ${currentDate} </p>
    `)
})

app.get('/api/persons', (req, res) => {
    Numbers.find({}).then(numbers => {
        res.json(numbers)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
    Numbers.findById(req.params.id).then(number => {
        if (number) {
            res.json(number)
        } else {
            next('not found')
        }
    }).catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Numbers.findByIdAndDelete(req.params.id)
        .then(() => {
            res.status(200).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
    
    const newPerson = new Numbers({
        name: req.body.name,
        number: req.body.number,
    })

    const isUnique = Numbers.findOne({name: newPerson.name})

    if (isUnique) {
        next('NotUnique')
    } else {
        newPerson.save().then(result => {
            res.json(result)            
        }).catch(error => next(error))         
    }

})

app.put('/api/persons/:id', (req, res, next) => {

    Numbers.findByIdAndUpdate(req.params.id, 
        {
            name: req.body.name,
            number: req.body.number
        },
        {
            new: true
        })
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(error => next(error)) 

})

app.use(errorHandler)
app.use(unknownEndpoint)

const PORT = 3001 || process.env.PORT
app.listen((PORT), () => {
    console.log(`Server running in port ${PORT}`)
})
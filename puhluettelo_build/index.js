const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(morgan((tokens, req, res) => {
    return `${tokens.method(req, res)} ${tokens.url(req, res)} ${tokens.status(req, res)} ${tokens.req(req, res, 'content-length')} - ${tokens['response-time'](req,res)} ms ${JSON.stringify(req.body)}`
    
}))

app.use(cors())
app.use(express.static('build'))

let phonebook = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    },
]

app.get('/api/persons', (req, res) => {
    res.status(200).json(phonebook)
})

app.get('/info', (req, res) => {

    const currentDate = new Date()

    res.send(`
    <p>Phonebook has info for ${phonebook.length} people</p> 
    <p> ${currentDate} </p>
    `)
})

app.get('/api/persons/:id', (req, res) => {
    const person = phonebook.find((person) => person.id === Number(req.params.id))
    
    if(person) {
        res.status(200).json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    phonebook = phonebook.filter((person) => person.id !== Number(req.params.id))
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const newId = Math.floor(Math.random() * 500000)

    const newPerson = {
        name: req.body.name,
        number: req.body.number,
        id: newId
    }

    if (!req.body.name || !req.body.number) {
        res.status(400).json({error: "Please input name and number"})
    } else if (phonebook.find((person) => (person.name).toLowerCase() === (req.body.name).toLowerCase())) {
        res.status(400).json({error: "Name must be unique"})
    } else {
        phonebook = phonebook.concat(newPerson)
        res.status(200).json(phonebook)
    }

})

const PORT = 3000 || process.env.PORT
app.listen((PORT), () => {
    console.log(`Server running in port ${PORT}`);
})
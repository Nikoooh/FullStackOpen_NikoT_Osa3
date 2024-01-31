const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Input password as argument');
    process.exit(1)
}

const password = process.argv[2]
const inputname = process.argv[3]
const inputnumber = process.argv[4]

const url = `mongodb+srv://niko:${password}@fscluster.eekrsl6.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const numberSchema = new mongoose.Schema({
    name: String,
    number: Number
})

const Numbers = mongoose.model('Number', numberSchema)

if (inputname || inputnumber) {
    const phonebook = new Numbers ({
        name: inputname,
        number: inputnumber
    })

    phonebook.save({}).then(result => {
        console.log('New number added');
        mongoose.connection.close()
    })

} else {
    Numbers.find({}).then(result => {
        console.log('Phonebook:');
        result.forEach(number => {
          console.log(`${number.name} ${number.number}`)
    })
        mongoose.connection.close()
    })
}
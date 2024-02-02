import { useEffect, useState } from 'react'
import Numbers from './components/Numbers'
import AddNumbers from './components/AddNumbers'
import Filtering from './components/Filtering'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([]) 

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const [filtered, setFiltered] = useState(false)
  const [filterString, setFilterString] = useState('')
  const [filteredPersons, setFilteredPersons] = useState()

  const [message, setMessage] = useState({type: "", message: null})

  const handleChange = (e) => { 
    e.preventDefault()
    if (e.target.name === "nameInput") {
      setNewName(e.target.value)
    } else if (e.target.name === "numberInput") {
      setNewNumber(e.target.value)
    }

    if (e.target.name === "filter") {
      setFilterString(e.target.value)
    }
  }

  const handleForm = (e) => {
    e.preventDefault()

    const newPerson = {
        name: newName,
        number: newNumber
    }
     

    let isNumberNew = persons.find(person => (person.name).toLowerCase() === (newName).toLowerCase())

    if (isNumberNew) {
      const confirmation = window.confirm(`${newName} is already added to phonebook, replace old number with new one?`)
      if (confirmation) {
        personService.updatePerson(isNumberNew, newPerson)          
          .then(() => personService.getPersons())
          .then(response => {
            setPersons(response)
          })
          .catch(error => {;
            setMessage({type: "error", message: `${isNumberNew.name} has already been deleted from server`})
            setTimeout(() => {
              setMessage({type: "", message: null})
            }, 4000)
          })

          setMessage({type: "success", message: 'Number updated successfully'})
          setTimeout(() => {
            setMessage({type: "", message: null})
          }, 4000)

      }
    } else {
      personService.newPerson(newPerson)
        .then(() => personService.getPersons())
        .then(response => {
          setPersons(response)

          setMessage({type: "success", message: `Added ${newPerson.name}`})
          setTimeout(() => {
            setMessage({type: "", message: null})
          }, 4000)
        })  
        .catch(error => {
          setMessage({type: "error", message: error.response.data.error})
          setTimeout(() => {
            setMessage({type: "", message: null})
          }, 4000)
        })
        
        
    } 
  }

  const handleFilter = (e) => {
    e.preventDefault()

    if (filterString.length === 0) {
      setFiltered(false)
    } else {
      setFiltered(true)
      setFilteredPersons(persons.filter(person => person.name.toLocaleLowerCase().includes(filterString.toLowerCase())))
    }
  }

  const handleDelete = (person) => {

    const confirmation = window.confirm(`Delete ${person.name}`)
    if (confirmation) {
      personService.deletePerson(person.id)
        .then(() => personService.getPersons())
        .then(response => {
          setPersons(response)
        })
        
      if (filtered) {
        setFilteredPersons(filteredPersons.filter(flPerson => flPerson.id !== person.id))
      }
    }
  }

  useEffect(() => {
    personService.getPersons().then(response => {
      setPersons(response)
    })
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>
      
      <Filtering handleFilter={handleFilter} handleChange={handleChange} filterString={filterString}/>
      <AddNumbers newName={newName} newNumber={newNumber} handleChange={handleChange} handleForm={handleForm} message={message}/>
      <Numbers persons={persons} filtered={filtered} filteredPersons={filteredPersons} handleDelete={handleDelete}/>

    </div>
  )

}

export default App

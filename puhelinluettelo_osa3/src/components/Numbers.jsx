import React from 'react'

const Numbers = ({persons, filteredPersons, filtered, handleDelete}) => {
    return (
        <div>
        <h2>Numbers</h2>
            <div>
                {(persons.length > 0) ?
                    filtered ?
                        filteredPersons.length > 0 ?
                            filteredPersons.map((person) => {
                                return (
                                    <div key={person.id}> 
                                      <p>{person.name} {person.number} <button onClick={() => handleDelete(person)}>Delete</button> </p>
                                    </div>
                                )
                            })  
                        :
                            <p>No numbers found</p>    
                    :           
                        persons.map((person) => {
                        return (
                          <div key={person.id}> 
                            <p>{person.name} {person.number} <button onClick={() => handleDelete(person)}>Delete</button></p> 
                          </div>
                        )
                    })
                :
                    <p>No numbers found</p>
                }
            </div>
        </div>
    )
}

export default Numbers
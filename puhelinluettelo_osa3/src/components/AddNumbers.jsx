import React from 'react'
import Notification from './Notification'

const AddNumbers = ({newName, newNumber, handleChange, handleForm, message}) => {
    return (
        <div>
            <form onSubmit={handleForm}>
                <h2>Add a new entry</h2>
                <div name="inputName">
                    name: <input name='nameInput' value={newName} onChange={handleChange}/>
                    <br/><br/>
                    number: <input name="numberInput" value={newNumber} onChange={handleChange}/>      
                </div>
                <br/>
                <div>
                    <button type="submit">add</button>
                </div>
            </form>
            <Notification message={message}/>
      </div>
    )
}

export default AddNumbers
import React from 'react'

const Filtering = ({handleChange, handleFilter, filterString}) => {
    return (
        <form onSubmit={handleFilter}>
        <div>
          <p>Filter phonebook</p><input name='filter' value={filterString} onChange={handleChange}/>
          <button style={{marginLeft: 10}} type='submit'>Filter</button>
        </div>
      </form>
    )
}

export default Filtering
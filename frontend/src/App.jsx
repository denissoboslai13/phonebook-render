import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Forms from './components/Forms'
import Persons from './components/Persons'
import noteService from './services/notes'
import Success from './components/Success'
import Delete from './components/Delete'
import Error from './components/Error'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newArr, setNewArr] = useState(persons)
  const [successMessage, setSuccessMessage] = useState(null)
  const [deleteMessage, setDeleteMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const hook = () => {
    noteService
      .getAll()
      .then(initialPeople => {
        console.log('promise fulfilled')
        console.log("data from server: ", initialPeople)
        setNewArr(initialPeople)
        setPersons(initialPeople)
      })
  }

  useEffect(hook, [])

  const addName = (event) => {
    event.preventDefault()

    const nameObject = {
      name: newName,
      number: newNumber,
    }

    const names = persons.map(people => people.name)
    console.log(names)

    if (!newName || !newNumber ){
      window.alert('Please add all values')
    }
    else if (names.includes(newName)){
      if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)){
        const match = persons.filter(people => nameObject.name === people.name)
        const matchID = match[0].id
        const changedPerson = {...match[0], number: newNumber}
        const newPersons = [...persons]
        const index = persons.findIndex(item => item.id === matchID);
        console.log("changed person: ", changedPerson)
        noteService
          .update(matchID, changedPerson)
          .then(response => {
            newPersons[index].number = newNumber
            setPersons(newPersons)
            setNewArr(newPersons)
            setSuccessMessage(
              `Changed '${nameObject.name}'s number to '${changedPerson.number}'`
            )
            setTimeout(() => {
              setSuccessMessage(null)
            }, 5000)
        })
        .catch(error => {
          setErrorMessage(error.response.data.error)
          console.log('Error message: ', error.response.data.error)
        })
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
    }
    else {
      noteService
        .create(nameObject)
        .then(returnedPeople => {
          setPersons(persons.concat(returnedPeople))
          setNewArr(newArr.concat(returnedPeople))
          setSuccessMessage(
            `Added '${nameObject.name}' with the number '${nameObject.number}'`
          )
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)
        })
        .catch(error => {
          setErrorMessage(error.response.data.error)
            console.log('Error message: ', error.response.data.error)
        })
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
    }
  }
  
  const deletePeople = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name} ?`)) {
      noteService
        .deletePerson(id)
        .catch(error => {
          setDeleteMessage(
            `'${name}' was already removed from the server`
          )
          setTimeout(() => {
            setDeleteMessage(null)
          }, 5000)})
        setDeleteMessage(
          `Deleted '${name}'`
        )
        setPersons(persons.filter(person => person.id !== id))
        setNewArr(newArr.filter(person => person.id !== id))
        setTimeout(() => {
          setDeleteMessage(null)
        }, 5000)
    }
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewArr(persons)
    const filter = event.target.value
    const newData = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
    setNewArr(newData)


  //   const filterNames = persons.map(people => people.name)

  //   if (filterNames[0].includes(filter)){
  //     setPersons(filterNames)
  //   }

  //   console.log("persons: ", persons)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Success message={successMessage} />
      <Delete message={deleteMessage} />
      <Error message={errorMessage} />
      <Filter onChange={handleFilterChange}/>
      <h2>add a new</h2>
      <Forms onSubmit={addName} handleName={handleNameChange} handleNumber={handleNumberChange}/>
      <h2>Numbers</h2>
      <div>
        {newArr.map((data) => (
          <Persons key={data.id} data={data}
          deletePeople={() => deletePeople(data.id, data.name)}/>
        ))}
      </div>
    </div>
  )
}

export default App
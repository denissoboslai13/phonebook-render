const Persons = ({ data, deletePeople }) => {

  return(
    <div>
      {data.name} {data.number}
      <button onClick={deletePeople}>delete</button>  
    </div>
    )
}

export default Persons
const Delete = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="delete">
      {message}
    </div>
  )
}

export default Delete
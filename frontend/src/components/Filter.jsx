const Filter = (props) => {
  return (
    <form>
        <div>
          filter shown with <input onChange={props.onChange}/>
        </div>
    </form>
  )
}

export default Filter
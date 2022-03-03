import styles from "./index.css"
import { AiFillCalendar } from 'react-icons/ai'
import Search from './components/Search'
import AddAppointments from './components/AddAppointment'
import AppointmentInfo from './components/AppointmentInfo'
import { useState, useCallback, useEffect } from 'react'
function App() {
  let [appointmentList, setAppointmentList] = useState([]);
  let [query, setQuery] = useState("");
  let [sortBy, setSortBy] = useState("petName")
  let [orderBy, setOrderBy] = useState("asc")
  const filteredAppointments = appointmentList.filter(
    item => {
      const queryLC = query.toLowerCase();
      // the constant is there because for some reason the include method does not allow another lowercase() method to be within it and it breaks the app
      // example item.petName.toLowerCase().includes(query.toLowercase()) will not work so instead.... item.petName.toLowerCase().includes(queryLC) works around it!

      return (
        item.petName.toLowerCase().includes(queryLC) ||
        item.ownerName.toLowerCase().includes(queryLC) ||
        item.aptNotes.toLowerCase().includes(queryLC)


      )
    }
  ).sort((a, b) => {
    let order = (orderBy === 'asc') ? 1 : -1;
    return (a[sortBy].toLowerCase() <
      b[sortBy].toLowerCase() ? -1 * order : 1 * order)
  })
  const fetchData = useCallback(() => {
    fetch('./data.json')
      .then(response => response.json())
      .then(data => {
        setAppointmentList(data)
      })

  }, [])
  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div className="App">
      <h1 className="text-3xl font-bold">Your Appointments</h1>      <AiFillCalendar className="inline-block" />

      <Search query={query} onQueryChange={myQuery => setQuery(myQuery)} orderBy={orderBy} onOrderByChange={mySort => setOrderBy(mySort)} sortBy={sortBy} onSortByChange={mySort => setSortBy(mySort)} />
      <AddAppointments onSendAppointment={myAppointment => setAppointmentList([...appointmentList, myAppointment])} lastId={appointmentList.reduce((max, item) => Number(item.id) > max ? Number(item.id) : max, 0)} />
      <ul className="divide-y divide-x gray-200">
        {filteredAppointments.map(appointment => (

          <AppointmentInfo key={appointment.id} appointment={appointment} onDeleteAppointment={
            appointmentId => setAppointmentList(appointmentList.filter(appointment => appointment.id !== appointmentId))
          } />
        ))}
      </ul>



    </div>
  );
}

export default App;

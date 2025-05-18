"use client"
import React, { useState, useRef, useEffect } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { useModal } from "@/hooks/useModal"
import { Modal } from "@/components/ui/modal"
import { addAbscence } from "@/services/AbscenceService"
import { useRouter } from "next/navigation"
import { editRendezVous } from "@/services/RendezVousService"
import emailjs from "@emailjs/browser"

const Calendar = ({ abscence, medecin, NonEff }) => {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [eventTitle, setEventTitle] = useState("")
  const [eventStartDate, setEventStartDate] = useState("")
  const [eventEndDate, setEventEndDate] = useState("")
  const [eventLevel, setEventLevel] = useState("")
  const [events, setEvents] = useState([])
  const calendarRef = useRef(null)
  const { isOpen, openModal, closeModal } = useModal()
  const router = useRouter()

  const calendarsEvents = {
    Danger: "danger",
    Success: "success",
    Primary: "primary",
    Warning: "warning"
  }

  useEffect(() => {
    const baseEvents = [
      {
        id: "1",
        title: "Event Conf.",
        start: new Date().toISOString().split("T")[0],
        extendedProps: { calendar: "Danger" }
      },
      {
        id: "2",
        title: "Meeting",
        start: new Date(Date.now() + 86400000).toISOString().split("T")[0],
        extendedProps: { calendar: "Success" }
      }
    ]

    const currentYear = new Date().getFullYear()

    fetch(`https://date.nager.at/api/v3/PublicHolidays/${currentYear}/TN`)
      .then(res => res.json())
      .then(data => {
        const holidays = data.map(holiday => ({
          id: `holiday-${holiday.date}`,
          title: holiday.localName,
          start: holiday.date,
          allDay: true,
          extendedProps: { calendar: "Warning" }
        }))
        setEvents([...baseEvents, ...holidays])
      })
      .catch(err => {
        console.error("Erreur de chargement des jours fériés:", err)
        setEvents(baseEvents)
      })
  }, [])

  const handleDateSelect = selectInfo => {
    resetModalFields()
    setEventStartDate(selectInfo.startStr)
    setEventEndDate(selectInfo.startStr)
    openModal()
  }

  const handleEventClick = clickInfo => {
    const event = clickInfo.event
    setSelectedEvent(event)
    setEventTitle(event.title)
    setEventStartDate(event.start?.toISOString().split("T")[0] || "")
    setEventEndDate(event.end?.toISOString().split("T")[0] || event.start?.toISOString().split("T")[0] || "")
    setEventLevel(event.extendedProps.calendar)
    openModal()
  }

  const validateForm = () => {
    if (!eventStartDate || !eventEndDate) return false
    const start = new Date(eventStartDate)
    const end = new Date(eventEndDate)
    return !isNaN(start) && !isNaN(end) && start <= end
  }

  const handleAddOrUpdateEvent = async e => {
    e.preventDefault()

    if (!validateForm()) {
      alert("Veuillez remplir correctement les dates de début et de fin, et assurez-vous que la date de début soit avant la date de fin.")
      return
    }

    if (selectedEvent) {
      setEvents(prevEvents =>
        prevEvents.map(event =>
          event.id === selectedEvent.id
            ? {
                ...event,
                title: eventTitle,
                start: eventStartDate,
                end: eventEndDate,
                extendedProps: { calendar: eventLevel }
              }
            : event
        )
      )
    } else {
      try {
        await addAbscence({
          minDate: eventStartDate,
          maxDate: eventEndDate,
          idMed: medecin.id
        })

        if (Array.isArray(NonEff) && NonEff.length > 0) {
          const rendezVousAReporter = NonEff.filter(n => {
            const date = new Date(n.dateRendez).toISOString().split("T")[0]
            return date >= eventStartDate && date <= eventEndDate
          })

          for (const n of rendezVousAReporter.filter((red)=>red.etat!=="REPORTE")) {
            await editRendezVous({ ...n, etat: "REPORTE" })
            console.log("maol"+n.patient.utilisateur.email )
                        console.log("nom : "+n.patient.utilisateur.nom )

             await sendMail(
  n.patient.utilisateur.nom + " " + n.patient.utilisateur.prenom,                                // toEmail : email réel
  n.patient.utilisateur.email, // fromName : nom du médecin
  n.patient.utilisateur.nom + " " + n.patient.utilisateur.prenom, // toName
  medecin.utilisateur.nom + " " + medecin.utilisateur.prenom  // doc
)

          }
        }

        router.push("/medecinAdmin/calendar/")
        router.refresh()
      } catch (error) {
        alert("Erreur lors de l'ajout de l'absence : " + error.message)
      }
    }

    closeModal()
    resetModalFields()
  }

  const sendMail = (toEmail, fromName, toName,doc) => {
    const params = {
      from_name: fromName,
      to_name: toName,
      to_email: toEmail,
      doc:doc
    }

    const serviceID = "service_n5igvmb"
    const templateID = "template_uesdift"

    return emailjs
      .send(serviceID, templateID, params, "D-fPdQEmCDovUoQ4x")
      .then(response => {
        console.log("Message envoyé avec succès !", response.status, response.text)
      })
      .catch(error => {
        console.error("Échec de l'envoi du message :", error)
      })
  }

  const resetModalFields = () => {
    setEventTitle("")
    setEventStartDate("")
    setEventEndDate("")
    setEventLevel("")
    setSelectedEvent(null)
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next addEventButton",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay"
        }}
        events={events}
        selectable={true}
        select={handleDateSelect}
        eventClick={handleEventClick}
        eventContent={renderEventContent}
        customButtons={{
          addEventButton: {
            text: "Add Event +",
            click: openModal
          }
        }}
      />

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] p-6 lg:p-10">
        <form className="flex flex-col px-2 overflow-y-auto custom-scrollbar" onSubmit={handleAddOrUpdateEvent}>
          <div>
            <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
              {selectedEvent ? "Edit Event" : "Add Event"}
            </h5>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Plan your next big moment: schedule or edit an event to stay on track
            </p>
          </div>

          <div className="mt-8">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Event Title
            </label>
            <input
              type="text"
              value={eventTitle}
              onChange={e => setEventTitle(e.target.value)}
              className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:border-gray-700 dark:text-white/90"
            />

            <div className="mt-6">
              <label className="block mb-4 text-sm font-medium text-gray-700 dark:text-gray-400">
                Event Color
              </label>
              <div className="flex flex-wrap items-center gap-4 sm:gap-5">
                {Object.entries(calendarsEvents).map(([key]) => (
                  <label key={key} className="flex items-center text-sm text-gray-700 dark:text-gray-400">
                    <input
                      type="radio"
                      name="event-level"
                      value={key}
                      checked={eventLevel === key}
                      onChange={() => setEventLevel(key)}
                      className="mr-2"
                    />
                    {key}
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Start Date
              </label>
              <input
                type="date"
                value={eventStartDate}
                onChange={e => setEventStartDate(e.target.value)}
                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 px-4 text-sm dark:border-gray-700 dark:text-white/90"
              />
            </div>

            <div className="mt-6">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                End Date
              </label>
              <input
                type="date"
                value={eventEndDate}
                onChange={e => setEventEndDate(e.target.value)}
                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 px-4 text-sm dark:border-gray-700 dark:text-white/90"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
            <button
              onClick={closeModal}
              type="button"
              className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 sm:w-auto"
            >
              Close
            </button>
            <button
              type="submit"
              className="flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm text-white sm:w-auto"
            >
              {selectedEvent ? "Update Changes" : "Add Event"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

const renderEventContent = eventInfo => {
  const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar?.toLowerCase() || "primary"}`
  return (
    <div className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm`}>
      <div className="fc-daygrid-event-dot"></div>
      <div className="fc-event-time">{eventInfo.timeText}</div>
      <div className="fc-event-title">{eventInfo.event.title}</div>
    </div>
  )
}

export default Calendar
  
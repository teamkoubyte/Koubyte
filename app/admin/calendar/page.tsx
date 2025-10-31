'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, User, Mail, Phone } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns'
import { nl } from 'date-fns/locale/nl'

interface Appointment {
  id: string
  date: string
  time: string
  service: string
  description: string
  status: string
  user: {
    id: string
    name: string
    email: string
  }
}

export const dynamic = 'force-dynamic'
export default function AdminCalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedAppointments, setSelectedAppointments] = useState<Appointment[]>([])
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')

  useEffect(() => {
    fetchAppointments()
  }, [currentMonth])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/appointments')
      if (response.ok) {
        const data = await response.json()
        setAppointments(data)
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    const dateString = format(date, 'yyyy-MM-dd')
    const dayAppointments = appointments.filter(apt => apt.date === dateString)
    setSelectedAppointments(dayAppointments)
  }

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const handleToday = () => {
    setCurrentMonth(new Date())
    setSelectedDate(new Date())
    handleDateClick(new Date())
  }

  const getAppointmentsForDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd')
    return appointments.filter(apt => apt.date === dateString)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800'
      case 'confirmed':
        return 'bg-blue-100 border-blue-300 text-blue-800'
      case 'completed':
        return 'bg-green-100 border-green-300 text-green-800'
      case 'cancelled':
        return 'bg-red-100 border-red-300 text-red-800'
      default:
        return 'bg-slate-100 border-slate-300 text-slate-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'In behandeling'
      case 'confirmed':
        return 'Bevestigd'
      case 'completed':
        return 'Voltooid'
      case 'cancelled':
        return 'Geannuleerd'
      default:
        return status
    }
  }

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart, { locale: nl })
  const calendarEnd = endOfWeek(monthEnd, { locale: nl })
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00',
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Kalender</h1>
          <p className="text-slate-600 mt-1 text-sm sm:text-base">Bekijk alle afspraken in kalender weergave</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleToday} variant="outline" size="sm">
            Vandaag
          </Button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={handlePreviousMonth}
                variant="outline"
                size="sm"
                className="w-10 h-10 p-0"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 min-w-[200px] text-center">
                {format(currentMonth, 'MMMM yyyy', { locale: nl })}
              </h2>
              <Button
                onClick={handleNextMonth}
                variant="outline"
                size="sm"
                className="w-10 h-10 p-0"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
            <Select value={view} onValueChange={(value: any) => setView(value)}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Maand</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="day">Dag</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {/* Month View */}
          {view === 'month' && (
            <div className="space-y-4">
              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'].map((day, index) => (
                  <div
                    key={index}
                    className="text-center font-semibold text-slate-600 py-2 text-sm sm:text-base"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, index) => {
                  const dayAppointments = getAppointmentsForDate(day)
                  const isCurrentMonth = isSameMonth(day, currentMonth)
                  const isToday = isSameDay(day, new Date())
                  const isSelected = selectedDate && isSameDay(day, selectedDate)

                  return (
                    <div
                      key={index}
                      onClick={() => handleDateClick(day)}
                      className={`
                        min-h-[100px] sm:min-h-[120px] p-2 border-2 rounded-lg cursor-pointer transition-all
                        ${!isCurrentMonth ? 'opacity-40 bg-slate-50' : 'bg-white hover:bg-blue-50'}
                        ${isToday ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}
                        ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                      `}
                    >
                      <div className={`text-sm font-semibold mb-1 ${
                        isToday ? 'text-blue-600' : 'text-slate-700'
                      }`}>
                        {format(day, 'd')}
                      </div>
                      <div className="space-y-1 overflow-hidden">
                        {dayAppointments.slice(0, 3).map((apt) => (
                          <div
                            key={apt.id}
                            className={`text-xs px-1.5 py-0.5 rounded border truncate ${getStatusColor(apt.status)}`}
                            title={`${apt.time} - ${apt.service} - ${apt.user.name}`}
                          >
                            <span className="font-medium">{apt.time}</span> {apt.user.name.split(' ')[0]}
                          </div>
                        ))}
                        {dayAppointments.length > 3 && (
                          <div className="text-xs text-slate-600 font-medium">
                            +{dayAppointments.length - 3} meer
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Week View */}
          {view === 'week' && (
            <div className="space-y-4">
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 7 }).map((_, index) => {
                  const date = new Date(calendarStart)
                  date.setDate(calendarStart.getDate() + index)
                  const dayAppointments = getAppointmentsForDate(date)
                  const isToday = isSameDay(date, new Date())

                  return (
                    <div
                      key={index}
                      className={`
                        min-h-[300px] p-3 border-2 rounded-lg
                        ${isToday ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white'}
                      `}
                    >
                      <div className={`text-sm font-semibold mb-3 ${
                        isToday ? 'text-blue-600' : 'text-slate-700'
                      }`}>
                        {format(date, 'EEE d MMM', { locale: nl })}
                      </div>
                      <div className="space-y-2">
                        {dayAppointments.map((apt) => (
                          <div
                            key={apt.id}
                            className={`text-xs p-2 rounded border ${getStatusColor(apt.status)}`}
                          >
                            <div className="font-medium">{apt.time}</div>
                            <div className="font-semibold mt-1">{apt.user.name}</div>
                            <div className="text-xs mt-1 opacity-75">{apt.service}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Day View */}
          {view === 'day' && selectedDate && (
            <div className="space-y-4">
              <div className="text-xl font-bold text-slate-900 mb-4">
                {format(selectedDate, 'EEEE d MMMM yyyy', { locale: nl })}
              </div>
              <div className="space-y-2">
                {timeSlots.map((slot) => {
                  const slotAppointments = selectedAppointments.filter(apt => apt.time === slot)
                  return (
                    <div key={slot} className="flex gap-4 border-b pb-2">
                      <div className="w-20 font-semibold text-slate-700 text-sm sm:text-base">
                        {slot}
                      </div>
                      <div className="flex-1 space-y-2">
                        {slotAppointments.map((apt) => (
                          <Card key={apt.id} className={`${getStatusColor(apt.status)} border-2`}>
                            <CardContent className="p-3 sm:p-4">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <div className="font-semibold text-sm sm:text-base mb-1">
                                    {apt.user.name}
                                  </div>
                                  <div className="text-xs sm:text-sm opacity-75 mb-2">
                                    {apt.service}
                                  </div>
                                  <div className="text-xs text-slate-600 line-clamp-2">
                                    {apt.description}
                                  </div>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${getStatusColor(apt.status)}`}>
                                  {getStatusLabel(apt.status)}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {apt.user.email}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                        {slotAppointments.length === 0 && (
                          <div className="text-xs text-slate-400 italic">Geen afspraken</div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Date Appointments */}
      {selectedDate && view === 'month' && (
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Afspraken op {format(selectedDate, 'd MMMM yyyy', { locale: nl })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedAppointments.length > 0 ? (
              <div className="space-y-4">
                {selectedAppointments.sort((a, b) => a.time.localeCompare(b.time)).map((apt) => (
                  <Card key={apt.id} className={`${getStatusColor(apt.status)} border-2`}>
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4 text-slate-600" />
                            <span className="font-semibold text-slate-900">{apt.time}</span>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(apt.status)}`}>
                              {getStatusLabel(apt.status)}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-slate-900 mb-1">{apt.service}</h3>
                          <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {apt.user.name}
                            </span>
                            <span className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              {apt.user.email}
                            </span>
                          </div>
                          <p className="text-sm text-slate-700">{apt.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                Geen afspraken op deze dag
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}



import React, { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Reservation } from '@/hooks/reservations';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { useLanguage } from "@/hooks/language";

interface CalendarViewProps {
  reservations: Reservation[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ reservations }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [reservationsOnDate, setReservationsOnDate] = useState<Reservation[]>([]);
  const { t } = useLanguage();
  
  // Convertir les dates de chaîne en objets Date
  const reservationsWithDates = reservations.map(res => ({
    ...res,
    checkInDate: new Date(res.checkIn),
    checkOutDate: new Date(res.checkOut)
  }));
  
  // Fonction pour déterminer si une date a des réservations
  const isDayWithReservation = (date: Date) => {
    return reservationsWithDates.some(res => {
      const checkIn = res.checkInDate;
      const checkOut = res.checkOutDate;
      return date >= checkIn && date <= checkOut;
    });
  };
  
  // Fonction pour récupérer les réservations d'une date donnée
  const getReservationsForDate = (date: Date) => {
    const reservationsOnDate = reservationsWithDates.filter(res => {
      const checkIn = res.checkInDate;
      const checkOut = res.checkOutDate;
      return date >= checkIn && date <= checkOut;
    });
    
    setReservationsOnDate(reservationsOnDate);
  };
  
  const handleSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      getReservationsForDate(date);
    } else {
      setReservationsOnDate([]);
    }
  };
  
  // Fonction pour obtenir la couleur du badge en fonction du statut de réservation
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date strings to locale format
  const formatDateString = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          className="rounded-md border shadow p-3 pointer-events-auto"
          modifiers={{
            booked: (date) => isDayWithReservation(date),
          }}
          modifiersClassNames={{
            booked: "bg-primary/10 font-bold text-primary",
          }}
          components={{
            DayContent: ({ date }) => {
              const hasReservation = isDayWithReservation(date);
              return (
                <div className="relative w-full h-full flex items-center justify-center">
                  {date.getDate()}
                  {hasReservation && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                  )}
                </div>
              );
            },
          }}
        />
      </div>
      
      <div className="md:col-span-1">
        <Card>
          <CardContent className="p-4">
            {selectedDate ? (
              <>
                <div className="flex items-center space-x-2 mb-4">
                  <CalendarIcon className="h-5 w-5 text-gray-500" />
                  <h3 className="font-medium">
                    {t('reservations_for') || 'Réservations du'} {format(selectedDate, 'dd/MM/yyyy')}
                  </h3>
                </div>
                
                {reservationsOnDate.length > 0 ? (
                  <div className="space-y-3">
                    {reservationsOnDate.map((res) => (
                      <div key={res.id} className="p-3 border rounded-md">
                        <div className="font-medium">{res.listingTitle}</div>
                        <div className="text-sm text-gray-500">{res.listingLocation}</div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="text-xs">
                            {formatDateString(res.checkIn)} - {formatDateString(res.checkOut)}
                          </div>
                          <Badge className={getStatusColor(res.status)}>
                            {res.status === 'confirmed' ? (t('confirmed') || 'Confirmée') : 
                             res.status === 'pending' ? (t('pending') || 'En attente') : (t('cancelled') || 'Annulée')}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    {t('no_reservations_for_date') || 'Aucune réservation pour cette date'}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-6 text-gray-500">
                {t('select_date_to_see_reservations') || 'Sélectionnez une date pour voir les réservations'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

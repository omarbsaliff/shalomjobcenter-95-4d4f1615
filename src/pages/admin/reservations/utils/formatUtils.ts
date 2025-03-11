
import { Reservation } from "@/hooks/reservations"; 
import { toast } from "sonner";
import { format } from "date-fns";

// Format date strings to locale format
export const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), 'dd/MM/yyyy');
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

// Export data to CSV
export const exportToCSV = (
  type: 'reservations' | 'applications', 
  data: any[]
) => {
  let csvContent = '';
  let filename = '';
  
  if (type === 'reservations') {
    // En-têtes CSV pour les réservations
    csvContent = 'ID,Client,Email,Logement,Localisation,Arrivée,Départ,Voyageurs,Prix,Statut,Date Création\n';
    
    // Données
    data.forEach((reservation: Reservation) => {
      csvContent += `"${reservation.id}","${reservation.guestName}","${reservation.guestEmail}","${reservation.listingTitle}","${reservation.listingLocation}","${reservation.checkIn}","${reservation.checkOut}","${reservation.guests}","${reservation.totalPrice}","${reservation.status}","${reservation.createdAt}"\n`;
    });
    
    filename = `reservations_export_${new Date().toISOString().split('T')[0]}.csv`;
  } else {
    // En-têtes CSV pour les candidatures
    csvContent = 'ID,Candidat,Email,Téléphone,Offre,Localisation,Date Candidature,Statut\n';
    
    // Données
    data.forEach((item: any) => {
      csvContent += `"${item.application.id}","${item.application.applicantName}","${item.application.email}","${item.application.phone}","${item.job.title}","${item.job.location}","${item.application.submittedAt}","${item.application.status}"\n`;
    });
    
    filename = `candidatures_export_${new Date().toISOString().split('T')[0]}.csv`;
  }

  // Créer un blob et télécharger
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  toast.success(`Export des ${type === 'reservations' ? 'réservations' : 'candidatures'} réussi`);
};

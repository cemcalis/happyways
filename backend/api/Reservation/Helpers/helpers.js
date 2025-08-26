export function calculateDuration(pickupDate, pickupTime, dropoffDate, dropoffTime) {
  const startDateTime = new Date(`${pickupDate}T${pickupTime}:00`);
  const endDateTime = new Date(`${dropoffDate}T${dropoffTime}:00`);

  const diffTime = Math.abs(endDateTime - startDateTime);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

  if (diffDays >= 1) {
    return `${diffDays} gün`;
  } else {
    return `${diffHours} saat`;
  }
}

export function getStatusInfo(reservation, currentDate, currentTime) {
  const pickupDateTime = new Date(`${reservation.pickup_date}T${reservation.pickup_time}:00`);
  const dropoffDateTime = new Date(`${reservation.dropoff_date}T${reservation.dropoff_time}:00`);
  const currentDateTime = new Date(`${currentDate}T${currentTime}:00`);

  if (reservation.status === 'cancelled') {
    return {
      status: 'cancelled',
      message: 'İptal edildi',
      color: '#FF6B6B',
      icon: 'cancel'
    };
  }

  if (currentDateTime < pickupDateTime) {
    const timeDiff = pickupDateTime - currentDateTime;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    return {
      status: 'upcoming',
      message: daysDiff === 1 ? 'Yarın başlıyor' : `${daysDiff} gün sonra`,
      color: '#4ECDC4',
      icon: 'schedule'
    };
  }

  if (currentDateTime >= pickupDateTime && currentDateTime <= dropoffDateTime) {
    return {
      status: 'active',
      message: 'Devam ediyor',
      color: '#45B7D1',
      icon: 'directions_car'
    };
  }

  return {
    status: 'completed',
    message: 'Tamamlandı',
    color: '#96CEB4',
    icon: 'check_circle'
  };
}
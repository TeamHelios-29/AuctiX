// File: components/delivery/shared/DateHelper.tsx
export const getDaysInfo = (deliveryDate: string, status: string) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const delivery = new Date(deliveryDate);
    delivery.setHours(0, 0, 0, 0);

    const diffTime = delivery.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (status.toLowerCase() === 'delivered') {
      if (diffDays < 0) {
        return {
          text: `Delivered ${Math.abs(diffDays)} days ago`,
          isOverdue: false,
        };
      } else {
        return {
          text: 'Delivered today',
          isOverdue: false,
        };
      }
    } else {
      if (diffDays > 0) {
        return {
          text: `${diffDays} days remaining`,
          isOverdue: false,
        };
      } else if (diffDays < 0) {
        return {
          text: `${Math.abs(diffDays)} days overdue`,
          isOverdue: true,
        };
      } else {
        return {
          text: 'Due today',
          isOverdue: false,
        };
      }
    }
  } catch (error) {
    console.error('Error calculating days info:', error);
    return {
      text: 'Unknown',
      isOverdue: false,
    };
  }
};

export const isValidDate = (dateString: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

// New function to check if a date is in the past
export const isPastDate = (dateString: string): boolean => {
  if (!isValidDate(dateString)) return false;

  const date = new Date(dateString);
  date.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return date < today;
};

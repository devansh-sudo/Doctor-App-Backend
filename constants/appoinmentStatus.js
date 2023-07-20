const appointmentStatus = {
    pending: 'pending',
    progress: 'progress',
    completed: 'completed',
}

const appointmentStatusArray = Object.keys(appointmentStatus);

module.exports = {appointmentStatus, appointmentStatusArray};

const appointmentStatus = {
    pending: 'pending',
    progress: 'progress',
    completed: 'completed',
    cancel : 'cancel'
}

const appointmentStatusArray = Object.keys(appointmentStatus);

module.exports = {appointmentStatus, appointmentStatusArray};
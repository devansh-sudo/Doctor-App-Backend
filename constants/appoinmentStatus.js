const appointmentStatus = {
    pending: 'pending',
    progress: 'progress',
    completed: 'completed',
    failed: 'failed',
    refunded: 'refunded',
}

const appointmentStatusArray = Object.keys(appointmentStatus);

module.exports = {appointmentStatus, appointmentStatusArray};
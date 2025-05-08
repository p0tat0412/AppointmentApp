const DoctorAppointments = () => {
  const appointments = [
    { id: 1, patient: "John Doe", time: "10:00 AM", reason: "Headache" },
    { id: 2, patient: "Jane Smith", time: "11:30 AM", reason: "Back pain" },
  ];

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Today's Appointments</h1>
      <div className="space-y-4">
        {appointments.map((appt) => (
          <div key={appt.id} className="bg-[#E0F2FE] p-4 rounded-xl shadow-md flex justify-between items-center">
            <div>
              <p className="text-gray-900 font-semibold">{appt.patient}</p>
              <p className="text-gray-700 text-sm">{appt.time} – {appt.reason}</p>
            </div>
            <button className="bg-[#2563EB] hover:bg-[#3B82F6] text-white px-4 py-2 rounded-md text-sm shadow">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorAppointments;

import { useEffect, useState } from "react";

interface Appointment {
  _id: string;
  patient: { fullName: string }; // Assuming populated
  time: string;
  date: string;
  problem: string;
}

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Replace with actual logged-in doctor ID from context/auth/session
  const doctorIdStr = localStorage.getItem("userInfo");
  const doctorId = doctorIdStr ? JSON.parse(doctorIdStr) : null;

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/appointment/doctor/${doctorId.id}`);
        const data = await res.json();
        setAppointments(data);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      fetchAppointments();
    }
  }, [doctorId]);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Your Appointments</h1>
      {appointments.length === 0 ? (
        <p className="text-gray-600">No appointments found.</p>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt) => (
            <div key={appt._id} className="bg-[#E0F2FE] p-4 rounded-xl shadow-md flex justify-between items-center">
              <div>
                <p className="text-gray-900 font-semibold">{appt.patient?.fullName || "Unnamed Patient"}</p>
                <p className="text-gray-700 text-sm">
                  {appt.date} at {appt.time} – {appt.problem}
                </p>
              </div>
              <button className="bg-[#2563EB] hover:bg-[#3B82F6] text-white px-4 py-2 rounded-md text-sm shadow">
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;

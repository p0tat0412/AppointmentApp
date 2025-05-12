import { FormEvent, useEffect, useState } from "react";

interface Appointment {
  appointmentId: string;
  patientId: string;
  doctorId: string;
  time: string;
  date: string;
  gender: string;
  problem: string;
  fullName: string
}

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [symptoms, setSymptoms] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [medications, setMedications] = useState("");
  const [followUps, setFollowUps] = useState("");
  
  const doctorIdStr = localStorage.getItem("userInfo");
  const doctorId = doctorIdStr ? JSON.parse(doctorIdStr) : null;

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch(`/api/appointment/doctor/${doctorId.id}`);
        const data = await res.json();
        console.log(data)
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
  }, []);

  const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  if(!selectedAppt) return;

  await fetch(`/api/appointment/${selectedAppt.appointmentId}/feedback`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ symptoms, diagnosis, medications, followUps }),
  });

  alert('Feedback saved!');
  setSelectedAppt(null);
};

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Your Appointments
      </h1>
      {appointments.length === 0 ? (
        <p className="text-gray-600">No appointments found.</p>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt) => (
            <div
              key={appt.appointmentId}
              className="bg-[#E0F2FE] p-4 rounded-xl shadow-md flex justify-between items-center"
            >
              <div>
                <p className="text-gray-900 font-semibold">
                  {appt.fullName || "Unnamed Patient"}
                </p>
                <p className="text-gray-700 text-sm">
                  {appt.date} at {appt.time} – {appt.problem}
                </p>
              </div>
              <button 
                onClick={() => setSelectedAppt(appt)}
                className="bg-[#2563EB] hover:bg-[#3B82F6] text-white px-4 py-2 rounded-md text-sm shadow">
                  View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedAppt && (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Appointment Details</h2>
          <p><strong>Name:</strong> {selectedAppt.fullName}</p>
          <p><strong>Date:</strong> {selectedAppt.date}</p>
          <p><strong>Time:</strong> {selectedAppt.time}</p>
          <p><strong>Problem:</strong> {selectedAppt.problem}</p>

          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <textarea
              placeholder="Symptoms"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <textarea
              placeholder="Diagnosis"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <textarea
              placeholder="Medications"
              value={medications}
              onChange={(e) => setMedications(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <textarea
              placeholder="Follow-ups"
              value={followUps}
              onChange={(e) => setFollowUps(e.target.value)}
              className="w-full p-2 border rounded"
            />

            <button
              type="submit"
              className="bg-[#2563EB] hover:bg-[#3B82F6] text-white px-4 py-2 rounded-md"
            >
              Submit
            </button>
          </form>

        </div>
      </div>
    )}

    </div>
  );
};

export default DoctorAppointments;

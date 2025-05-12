import { FormEvent, useEffect, useState } from "react";

interface Appointment {
  appointmentId: string;
  patientId: string;
  doctorId: string;
  time: string;
  date: string;
  gender: string;
  problem: string;
  fullName: string;
  symptoms: string;
  diagnosis: string;
  medications: string;
  followUps: string;
}

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [symptoms, setSymptoms] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [medications, setMedications] = useState("");
  const [followUps, setFollowUps] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const doctorIdStr = localStorage.getItem("userInfo");
  const doctorId = doctorIdStr ? JSON.parse(doctorIdStr) : null;

  const now = new Date();
  const todayStr = now.toISOString().split("T")[0]; // yyyy-mm-dd

  const isPast = (appt: Appointment) => {
    const apptDateTime = new Date(`${appt.date}T${appt.time}`);
    return apptDateTime < now;
  };

  const isToday = (appt: Appointment) => appt.date === todayStr;

  const upcoming = appointments.filter((a) => !isPast(a));
  const todaysAppointments = upcoming.filter(isToday);
  const futureAppointments = upcoming.filter((a) => !isToday(a));
  const past = appointments.filter((a) => isPast(a));

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch(`/api/appointment/doctor/${doctorId.id}`);
        const data = await res.json();
        setAppointments(data);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) fetchAppointments();
  }, []);

  const handleViewDetails = async (appt: Appointment) => {
    setSelectedAppt(appt);
    setIsEditing(!isPast(appt));

    try {
      const res = await fetch(`/api/appointment/${appt.appointmentId}/feedback`);
      if (res.ok) {
        const data = await res.json();
        setSymptoms(data.symptoms || "");
        setDiagnosis(data.diagnosis || "");
        setMedications(data.medications || "");
        setFollowUps(data.followUps || "");
      } else {
        setSymptoms("");
        setDiagnosis("");
        setMedications("");
        setFollowUps("");
      }
    } catch (err) {
      console.error("Error fetching feedback:", err);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedAppt) return;

    await fetch(`/api/appointment/${selectedAppt.appointmentId}/feedback`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symptoms, diagnosis, medications, followUps }),
    });

    alert("Feedback saved!");
    setSelectedAppt(null);
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Your Appointments</h1>

      {/* TODAY */}
      <h2 className="text-xl font-semibold text-blue-800 mt-4 mb-2">Today's Appointments</h2>
      {todaysAppointments.length === 0 ? (
        <p className="text-gray-600">No appointments today.</p>
      ) : (
        <div className="space-y-4">
          {todaysAppointments.map((appt) => (
            <div
              key={appt.appointmentId}
              className="bg-[#E0F2FE] p-4 rounded-xl shadow-md flex justify-between items-center"
            >
              <div>
                <p className="text-gray-900 font-semibold">{appt.fullName || "Unnamed Patient"}</p>
                <p className="text-gray-700 text-sm">{appt.date} at {appt.time} – {appt.problem}</p>
              </div>
              <button
                onClick={() => handleViewDetails(appt)}
                className="bg-[#2563EB] hover:bg-[#3B82F6] text-white px-4 py-2 rounded-md text-sm shadow"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* UPCOMING */}
      <h2 className="text-xl font-semibold text-blue-800 mt-8 mb-2">Upcoming Appointments</h2>
      {futureAppointments.length === 0 ? (
        <p className="text-gray-600">No upcoming appointments.</p>
      ) : (
        <div className="space-y-4">
          {futureAppointments.map((appt) => (
            <div
              key={appt.appointmentId}
              className="bg-blue-100 p-4 rounded-xl shadow-md flex justify-between items-center"
            >
              <div>
                <p className="text-gray-900 font-semibold">{appt.fullName || "Unnamed Patient"}</p>
                <p className="text-gray-700 text-sm">{appt.date} at {appt.time} – {appt.problem}</p>
              </div>
              <button
                disabled
                className="bg-gray-300 text-white px-4 py-2 rounded-md text-sm shadow cursor-not-allowed"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* PAST */}
      <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-2">Past Appointments</h2>
      {past.length === 0 ? (
        <p className="text-gray-600">No past appointments.</p>
      ) : (
        <div className="space-y-4">
          {past.map((appt) => (
            <div
              key={appt.appointmentId}
              className="bg-gray-100 p-4 rounded-xl shadow-md flex justify-between items-center"
            >
              <div>
                <p className="text-gray-900 font-semibold">{appt.fullName || "Unnamed Patient"}</p>
                <p className="text-gray-700 text-sm">{appt.date} at {appt.time} – {appt.problem}</p>
              </div>
              <button
                onClick={() => handleViewDetails(appt)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm shadow"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {selectedAppt && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Appointment Details</h2>
            <p><strong>Name:</strong> {selectedAppt.fullName}</p>
            <p><strong>Date:</strong> {selectedAppt.date}</p>
            <p><strong>Time:</strong> {selectedAppt.time}</p>
            <p><strong>Problem:</strong> {selectedAppt.problem}</p>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <textarea
                placeholder="Symptoms"
                value={selectedAppt.symptoms || " "}
                onChange={(e) => setSymptoms(e.target.value)}
                className="w-full p-2 border rounded"
                disabled={!isEditing}
              />
              <textarea
                placeholder="Diagnosis"
                value={selectedAppt.diagnosis || " "}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="w-full p-2 border rounded"
                disabled={!isEditing}
              />
              <textarea
                placeholder="Medications"
                value={selectedAppt.medications || " "}
                onChange={(e) => setMedications(e.target.value)}
                className="w-full p-2 border rounded"
                disabled={!isEditing}
              />
              <textarea
                placeholder="Follow-ups"
                value={selectedAppt.followUps || " "}
                onChange={(e) => setFollowUps(e.target.value)}
                className="w-full p-2 border rounded"
                disabled={!isEditing}
              />

              <div className="flex justify-end mt-2">
                {isEditing && (
                  <button
                    type="submit"
                    className="bg-[#2563EB] hover:bg-[#3B82F6] text-white px-4 py-2 rounded-md"
                  >
                    Submit
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedAppt(null)}
                  className="ml-2 bg-gray-400 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;

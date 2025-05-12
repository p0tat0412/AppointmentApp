import React, { useEffect, useState } from "react";

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

const MedicalHistoryPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<"upcoming" | "history">("upcoming");
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const today = new Date().toISOString().split("T")[0];

  const todayAppointments = appointments.filter(a => a.date === today);
  const futureAppointments = appointments.filter(a => a.date > today);
  const pastAppointments = appointments.filter(a => a.date < today);



  useEffect(() => {
    const fetchAppointments = async () => {
      const userIdStr = localStorage.getItem("userInfo");
      const user = userIdStr ? JSON.parse(userIdStr) : null;

      console.log("USERID:",user.id)
      try {
        const res = await fetch(`/api/appointment/patient/${user.id}`);
        const data = await res.json();
        console.log(data)
        setAppointments(data);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 p-6 text-white">
          <h1 className="text-2xl md:text-3xl font-bold">Medical History</h1>
        </div>

        <div className="p-6 md:p-8">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`py-2 px-4 font-medium ${currentTab === "upcoming" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setCurrentTab("upcoming")}
            >
              Upcoming Appointments
            </button>
            <button
              className={`py-2 px-4 font-medium ${currentTab === "history" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setCurrentTab("history")}
            >
              Appointment History
            </button>
          </div>

          {currentTab === "upcoming" ? (
            <div className="space-y-6">
              {/* Today */}
              <div>
                <h2 className="text-lg font-semibold mb-2 text-gray-700">Today's Appointments</h2>
                {todayAppointments.length === 0 ? (
                  <p className="text-gray-500">No appointments for today.</p>
                ) : (
                  todayAppointments.map((appt) => (
                    <div key={appt.appointmentId} className="p-4 bg-blue-50 rounded-lg shadow-sm">
                      <p className="font-medium text-gray-800">{appt.fullName}</p>
                      <p className="text-sm text-gray-600">{appt.date} at {appt.time} — {appt.problem}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Upcoming */}
              <div>
                <h2 className="text-lg font-semibold mb-2 text-gray-700">Upcoming Appointments</h2>
                {futureAppointments.length === 0 ? (
                  <p className="text-gray-500">No upcoming appointments.</p>
                ) : (
                  futureAppointments.map((appt) => (
                    <div key={appt.appointmentId} className="p-4 bg-blue-100 rounded-lg shadow-sm">
                      <p className="font-medium text-gray-800">{appt.fullName}</p>
                      <p className="text-sm text-gray-600">{appt.date} at {appt.time} — {appt.problem}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Previous Appointments</h2>

              {pastAppointments.length === 0 ? (
                <p className="text-gray-500">No past appointments.</p>
              ) : (
                pastAppointments.map((appt) => (
                  <div key={appt.appointmentId} className="border border-gray-200 rounded-lg p-6 hover:shadow-md">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      {appt.date} – {appt.fullName}
                    </h3>
                    <p className="text-gray-700"><strong>Problem:</strong> {appt.problem}</p>
                    <p className="text-gray-700"><strong>Symptoms:</strong> {appt.symptoms}</p>
                    <p className="text-gray-700"><strong>Diagnosis:</strong> {appt.diagnosis}</p>
                    <p className="text-gray-700"><strong>Medications:</strong> {appt.medications}</p>
                    <p className="text-gray-700"><strong>Follow-ups:</strong> {appt.followUps}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalHistoryPage;

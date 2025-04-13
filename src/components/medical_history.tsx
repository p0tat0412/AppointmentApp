import React, { useState } from "react";

interface Appointment {
  date: string;
  doctor: string;
  specialty: string;
  symptoms: string[];
  diagnosis: string;
  medications: string[];
  followUpInstructions: string;
  followUpScheduled: boolean;
}

interface Booking {
  date: string;
  time: string;
  patientName: string;
  age?: number;
  gender?: string;
  isAnotherPerson: boolean;
}

const MedicalHistoryPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<"upcoming" | "history">(
    "upcoming",
  );

  const pastAppointments: Appointment[] = [
    {
      date: "12 Jan 2024",
      doctor: "Dr. Emily Johnson",
      specialty: "General Medicine",
      symptoms: ["Fever", "Cough"],
      diagnosis: "Viral Infection",
      medications: ["Panostigmol", "Best"],
      followUpInstructions:
        "Return for check-up if symptoms persist after 5 days",
      followUpScheduled: false,
    },
    {
      date: "15 Dec 2023",
      doctor: "Dr. John Doe",
      specialty: "Dermatology",
      symptoms: ["Rash", "Itching"],
      diagnosis: "Allergic Reaction",
      medications: ["Antihistamine", "Cream"],
      followUpInstructions: "Apply cream twice daily and avoid allergens",
      followUpScheduled: true,
    },
    {
      date: "20 Nov 2023",
      doctor: "Dr. Sarah Lee",
      specialty: "Cardiology",
      symptoms: ["Chest Pain", "Shortness of Breath"],
      diagnosis: "Anxiety Attack",
      medications: ["Anxiolytic"],
      followUpInstructions: "Monitor symptoms and return if they worsen",
      followUpScheduled: false,
    },
  ];

  const upcomingAppointment: Booking = {
    date: "19th April, 2025",
    time: "10:00 AM",
    patientName: "David Brown",
    gender: "Male",
    age: 23,
    isAnotherPerson: true,
  };

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
              <div className="bg-blue-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  {upcomingAppointment.date} - {upcomingAppointment.time}
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-medium text-gray-700">
                      Booking For:
                    </h3>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {upcomingAppointment.isAnotherPerson
                        ? "For Another Person"
                        : "For Yourself"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium">
                        {upcomingAppointment.patientName}
                      </p>
                    </div>
                    {upcomingAppointment.age && (
                      <div>
                        <p className="text-sm text-gray-500">Age</p>
                        <p className="font-medium">{upcomingAppointment.age}</p>
                      </div>
                    )}
                    {upcomingAppointment.gender && (
                      <div>
                        <p className="text-sm text-gray-500">Gender</p>
                        <p className="font-medium">
                          {upcomingAppointment.gender}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Previous Appointments
              </h2>

              {pastAppointments.map((appointment, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium text-gray-800">
                      {appointment.date} - {appointment.doctor}
                    </h3>
                    <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                      {appointment.specialty}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-md font-medium text-gray-700 mb-2">
                        Symptoms
                      </h4>
                      <ul className="list-disc list-inside">
                        {appointment.symptoms.map((symptom, i) => (
                          <li key={i} className="text-gray-700">
                            {symptom}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-md font-medium text-gray-700 mb-2">
                        Diagnosis
                      </h4>
                      <p className="text-gray-700">{appointment.diagnosis}</p>
                    </div>

                    <div>
                      <h4 className="text-md font-medium text-gray-700 mb-2">
                        Medications
                      </h4>
                      <ul className="list-disc list-inside">
                        {appointment.medications.map((med, i) => (
                          <li key={i} className="text-gray-700">
                            {med}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-md font-medium text-gray-700 mb-2">
                        Follow-Up
                      </h4>
                      <p className="text-gray-700 mb-2">
                        {appointment.followUpInstructions}
                      </p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm ${appointment.followUpScheduled
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                          }`}
                      >
                        {appointment.followUpScheduled
                          ? "Scheduled"
                          : "Not Scheduled"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalHistoryPage;

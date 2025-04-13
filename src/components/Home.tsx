import { FaStar, FaRegStar, FaCalendarAlt, FaClock } from "react-icons/fa";

const HomePage = () => {
  const days = [
    { date: "9", day: "MON" },
    { date: "10", day: "TUE" },
    { date: "11", day: "WED" },
    { date: "12", day: "THU" },
    { date: "13", day: "FRI" },
    { date: "14", day: "SAT" },
  ];

  const doctors = [
    {
      name: "Dr. Olivia Smith, M.D.",
      specialty: "General Medicine",
      rating: 5,
      patients: 60,
      time: "10 AM",
      treatment: "General Medicine treatment",
    },
    {
      name: "Dr. Emily Johnson",
      specialty: "Dermatology",
      rating: 4.5,
      patients: 40,
      time: "11 AM",
    },
    {
      name: "Dr. Mark Roberts",
      specialty: "Cardiology",
      rating: 5,
      patients: 150,
      time: "12 AM",
    },
    {
      name: "Dr. Linda Martinez",
      specialty: "Psychology",
      rating: 4.8,
      patients: 90,
      time: "2 PM",
    },
  ];

  const today = new Date();
  const todayString = today.toLocaleDateString("en-US", { weekday: "long" });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Hi, Welcome back
        </h1>
        <p className="text-lg text-gray-600">David Brown</p>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <FaCalendarAlt className="text-blue-500" />
          <span>Book Appointment</span>
        </button>
        <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <FaClock className="text-blue-500" />
          <span>Upcoming Visits</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaCalendarAlt className="text-blue-500" />
          <span>Appointment Calendar</span>
        </h2>
        <div className="grid grid-cols-6 gap-2 mb-4">
          {days.map((day, index) => (
            <div
              key={index}
              className={`p-2 text-center rounded-lg ${day.day === todayString.slice(0, 3).toUpperCase() ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"}`}
            >
              <div className="font-medium">{day.date}</div>
              <div className="text-sm">{day.day}</div>
            </div>
          ))}
        </div>
        <div className="border-t pt-4">
          <div className="flex items-center gap-2 text-blue-500 mb-2">
            <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
            <span>11 {todayString} - Today</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
        <h2 className="text-xl font-semibold mb-4">Today's Appointments</h2>
        <div className="space-y-4">
          {doctors
            .filter((d) => d.time === "10 AM")
            .map((doctor, index) => (
              <div key={index} className="border-b pb-4 last:border-b-0">
                <div className="text-gray-500 mb-1">{doctor.time}</div>
                <h3 className="text-lg font-medium">{doctor.name}</h3>
                <p className="text-gray-600 mb-2">{doctor.specialty}</p>
                <p className="text-sm text-gray-500">{doctor.treatment}</p>
              </div>
            ))}
        </div>
      </div>

      {/* Favorite Doctors */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="text-xl font-semibold mb-4">Favorite Doctors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {doctors.map((doctor, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{doctor.name}</h3>
                <div className="flex items-center text-yellow-400">
                  {[...Array(5)].map((_, i) =>
                    i < Math.floor(doctor.rating) ? (
                      <FaStar key={i} />
                    ) : (
                      <FaRegStar key={i} />
                    ),
                  )}
                  <span className="text-gray-600 ml-1">{doctor.rating}</span>
                </div>
              </div>
              <p className="text-gray-600 mb-2">{doctor.specialty}</p>
              <p className="text-sm text-gray-500">
                {doctor.patients} patients
              </p>
              <button className="mt-3 w-full py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors">
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;

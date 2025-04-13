import { FormEvent, useState } from "react";

type Day = {
  date: number;
  day: string;
};

type Gender = "Male" | "Female" | "Other" | "";

const BookingPage = () => {
  const [selectedDate, setSelectedDate] = useState<Day | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [patientType, setPatientType] = useState<
    "Yourself" | "Another Student"
  >("Yourself");
  const [gender, setGender] = useState<Gender>("");
  const [problem, setProblem] = useState<string>("");

  const availableTimes: string[] = [
    "10:00 AM",
    "1:30 AM",
    "2:30 PM",
    "3:00 PM",
    "1:00 PM",
    "1:30 PM",
  ];

  const days: Day[] = [
    { date: 22, day: "MON" },
    { date: 23, day: "TUE" },
    { date: 24, day: "THU" },
    { date: 25, day: "FRI" },
    { date: 26, day: "SAT" },
    { date: 27, day: "SUN" },
  ];

  const handleSubmit = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // You could add validation logic here before submitting
    console.log({
      selectedDate,
      selectedTime,
      patientType,
      gender,
      problem,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-blue-600 p-6 text-white">
          <h1 className="text-2xl md:text-3xl font-bold">John Smith, M.D.</h1>
          <p className="text-blue-100 mt-1">General Practitioner</p>
        </div>

        <div className="p-6 md:p-8">
          {/* Select Date */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Select Date
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
              {days.map((day, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDate(day)}
                  className={`py-3 px-2 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${selectedDate?.date === day.date
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-gray-200 hover:bg-blue-50 hover:border-blue-300 text-gray-900"
                    }`}
                >
                  <div className="font-medium">{day.date}</div>
                  <div className="text-sm">{day.day}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Select Time */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Available Time
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {availableTimes.map((time, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedTime(time)}
                  className={`py-2 px-4 border rounded-md text-center ${selectedTime === time
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 hover:bg-gray-50"
                    }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Patient Details */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Patient Details
            </h2>

            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setPatientType("Yourself")}
                className={`py-2 px-4 rounded-md ${patientType === "Yourself"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                Yourself
              </button>
              <button
                onClick={() => setPatientType("Another Student")}
                className={`py-2 px-4 rounded-md ${patientType === "Another Student"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                Another Student
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Jane Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="18"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <div className="flex space-x-3">
                  {["Male", "Female", "Other"].map((option) => (
                    <button
                      key={option}
                      onClick={() => setGender(option as Gender)}
                      className={`py-2 px-4 rounded-md ${gender === option
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Problem Description */}
          <div className="mb-8">
            <label className="block text-xl font-semibold text-gray-800 mb-4">
              Describe your problem
            </label>
            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 min-h-[120px]"
              placeholder="Enter Your Problem Here..."
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
          >
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;

import { FormEvent, useEffect, useState } from "react";

type Gender = "Male" | "Female" | "Other" | "";
type Day = { date: string; day: string };
type Doctor = {
  id: string;
  name: string;
  specialty: string;
  fullName: string;
  _id: string;
};

const BookingPage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
  const [availableDates, setAvailableDates] = useState<Day[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Day | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string>();
  const [patientType, setPatientType] = useState<
    "Yourself" | "Another Student"
  >("Yourself");
  const [gender, setGender] = useState<Gender>("");
  const [problem, setProblem] = useState<string>("");

  useEffect(() => {
    // Fetch list of doctors
    const fetchDoctors = async () => {
      const res = await fetch("/api/doctor");
      const data = await res.json();
      setDoctors(data);
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    if (!selectedDoctorId) return;

    // Fetch available dates and times for selected doctor
    const fetchAvailability = async () => {
      const res = await fetch(`/api/doctor/availability/${selectedDoctorId}`);
      const data = await res.json();
      const rawAvailability = data.availability; // assuming array of { day, slots: [{ time, available }] }

      const validDays: Day[] = [];
      const now = new Date();
      rawAvailability.forEach((entry: any) => {
        const availableTimes = entry.slots
          .filter((s: any) => s.available)
          .map((s: any) => s.time);
        if (availableTimes.length) {
          const weekdayIndex = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ].indexOf(entry.day);
          const diff = (7 + weekdayIndex - now.getDay()) % 7;
          const availableDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + diff,
          );
          validDays.push({
            date: availableDate.toISOString().split("T")[0],
            day: entry.day,
          });
        }
      });

      setAvailableDates(validDays);
      setAvailableTimes([]); // reset time selection
      setSelectedDate(null);
    };

    fetchAvailability();
  }, [selectedDoctorId]);

  useEffect(() => {
    if (!selectedDoctorId || !selectedDate) return;

    const fetchAvailability = async () => {
      const res = await fetch(`/api/doctor/availability/${selectedDoctorId}`);
      const data = await res.json();

      const dayEntry = data.availability.find(
        (entry: any) => entry.day === selectedDate.day,
      );
      if (dayEntry) {
        const times = dayEntry.slots
          .filter((s: any) => s.available)
          .map((s: any) => s.time);
        setAvailableTimes(times);
      } else {
        setAvailableTimes([]);
      }
    };

    fetchAvailability();
  }, [selectedDate, selectedDoctorId]);

  const handleSubmit = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!selectedDoctorId || !selectedDate || !selectedTime) {
      alert("Please fill all required fields.");
      return;
    }

    let userInfoStr = localStorage.getItem("userInfo");
    const userId = userInfoStr ? JSON.parse(userInfoStr).id : null;

    const appointmentData = {
      doctorId: selectedDoctorId,
      patientId: userId,
      date: selectedDate.date,
      time: selectedTime,
      patientType,
      fullName,
      gender,
      problem,
    };

    console.log(appointmentData);
    try {
      // Send data to backend to create appointment
      const response = await fetch("/api/appointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      });

      if (response.ok) {
        // Handle success (appointment successfully booked)
        alert("Appointment booked successfully.");
      } else {
        // If the response is not ok (e.g., 400 or 500 error)
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "Failed to book appointment"}`);
      }
    } catch (err) {
      console.error("Error booking appointment:", err);
      alert("There was an error booking your appointment. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-blue-600 p-6 text-white">
          <h1 className="text-2xl md:text-3xl font-bold">Book Appointment</h1>
          <p className="text-blue-100 mt-1">Choose a doctor and schedule</p>
        </div>

        <div className="p-6 md:p-8">
          {/* Doctor Selection */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-800 mb-2">
              Select Doctor
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
            >
              <option value="">-- Choose a doctor --</option>
              {doctors.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.fullName} – {doc.specialty}
                </option>
              ))}
            </select>
          </div>

          {/* Select Date */}
          {availableDates.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Select Date
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                {availableDates.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(day)}
                    className={`py-3 px-2 border rounded-lg transition-colors duration-200 focus:outline-none ${selectedDate?.date === day.date
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
          )}

          {/* Time Selection */}
          {selectedDate && availableTimes.length > 0 && (
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
          )}

          {/* Patient Info */}
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
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Jane Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-[120px]"
              placeholder="Enter your problem..."
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700"
          >
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;

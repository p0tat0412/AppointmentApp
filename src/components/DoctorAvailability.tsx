import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type AvailabilityData = {
  [day: string]: {
    [hour: string]: boolean;
  };
};

const DoctorAvailability = () => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"];
  const navigate = useNavigate();

  const defaultAvailability: AvailabilityData = days.reduce((acc, day) => {
    acc[day] = timeSlots.reduce((slots, time) => {
      slots[time] = false;  
      return slots;
    }, {} as { [hour: string]: boolean });
    return acc;
  }, {} as AvailabilityData);

  const [availability, setAvailability] = useState<AvailabilityData>(defaultAvailability);

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const userId = userInfo?.id || userInfo?._id;
  const token = userInfo?.token;

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!token || !userId) return;
  
      try {
        const res = await fetch(`http://localhost:5000/api/doctor/availability/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!res.ok) throw new Error("Failed to fetch availability");
  
        const data = await res.json(); // data.availability should be an array
        const fetched = data.availability;
  
        const updatedAvailability: AvailabilityData = { ...defaultAvailability };
  
        fetched.forEach((dayEntry: { day: string; slots: { time: string; available: boolean }[] }) => {
          if (!updatedAvailability[dayEntry.day]) return;
  
          dayEntry.slots.forEach(({ time, available }) => {
            if (updatedAvailability[dayEntry.day][time] !== undefined) {
              updatedAvailability[dayEntry.day][time] = available;
            }
          });
        });
  
        setAvailability(updatedAvailability);
      } catch (err) {
        console.error("Error fetching availability", err);
      }
    };
  
    fetchAvailability();
  }, [userId, token]);
  

  const toggleSlot = (day: string, time: string) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [time]: !prev[day][time],
      },
    }));
  };

  const handleSubmit = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/doctor/availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          availability,
        }),
      });

      if (!res.ok) throw new Error("Failed to save");

      alert("Availability saved successfully!");
    } catch (err) {
      console.error("Error saving availability", err);
      alert("Failed to save availability");
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Set Availability</h1>

      <div className="space-y-8">
        {days.map((day) => (
          <div key={day}>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">{day}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => toggleSlot(day, time)}
                  className={`px-3 py-2 rounded-md text-sm font-medium shadow ${
                    availability[day][time]
                      ? "bg-[#2563EB] text-white"
                      : "bg-gray-100 text-gray-700"
                  } hover:shadow-md`}
                >
                  {time}–{parseInt(time.split(":")[0]) + 1}:00
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="mt-8 bg-[#2563EB] hover:bg-[#1E4ED8] text-white px-6 py-3 rounded-lg shadow font-medium"
      >
        Save Availability
      </button>
    </div>
  );
};

export default DoctorAvailability;

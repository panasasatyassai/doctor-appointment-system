const isDoctorAvailable = (availability) => {
  if (!availability) return false;
  if (!availability.days || availability.days.length === 0) return false;
  if (!availability.from || !availability.to) return false;
  return true;
};

const isDoctorAvailableNow = (availability) => {
  if (!availability) return false;

  const { days, from, to } = availability;

  const now = new Date();

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = dayNames[now.getDay()];

  console.log("TODAY:", today);
  console.log("AVAILABLE DAYS:", days);

  if (!days.includes(today)) {
    
    return false;
  }

  const [fromH, fromM] = from.split(":").map(Number);
  const [toH, toM] = to.split(":").map(Number);

  const fromTime = new Date();
  fromTime.setHours(fromH, fromM, 0, 0);

  const toTime = new Date();
  toTime.setHours(toH, toM, 0, 0);

  // console.log("NOW:", now);
  // console.log("FROM:", fromTime);
  // console.log("TO:", toTime);

  if (toTime < fromTime) {
    return now >= fromTime || now <= toTime;
  }

  return now >= fromTime && now <= toTime;
};

const getNextAvailableDay = (days) => {
  const week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const todayIndex = new Date().getDay();

  for (let i = 1; i <= 7; i++) {
    const nextDay = week[(todayIndex + i) % 7];
    if (days.includes(nextDay)) return nextDay;
  }
  return null;
};

const DoctorCard = ({ doctor, onSelect }) => {
  const available = isDoctorAvailable(doctor.availability);

  const isAvailable = isDoctorAvailableNow(doctor.availability);
  const nextDay = getNextAvailableDay(doctor.availability?.days || []);

  return (
    <div className="bg-white shadow p-5 rounded hover:shadow-lg">
      <h3 className="font-bold text-lg">{doctor.name}</h3>
      <p className="text-gray-600">{doctor.specialization}</p>
      <p className="text-sm text-gray-500">Experience: {doctor.experience}</p>

      <div className="mt-3 text-sm">
        {available ? (
          <div className="mt-2 text-sm text-green-700">
            <p>Available: {doctor.availability.days.join(" , ")}</p>
            <p>
              Time: {doctor.availability.from} – {doctor.availability.to}
            </p>
          </div>
        ) : (
          <p className="mt-2 text-sm text-red-600">Not Available</p>
        )}
      </div>

      {/* Action Button */}

      <button
        onClick={() => onSelect(doctor)}
        disabled={!isAvailable}
        className={`px-4 py-2 rounded ${
          isAvailable ? "bg-blue-500 text-white" : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Book Appointment
      </button>

      {!isAvailable && (
        <p className="text-sm text-red-500 mt-2">
          Next available: {nextDay} ({doctor.availability.from} –{" "}
          {doctor.availability.to})
        </p>
      )}
    </div>
  );
};

export default DoctorCard;

import { Link } from "react-router-dom";
import DoctorDetailPage from "../DoctorDetailPage/DoctorDetailPage";
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
  if (!days.includes(today)) return false;

  const [fh, fm] = from.split(":").map(Number);
  const [th, tm] = to.split(":").map(Number);

  const fromTime = new Date();
  fromTime.setHours(fh, fm, 0, 0);
  const toTime = new Date();
  toTime.setHours(th, tm, 0, 0);

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
  const hasAvailability = isDoctorAvailable(doctor.availability);
  const isAvailableNow = isDoctorAvailableNow(doctor.availability);
  const nextDay = getNextAvailableDay(doctor.availability?.days || []);
  const isBookedByUserToday = doctor.isBookedByUserToday || false;

  //console.log("alll doc", doctor);

  const onClickDoctor = () => {
    <DoctorDetailPage doctorId={doctor.id} />;
  };

  const disableBooking =
    !hasAvailability || !isAvailableNow || isBookedByUserToday;

  const breaks = doctor.availability?.breaks || [];
  const validBreaks = breaks.filter((b) => b.from && b.to);

  return (
    <div className="rounded-3xl bg-white shadow-xl hover:shadow-2xl transition overflow-hidden">
      <Link to="/doctors/doctor-details-page">
        <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-6 text-white">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-full bg-white/20
            flex items-center justify-center text-xl font-bold"
            >
              {doctor.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-semibold">{doctor.name}</h3>
              <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
                {doctor.specialization}
              </span>
            </div>
          </div>
        </div>
      </Link>

      <div className="p-6 space-y-2 text-sm text-slate-600">
        <p>
          <b>Experience:</b> {doctor.experience} years
        </p>

        {hasAvailability ? (
          <>
            <p>
              <b>Days:</b> {doctor.availability.days.join(", ")}
            </p>
            <p>
              <b>Hours:</b> {doctor.availability.from} –{" "}
              {doctor.availability.to}
            </p>

            <div>
              <b>Breaks:</b>
              {validBreaks.length ? (
                <div className="flex gap-2 flex-wrap mt-1">
                  {validBreaks.map((b, i) => (
                    <span
                      key={i}
                      className="text-xs bg-orange-100 text-orange-700
                        px-2 py-1 rounded-full"
                    >
                      {b.from} – {b.to}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="italic text-slate-400 text-xs">
                  No scheduled break
                </p>
              )}
            </div>
          </>
        ) : (
          <p className="text-red-600 font-medium">Availability not set</p>
        )}

        {isBookedByUserToday && (
          <p className="font-semibold text-indigo-600 mt-2">
            Already booked today
          </p>
        )}
      </div>

      <div className="p-6 border-t">
        <button
          disabled={disableBooking}
          onClick={() => onSelect(doctor)}
          className={`w-full py-2.5 rounded-xl font-semibold transition
            ${
              disableBooking
                ? "bg-slate-300 text-slate-600 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
        >
          {isBookedByUserToday ? "Already Booked" : "Book Appointment"}
        </button>

        {disableBooking && nextDay && (
          <p className="text-xs text-center text-slate-500 mt-2">
            Next available: {nextDay}
          </p>
        )}
      </div>
      {/* <Link to={`/doctors/doctor-details-page/${doctor.id}`}>
        <div className="m-5 ">
          <button className="bg-red-500 p-2 text-white">view details</button>
        </div>
      </Link> */}
    </div>
  );
};

export default DoctorCard;

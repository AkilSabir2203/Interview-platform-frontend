import { useEffect, useState, useMemo } from "react";
import { AiOutlineArrowLeft, AiOutlineClockCircle, AiOutlineEnvironment, AiOutlineCheckCircle, AiOutlineLeft, AiOutlineRight, AiOutlineTags } from "react-icons/ai";
import { HiOutlineBriefcase } from "react-icons/hi2";
import api from "../../libs/axois";

// 1. 🔌 Imported directly from Practice.tsx to ensure perfect type symmetry
import type { Interviewer } from "./Practice"; 

interface BookingPageProps {
  interviewer: Interviewer;
  trackContext: any;
  onBack: () => void;
}

export default function BookingPage({ interviewer, trackContext, onBack }: BookingPageProps) {
  const now = useMemo(() => new Date(), []);
  
  const [existingSessions, setExistingSessions] = useState<any[]>([]);
  const [scheduleLoading, setScheduleLoading] = useState(true);

  const [currentMonthDate, setCurrentMonthDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    setScheduleLoading(true);
    api.get(`/api/v1/interviews/sessions?interviewer_id=${interviewer.id}`)
      .then((res) => {
        setExistingSessions(res.data.items || res.data || []);
      })
      .catch((err) => console.error("Error loading concurrent sessions registry:", err))
      .finally(() => setScheduleLoading(false));
  }, [interviewer.id]);

  // ⏰ Helper function to translate "14:30" string maps to readable "02:30 PM"
  const formatTo12Hour = (timeStr: string): string => {
    if (!timeStr) return "";
    const [hoursStr, minutesStr] = timeStr.split(":");
    let hours = parseInt(hoursStr, 10);
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'
    return `${String(hours).padStart(2, "0")}:${minutesStr} ${ampm}`;
  };

  const maxBookingDate = useMemo(() => {
    const end = new Date(now);
    end.setDate(now.getDate() + 7);
    return end;
  }, [now]);

  const isDateSelectable = (date: Date) => {
    const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const maxDate = new Date(maxBookingDate.getFullYear(), maxBookingDate.getMonth(), maxBookingDate.getDate());
    return checkDate >= todayDate && checkDate <= maxDate;
  };

  const calendarGridDays = useMemo(() => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const daysArray: { date: Date; isCurrentMonth: boolean }[] = [];
    
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      daysArray.push({ date: new Date(year, month, -i), isCurrentMonth: false });
    }
    for (let i = 1; i <= totalDays; i++) {
      daysArray.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    return daysArray;
  }, [currentMonthDate]);

  const availableHours = useMemo(() => {
    const targetMap = interviewer?.schedule?.availability_map;
    if (!selectedDate || !targetMap) return [];
    
    const dateKey = selectedDate.toLocaleDateString("en-US", { weekday: "long" }); 

    const dailyRawSlots: string[] = targetMap[dateKey] || [];
    
    return dailyRawSlots.filter((timeStr) => {
      const [hours, minutes] = timeStr.split(":").map(Number);
      const slotDateTime = new Date(selectedDate);
      slotDateTime.setHours(hours, minutes, 0, 0);

      if (slotDateTime <= now) return false;

      const isConflict = existingSessions.some((session: any) => {
        const sessionTime = new Date(session.interview_time);
        return sessionTime.getTime() === slotDateTime.getTime() && session.status !== "CANCELLED";
      });

      return !isConflict;
    });
  }, [selectedDate, interviewer, existingSessions, now]);

  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedTimeSlot) return;

    const [hours, minutes] = selectedTimeSlot.split(":").map(Number);
    const finalScheduledDateTime = new Date(selectedDate);
    finalScheduledDateTime.setHours(hours, minutes, 0, 0);

    const payload = {
      interviewer_id: interviewer.id,
      interview_time: finalScheduledDateTime.toISOString(),
      session_type: trackContext?.type || "TECHNICAL" 
    };

    api.post("/api/v1/interviews/sessions", payload)
      .then(() => setBookingSuccess(true))
      .catch((err) => alert(`Booking submission mismatch error: ${err.response?.data?.detail || err.message}`));
  };

  const renderTrackTags = (type: string) => {
    if (!type) return null;
    if (type === "both") {
      return (
         <div className="flex flex-wrap gap-1">
           <span className="text-[10px] font-bold uppercase tracking-wide text-purple-600 bg-purple-50 px-2 py-0.5 rounded">Technical</span>
           <span className="text-[10px] font-bold uppercase tracking-wide text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Behavioral</span>
         </div>
      );
    }
    const isTech = type === "technical";
    return (
      <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded ${
        isTech ? "text-purple-600 bg-purple-50" : "text-amber-600 bg-amber-50"
      }`}>
        {isTech ? "Technical Core" : "Behavioral / HR"}
      </span>
    );
  };

  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-neutral-200 rounded-2xl p-8 text-center shadow-xs">
          <AiOutlineCheckCircle className="w-14 h-14 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-neutral-900">Session Confirmed</h2>
          <p className="text-sm text-neutral-500 mt-1">Your interview pipeline slot has been registered successfully.</p>
          <button onClick={onBack} className="mt-6 w-full py-2.5 bg-neutral-900 text-white font-medium text-sm rounded-xl hover:bg-neutral-800 transition">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 py-12 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-5xl mb-6">
        <button 
          onClick={onBack} 
          className="bg-white flex items-center gap-2 text-sm text-neutral-600 rounded-2xl py-1 px-3 font-medium hover:text-white hover:bg-black transition-colors"
        >
          <AiOutlineArrowLeft /> Back
        </button>
      </div>

      <div className="w-full max-w-5xl bg-white border border-neutral-200 rounded-2xl shadow-xs flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-neutral-200 overflow-hidden">
        
        <div className="p-6 md:w-1/4 bg-white shrink-0 flex flex-col justify-between">
          <div>
            <img 
              src={interviewer.profile_image_url || "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"} 
              className="w-16 h-16 rounded-full object-cover border border-neutral-200 mb-4 shadow-xs" 
              alt={interviewer.name} 
            />
            
            <h2 className="text-xl font-bold text-neutral-900 leading-tight">{interviewer.name}</h2>
            
            <div className="flex items-center gap-1 text-neutral-500 text-xs mt-1.5 font-medium">
              <HiOutlineBriefcase className="shrink-0 text-neutral-400" size={14} />
              <span className="truncate">{interviewer.position}</span>
            </div>
            
            <span className="text-[11px] font-extrabold text-purple-600 tracking-wider uppercase mt-0.5 block">
              @ {interviewer.company}
            </span>

            <hr className="border-neutral-100 my-4" />

            <div className="space-y-1 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Assessment Track</span>
              {renderTrackTags(interviewer.interviewer_type)}
            </div>

            {interviewer.skills && interviewer.skills.length > 0 && (
              <div className="space-y-1.5 mb-4">
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  <AiOutlineTags size={12} />
                  <span>Domain Competencies</span>
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {interviewer.skills.map((skill: string, index: number) => (
                    <span 
                      key={index} 
                      className="bg-neutral-50 text-neutral-700 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-neutral-200/60"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <hr className="border-neutral-100 my-4" />

            <div className="space-y-2 text-xs font-medium text-neutral-600">
              <div className="flex items-center gap-2.5">
                <AiOutlineClockCircle className="text-neutral-400" size={15} />
                <span>{trackContext?.duration || "45 mins"} duration</span>
              </div>
              <div className="flex items-center gap-2.5">
                <AiOutlineEnvironment className="text-neutral-400" size={15} />
                <span>{interviewer.schedule?.timezone || "Asia/Kolkata"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 md:w-5/12 grow">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm font-bold text-neutral-800">{currentMonthDate.toLocaleString("default", { month: "long", year: "numeric" })}</span>
            <div className="flex gap-1">
              <button onClick={() => setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1))} className="p-1.5 border border-neutral-200 rounded-lg hover:bg-neutral-50"><AiOutlineLeft size={14} /></button>
              <button onClick={() => setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1))} className="p-1.5 border border-neutral-200 rounded-lg hover:bg-neutral-50"><AiOutlineRight size={14} /></button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-neutral-400 mb-3">
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => <div key={d}>{d}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarGridDays.map((item, idx) => {
              const selectable = isDateSelectable(item.date) && item.isCurrentMonth;
              const isSelected = selectedDate?.toDateString() === item.date.toDateString();

              return (
                <button
                  key={idx}
                  disabled={!selectable}
                  onClick={() => { setSelectedDate(item.date); setSelectedTimeSlot(null); }}
                  className={`h-10 text-xs font-semibold rounded-xl flex flex-col items-center justify-center transition-all relative
                    ${!item.isCurrentMonth ? "text-transparent pointer-events-none" : ""}
                    ${selectable && !isSelected ? "text-purple-600 bg-purple-50/70 hover:bg-purple-100/60" : ""}
                    ${isSelected ? "bg-neutral-900 text-white font-bold" : ""}
                    ${!selectable && item.isCurrentMonth ? "text-neutral-300 pointer-events-none" : ""}
                  `}
                >
                  {item.date.getDate()}
                  {selectable && !isSelected && <span className="absolute bottom-1 w-1 h-1 bg-purple-500 rounded-full"></span>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6 md:w-1/3 bg-neutral-50/30 shrink-0 min-w-65">
          <h3 className="text-sm font-bold text-neutral-800 mb-4">
            {selectedDate ? selectedDate.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" }) : "Select Date"}
          </h3>

          {scheduleLoading ? (
            <div className="h-32 bg-neutral-100 rounded-xl animate-pulse" />
          ) : !selectedDate ? (
            <div className="text-xs text-neutral-400 py-12 text-center">Pick an active calendar block window above.</div>
          ) : availableHours.length === 0 ? (
            <div className="text-xs text-neutral-400 py-12 text-center">No open matching slots left for this timeline day.</div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {availableHours.map((timeStr) => {
                const isPicked = selectedTimeSlot === timeStr;
                return (
                  <div key={timeStr} className="flex gap-2">
                    <button
                      onClick={() => setSelectedTimeSlot(timeStr)}
                      className={`grow py-2.5 text-xs font-bold border rounded-xl transition-all text-center
                        ${isPicked ? "bg-neutral-100 text-neutral-800 border-neutral-400 w-1/2" : "bg-white border-neutral-200 text-neutral-700 hover:border-neutral-400 w-full"}`}
                    >
                      {/* 👈 Added the helper conversion routine cleanly here for display purposes */}
                      {formatTo12Hour(timeStr)}
                    </button>
                    {isPicked && (
                      <button onClick={handleConfirmBooking} className="w-1/2 py-2.5 text-xs font-bold bg-neutral-600 text-white rounded-xl hover:bg-neutral-700 transition">
                        Confirm
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
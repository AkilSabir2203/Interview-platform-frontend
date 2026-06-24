import React, { useEffect, useMemo, useState } from "react";
import { AiOutlineCalendar, AiOutlineClockCircle, AiOutlineVideoCamera } from "react-icons/ai";
import Avatar from "../ui/Avatar";
import api from "../../libs/axois";

const Practice: React.FC = () => {
  const [tracksTable, setTracksTable] = useState<any[]>([]);
  const [interviewersTable, setInterviewersTable] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    api.get("/api/v1/auth/practice")
      .then((res) => {
        setTracksTable(res.data.tracks || []);
        setInterviewersTable(res.data.interviewers || []);
      })
      .catch((err) => {
        console.error("Axios data loading crash:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const interviewerLookupMap = useMemo(() => {
    const map: Record<string, any> = {};
    if (!Array.isArray(interviewersTable)) return map;

    interviewersTable.forEach((interviewer) => {
      const id = interviewer?.id || interviewer?._id;
      if (id !== undefined && id !== null) {
        map[String(id)] = interviewer;
      }
    });
    return map;
  }, [interviewersTable]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-neutral-50 flex items-center justify-center p-6">
        <p className="text-neutral-500 font-medium animate-pulse">Loading practice loops...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-neutral-50 p-6 mt-12 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 tracking-tight">
            Available Practice Tracks
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracksTable.map((track: any) => {
            const assignedInterviewer = interviewerLookupMap[String(track.interviewerId)];
            
            const firstName = assignedInterviewer?.firstname || "";
            const lastName = assignedInterviewer?.lastname || "";
            const interviewerFullName = `${firstName} ${lastName}`.trim() || "Assigned Expert";

            return (
              <div key={track.id} className="bg-white border border-neutral-200 rounded-2xl p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all">
                <div>
                  <div className="mb-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md">
                      {track.company}
                    </span>
                    <h3 className="text-lg font-bold text-neutral-800 mt-2.5 leading-tight">
                      {track.role}
                    </h3>
                  </div>

                  <hr className="border-neutral-100 my-3" />

                  <div className="space-y-2.5 my-4 text-neutral-600 text-sm">
                    <div className="flex items-center gap-2.5">
                      <AiOutlineClockCircle className="text-neutral-400 shrink-0" size={16} />
                      <span>{track.duration}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <AiOutlineVideoCamera className="text-neutral-400 shrink-0" size={16} />
                      <span>{track.type}</span>
                    </div>
                  </div>

                  <hr className="border-neutral-100 my-3" />

                  <div className="flex items-center gap-3 mt-4 mb-6">
                    <Avatar 
                      src={assignedInterviewer?.image} 
                      name={interviewerFullName} 
                    />
                    <div className="flex flex-col">
                      <span className="text-xs text-neutral-400 font-medium leading-none">
                        {assignedInterviewer?.roleTitle || "Interviewer Expert"}
                      </span>
                      <span className="text-sm font-semibold text-neutral-700 mt-1">
                        {interviewerFullName}
                      </span>
                    </div>
                  </div>
                </div>

                <button className="w-full py-3 px-4 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 select-none active:scale-[0.99] transition cursor-pointer">
                  <AiOutlineCalendar size={16} />
                  Schedule Interview
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Practice;
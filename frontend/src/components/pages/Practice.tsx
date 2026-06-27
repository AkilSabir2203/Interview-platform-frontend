import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AiOutlineCalendar, AiOutlineTags, AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { HiOutlineBriefcase } from "react-icons/hi2";
import { FiRotateCcw } from "react-icons/fi"; 
import Avatar from "../ui/Avatar";
import api from "../../libs/axois";
import BookingPage from "./BookingPage";

// 👈 Exported to become the single source of truth for both files
export interface Interviewer {
  id: number;
  user_id: number;
  name: string;
  phone: string;
  profile_image_url: string | null;
  interviewer_type: "technical" | "non_technical" | "both";
  company: string;
  position: string;
  skills: string[];
  schedule?: {
    availability_map: Record<string, string[]>;
    timezone: string;
    id: number;
    interviewer_id: number;
  };
}

const Practice: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedInterviewer, setSelectedInterviewer] = useState<Interviewer | null>(null);
  
  const pageSize = 6; 

  const currentPage = Number(searchParams.get("page")) || 1;
  const companyFilter = searchParams.get("company") || "";
  const typeFilter = searchParams.get("interviewer_type") || "";

  const hasActiveFilters = !!companyFilter || !!typeFilter || currentPage > 1;

  useEffect(() => {
    setIsLoading(true);
    
    const queryParams = new URLSearchParams({
      page: String(currentPage),
      size: String(pageSize),
    });

    if (companyFilter) queryParams.append("company", companyFilter);
    if (typeFilter) queryParams.append("interviewer_type", typeFilter);

    api.get(`/api/v1/session/interviewers?${queryParams.toString()}`)
      .then((res) => {
        setInterviewers(res.data.items || []);
        setTotalPages(res.data.total_pages || 1);
        setTotalItems(res.data.total || 0);
      })
      .catch((err) => {
        console.error("Failed loading filtered, paginated data stream:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentPage, companyFilter, typeFilter]);

  const updateFilters = (newParams: Record<string, string>) => {
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev);
      updated.set("page", "1"); 

      Object.entries(newParams).forEach(([key, value]) => {
        if (value) {
          updated.set(key, value);
        } else {
          updated.delete(key);
        }
      });
      return updated;
    });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev);
      updated.set("page", String(newPage));
      return updated;
    });
  };

  const handleReset = () => {
    setSearchParams({}); 
  };

  const renderTrackTags = (type: string) => {
    if (type === "both") {
      return (
         <>
           <span className="text-[10px] font-bold uppercase tracking-wide text-purple-600 bg-purple-50 px-2 py-0.5 rounded">Technical</span>
           <span className="text-[10px] font-bold uppercase tracking-wide text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Behavioral</span>
         </>
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

  if (selectedInterviewer) {
    return (
      <BookingPage 
        interviewer={selectedInterviewer} 
        onBack={() => setSelectedInterviewer(null)}
        trackContext={{
          company: selectedInterviewer.company,
          role: selectedInterviewer.position,
          type: selectedInterviewer.interviewer_type === "non_technical" ? "BEHAVIORAL" : "TECHNICAL",
          duration: "50 mins"
        }}
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-neutral-50 p-6 mt-12 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tight">
              Available Expert Interviewers
            </h1>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex flex-col min-w-40">
              <select
                value={typeFilter}
                onChange={(e) => updateFilters({ interviewer_type: e.target.value })}
                className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-neutral-300 bg-white text-neutral-700 shadow-xs focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition cursor-pointer"
              >
                <option value="">All Panel Types</option>
                <option value="technical">Technical Core</option>
                <option value="non_technical">Behavioral / HR</option>
                <option value="both">Both Tracks</option>
              </select>
            </div>

            <div className="flex flex-col min-w-45">
              <input
                type="text"
                placeholder="Search Company..."
                value={companyFilter}
                onChange={(e) => updateFilters({ company: e.target.value })}
                className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-neutral-300 bg-white text-neutral-700 placeholder-neutral-400 shadow-xs focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition"
              />
            </div>

            {hasActiveFilters && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-bold text-neutral-500 bg-neutral-200/60 hover:bg-neutral-200 hover:text-neutral-700 rounded-xl transition cursor-pointer active:scale-95 select-none"
              >
                <FiRotateCcw size={14} />
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="min-h-100 w-full flex items-center justify-center">
            <p className="text-neutral-500 font-medium animate-pulse">Loading verified evaluation panels...</p>
          </div>
        ) : interviewers.length === 0 ? (
          <div className="min-h-100 w-full border border-dashed border-neutral-300 bg-neutral-100/50 rounded-2xl flex flex-col items-center justify-center p-6 text-center">
            <p className="text-neutral-500 font-bold text-lg">No assessment panels found</p>
            <p className="text-neutral-400 text-sm mt-1 mb-4">Try resetting your active search metrics or category fields.</p>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition cursor-pointer shadow-sm"
            >
              <FiRotateCcw size={13} />
              Clear All Search Queries
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {interviewers.map((interviewer) => (
              <div key={interviewer.id} className="bg-white border border-neutral-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-200">
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar 
                      src={interviewer.profile_image_url || "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"} 
                      name={interviewer.name}
                      className="h-14 w-14 border border-purple-100 object-cover rounded-full shadow-xs" 
                    />
                    <div className="flex flex-col flex-1 min-w-0">
                      <h3 className="text-base font-bold text-neutral-900 truncate leading-tight">
                        {interviewer.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-neutral-500 text-xs mt-1 font-medium truncate">
                        <HiOutlineBriefcase className="shrink-0 text-neutral-400" size={14} />
                        <span className="truncate">{interviewer.position}</span>
                      </div>
                      <span className="text-[11px] font-extrabold text-purple-600 tracking-wider uppercase mt-0.5 truncate">
                        @ {interviewer.company}
                      </span>
                    </div>
                  </div>

                  <hr className="border-neutral-100 my-3.5" />

                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">Assessment Panels</span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {renderTrackTags(interviewer.interviewer_type)}
                    </div>
                  </div>

                  <div className="mt-4 mb-6 space-y-1">
                    <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                      <AiOutlineTags size={12} />
                      <span>Core Domain Skills</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1.5">
                      {interviewer.skills.slice(0, 5).map((skill, index) => (
                        <span 
                          key={index} 
                          className="bg-neutral-100 text-neutral-700 text-[10px] font-semibold px-2.5 py-1 rounded-lg border border-neutral-200/40"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button onClick={() => setSelectedInterviewer(interviewer)} className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 select-none active:scale-[0.99] transition cursor-pointer shadow-xs">
                  <AiOutlineCalendar size={16} />
                  Schedule Interview Slot
                </button>
              </div>
            ))}
          </div>
        )}

        {!isLoading && totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-4 border-t border-neutral-200 pt-6">
            <button
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="p-2.5 rounded-xl border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <AiOutlineLeft size={16} />
            </button>
            
            <span className="text-sm font-bold text-neutral-700 select-none">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2.5 rounded-xl border border-purple-300 bg-white text-purple-700 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <AiOutlineRight size={16} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Practice;
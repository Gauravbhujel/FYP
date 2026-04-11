import React from "react";
import { CalendarIcon, XIcon } from "lucide-react";

export const DateRangePicker = ({ start, end, onStartChange, onEndChange, onClear }) => {
    const hasValue = start || end;

    return (
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm hover:border-gray-300 transition-all focus-within:ring-4 focus-within:ring-accent/5 focus-within:border-accent group relative">
            <div className="flex items-center gap-3">
                <div className="relative flex items-center">
                    <CalendarIcon className="w-4 h-4 text-gray-400 mr-3 group-focus-within:text-accent transition-colors" />
                    <input 
                        type="date" 
                        value={start || ""}
                        onChange={(e) => onStartChange(e.target.value)}
                        className="text-sm font-semibold text-gray-700 outline-none bg-transparent border-none p-0 w-[110px] cursor-pointer"
                    />
                </div>
                
                <span className="text-gray-300 font-light mx-1">/</span>
                
                <div className="relative flex items-center">
                    <input 
                        type="date" 
                        value={end || ""}
                        onChange={(e) => onEndChange(e.target.value)}
                        className="text-sm font-semibold text-gray-700 outline-none bg-transparent border-none p-0 w-[110px] cursor-pointer"
                    />
                    <div className="ml-3 p-1 bg-gray-50 rounded text-gray-400 group-focus-within:bg-accent/10 group-focus-within:text-accent transition-colors">
                        <CalendarIcon className="w-4 h-4" />
                    </div>
                </div>
            </div>

            {hasValue && onClear && (
                <button 
                    onClick={(e) => {
                        e.preventDefault();
                        onClear();
                    }}
                    className="ml-2 p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-rose-500 transition-all cursor-pointer"
                    title="Clear filter"
                >
                    <XIcon className="w-3.5 h-3.5" />
                </button>
            )}
        </div>
    );
};

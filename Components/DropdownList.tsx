"use client";
import { cn } from "@/lib/util";
import { Check, ChevronDown, Menu } from "lucide-react";
import { useState } from "react";
import {filterOptions} from '../constants';
const DropdownList = ({
  selectedOption,
  onOptionSelect,
}: import("..").DropdownListProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (option: string) => {
    onOptionSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="filter-trigger">
          <figure className="flex gap-2">
            <Menu className="h-5 w-5" />
            <span className="tracking-wide flex gap-4">
              {filterOptions[selectedOption] || "Sort"}
              <ChevronDown className="h-5 w-5" />
            </span>
          </figure>
        </div>
      </div>

      {isOpen && (
        <ul className="dropdown">
          {Object.entries(filterOptions).map(([key, label]) => (
            <li
              key={key}
              className={cn("list-item tracking-wide", {
                "bg-pink-100 text-white": selectedOption === key,
              })}
              onClick={() => handleOptionClick(key)}
            >
              <span className="flex gap-2 items-center">
                {label}
                {selectedOption === key && <Check className="h-5 w-5" />}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownList;

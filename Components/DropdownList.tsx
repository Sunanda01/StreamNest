"use client";
import { cn } from "@/lib/util";
import { Check, ChevronDown, Menu } from "lucide-react";
import { useState } from "react";
const DropdownList = ({
  options,
  selectedOption,
  onOptionSelect,
  triggerElement,
}: import("..").DropdownListProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const filterOptions = ["Most Recent", "Most Liked"];
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
              Most Recently <ChevronDown className="h-5 w-5" />
            </span>
          </figure>
        </div>
      </div>
      {isOpen && (
        <ul className="dropdown">
          {filterOptions.map((option, index) => (
            <li
              key={option}
              className={cn("list-item tracking-wide", {
                "bg-pink-100 text-white": selectedOption === option,
              })}
              onClick={() => handleOptionClick(option)}
            >
              <span className="flex gap-2 items-center">
                {option}
              {selectedOption === option && <Check className="h-5 w-5" />}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownList;

"use client"
import { ChevronDown, Menu } from "lucide-react";
import { useState } from "react";

const DropdownList = () => {
    const [isOpen, setisOpen] = useState(false);
    const options=["Most Recent","Most Liked"];
  return (
    <div className="relative">
        <div className="cursor-pointer" onClick={()=>setisOpen(!isOpen)}>
            <div className="filter-trigger">
                <figure className="flex gap-2">
                <Menu className="h-5 w-5"/>
                <span className="tracking-wide flex gap-4">Most Recently <ChevronDown className="h-5 w-5"/></span>
            </figure>
            </div>
        </div>
        {isOpen && (
            <ul className="dropdown">
                {options.map((option)=>(
                    <li className="list-item tracking-wide">
                        {option}
                    </li>
                ))}
            </ul>
        )}
    </div>
  )
}

export default DropdownList
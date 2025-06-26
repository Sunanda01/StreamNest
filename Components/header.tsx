"use client";
import { ArrowDown, MenuIcon, Search, UploadIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DropdownList from "./DropdownList";
import { SharedHeaderProps } from "..";
import RecordScreen from "./RecordScreen";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { updateURLParams } from "@/lib/util";
import { filterOptions } from "@/constants";

const Header = ({ subHeader, title, userImg }: SharedHeaderProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("query") || ""
  );

  const [selectedFilter, setSelectedFilter] = useState(
    searchParams.get("filter") || "Most Recent"
  );

  useEffect(() => {
    setSearchQuery(searchParams.get("query") || "");
    setSelectedFilter(searchParams.get("filter") || "Most Recent");
  }, [searchParams]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery !== searchParams.get("query")) {
        const url = updateURLParams(
          searchParams,
          { query: searchQuery || null },
          pathname
        );
        router.push(url);
      }
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, searchParams, pathname, router]);

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    const url = updateURLParams(
      searchParams,
      { filter: filter || null },
      pathname
    );
    router.push(url);
  };

  const renderFilterTrigger = () => (
    <div className="filter-trigger">
      <figure>
        <MenuIcon />
        <span>{selectedFilter}</span>
      </figure>
      <ArrowDown />
    </div>
  );

  return (
    <header className="header">
      <section className="header-container">
        <div className="details">
          {userImg && (
            <Image
              src={userImg}
              alt="user"
              height={66}
              width={66}
              className="rounded-full"
            />
          )}
          <article>
            <p className="tracking-normal">{subHeader}</p>
            <h1 className="tracking-normal text-xl lg:text-3xl md:text-2xl">{title}</h1>
          </article>
        </div>
        <aside className="flex flex-row gap-3 sm:items-center">
          <Link
            href="/upload"
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-full  text-black text-sm sm:text-base hover:bg-slate-200 transition"
          >
            <UploadIcon className="h-5 w-5" />
            <span>Upload Video</span>
          </Link>
          <RecordScreen />
        </aside>

      </section>
      <section className="search-filter">
        <div className="search">
          <input
            type="text"
            placeholder="Search for video, tags, folders...."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>
        {/* <DropdownList
          options={filterOptions}
          selectedOption={selectedFilter}
          onOptionSelect={handleFilterChange}
          triggerElement={renderFilterTrigger()}
        /> */}
      </section>
    </header>
  );
};

export default Header;

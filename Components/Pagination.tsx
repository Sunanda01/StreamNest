"use client";
import { cn, generatePagination, updateURLParams } from "@/lib/util";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

type PaginationProps = {
  currentPage?: number;
  totalPages?: number;
  queryString?: string;
  filterString?: string;
};

const Pagination = ({
  currentPage = 1,
  totalPages = 10,
  queryString = "",
  filterString = "",
}: PaginationProps) => {
  const pages = generatePagination(currentPage, totalPages);
  const router = useRouter();
  const searchParams = useSearchParams();

  const createPageUrl = (pageNumber: number) => {
    return updateURLParams(
      searchParams,
      {
        page: pageNumber.toString(),
        query: queryString?.trim() || null,
        filter: filterString || null,
      },
      "/"
    );
  };

  const navigateToPage = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    router.push(createPageUrl(pageNumber));
  };

  return (
    <section className="pagination flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
      <button
        onClick={() => navigateToPage(currentPage - 1)}
        className={cn("nav-button hidden lg:block md:block", {
          "pointer-events-none opacity-50": currentPage === 1,
        })}
        disabled={currentPage === 1}
        aria-disabled={currentPage === 1}
      >
        <div>
          <ArrowBigLeft className="text-black fill-black" />
          Previous
        </div>
      </button>

      <div className="flex flex-wrap justify-center items-center gap-2">
        {pages.map((page, index) =>
          page === "..." ? (
            <span key={`ellipsis-${index}`}>...</span>
          ) : (
            <button
              key={`page-${page}`}
              onClick={() => navigateToPage(page as number)}
              className={cn({
                "bg-pink-100 text-white ": currentPage === page,
              })}
            >
              {page}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => navigateToPage(currentPage + 1)}
        className={cn("nav-button hidden lg:block md:block", {
          "pointer-events-none opacity-50": currentPage === totalPages,
        })}
        disabled={currentPage === totalPages}
        aria-disabled={currentPage === totalPages}
      >
        <div>
          Next
          <ArrowBigRight className="text-black fill-black" />
        </div>
      </button>
    </section>
  );
};

export default Pagination;

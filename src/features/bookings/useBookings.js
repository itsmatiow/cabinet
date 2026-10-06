import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBookings } from "../../services/apiBookings";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "../../utils/constants";

export default function useBookings() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  //*FILTER SERVER SIDE
  const filterValue = searchParams.get("status"); // Default to "all" if no filter is set
  const filter =
    !filterValue || filterValue === "all"
      ? null
      : { field: "status", value: filterValue };
  // { field: "total_price", value: 5000, method: "gte" };

  //* SORTING SERVER SIDE
  const sortByRaw = searchParams.get("sortBy") || "start_date-desc"; // Default to "start_date-desc" if no sort is set
  const [field, direction] = sortByRaw.split("-");
  const sortBy = { field, direction }; // { field: "start_date", direction: "desc" }

  //* PAGINATION
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  //* QUERY
  const {
    isLoading,
    data: { data: bookings, count } = {},
    error,
  } = useQuery({
    queryKey: ["bookings", filter, sortBy, page],
    queryFn: () => getBookings({ filter, sortBy, page }),
  });

  //* PRE-FETCHING
  const pageCount = Math.ceil(count / PAGE_SIZE);

  if (page < pageCount)
    queryClient
      .query({
        queryKey: ["bookings", filter, sortBy, page + 1],
        queryFn: () =>
          getBookings({
            filter,
            sortBy,
            page: page + 1,
          }),
      })
      .catch(() => {});

  if (page > 1)
    queryClient
      .query({
        queryKey: ["bookings", filter, sortBy, page - 1],
        queryFn: () =>
          getBookings({
            filter,
            sortBy,
            page: page - 1,
          }),
      })
      .catch(() => {});

  return { isLoading, bookings, count, error };
}

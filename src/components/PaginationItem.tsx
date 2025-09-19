import { Pagination, Box } from "@chakra-ui/react";
import * as React from "react";
import { useState } from "react";
type PagedProps = {
  /** How many items per page */
  pageSize?: number;
  /** Start on this 1-based page */
  initialPage?: number;
  /** Controlled current page (optional) */
  page?: number;
  /** Controlled page change (optional) */
  onPageChange?: (page: number) => void;
  /** Hide the pagination bar if there's only 1 page */
  hideOnSinglePage?: boolean;
  /** Optional layout wrapper props for the pagination bar */
  paginationAlign?: "left" | "center" | "right";
  children: React.ReactNode;
};

export default function PaginationItems({
  pageSize = 10,
  initialPage = 1,
  page : controlledPage,
  onPageChange,
  children,
}: PagedProps) {
  const items = React.Children.toArray(children);
  const numItems = items.length;
  const totalPages = Math.max(1, Math.ceil(numItems / pageSize));

  const [uncontrolledPage, setUncontrolledPage] = React.useState(initialPage);
  const page = controlledPage ?? uncontrolledPage;

  const setPage = React.useCallback(
    (p: number) => {
      const next = Math.min(Math.max(1, p), totalPages);
      if (onPageChange) onPageChange(next);
      if (controlledPage === undefined) setUncontrolledPage(next);
    },
    [controlledPage, onPageChange, totalPages]
  );

  
  return <Box></Box>;
}

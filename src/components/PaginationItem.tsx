"use client";

import { Pagination, Box, IconButton, HStack } from "@chakra-ui/react";
import * as React from "react";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";

type PagedProps = {
  pageSize?: number;
  initialPage?: number;
  page?: number;
  onPageChange?: (page: number) => void;
  hideOnSinglePage?: boolean;
  children: React.ReactNode;
  itemsProps?: React.ComponentProps<typeof Box>;
  paginationProps?: React.ComponentProps<typeof Box>;
};

export default function PaginationItems({
  pageSize = 10,
  initialPage = 1,
  page: controlledPage,
  onPageChange,
  hideOnSinglePage = true,
  children,
  itemsProps,
  paginationProps,
}: PagedProps) {
  const items = React.Children.toArray(children);
  const numItems = items.length;
  const totalPages = Math.max(1, Math.ceil(numItems / pageSize));

  const [uncontrolledPage, setUncontrolledPage] = React.useState(
    Math.min(Math.max(1, initialPage), totalPages)
  );
  const page = controlledPage ?? uncontrolledPage;

  const setPage = React.useCallback(
    (p: number) => {
      const next = Math.min(Math.max(1, p), totalPages);
      onPageChange?.(next);
      if (controlledPage === undefined) setUncontrolledPage(next);
    },
    [controlledPage, onPageChange, totalPages]
  );

  React.useEffect(() => {
    if (page > totalPages) setPage(totalPages);
    if (page < 1) setPage(1);
  }, [totalPages]);

  const startIdx = (page - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const currentItems = items.slice(startIdx, endIdx);

  const shouldHidePagination = hideOnSinglePage && totalPages <= 1;

  return (
    <Box>
      <Box {...itemsProps}>{currentItems}</Box>

      {!shouldHidePagination && (
        <Box w="140px" mt={2} mx={"auto"} {...paginationProps}>
          <Pagination.Root
            count={numItems}
            pageSize={pageSize}
            page={page}
            onPageChange={(e) => setPage(e.page)}
          >
            <HStack>
              <Pagination.PrevTrigger asChild>
                <IconButton variant={"ghost"}>
                  <GrFormPrevious />
                </IconButton>
              </Pagination.PrevTrigger>
              <Pagination.PageText />
              <Pagination.NextTrigger asChild>
                <IconButton variant={"ghost"}>
                  <GrFormNext />
                </IconButton>
              </Pagination.NextTrigger>
            </HStack>
          </Pagination.Root>
        </Box>
      )}
    </Box>
  );
}

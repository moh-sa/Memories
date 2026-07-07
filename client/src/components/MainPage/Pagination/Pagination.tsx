import { Pagination as PaginationCom } from "@mantine/core";

interface PaginationProps {
  currentPage: string | number | null;
  numberOfPages: number | null;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  numberOfPages,
  onPageChange,
}: PaginationProps) => {
  const page = Number(currentPage) || 1;

  return (
    <PaginationCom
      mt={60}
      mb={20}
      withEdges
      withControls
      spacing="sm"
      position="center"
      page={page}
      total={numberOfPages ?? 1}
      onChange={onPageChange}
    />
  );
};

export default Pagination;

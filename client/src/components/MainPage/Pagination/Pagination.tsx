//UI Components
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
  return (
    <PaginationCom
      mt={60}
      mb={20}
      withEdges
      withControls
      spacing="sm"
      position="center"
      page={currentPage as number}
      total={parseInt(numberOfPages as unknown as string)}
      onChange={onPageChange}
    />
  );
};

export default Pagination;

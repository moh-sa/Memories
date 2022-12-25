//UI Components
import { Pagination as PaginationCom } from "@mantine/core";

const Pagination = ({ currentPage, numberOfPages, onPageChange }) => {
  return (
    <PaginationCom
      mt={60}
      mb={20}
      withEdges
      withControls
      spacing="sm"
      position="center"
      page={currentPage}
      total={parseInt(numberOfPages)}
      onChange={onPageChange}
    />
  );
};

export default Pagination;

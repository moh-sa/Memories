import { render, screen } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import Likes from "./Likes";

it("renders the like count", () => {
  render(
    <MantineProvider>
      <Likes likes={42} badgeStyles="" likesStyles="" />
    </MantineProvider>,
  );
  expect(screen.getByText("42")).toBeInTheDocument();
});

import { describe, it, expect, vi } from "vitest";
import type { ReactNode } from "react";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { useForm, FormProvider } from "react-hook-form";
import { renderWithProviders } from "test/renderWithProviders";
import { mockMemory, mockMemory2, mockComment, mockUser } from "test/mockData";

vi.mock("services", () => ({
  auth: { verifyCode: vi.fn(), verifyToken: vi.fn() },
  memory: {
    getTags: vi.fn().mockResolvedValue({ data: { data: { tags: ["a", "b"] } } }),
  },
  search: { getTitles: vi.fn() },
  recommendations: { get: vi.fn() },
  user: { getProfile: vi.fn() },
  comments: {},
}));

Element.prototype.scrollTo = vi.fn();

const FormHarness = ({ children }: { children: ReactNode }) => {
  const methods = useForm();
  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe("Badges", () => {
  it("renders Comments and Time badges", async () => {
    const { default: Badges } = await import(
      "components/common/Badges/index",
    );
    renderWithProviders(
      <div>
        <Badges.Comments badgeStyles="" likesStyles="" data={7} />
        <Badges.Time badgeStyles="" likesStyles="" time={mockMemory.createdAt} />
      </div>,
    );
    expect(screen.getByText("7")).toBeInTheDocument();
  });
});

describe("Alerts + Loaders + Modals", () => {
  it("renders success and failure alerts and response alert", async () => {
    const { default: Alerts } = await import("components/common/Alert/index");
    const ResponseAlert = (
      await import("components/common/Alert/ResponseAlert")
    ).default;
    renderWithProviders(
      <div>
        <Alerts.Success msg="ok" />
        <Alerts.Failure msg="bad" />
        <ResponseAlert isSuccess msg="great" />
        <ResponseAlert isSuccess={false} msg="oops" />
      </div>,
    );
    expect(screen.getByText("ok")).toBeInTheDocument();
    expect(screen.getByText("oops")).toBeInTheDocument();
  });

  it("renders the loading overlay", async () => {
    const Overlay = (await import("components/common/Loader/Overlay")).default;
    renderWithProviders(<Overlay />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders the delete modal and reacts to buttons", async () => {
    const Delete = (await import("components/common/Modals/Delete/Delete"))
      .default;
    const close = vi.fn();
    const yes = vi.fn();
    renderWithProviders(<Delete open close={close} yes={yes} />);
    fireEvent.click(screen.getByText("YES"));
    fireEvent.click(screen.getByText("NO"));
    expect(yes).toHaveBeenCalled();
    expect(close).toHaveBeenCalled();
  });
});

describe("Logo", () => {
  it("renders text and image logos", async () => {
    const { default: Logo } = await import("components/common/Logo/index");
    renderWithProviders(
      <div>
        <Logo.TextLogo />
        <Logo.ImageLogo />
      </div>,
    );
    expect(screen.getByText("Memories")).toBeInTheDocument();
  });
});

describe("Notifications", () => {
  it("invokes every notification helper without throwing", async () => {
    const { default: Notifications } = await import(
      "components/common/Notifications/index",
    );
    renderWithProviders(<div />);
    expect(() => {
      Notifications.ID.Pending("id", "t", "m");
      Notifications.ID.Success("id", "t", "m");
      Notifications.ID.Failure("id", "t", "m");
      Notifications.noID.Success("t", "m");
      Notifications.noID.Failure("t", "m");
    }).not.toThrow();
  });
});

describe("ControlledFields", () => {
  it("renders Text, Password and Textarea inside a form", async () => {
    const { default: ControlledFields } = await import(
      "components/common/ControlledFields/index",
    );
    renderWithProviders(
      <FormHarness>
        <ControlledFields.Text name="title" label="Title" holder="t" />
        <ControlledFields.Password name="password" label="Password" />
        <ControlledFields.Textarea name="comment" label="Comment" />
      </FormHarness>,
    );
    const input = screen.getByPlaceholderText("t");
    expect(input).toBeInTheDocument();
    fireEvent.change(input, { target: { value: "hello", name: "title" } });
    fireEvent.blur(input);
  });

  it("renders the Tags field and loads tags", async () => {
    const { default: ControlledFields } = await import(
      "components/common/ControlledFields/index",
    );
    renderWithProviders(
      <FormHarness>
        <ControlledFields.Tags initalValue={["x"]} />
      </FormHarness>,
    );
    expect(await screen.findByText("Tags")).toBeInTheDocument();
  });
});

describe("ImageSelect", () => {
  it("renders and shows an error message", async () => {
    const ImageSelect = (
      await import(
        "components/common/UncontrolledFields/ImageSelect/ImageSelect",
      )
    ).default;
    const data = vi.fn();
    renderWithProviders(
      <ImageSelect name="Cover" data={data} err="bad image" />,
    );
    expect(screen.getByText("bad image")).toBeInTheDocument();
    expect(screen.getByText("Image must be less than 30MB")).toBeInTheDocument();
  });
});

describe("Cards", () => {
  it("renders a Memory card for an author and handles actions", async () => {
    const { default: Cards } = await import("components/common/Cards/index");
    const like = vi.fn();
    const edit = vi.fn();
    const del = vi.fn();
    renderWithProviders(
      <Cards.Memory
        data={mockMemory}
        user={{ _id: "user-1", role: "admin" }}
        like={like}
        edit={edit}
        _delete={del}
      />,
    );
    expect(screen.getByText(mockMemory.title)).toBeInTheDocument();
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[0]);
    expect(like).toHaveBeenCalled();
  });

  it("renders a Memory card for an anonymous user", async () => {
    const { default: Cards } = await import("components/common/Cards/index");
    renderWithProviders(
      <Cards.Memory
        data={mockMemory2}
        user={{}}
        like={vi.fn()}
        edit={vi.fn()}
        _delete={vi.fn()}
      />,
    );
    expect(screen.getByText(mockMemory2.title)).toBeInTheDocument();
  });

  it("renders a Recommendation card", async () => {
    const { default: Cards } = await import("components/common/Cards/index");
    renderWithProviders(<Cards.Recommendation data={mockMemory} />);
    expect(screen.getByText(mockMemory.title)).toBeInTheDocument();
  });

  it("renders a Comment card for the author", async () => {
    const { default: Cards } = await import("components/common/Cards/index");
    renderWithProviders(
      <Cards.Comment data={mockComment} user={mockUser} />,
      { preloadedState: { auth: { user: mockUser } } },
    );
    expect(screen.getByText(mockComment.body)).toBeInTheDocument();
  });
});

describe("MainPage", () => {
  it("renders the Memories grid", async () => {
    const { default: MainPage } = await import("components/MainPage/index");
    renderWithProviders(
      <MainPage.Memories
        data={[mockMemory, mockMemory2]}
        user={{ _id: "user-1" }}
        like={vi.fn()}
        edit={vi.fn()}
        _delete={vi.fn()}
      />,
    );
    expect(screen.getByText(mockMemory.title)).toBeInTheDocument();
  });

  it("renders the Pagination control", async () => {
    const { default: MainPage } = await import("components/MainPage/index");
    const onChange = vi.fn();
    renderWithProviders(
      <MainPage.Pagination
        currentPage={1}
        numberOfPages={3}
        onPageChange={onChange}
      />,
    );
    expect(screen.getByText("2")).toBeInTheDocument();
    fireEvent.click(screen.getByText("2"));
    expect(onChange).toHaveBeenCalledWith(2);
  });
});

describe("Comments components", () => {
  it("renders the OptionsButton and triggers callbacks", async () => {
    const { default: Comments } = await import("components/Comments/index");
    const edit = vi.fn();
    const del = vi.fn();
    renderWithProviders(<Comments.OptionsButton edit={edit} _delete={del} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders the comment List with comments", async () => {
    const { default: Comments } = await import("components/Comments/index");
    renderWithProviders(
      <Comments.List data={[mockComment]} user={mockUser} />,
      { preloadedState: { auth: { user: mockUser } } },
    );
    expect(screen.getByText(mockComment.body)).toBeInTheDocument();
  });

  it("renders the empty comment List", async () => {
    const { default: Comments } = await import("components/Comments/index");
    renderWithProviders(<Comments.List data={[]} user={null} />);
  });

  it("renders the comment Form and toggles the editor", async () => {
    const { default: Comments } = await import("components/Comments/index");
    renderWithProviders(
      <Comments.Form memoryId="memory-1" user={mockUser} />,
      { preloadedState: { auth: { user: mockUser } } },
    );
    const toggle = screen.getByText("Add Comment");
    fireEvent.click(toggle);
    await waitFor(() => {
      expect(screen.getByText("Submit")).toBeInTheDocument();
    });
  });
});

describe("Navbar", () => {
  it("renders search buttons, switch themes and user menu", async () => {
    const { default: Navbar } = await import("components/Navbar/index");
    renderWithProviders(
      <div>
        <Navbar.Search.Desk />
        <Navbar.Search.Mob />
        <Navbar.SwitchThemes />
        <Navbar.UserMenu user={mockUser} />
      </div>,
    );
    expect(screen.getByText("Search")).toBeInTheDocument();
    fireEvent.click(screen.getByTitle("Toggle theme"));
    expect(screen.getByText(mockUser.username)).toBeInTheDocument();
  });
});

describe("FloatingButton + ScrollToTop", () => {
  it("renders the floating button when logged in", async () => {
    const FloatingButton = (
      await import("components/FloatingButton/FloatingButton")
    ).default;
    const ScrollToTop = (await import("components/ScrollToTop")).default;
    renderWithProviders(
      <div>
        <FloatingButton />
        <ScrollToTop />
      </div>,
      { preloadedState: { auth: { user: mockUser } } },
    );
    expect(screen.getByRole("link")).toBeInTheDocument();
  });
});

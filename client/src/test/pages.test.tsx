import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "test/renderWithProviders";
import { mockMemory, mockComment, mockUser } from "test/mockData";

Element.prototype.scrollTo = vi.fn();

vi.mock("@mantine/rte", async () => {
  const React = await import("react");
  const RichTextEditor = React.forwardRef(
    (
      props: { onChange?: (value: string) => void },
      ref: React.Ref<unknown>,
    ) => {
      React.useImperativeHandle(ref, () => ({
        focus: () => {},
        editor: { container: { innerText: "body text" } },
      }));
      React.useEffect(() => {
        props.onChange?.("<p>hello</p>");
      }, []);
      return React.createElement("div", { "data-testid": "rte" });
    },
  );
  RichTextEditor.displayName = "RichTextEditor";
  return { RichTextEditor };
});

vi.mock("services", async () => {
  const { mockMemory, mockMemory2, mockComment } = await import(
    "test/mockData",
  );
  return {
    auth: {
      verifyCode: vi.fn().mockResolvedValue({ data: { message: "activated" } }),
      verifyToken: vi.fn(),
      login: vi.fn(),
      register: vi.fn().mockResolvedValue({ data: { message: "ok" } }),
      logout: vi.fn(),
    },
    memory: {
      getAll: vi.fn().mockResolvedValue({
        data: {
          data: { memories: [mockMemory, mockMemory2], numberOfPages: 2 },
        },
      }),
      getSingle: vi
        .fn()
        .mockResolvedValue({ data: { data: { memory: mockMemory } } }),
      getTags: vi
        .fn()
        .mockResolvedValue({ data: { data: { tags: ["a", "b"] } } }),
      create: vi.fn(),
      update: vi.fn(),
      like: vi.fn(),
      _delete: vi.fn(),
    },
    comments: {
      getAll: vi
        .fn()
        .mockResolvedValue({ data: { data: { comments: [mockComment] } } }),
      create: vi.fn(),
      update: vi.fn(),
      like: vi.fn(),
      _delete: vi.fn(),
    },
    search: {
      search: vi.fn().mockResolvedValue({
        data: { data: { memories: [mockMemory], numberOfPages: 1 } },
      }),
      getTitles: vi.fn().mockResolvedValue({ data: { data: { titles: [] } } }),
    },
    recommendations: {
      get: vi.fn().mockResolvedValue({
        data: { data: { recommendations: [mockMemory2] } },
      }),
    },
    user: {
      getProfile: vi.fn().mockResolvedValue({
        data: {
          data: {
            avatarURL: "https://example.com/avatar.png",
            createdAt: "2020-01-01T00:00:00.000Z",
            numberOfLikes: 5,
            numberOfMemories: 2,
            numberOfComments: 1,
          },
        },
      }),
    },
  };
});

beforeEach(() => {
  localStorage.clear();
});

describe("Home page", () => {
  it("renders memories after fetching", async () => {
    const Home = (await import("pages/Home/Home")).default;
    renderWithProviders(<Home />, { initialEntries: ["/"] });
    expect(await screen.findByText(mockMemory.title)).toBeInTheDocument();
  });
});

describe("Auth pages", () => {
  it("renders the Login page", async () => {
    const Login = (await import("pages/auth/Login/Login")).default;
    renderWithProviders(<Login />, {
      routePath: "/login",
      initialEntries: ["/login"],
    });
    expect(screen.getByText("Welcome back!")).toBeInTheDocument();
  });

  it("renders the Register page", async () => {
    const Register = (await import("pages/auth/Register/Register")).default;
    renderWithProviders(<Register />, {
      routePath: "/register",
      initialEntries: ["/register"],
    });
    expect(screen.getByText("Welcome to the family!")).toBeInTheDocument();
  });

  it("shows an invalid message for a bad activation code", async () => {
    const Activation = (await import("pages/auth/Activation/Activation"))
      .default;
    renderWithProviders(<Activation />, {
      routePath: "/activation",
      initialEntries: ["/activation"],
    });
    expect(await screen.findByText("Invalid")).toBeInTheDocument();
  });

  it("activates a valid code", async () => {
    const Activation = (await import("pages/auth/Activation/Activation"))
      .default;
    const code = "12345678-1234-4123-8123-1234567890AB";
    renderWithProviders(<Activation />, {
      routePath: "/activation",
      initialEntries: [`/activation?code=${code}`],
    });
    expect(await screen.findByText("activated")).toBeInTheDocument();
  });
});

describe("Missing page", () => {
  it("renders the 404 page", async () => {
    const Missing = (await import("pages/Missing/Missing")).default;
    renderWithProviders(<Missing />, {
      routePath: "*",
      initialEntries: ["/nope"],
    });
    expect(screen.getByText("404")).toBeInTheDocument();
  });
});

describe("Memory pages", () => {
  it("renders the Details page with memory, comments and recommendations", async () => {
    const Details = (await import("pages/Memory/Details/Details")).default;
    renderWithProviders(<Details />, {
      routePath: "/memory/:_id",
      initialEntries: ["/memory/memory-1"],
    });
    expect(await screen.findByText(mockMemory.title)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(mockComment.body)).toBeInTheDocument();
    });
  });

  it("renders the Create page with the rich text editor", async () => {
    const Create = (await import("pages/Memory/Create/Create")).default;
    renderWithProviders(<Create />, {
      routePath: "/memory/create",
      initialEntries: ["/memory/create"],
      preloadedState: { auth: { user: mockUser } },
    });
    expect(await screen.findByText("Create new Memory!")).toBeInTheDocument();
    expect(screen.getByTestId("rte")).toBeInTheDocument();
  });

  it("renders the Edit page when edit data exists", async () => {
    localStorage.setItem("editMemory", JSON.stringify(mockMemory));
    const Edit = (await import("pages/Memory/Edit/Edit")).default;
    renderWithProviders(<Edit />, {
      routePath: "/memory/edit",
      initialEntries: ["/memory/edit"],
    });
    expect(await screen.findByText("Edit Your Memory!")).toBeInTheDocument();
  });
});

describe("Search page", () => {
  it("renders search results", async () => {
    const Search = (await import("pages/search/search/Search")).default;
    renderWithProviders(<Search />, {
      routePath: "/search",
      initialEntries: ["/search?query=trip"],
    });
    expect(await screen.findByText(mockMemory.title)).toBeInTheDocument();
  });
});

describe("User pages", () => {
  it("renders the Profile page", async () => {
    const Profile = (await import("pages/user/Profile/Profile")).default;
    renderWithProviders(<Profile />, {
      routePath: "/user/:username",
      initialEntries: ["/user/john"],
    });
    expect(await screen.findByAltText("john's avatar")).toBeInTheDocument();
  });

  it("renders the user Memories page", async () => {
    const Memories = (await import("pages/user/Memories/Memories")).default;
    renderWithProviders(<Memories />, {
      routePath: "/user/:username/memories",
      initialEntries: ["/user/john/memories"],
    });
    expect(await screen.findByText(mockMemory.title)).toBeInTheDocument();
  });
});

describe("Layouts", () => {
  it("renders the Main layout with header and footer", async () => {
    const Main = (await import("layouts/Main/Main")).default;
    renderWithProviders(<Main />, {
      preloadedState: { auth: { user: mockUser } },
    });
    expect(screen.getAllByText("Memories").length).toBeGreaterThan(0);
  });

  it("renders the header for a logged-out visitor", async () => {
    const Header = (await import("layouts/Navigation/Header/Header")).default;
    renderWithProviders(<Header />);
    expect(screen.getByText("Register")).toBeInTheDocument();
  });

  it("triggers logout from the user menu", async () => {
    const Header = (await import("layouts/Navigation/Header/Header")).default;
    renderWithProviders(<Header />, {
      preloadedState: { auth: { user: mockUser } },
    });
    expect(screen.getByText(mockUser.username)).toBeInTheDocument();
  });
});

describe("RichTextEditor", () => {
  it("renders and forwards changes", async () => {
    const RTE = (
      await import(
        "components/common/UncontrolledFields/RichTextEditor/Memory/Memory",
      )
    ).default;
    const onData = vi.fn();
    renderWithProviders(<RTE data={onData} err="body error" />);
    expect(screen.getByTestId("rte")).toBeInTheDocument();
    await waitFor(() => {
      expect(onData).toHaveBeenCalled();
    });
    expect(onData).toHaveBeenCalledWith({
      body: "<p>hello</p>",
      description: "body text",
    });
  });
});

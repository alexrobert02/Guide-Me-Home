import { render, screen } from "@testing-library/react";
import App from "./App";
import { MemoryRouter } from "react-router-dom";

// Mock child components
jest.mock("./pages/Login/LoginHandler", () => {
  return function DummyLogin() {
    return <div>Login Component</div>;
  };
});

jest.mock("./pages/Register/RegisterHandler", () => {
  return function DummyRegister() {
    return <div>Register Component</div>;
  };
});

jest.mock("./pages/Home/Home", () => {
  return function DummyHome() {
    return <div>Home Component</div>;
  };
});

// Mock `localStorage`
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value;
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("App Component Routing", () => {
  beforeEach(() => {
    localStorageMock.clear(); // Reset mock before each test
  });

  it("redirects to Home if authenticated on login route", () => {
    localStorageMock.setItem("isAuthenticated", "true"); // Simulate authenticated user
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <App />
      </MemoryRouter>
    );

    // Ensure Home Component renders
    expect(screen.getByText("Home Component")).toBeInTheDocument();
  });

  it("renders Login if not authenticated on login route", () => {
    localStorageMock.setItem("isAuthenticated", "false"); // Simulate unauthenticated user
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <App />
      </MemoryRouter>
    );

    // Ensure Login Component renders
    expect(screen.getByText("Login Component")).toBeInTheDocument();
  });

  it("redirects to Home if authenticated on register route", () => {
    localStorageMock.setItem("isAuthenticated", "true"); // Simulate authenticated user
    render(
      <MemoryRouter initialEntries={["/register"]}>
        <App />
      </MemoryRouter>
    );

    // Ensure Home Component renders
    expect(screen.getByText("Home Component")).toBeInTheDocument();
  });

  it("renders Register if not authenticated on register route", () => {
    localStorageMock.setItem("isAuthenticated", "false"); // Simulate unauthenticated user
    render(
      <MemoryRouter initialEntries={["/register"]}>
        <App />
      </MemoryRouter>
    );

    // Ensure Register Component renders
    expect(screen.getByText("Register Component")).toBeInTheDocument();
  });

  it("redirects to Home on any unknown route", () => {
    localStorageMock.setItem("isAuthenticated", "true"); // Simulate authenticated user
    render(
      <MemoryRouter initialEntries={["/unknown"]}>
        <App />
      </MemoryRouter>
    );

    // Ensure Home Component renders
    expect(screen.getByText("Home Component")).toBeInTheDocument();
  });
});

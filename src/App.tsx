import { BrowserRouter, Routes, Route, Link } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { Home } from "./pages/Home";
import { Form } from "./pages/form";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <div className="flex flex-col items-center justify-center mt-20" >
      <BrowserRouter>
        <nav className="flex items-center justify-center gap-10 mb-5">
          <Link to="/">Home</Link>
          <Link to="add-form">Add Form</Link>
          <Link to="edit-form">Edit Form</Link>
        </nav>
        <Routes>
          <Route path="/" element={<h1 className="text-2xl">Home</h1>} />
          <Route path="/add-form" element={<Form />} />
          <Route
            path="/edit-form"
            element={
              <Form isEdit={true} />
            }
          />
        </Routes>
      </BrowserRouter>
          {/* <Home /> */}
      {/* <FormComponent initialData={{
      id: "2",
      language: "es",
      username: "gohan"
    }}/> */}
    </div>
    </QueryClientProvider>
  );
}

export default App;

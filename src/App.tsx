import { BrowserRouter, Routes, Route, Link } from "react-router";
import FormComponent from "@/components/FormComponent";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <div className="flex flex-col items-center justify-center mt-20 " >
      <BrowserRouter>
        <nav className="flex items-center justify-center gap-10 mb-5">
          <Link to="/">Home</Link>
          <Link to="add-form">Add Form</Link>
          <Link to="edit-form">Edit Form</Link>
        </nav>
        <Routes>
          <Route path="/" element={<h1 className="text-2xl">Home</h1>} />
          <Route path="/add-form" element={<FormComponent />} />
          <Route
            path="/edit-form"
            element={
              <FormComponent
                initialData={{
                  id: "1",
                  language: "en",
                  username: "goku",
                  hasWorkExperience: true,
                  companyName: "goku PVT LTD",
                  educationLevel: "bachelorsDegree",
                  universityName: "Ganpat university",
                  knowsOtherLanguages: true,
                  languages: [{name: "hindi"},{name: "english"},{name: "gujarati"}]
                }}
              />
            }
          />
        </Routes>
      </BrowserRouter>
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

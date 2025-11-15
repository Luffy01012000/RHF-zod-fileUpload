import { BrowserRouter,Routes, Route, Link } from "react-router";
import FormComponent from "./components/FormComponent";

function App() {
  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <BrowserRouter>
      <nav className="flex items-center justify-center gap-10 mb-5">
        <Link to="/">Home</Link>
        <Link to="add-form">Add Form</Link>
        <Link to="edit-form">Edit Form</Link>
      </nav>
      <Routes >
        <Route path="/" element={<h1 className="text-2xl">Home</h1>}/>
        <Route
          path="/add-form"
          element={
            <FormComponent
            />
          }
        />
        <Route
          path="/edit-form"
          element={
            <FormComponent
              initialData={{
                id: "1",
                language: "en",
                username: "goku",
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
  );
}

export default App;

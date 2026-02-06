import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import ProductsList from "./pages/products/ProductsList";
import ProductNew from "./pages/products/ProductNew";
import ProductEdit from "./pages/products/ProductEdit";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/products" element={<ProductsList />} />
        <Route path="/products/new" element={<ProductNew />} />
        <Route path="/products/:id/edit" element={<ProductEdit />} />
      </Routes>
    </>
  );
}

export default App;
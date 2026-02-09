import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import ProductsList from "./pages/products/ProductsList";
import ProductNew from "./pages/products/ProductNew";
import ProductEdit from "./pages/products/ProductEdit";

import ClientsList from "./pages/clients/ClientsList";
import ClientNew from "./pages/clients/ClientNew";
import ClientEdit from "./pages/clients/ClientEdit";

import CommandesList from "./pages/commandes/CommandesList";
import CommandeNew from "./pages/commandes/CommandeNew";

import CodePromosList from "./pages/codepromos/CodePromosList";
import CodePromoNew from "./pages/codepromos/CodePromoNew";
import CodePromoEdit from "./pages/codepromos/CodePromoEdit";

import PaiementsList from "./pages/paiements/PaiementsList";
import PaiementNew from "./pages/paiements/PaiementNew";

function App() {
  return (
    <>
      <Navbar />

      <main style={{ marginLeft: '260px', minHeight: '100vh' }}>
        <Routes>
          <Route path="/products" element={<ProductsList />} />
          <Route path="/products/new" element={<ProductNew />} />
          <Route path="/products/:id/edit" element={<ProductEdit />} />
          
          <Route path="/clients" element={<ClientsList />} />
          <Route path="/clients/new" element={<ClientNew />} />
          <Route path="/clients/:id/edit" element={<ClientEdit />} />
          
          <Route path="/commandes" element={<CommandesList />} />
          <Route path="/commandes/new" element={<CommandeNew />} />
          
          <Route path="/codepromos" element={<CodePromosList />} />
          <Route path="/codepromos/new" element={<CodePromoNew />} />
          <Route path="/codepromos/:id/edit" element={<CodePromoEdit />} />
          
          <Route path="/paiements" element={<PaiementsList />} />
          <Route path="/paiements/new" element={<PaiementNew />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
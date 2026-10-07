import { Link, Navigate, Route, Routes } from "react-router-dom";
import ListView from "./pages/ListView";
import GalleryView from "./pages/GalleryView";
import DetailView from "./pages/DetailView";
//import { useEffect } from "react";
//import { fetchAllPokemon } from "./api/pokemon";

export default function App() {
//useEffect(() => {
  //fetchAllPokemon().then(console.log).catch(console.error);
//}, []);
  return (
  <>
<nav>
  <Link to="/list">List</Link>
  <Link to="/gallery">Gallery</Link>
</nav>
<Routes>
  <Route path="/" element={<Navigate to="/list" replace />} />
  <Route path="/list" element={<ListView />} />
  <Route path="/gallery" element={<GalleryView />} />
  <Route path="/pokemon/:id" element={<DetailView />} />
</Routes>
</>
);
}
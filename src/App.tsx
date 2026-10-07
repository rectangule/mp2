import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import ListView from "./pages/ListView";
import GalleryView from "./pages/GalleryView";
import DetailView from "./pages/DetailView";
//import { useEffect } from "react";
//import { fetchAllPokemon } from "./api/pokemon";
import styles from "./App.module.css";


function linkClass({ isActive }: { isActive: boolean }): string {
  return isActive ? `${styles.link} ${styles.active}` : styles.link;
}
export default function App() {
//useEffect(() => {
  //fetchAllPokemon().then(console.log).catch(console.error);
//}, []);
  return (
  <>

   <header className={styles.header}>
        <span className={styles.brand}>Gen 1 Pokédex</span>
        <nav className={styles.nav}>
          <NavLink to="/list" className={linkClass}>
            List
          </NavLink>
          <NavLink to="/gallery" className={linkClass}>
            Gallery
          </NavLink>
        </nav>
      </header>

  

<Routes>
  <Route path="/" element={<Navigate to="/list" replace />} />
  <Route path="/list" element={<ListView />} />
  <Route path="/gallery" element={<GalleryView />} />
  <Route path="/pokemon/:id" element={<DetailView />} />
</Routes>
</>
);
}
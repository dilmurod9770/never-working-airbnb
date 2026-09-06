import { HttpLink, InMemoryCache, ApolloClient } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";

import HomePage from "./HomePage.jsx";
import ListingsPage from "./Listings.jsx";
import SingUp from "./SingUp.jsx";
import ListingsDetal from "./ListingsDetal.jsx";
import Favorites from "./Favorites.jsx";
import Login from "./Login";
import Footer from "./Footer";
import Bookings from "./Bokings.jsx";
import { graphqlClient } from "./graphql-client.js";
import StyleHomePage from "./HomePage.style.js";
import Adminn from "./Admin.jsx";



function App() {
  document.title = "Airbnb";
  
  return (

    <ApolloProvider client={graphqlClient}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/listings" element={<ListingsPage />} />
        <Route path="/listings/:id" element={<ListingsDetal />} />
        <Route path="/signup" element={<SingUp />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/login" element={<Login />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/admin" element={<Adminn />} />
      </Routes>   
       <Footer />
      <ToastContainer position="bottom-right" />
    </ApolloProvider>
  );
}

export default App;

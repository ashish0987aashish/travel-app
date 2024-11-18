import React from "react";
import LOGO from "../assets/images/logo.svg";
import ProfileInfo from "./Cards/ProfileInfo";
import { useNavigate } from "react-router-dom";
import SearchBar from "./Input/SearchBar";
import {IoMdSearch,IoMdClose} from "react-icons/io"

const Navbar = ({
  userInfo,
  searchQuery,
  setSearchQuery,
  onSearchNote,
  handleClearSearch,
}) => {
  const isToken = localStorage.getItem("token");
  const navigate = useNavigate();
  const[isSearchVisible,setIsSearchVisible]= useState(false)
  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery);
    }
  };

  const onClearSearch = () => {
    handleClearSearch();
    setSearchQuery("");
  };

  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10 ">
      <img src={LOGO} alt="travel story" className="h-9" />

      {isToken && (
        <>
          <div className="hidden md:block flex-1 mx-4">
          <SearchBar
            value={searchQuery}
            onChange={({ target }) => {
              setSearchQuery(target.value);
            }}
            handleSearch={handleSearch}
            onClearSearch={onClearSearch}
          />
          <div/> 

          <button
            className="md:hidden mr-7 text-gray-600"  
            onClick={()=> setIsSearchVisible(!isSearchVisible)}
          >
            {isSearchVisible ?  (
             <IoMdClose size={34}/>
            ) :
              <IoMdSearch size={34}/>
            }
          <button/>  
            
          <ProfileInfo userInfo={userInfo} onLogout={onLogout} />{" "}
        </>
      )}

       { isSearchVisible && (
          <div className="absolute top-14 left-0 right-0 bg-white p-4 shadow-md md:hidden z-20">
          <SearchBar
            value={searchQuery}
            onChange={({ target }) => {
              setSearchQuery(target.value);
            }}
            handleSearch={handleSearch}
            onClearSearch={onClearSearch}
          />
        </div>
       )}     
    </div>
  );
};

export default Navbar;

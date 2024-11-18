import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { json, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import TravelStoryCard from "../../components/Cards/TravelStoryCard";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddEditTravelStory from "./AddEditTravelStory";
import ViewTravelStory from "./ViewTravelStory";
import EmptyCard from "../../components/Cards/EmptyCard";

import EmptyImg from "../../assets/images/add-story.svg";
import { DayPicker } from "react-day-picker";
import moment from "moment";
import FilterInfoTitle from "../../components/Cards/FilterInfoTitle";

const Home = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("")

  const [dateRange,setDateRange] = useState({from:null,to:null})


  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    data: null,
  });

  // Get User Info

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        // Set user info if data exists

        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        // Clear storage if unauthorized
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  // Get all travel stories

  const getAllTravelStories = async () => {
    try {
      const response = await axiosInstance.get("get-all-stories");
      if (response.data && response.data.stories) {
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.log("An unexpected error occrued. Please try again");
    }
  };

  // Handle Edit Story Click
  const handleEdit = (data) => {
    setOpenAddEditModal({ isShown: true, type: "edit", data: data });
  };

  // Handle Travel Story Click
  const handleViewStory = (data) => {
    setOpenViewModal({ isShown: true, data });
  };

  // Handle  Update Favourite
  const updateIsFavourite = async (storyData) => {
    const storyId = storyData._id;

    try {
      const response = await axiosInstance.put(
        "/update-is-favourite/" + storyId,
        {
          isFavourite: !storyData.isFavourite,
        }
      );

      if (response.data && response.data.story) {
        toast.success("Story Updated Successfully");
        getAllTravelStories();
      }
    } catch (error) {
      console.log("An unexpected error occured,Please try again.");
    }
  };

  //  Delete Story
  const deleteTravelStory = async (data) => {
    const storyId = data._id;

    try {
      const response = await axiosInstance.delete("/delete-story/" + storyId);

      if (response.data && !response.data.error) {
        toast.error("Story Deleted Successfully");
        setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
        getAllTravelStories();
      }
    } catch (error) {
      // handle unexpected error occured

      console.log("An unexpected error occurred.please try again");
    }
  };


  // Search Story 
  const onSearchStory = async(query)=>{

     try {
       const response = await axiosInstance.get("/search", {
       params:{
        query
       }
       });

        if(response.data && response.data.stories){

          setFilterType("search")
          setAllStories(response.data.stories)
        }


      
     } catch (error) {
       // handle unexpected error occured

       console.log("An unexpected error occurred.please try again");
     }

  }

  const handleClearSearch = async() =>{
        setFilterType("")
        getAllTravelStories()
  }


// Handle Filter Travel Story By Date Range :
 const filterStoriesByDate = async(day) =>{

    try{

      const startDate = day.from? moment(day.from).valueOf():null
       const endDate = day.to? moment(day.to).valueOf():null
     

       if(startDate && endDate){

          const response = await axiosInstance.get("/travel-stories/filter",{params:{startDate,endDate}})

         if (response.data && response.data.stories) {

              setFilterType("date");
              setAllStories(response.data.stories)
         }
       }


       
    } catch{

       console.log("An unexpected error occurred.Please try again.")
    }

 }


// Handle Date Range Select
  const handleDayClick = (day) =>{
      
    setDateRange(day);
    filterStoriesByDate(day)
  }
     

  const resetFilter = () =>{

    setDateRange({from:null,to:null})
    setFilterType("")
    getAllTravelStories()
  }


  useEffect(() => {
    getUserInfo();
    getAllTravelStories();

    return () => {};
  }, []);

  return (
    <>
      <Navbar
        userInfo={userInfo}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchNote={onSearchStory}
        handleClearSearch={handleClearSearch}
      />

      <div className="container mx-auto px-4 py-6 ">


       <FilterInfoTitle 
       
         filterType={filterType}
         filterDates={dateRange}
        
         onClear = {()=>{
             resetFilter();
         }}
       
       />   



        <div className="flex flex-col-reverse lg:flex-row gap-6">
          <div className="flex-1">
            {allStories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-2 gap-7 ">
                {allStories.map((item) => {
                  return (
                    <TravelStoryCard
                      key={item._id}
                      imgUrl={item.imageUrl}
                      title={item.title}
                      story={item.story}
                      date={item.visitedDate}
                      visitedLocation={item.visitedLocation}
                      isFavourite={item.isFavourite}
                      onEdit={() => handleEdit(item)}
                      onClick={() => handleViewStory(item)}
                      onFavouriteClick={() => updateIsFavourite(item)}
                    />
                  );
                })}
              </div>
            ) : (
              <EmptyCard
                imaSrc={EmptyImg}
                message={` Oops,  No Story Found, Start creting your first Travel Story! Click the 'Add' button to write your thoughts,ideas and memories. Let's get started!`}
              />
            )}
          </div>
          <div className="w-[380px] lg:block">
            <div className="bg-white border border-slate-200 shadow-lg shadow-slate-200/60 hover:shadow-slate-500  rounded-lg mr-9">
              <div className="p-2">
                <DayPicker
                  captionLayout="dropdown-button"
                  mode="range"
                  selected={dateRange}
                  onSelect={handleDayClick}
                  pagedNavigation
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add & Edit Travel Story Modal */}

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="modal-box outline-none scrollbar overflow-y-scroll w-full sm:w-3/4 lg:w-1/2"
      >
        <AddEditTravelStory
          type={openAddEditModal.type}
          storyInfo={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          getAllTravelStories={getAllTravelStories}
        />
      </Modal>

      {/* View Travel Story Modal */}

      <Modal
        isOpen={openViewModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="modal-box outline-none scrollbar overflow-y-scroll w-full sm:w-3/4 lg:w-1/2"
      >
        <ViewTravelStory
          storyInfo={openViewModal.data || null}
          onClose={() => {
            setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
          }}
          onEditClick={() => {
            setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
            handleEdit(openViewModal.data || null);
          }}
          onDeleteClick={() => {
            deleteTravelStory(openViewModal.data || null);
          }}
        />
      </Modal>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-full bg-cyan-400 hover:bg-cyan-200 fixed right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <ToastContainer />
    </>
  );
};

export default Home;

import React, { useState } from 'react'
import { MdAdd,MdCheck, MdClose,MdDeleteOutline,MdUpdate } from 'react-icons/md'
import DateSelector from '../../components/Input/DateSelector'
import ImageSelector from '../../components/Input/ImageSelector';
import TagInput from '../../components/Input/TagInput';
import moment from 'moment';
import { ToastContainer, toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";
import uploadImage from '../../utils/uploadImage';

const AddEditTravelStory = ({
   
  storyInfo,
  type,
  onClose,
  getAllTravelStories

}) => {


  const [title,setTitle] = useState(storyInfo?.title||"");
  const [storyImg,setStoryImg] = useState(storyInfo?.imageUrl || null)
  const [story,setStory] = useState(storyInfo?.story||"")
  const [visitedLocation,setVisitedLocation] = useState(storyInfo?.visitedLocation || [])
  const [visitedDate,setVisitedDate] = useState(storyInfo?.visitedDate|| null);

  const [error,setError] = useState("")

   // Add New Travel Story

   const addNewTravelStory = async ()=>{

    try{
         let imageUrl = "";

         // Upload image if present 
         if(storyImg){

          const imgUploadRes = await uploadImage(storyImg)
            
          // Get image URL 
          imageUrl = imgUploadRes.imageUrl || "";
         }


         const response = await axiosInstance.post("/add-travel-story",{
           
            title,
            story,
            imageUrl: imageUrl || "",
            visitedLocation,
            visitedDate : visitedDate 
              ? moment(visitedDate).valueOf()
              : moment().valueOf()
         })

         if(response.data && response.data.story){

            toast.success("Story Added Successully")

             // Refresh stories 
             getAllTravelStories()

             // close modal or form 
             onClose()
             
         }

    }catch(error){
        
      if(

        error.response &&
        error.response.data &&
        error.response.data.message
      ){
         setError(error.response.data.message)
      }

      else{
        // handle unexpected error occured

        setError("An unexpected error occurred.please try again")
      }

    }

   }




   // Update Travel story
   const updateTravelStory= async()=>{

    const storyId = storyInfo._id;

      try{
         let imageUrl = "";

          let postData = {
           
            title,
            story,
            imageUrl: storyInfo.imageUrl || "",
            visitedLocation,
            visitedDate : visitedDate 
              ? moment(visitedDate).valueOf()
              : moment().valueOf()
         }
          
         if(typeof storyImg === "object"){

         //  Upload New Image
            
         const imgUploadRes = await uploadImage(storyImg)

         imageUrl  = imgUploadRes.imageUrl || ""

         postData ={
          ...postData,
           imageUrl:imageUrl,
         }

         }
          

         const response = await axiosInstance.put("/edit-story/"+storyId,postData)

         if(response.data && response.data.story){

            toast.success("Story Updated Successully")

             // Refresh stories 
             getAllTravelStories()

             // close modal or form 
             onClose()
             
         }

    }catch(error){
        
      if(

        error.response &&
        error.response.data &&
        error.response.data.message
      ){
         setError(error.response.data.message)
      }

      else{
        // handle unexpected error occured

        setError("An unexpected error occurred.please try again")
        console.log(error)
      }

    }
   }
  


   
   const handleAddOrUpdateClick = ()=>{
     console.log("Input Data:",{title,storyImg,story,visitedLocation,visitedDate})

     if(!title){
      setError("Please enter the title")
      return
     }

     if(!story){
      setError("Please enter the story")
      return 
     }

     setError("")

     if(type === "edit"){

      updateTravelStory();
     }
     else{
      addNewTravelStory();
     }

   }



   // Delete stroy image and update the story

   const handleDeleteImg = async()=>{


    // Deleting the Image 

    const deleteImgRes = await axiosInstance.delete("/delete-image",{

      params:{
        imageUrl: storyInfo.imageUrl,
      },
    });

    if(deleteImgRes.data){
      const storyId = storyInfo._id

      let postData = {
        title,
        story,
        visitedLocation,
        visitedDate: moment().valueOf(),
        imageUrl: "",
      };

      // Updating story

      const response = await axiosInstance.put(
      "/edit-story/"+storyId,
      postData

      );
        setStoryImg(null)
    }
   }

  return (
    <div className='relative'>
      <div className="flex items-center justify-between">
        <h5 className="text-xl font-medium text-slate-700">
          {type === "add" ? "Add Story" : "Update Story"}
        </h5>

        <div className="flex items-center gap-3 bg-cyan-50/50 rounded-l-lg">
          { type=== 'add'? (<button className="btn-small" onClick={handleAddOrUpdateClick}>
              <MdCheck className="text-lg" /> ADD STORY
            </button>):(<>
            <button className='btn-small' onClick={handleAddOrUpdateClick}>
              <MdUpdate className='text-lg' />UPDATE STORY
            </button>
          

            </>)
          }

          <button className="" onClick={onClose}>
            <MdClose className="text-xl btn-delete rounded-sm " />
          </button>
        </div>
          
        { error && (

          <p className='text-rose-600 text-xs pt-1.5 text-right' >{error}</p>
        )}

      </div>


      <div>
        <div className='flex-1 flex flex-col gap-2 pt-4'>
         <label className='input-label'></label>
         <input 
          type="text"
          className='text-2xl text-slate-900 bg-slate-50 outline-none' 
          placeholder='Add  a title to your story'
          value={title}
          onChange={({target})=>{setTitle(target.value)}}
         />


         <ImageSelector image={storyImg} setImage={setStoryImg} handleDeleteImg={handleDeleteImg} />

         <div className="my-3">
          <DateSelector date={visitedDate} setDate={setVisitedDate}/>
         </div>

          <div className="flex  flex-col gap-2 mt-4">
           <label className='input-leble'>STORY</label>
            
            <textarea  
               type="text"
               className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded'
               placeholder='Your Story'
               rows={10}
               value={story}
               onChange={({target})=>{
                setStory(target.value)
               }}
            />
          </div>

          <div className='pt-3'>

           <label className='input-lebel'>
            VISITED LOCATIONS
           </label>

           <TagInput tags={visitedLocation} setTags={setVisitedLocation}  />
          </div>

        </div>
      </div>
    </div>
  );
}

export default AddEditTravelStory

import  {memo } from "react"
import { MdClose } from "react-icons/md";

export default memo(function Confirm(props) { 
    const {statusOpenCf, setStatusOpenCf, setConfirmStatus, text} = props 
    const handleCloseConfirmationBox = () => {
        setStatusOpenCf(false)
        console.log(22212);
    } 
    const handleDeleteTask = () => {
        setConfirmStatus(true)
        console.log(1111);
    }
    return (
        <>
            <div className={`overlay inset-0 opacity-60 z-40 transition ${statusOpenCf ? 'bg-gray-300 fixed' : ''}`}></div>
            <div className={`container z-50 fixed ${statusOpenCf ? 'top-2/4' : '-top-2/4'} left-2/4 w-fit bg-white px-8 py-9 rounded transition-all  ease-in-out delay-800`}>
                <div className="relative">
                    <button className="absolute -right-6 -top-6 text-[18px]"  onClick={handleCloseConfirmationBox}>  
                        <MdClose/>
                    </button>
                    <div className="confirmation-text mb-7 text-base pt-3">
                        {text}
                    </div>
                    <div className="button-container flex justify-end">
                        <button 
                        className="cancel-button bg-gray-600 rounded px-1 py-1 text-white ml-3 hover:bg-gray-700" 
                        onClick={handleCloseConfirmationBox}>
                            Cancel
                        </button>
                        <button 
                        className="confirmation-button bg-red-500 rounded px-1 py-1 text-white ml-3 hover:bg-red-600"
                        onClick={() => handleDeleteTask()}>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </>
  )
})

import {Link} from 'react-router-dom'

const NotFound = () => {
    return (
        <div className=" flex flex-col bg-gray-50 bg-cover  justify-center items-center h-screen">
            <h1 className="text-[25px] font-bold">Page Not Found..!</h1> 
            <p className="text-black font-bold text-center"> Go to  <Link to="/login" className="text-blue-300 font-bold">
                 Login Page 
              </Link> </p>
        </div>
    )
}

export default NotFound
//import { useNavigate } from "react-router-dom";
// import HomePage from "../HomePage/HomePage";
import LogHomeNavbar from "../LogHomeNavbar/LogHomeNavbar";

const LogHomePage = () => {
   

  return (
    <div> 
     <LogHomeNavbar />
    <section className="flex m-4  ">
        <div className="flex flex-col justify-center items-center m-3 text-center">
          <div>
            <h1 className="font-bold text-[30px]">
              Your Health, <br /> Our Responsibility
            </h1>
            <p className="mt-4 text-[15px]">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              <br />
              Quibusdam tenetur doloremque molestias repellat minus asperiores
              in aperiam dolor, quaerat praesentium.
            </p>
          </div>
        </div>
        <div>
          <img src="https://appointmentdoctor.netlify.app/static/media/heroimg.8bbd2437f7c9d842026c.jpg" />
        </div>
      </section>
      <section className="m-4">
        <h1 className="font-bold text-center text-[30px] mt-5">About Us</h1>
        <div className="flex">
          <div>
            <img
              src="https://appointmentdoctor.netlify.app/static/media/aboutimg.af2db4b9f307d04f8745.jpg"
              className="m-4 h-[320px] w-[600px] "
            />
          </div>
          <div className="flex flex-col justify-center items-center m-3 ">
            <p className="w-[700px]  ">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Quibusdam tenetur doloremque molestias repellat minus asperiores
              in aperiam dolor, quaerat praesentium. Lorem ipsum dolor sit amet
              consectetur adipisicing elit. Voluptatibus, repudiandae! Lorem
              ipsum dolor sit amet consectetur adipisicing elit. Provident
              quibusdam doloremque ex? Officia atque ab dolore? Tempore totam
              non ea!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LogHomePage
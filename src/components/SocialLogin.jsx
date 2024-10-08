import { useLocation, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";
import useAxiosPublic from "../hooks/useAxiosPublic";

const SocialLogin = () => {
  const { signInWithGoogle } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";
  const axiosPublic = useAxiosPublic();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      const user = result.user;
      const userInfo = {
        name: user?.displayName,
        email: user?.email,
        photo: user?.photoURL,
        date: new Date(),
      };
      if (user) {
        const { data } = await axiosPublic.post("/users", userInfo);
        if (data.insertedId) {
          Swal.fire({
            position: "top-end",
            title: "Success!",
            text: `Welcome ${user.displayName ? user.displayName : user.email}`,
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error!",
        text: `${error.message}`,
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  };
  return (
    <>
      <div className="px-8 mb-6">
        <button
          onClick={handleGoogleSignIn}
          className="btn btn-outline rounded-full"
        >
          <FaGoogle className="text-lg" /> Google
        </button>
      </div>
    </>
  );
};
export default SocialLogin;

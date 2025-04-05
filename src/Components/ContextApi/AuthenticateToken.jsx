import { useEffect } from "react";
import { useData } from "./Context";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function AuthenticateToken() {
  const { setRole, setUserName, setEmail, setToken } = useData();
  const token = Cookies.get("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      axios
        .post(`https://ciho.com.au/api/verifyUserByToken.php?token=${token}`)
        .then((response) => {
          const data = response.data;
          if (data.valid) {
            setToken(token);
            setRole(data.role);
            setUserName(data.data.data.Name);
            setEmail(data.data.data.Email);
          } else {
            Cookies.remove("token");
            navigate("/login");
            setToken(null);
            setRole("");
            setUserName("");
            setEmail("");
          }
        })
        .catch((error) => {
          console.error("Error verifying token:", error);
        });
    } else {
      Cookies.remove("token");
      setToken(null);
      setRole("");
      setUserName("");
      setEmail("");
    }
  }, [token, setRole, setUserName, setEmail, setToken]);

  return null;
}

import { useState } from "react";
import axios from "axios";
import "./App.css";
import { jwtDecode } from "jwt-decode";
import LoginForm from "./components/LoginForm";
import SignUpForm from "./components/SignUpForm";
import Home from "./components/Home";

function App() {
  const [loginform, setLoginForm] = useState(true);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [signUp, setSignUp] = useState(false);
  const [posts, setPosts] = useState(null);
  const [postForm, setPostForm] = useState(false);
  const [title, setTitle] = useState("");

  const refreshToken = async () => {
    try {
      const res = await axios.post("http://localhost:4000/token", {
        token: token.refreshToken,
      });
      setToken(res.data);
      await openUser(res.data.accessToken);
      console.log(res.data);
      return res.data;
    } catch (e) {
      console.log(e.message);
    }
  };

  const JWTaxios = axios.create();
  JWTaxios.interceptors.request.use(
    async (req) => {
      let currentDate = new Date();
      const decodedToken = jwtDecode(token.accessToken);
      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        const data = await refreshToken();
        req.headers["authorization"] = "Bearer " + data.accessToken;
      }
      return req;
    },
    (err) => Promise.reject(err)
  );

  const openUser = async (accessToken) => {
    try {
      const res = await axios.get("http://localhost:5001/users", {
        headers: { authorization: "Bearer " + accessToken },
      });
      setUser(res.data.user);
      setPosts(res.data.posts);
      // setUser(data);
      // console.log(res.data);
      // return res.data;
    } catch (e) {
      console.log(e.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Subbmitted");
    try {
      const res = await axios.post("http://localhost:4000/login", {
        username,
      });
      setToken(res.data);
      // console.log(token);
      await openUser(res.data.accessToken);
      setLoginForm(false);
    } catch (e) {
      console.log(e.message);
    }
  };

  const logoutOper = async (refreshToken) => {
    try {
      const res = await JWTaxios.delete("http://localhost:4000/logout", {
        token: refreshToken,
      });
      console.log(res);
      if (res.status !== 204) {
        throw new Error("Some Error Occurred");
      }
      setUser(null);
      setToken(null);
      setLoginForm(true);
    } catch (e) {
      console.log(e.message);
    }
  };

  const getRequest = async () => {
    try {
      const res = await JWTaxios.get("http://localhost:5001/users", {
        headers: { authorization: "Bearer " + token.accessToken },
      });
      if (res.data === null) {
        throw new Error("Forbidden");
      }
      console.log(res.data);
    } catch (e) {
      console.log(e.message);
    }
  };

  const handleSubmitRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/register", {
        email,
        username,
        password,
      });
      if (res.data === null) {
        throw new Error("Error Occurred");
      }
      setLoginForm(true);
      setSignUp(false);
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <>
      <div className="container">
        {loginform ? (
          <div className="login">
            <LoginForm
              handleSubmit={handleSubmit}
              setUsername={setUsername}
              setPassword={setPassword}
              setLoginForm={setLoginForm}
              setSignUp={setSignUp}
            />
          </div>
        ) : signUp ? (
          <div className="Sign Up">
            <SignUpForm
              handleSubmitRegister={handleSubmitRegister}
              setUsername={setUsername}
              setEmail={setEmail}
              setPassword={setPassword}
              setLoginForm={setLoginForm}
              setSignUp={setSignUp}
            />
          </div>
        ) : (
          <div className="home">
            <Home
              user={user}
              getRequest={getRequest}
              logoutOper={logoutOper}
              posts={posts}
              setPosts={setPosts}
              token={token}
              postForm={postForm}
              setTitle={setTitle}
              setPostForm={setPostForm}
              title={title}
              axios={JWTaxios}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default App;

import React from "react";
import PostForm from "./PostForm";
import axios from "axios";

function Home(props) {
  const {
    user,
    getRequest,
    logoutOper,
    posts,
    token,
    postForm,
    setTitle,
    setPostForm,
    title,
    axios,
    setPosts,
  } = props;
  // const [posts, setPosts] = useState(null)
  // const [postForm, setPostForm] = useState(false);
  // const [title, setTitle] = useState("");

  const submitPost = async () => {
    // e.preventDefault();
    try {
      console.log(user);
      const res = await axios.post(
        `http://localhost:5001/${user._id}/posts`,
        { title },
        {
          headers: { authorization: "Bearer " + token.accessToken },
        }
      );
      setPostForm(false);
      setPosts(res.data.posts);
      console.log(res.data);
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <>
      {postForm ? (
        <PostForm submitPosts={submitPost} setTitle={setTitle} title={title} />
      ) : (
        <>
          <h2>
            Welcome <b>{user && user.username}</b>
          </h2>

          <br />
          <br />
          <h2>{posts.length > 0 ? "Posts: " : "No Posts"}</h2>
          <br />
          <br />
          {posts.length > 0 &&
            posts.map((post, id) => {
              return (
                <>
                  <h3 key={id}>{post.title}</h3>
                </>
              );
            })}
          <br />
          <br />
          <button
            onClick={() => {
              setPostForm(true);
            }}
          >
            Create +{" "}
          </button>
        </>
      )}

      <br />
      <br />

      <br />
      <br />
      <button onClick={getRequest}>GET</button>
      <br />
      <br />
      <button onClick={() => logoutOper(token.refreshToken)}>Logout</button>
    </>
  );
}

// export { submitPost };
export default Home;

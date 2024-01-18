import React from "react";
// import { submitPosts } from "./Home";

export default function PostForm(props) {
  const { submitPosts, setTitle, title } = props;
  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitPosts(title);
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>Title of Post: </label>
        <input
          name="title"
          placeholder="title"
          type="text"
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <br />
        <button type="submit">Submit Post</button>
      </form>
    </>
  );
}

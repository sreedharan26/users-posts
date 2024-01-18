import React from "react";

export default function LoginForm(props) {
  const { handleSubmit, setUsername, setPassword, setLoginForm, setSignUp } =
    props;
  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>Username: </label>
        <input
          type="text"
          placeholder="username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <br />
        <label>Password: </label>
        <input
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <br />
        <button type="submit">Login</button>
        <button
          onClick={() => {
            setLoginForm(false);
            setSignUp(true);
          }}
        >
          Sign Up / Register
        </button>
      </form>
    </>
  );
}

import React from "react";

export default function SignUpForm(props) {
  const {
    handleSubmitRegister,
    setUsername,
    setEmail,
    setPassword,
    setLoginForm,
    setSignUp,
  } = props;
  return (
    <>
      <form onSubmit={handleSubmitRegister}>
        <label>Username: </label>
        <input
          type="text"
          placeholder="username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <br />
        <label>Email: </label>
        <input
          type="text"
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
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
        <button type="submit">Sign Up</button>
        <button
          onClick={() => {
            setLoginForm(true);
            setSignUp(false);
          }}
        >
          Login
        </button>
      </form>
    </>
  );
}

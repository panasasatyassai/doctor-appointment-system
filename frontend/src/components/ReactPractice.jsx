const ReactPractice = () => {
  function Welcome(props) {
    if (props.isLoggedIn) {
      return <div>Welcome, {props.userName}</div>;
    } else {
      return (
        <div>
          <a href="/login">Login</a>
        </div>
      );
    }
  }

  return (
    <div>
      <h1>React 1 </h1>
      <div>
        <Welcome isLoggedIn={true} userName={"John"} />
      </div>
    </div>
  );
};

export default ReactPractice;

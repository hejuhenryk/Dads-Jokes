// import { useLocalStorageState } from "react-storage-hooks";
// import { usePersistentState } from "./usePersistentState";
import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import styled, { keyframes, createGlobalStyle } from "styled-components";
import axios from "axios";
import { Joke } from "./components/Joke";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGrinTears } from "@fortawesome/free-solid-svg-icons";

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Rubik&display=swap');
  body {
    font-family: 'Rubik', sans-serif;
  }
`;

const laugh = keyframes`
0% {
  transform: rotate(0deg);
}
30%, 60% {
  transform: rotate(10deg) translate( .1rem, -0.1rem);
}
20%, 50%, 80% {
  transform: rotate(-10deg) translate( -0.1rem, .1rem);
}
100% {
  transform: rotate(0deg);
}

`;

type Joke = {
  id: string;
  joke: string;
};

export interface JokeStatus extends Joke {
  vote: number;
}

const JokesApp = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;

  /* background-color: gold; */
  .jokes {
    /* border: solid brown 4px; */
    height: 80vh;
    width: 70%;
    border-left: 0;
    box-shadow: 10px 10px 20px 1px black;
    overflow: auto;
    list-style: none;
    align-self: center;
    background: white;
    scrollbar-color: red;
    @media (max-width: 768px) {
      flex-direction: row;
      width: 96%;
      height: 60vh;
    }
  }
  .menu {
    height: 90vh;
    width: 30%;
    /* border: black solid 4px; */
    margin: 0;
    background-color: brown;
    box-shadow: 10px 10px 20px 1px black;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    @media (max-width: 768px) {
      flex-direction: row;
      width: 100%;
      height: 30vh;
    }
    button {
      border: black 2px solid;
      border-radius: 15px;
      background-color: gold; /* overwrite */
      box-shadow: 10px 10px 20px 1px black;
      height: 2.5rem;
      width: 8rem;
      font-family: Rubik;
      font-size: 1rem;
      text-transform: uppercase;
      color: black;
      font-weight: bold;
      margin: .3rem;
    }
  }
  .laugh {
    transition: transform 0.5s ease-in-out;
    filter: drop-shadow(3px 3px 2px rgba(0, 0, 0, 0.7));
    :hover {
      animation: ${laugh} 1s infinite;
    }
    svg {
      color: gold;
      font-size: 5rem;
      margin: .3rem;

    }
  }
  .joker {
    display: flex;
    max-width: 80%;
    margin: 0 auto;
    @media (max-width: 768px) {
      flex-direction: column;
    }
  }
`;

const Menu = styled.div`
  /* height: 80%; */
  width: 15rem;
  border: pink solid 4px;
`;

const localStorageKey = "funny-jokes";

const App: React.FC = () => {
  const [jokes, setJokes] = useState<JokeStatus[]>(
    JSON.parse(localStorage.getItem(localStorageKey) || "[]")
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getOne = () => {
    setIsLoading(true);
    axios
      .get<Joke>("https://icanhazdadjoke.com", {
        headers: { Accept: "application/json" }
      })
      .then(res => {
        if (jokes.findIndex(j => j.id === res.data.id) === -1)
          setJokes(prevJokes => [
            ...prevJokes,
            { id: res.data.id, joke: res.data.joke, vote: 0 }
          ]);
        else getOne();
      })
      .then(() => setIsLoading(false))
      .catch(err => {
        setIsLoading(false);
        setError(err);
      });
  };

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(jokes));
  }, [jokes]);

  useEffect(() => {
    setError(null);
    if (error) {
      alert(error);
    }
  }, [error]);

  useEffect(() => {
    if (jokes.length === 0) {
      for (let i = 0; i < 10; i++) {
        getOne();
      }
    }
  }, []);

  const voteHandler = (id: string, vote: -1 | 1) => {
    const updatedJokes = jokes.map(j =>
      j.id === id ? { ...j, vote: j.vote + vote } : j
    );
    setJokes(updatedJokes);
  };

  const clickHandler = () => {
    for (let i = 0; i < 5; i++) {
      getOne();
    }
  };

  return (
    <JokesApp
      style={{
        background:
          "linear-gradient(135deg, gold 0%, gold 50%, brown 0%, brown 50%)"
      }}
    >
      <GlobalStyles />
      <div className="joker">
        <div className="menu">
          <span className="laugh">
            <FontAwesomeIcon
              icon={faGrinTears}
              // style={{ color: "gold", fontSize: "8rem" }}
            />
          </span>
          <button
            onClick={clickHandler}
            style={{
              background:
                "linear-gradient(135deg, gold 0%, gold 50%, brown 0%, brown 50%)"
            }}
          >
            find joke
          </button>
        </div>
        <div className="jokes">
          {jokes.map(j => (
            <Joke key={j.id} voteHandler={voteHandler} {...j} />
          ))}
        </div>
      </div>
    </JokesApp>
  );
};
render(<App />, document.getElementById("root"));

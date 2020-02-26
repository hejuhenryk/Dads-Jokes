import React from "react";
import { JokeStatus } from "../App";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFlushed,
  faMeh,
  faSmile,
  faLaugh,
  faGrinTears,
  faGrinSquintTears
} from "@fortawesome/free-regular-svg-icons";
import {   faArrowUp,
    faArrowDown} from "@fortawesome/free-solid-svg-icons"

interface JokeProps extends JokeStatus {
  voteHandler: (id: string, vote: -1 | 1) => void;
}
export const Joke: React.FC<JokeProps> = ({ id, joke, vote, voteHandler }) => {
  const getExpression = (excitementLevel: number) => {
    if (excitementLevel > 13)
      return { color: "#4caf50", emoji: faGrinSquintTears };
    else if (excitementLevel > 10)
      return { color: "#8bc34a", emoji: faGrinTears };
    else if (excitementLevel > 7) return { color: "#ffeb3b", emoji: faLaugh };
    else if (excitementLevel > 3) return { color: "#ffc108", emoji: faSmile };
    else if (excitementLevel >= 0) return { color: "#ff9800", emoji: faMeh };
    else return { color: "#f44336", emoji: faFlushed };
  };

  return (
    <JokeStyled color={getExpression(vote).color}>
      <Voting>
        <FontAwesomeIcon icon={faArrowUp} onClick={() => voteHandler(id, 1)} />
        <Vote color={getExpression(vote).color}>{vote}</Vote>
        <FontAwesomeIcon
          icon={faArrowDown}
          onClick={() => voteHandler(id, -1)}
        />
      </Voting>
      <p>{joke}</p>
      <div className='emoji'>
        <FontAwesomeIcon icon={getExpression(vote).emoji} />
      </div>
    </JokeStyled>
  );
};

const JokeStyled = styled.div<{color: string}>`
  display: flex;
  width: 100%;
  background-color: white;
  border-bottom: 2px solid #ccc;
  justify-content: space-between;
  align-items: center;
  font-weight: 400;
  padding: 0.8rem;
  .emoji {
      font-size: 2rem;
      padding-left: 1rem;
      font-weight: 100;
      color: ${p=>p.color};
  }
`;

const Vote = styled.div<{ color: string }>`
  height: 2rem;
  width: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 2px solid ${p => p.color};
  border-radius: 50%;
  font-size: 1rem;
`;

const Voting = styled.div`
  display: flex;
  align-items: center;
  svg {
    background-color: transparent;
    border: none;
    margin: 0 0.3rem;
    cursor: pointer;
    :focus {
      outline: none;
    }
  }
`;

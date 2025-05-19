import React, { useState } from "react";
import { Card, ButtonGroup, ToggleButton } from "react-bootstrap";

export type Question = {
  id: string;
  text: string;
  answered: boolean;
};

type QuestionCardProps = {
  question: Question;
  onAnswered: (id: string, answered: boolean) => void;
  onResponse: (value: string) => void;        //  NEW prop
};

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswered,
  onResponse,                              //  destructure it
}) => {
  const [selected, setSelected] = useState<number | null>(null);

  const options = [
    { value: 1, label: "Strongly Disagree" },
    { value: 2, label: "Disagree" },
    { value: 3, label: "Neutral" },
    { value: 4, label: "Agree" },
    { value: 5, label: "Strongly Agree" },
  ];

  const handleClick = (
    e: React.ChangeEvent<HTMLInputElement>,
    firstTime: boolean
  ) => {
    const val = parseInt(e.currentTarget.value, 10);
    setSelected(val);

    if (firstTime) {
      onAnswered(question.id, true);
    }
    // report the actual selected answer
    onResponse(val.toString());
  };

  return (
    <Card className="my-3 shadow-sm">
      <Card.Body>
        <Card.Title>{question.text}</Card.Title>
        <ButtonGroup className="d-flex justify-content-between mt-3">
          {options.map((opt, idx) => (
            <ToggleButton
              key={idx}
              id={`option-${question.id}-${idx}`}
              type="radio"
              variant={
                selected === opt.value ? "primary" : "outline-primary"
              }
              name={`question-${question.id}`}
              value={opt.value}
              checked={selected === opt.value}
              onChange={e => {
                handleClick(e, selected === null);   // selected===null means first answer
              }}
            >
              {opt.label}
            </ToggleButton>
          ))}
        </ButtonGroup>
      </Card.Body>
    </Card>
  );
};

export default QuestionCard;

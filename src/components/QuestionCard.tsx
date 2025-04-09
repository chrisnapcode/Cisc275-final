import React, { useState } from "react";
import { Card, ButtonGroup, ToggleButton } from "react-bootstrap";

export type Question = {
  id: string;
  text: string;
};

type QuestionCardProps = {
  question: Question;
};

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const [selected, setSelected] = useState<number | null>(null);

  const options = [
    { value: 1, label: "Strongly Disagree" },
    { value: 2, label: "Disagree" },
    { value: 3, label: "Neutral" },
    { value: 4, label: "Agree" },
    { value: 5, label: "Strongly Agree" },
  ];

  return (
    <Card className="my-3 shadow-sm">
      <Card.Body>
        <Card.Title>{question.text}</Card.Title>
        <ButtonGroup className="d-flex justify-content-between mt-3">
          {options.map((opt, idx) => (
            <ToggleButton
                key={idx}
                id={`option-${question.id}-${idx}`}  // unique id
                type="radio"
                variant={selected === opt.value ? "primary" : "outline-primary"}
                name={`question-${question.id}`}     // unique group per question
                value={opt.value}
                checked={selected === opt.value}
                onChange={(e) => {setSelected(parseInt(e.currentTarget.value))}}
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
import React, { useState } from "react";
import { Card, Form, InputGroup } from "react-bootstrap";
import { Question } from "./QuestionCard"; 

type QuestionCardProps = {
  question: Question;
  onAnswered: (id: string, answered: boolean) => void;
};

const AdvancedQuestionCard: React.FC<QuestionCardProps> = ({ question , onAnswered}) => {
  const [value, setValue] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setValue(newVal);
    // answered = true if there’s any non-whitespace text
    const isAnswered = newVal.trim().length > 0;
    onAnswered(question.id, isAnswered);
  };


  return (
    <Card className="my-3 shadow-sm">
      <Card.Body>
        <Card.Title>{question.text}</Card.Title>
        <Form.Group className="mb-3">
          <Form.Label className="fw-semibold"></Form.Label>
          <InputGroup>
            <Form.Control
              type="text"
              value={value}
              onChange={handleChange}
              placeholder={"Type your answer"}
              className="shadow-sm rounded"
            />
          </InputGroup>
        </Form.Group>
      </Card.Body>
    </Card>
  );
};

export default AdvancedQuestionCard;
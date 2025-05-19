// [Epic 3, #32] Displays individual detailed assessment questions with input fields
import React, { useState } from "react";
import { Card, Form, InputGroup } from "react-bootstrap";
import { Question } from "./QuestionCard"; 

type QuestionCardProps = {
  question: Question; //The question being asked
  onAnswered: (id: string, answered: boolean, newVal: string) => void;
};

const AdvancedQuestionCard: React.FC<QuestionCardProps> = ({ question , onAnswered}) => {
  //State to hold the user's input
  const [value, setValue] = useState("");
  //handles user input in real time 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setValue(newVal);
    // answered = true if there’s any non-whitespace text
    const isAnswered = newVal.trim().length > 0;
    onAnswered(question.id, isAnswered, newVal);
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
              value={value} // we in charge here
              onChange={handleChange} //syncs input with state
              placeholder={"Type your answer"} //tell the user to type
              className="shadow-sm rounded" 
            />
          </InputGroup>
        </Form.Group>
      </Card.Body>
    </Card>
  );
};

export default AdvancedQuestionCard;
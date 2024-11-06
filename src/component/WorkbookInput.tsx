import type { Component, ParentProps } from 'solid-js';
import { createSignal } from 'solid-js';

import './WorkbookInput.component.css'

type WorkInputEvent = {
  currentTarget: HTMLInputElement,
  target: HTMLInputElement,
  isTrusted: boolean
};
type AnswerResult = {
  isCorrect: boolean,
  left: number,
  right: number,
  value: number,
  correct_value: number
}
type Answer = (isCorrect: boolean, left: number, right: number, value: number, correct_value: number) => void

export enum Operator {
  Multiplication = '×'
}

function calc(left: number, right: number, operator: Operator) {
  switch(operator) {
    case Operator.Multiplication:
      return left * right;
  }

  return 0;
}

export const Equation: Component<ParentProps<{left: number, right: number, operator: Operator, answer: (result: AnswerResult) => void}>> = (props) => {
  const [correct, setCorrect] = createSignal(true);
  const inputhandler = (event: WorkInputEvent) => {
    if (event.target.value.length === 0) return;
    const value = Number(event.target.value);
    const correct_value = calc(props.left, props.right, props.operator);

    const isCorrect = value === correct_value;
    setCorrect(isCorrect);
    props.answer.call(null, {
      isCorrect,
      left: props.left,
      right: props.right,
      value,
      correct_value
    });
    event.target.value = '';
  }  

  return (
    <div class='equation'>
      <input class='num-input' type='number' readOnly={true} value={props.left} />
      <input class='operator' type='text' readOnly={true} value={props.operator} />
      <input class='num-input' type='number' readOnly={true} value={props.right} />
      <input class='operator' type='text' readOnly={true} value='=' />
      <input class='num-input' classList={{
        'correct': correct(),
        'incorrect': !correct()
      }} type='number' onblur={inputhandler} onKeyPress={e => {
        if (e.key === 'Enter') inputhandler( { currentTarget: e.currentTarget, target: e.currentTarget, isTrusted: e.isTrusted });
      }} />
    </div>
  );
};
import type { Component, ParentProps } from 'solid-js';
import { createSignal } from 'solid-js';

import './WorkbookInput.component.css'

type WorkInputEvent = {
  currentTarget: HTMLInputElement,
  target: HTMLInputElement,
  isTrusted: boolean
};

export const NumInput: Component<ParentProps<{value?: number | undefined, readOnly?: boolean, input?: (event: WorkInputEvent) => boolean}>> = (props) => {
  const [correct, setCorrect] = createSignal(true);
  const inputhandler = (event: WorkInputEvent) => {
    if(props.input === undefined) return;
    setCorrect(props.input(event))
  }
  
  return (
    <input class='num-input' classList={{
      'correct': correct(),
      'incorrect': !correct()
    }} type='number' readOnly={props.readOnly ?? true} value={props.value ?? ''} onblur={inputhandler} />
  );
};


export const Operator: Component<ParentProps<{sign: string}>> = (props) => {
  return (
    <input class='operator' type='text' readOnly={true} value={props.sign} />
  );
};

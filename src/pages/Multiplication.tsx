import type { Component } from 'solid-js';
import { createSignal, For } from 'solid-js';
import { shuffleArray } from '../utils/shuffle';
import { History } from '../utils/history';

import { Equation, Operator } from '../component/WorkbookInput';
import { ScoreBoard } from '../component/WorkbookResult';
import './Multiplication.css'

enum Mode {
  Free
}
const [mode, setMode] = createSignal(Mode.Free);
const modeChange = (newMode: Mode) => {
  setMode(newMode);
} 

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const [left, setLeft] = createSignal(0);
const [right, setRight] = createSignal(0);

const targets = numbers.map(number => {
  const [enable, setEnable] = createSignal(true);
  return { number, enable, setEnable }
});

const next = () => {
  const expressions =
    targets
      .filter(target => target.enable())
      .flatMap(target => numbers.map( number => ({ left: target.number, right: number })));

  if (expressions.length === 0) return;

  const sorted = shuffleArray(expressions);
  setLeft( sorted[0].left);
  setRight( sorted[0].right)
}

const App: Component = () => {
  History.init();
  next();
  return (
    <div style={{display: 'flex', height: '90vh'}}>
      <div style={{width: '250px', display: 'flex', "flex-direction": 'column'}}>
        <For each={targets}>{(target) => (
            <label class='number_line'>
              <input type='checkbox' checked={target.enable()} on:change={ e => (target.setEnable(e.target.checked), next()) }></input>
              <span>{target.number} のだん</span>
            </label>
          )}
        </For>
      </div>
      <div style={{flex: 1}}>

        <div class='mode_nav'>
          <button on:click={() => modeChange(Mode.Free)} class='mode_nav_item'>けいさん</button>
        </div>

        <Equation left={left()} right={right()} operator={Operator.Multiplication} answer={answer => {
          History.push(answer.left, answer.right, answer.value, answer.isCorrect);
          if(answer.isCorrect) next();
        }} />

        <ScoreBoard total={History.total()} consecutive={History.consecutive()} />
      </div>
    </div>
  );
};

export default App;

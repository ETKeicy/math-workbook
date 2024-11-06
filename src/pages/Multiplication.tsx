import type { Component } from 'solid-js';
import { createSignal, For, Show } from 'solid-js';
import { shuffleArray } from '../utils/shuffle';
import { History } from '../utils/history';

import { Equation, Operator } from '../component/WorkbookInput';
import { ScoreBoard } from '../component/WorkbookResult';
import './Multiplication.css'
import { M } from 'vite/dist/node/types.d-aGj9QkWt';

type question = {
  left: number,
  right: number
}
const [cardList, setCardList] = createSignal({
  count: 1,
  generator: (function* () {
    yield { left: 0, right: 0 } as question;
  })()
});
enum Mode {
  Card,
  Free
}
const [mode, setMode] = createSignal(Mode.Card);
const modeChange = (newMode: Mode) => {
  setMode(newMode);
  History.init();

  const expressions = targets
    .filter(target => target.enable())
    .flatMap(target => numbers.map( number => ({ left: target.number, right: number } as question)));

  switch(newMode) {
    case Mode.Card:
      const sorted = expressions;
      setCardList({
        count: sorted.length,
        generator: (function* () {
          yield* sorted;
        })()
      });
      break;
    case Mode.Free:
      setCardList({
        count: expressions.length,
        generator: (function* () {
          yield* shuffleArray(expressions);
        })()
      });
      break;
  }

  ask();
}
enum ModeSub {

} 

const ask = () => {
  if (cardList().count === 0) return;

  let card = cardList().generator.next();
  if (card.done) {
    return modeChange(mode());
  }

  if (card.value !== undefined) {
    setLeft(card.value.left);
    setRight(card.value.right)
  }  
}


const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const [left, setLeft] = createSignal(0);
const [right, setRight] = createSignal(0);

const targets = numbers.map(number => {
  const [enable, setEnable] = createSignal(true);
  return { number, enable, setEnable }
});

// const next = () => {
//   const expressions =
//     targets
//       .filter(target => target.enable())
//       .flatMap(target => numbers.map( number => ({ left: target.number, right: number })));

//   console.log(cardList().generator.next())

//   if (expressions.length === 0) return;

//   const sorted = shuffleArray(expressions);
//   setLeft( sorted[0].left);
//   setRight( sorted[0].right)
// }


const App: Component = () => {
  History.init();
  modeChange(mode());
  return (
    <div style={{display: 'flex', height: '90dvh'}}>
      <div style={{width: '12em', display: 'flex', "flex-direction": 'column'}}>
        <For each={targets}>{(target) => (
            <label class='number_line'>
              <input type='checkbox' checked={target.enable()} on:change={ e => (target.setEnable(e.target.checked), modeChange(mode())) }></input>
              <span>{target.number} のだん</span>
            </label>
          )}
        </For>
      </div>
      <div style={{flex: 1}}>

        <div class='mode_nav'>
          <button on:click={() => modeChange(Mode.Card)} class='mode_nav_item'>九九カード</button>
          <button on:click={() => modeChange(Mode.Free)} class='mode_nav_item'>けいさん</button>
        </div>

        <div class='mode_nav_sub'>
          <Show when={false}>
            <label>
              <input type='radio'></input>
              <span>まえから</span>
            </label>
            <label>
              <input type='radio'></input>
              <span>うしろから</span>
            </label>
            <label>
              <input type='radio'></input>
              <span>まぜて</span>
            </label>
          </Show>
        </div>

        <Equation left={left()} right={right()} operator={Operator.Multiplication} answer={answer => {
          History.push(answer.left, answer.right, answer.value, answer.isCorrect);
          if(answer.isCorrect) ask();
        }} />

        <ScoreBoard total={History.total()} consecutive={History.consecutive()} />
      </div>
    </div>
  );
};

export default App;

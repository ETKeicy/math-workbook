import type { Component } from 'solid-js';
import { createSignal, For, Show } from 'solid-js';
import { shuffleArray } from '../utils/shuffle';
import { History } from '../utils/history';

import { Equation, Operator } from '../component/WorkbookInput';
import { ScoreBoard } from '../component/WorkbookResult';
import './Multiplication.css'

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
enum ModeSub {
  Obverse,
  Reverse,
  Shuffle
} 

const [mode, setMode] = createSignal(Mode.Card);
const [modeSub, setModeSub] = createSignal(ModeSub.Obverse);
const refresh = (newMode: Mode = mode()) => {
  setMode(newMode);
  History.init();

  const expressions = targets
    .filter(target => target.enable())
    .flatMap(target => numbers.map( number => ({ left: target.number, right: number } as question)));

  switch(newMode) {
    case Mode.Card:
      const sorted = modeSub() === ModeSub.Shuffle ? shuffleArray(expressions)
                      : modeSub() === ModeSub.Reverse ? expressions.reverse()
                      : expressions;
      setCardList({
        count: sorted.length,
        generator: (function* () { yield* sorted; })()
      });
      break;
    case Mode.Free:
      setCardList({
        count: expressions.length,
        generator: (function* () { yield* shuffleArray(expressions); })()
      });
      break;
  }

  ask();
}

const ask = () => {
  if (cardList().count === 0) return;

  let card = cardList().generator.next();
  if (card.done) {
    return refresh();
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

const App: Component = () => {
  History.init();
  refresh();
  return (
    <div style={{display: 'flex', height: '90dvh'}}>
      <div style={{width: '12em', display: 'flex', "flex-direction": 'column'}}>
        <For each={targets}>{(target) => (
            <label class='number_line'>
              <input type='checkbox' checked={target.enable()} on:change={ e => (target.setEnable(e.target.checked), refresh()) }></input>
              <span>{target.number} のだん</span>
            </label>
          )}
        </For>
      </div>
      <div style={{flex: 1}}>

        <div class='mode_nav'>
          <button on:click={() => refresh(Mode.Card)} class='mode_nav_item' classList={{ active: mode() === Mode.Card }}>九九カード</button>
          <button on:click={() => refresh(Mode.Free)} class='mode_nav_item' classList={{ active: mode() === Mode.Free }}>けいさん</button>
        </div>

        <div class='mode_nav_sub'>
          <Show when={mode() === Mode.Card}>
            <label class='mode_nav_sub_item'>
              <input type='radio' name='order' checked={true} on:click={() => (setModeSub(ModeSub.Obverse), refresh())} />
              <span>うえから</span>
            </label>
            <label class='mode_nav_sub_item'>
              <input type='radio' name='order' on:click={() => (setModeSub(ModeSub.Reverse), refresh())} />
              <span>したから</span>
            </label>
            <label class='mode_nav_sub_item'>
              <input type='radio' name='order' on:click={() => (setModeSub(ModeSub.Shuffle), refresh())} />
              <span>まぜて</span>
            </label>
          </Show>
        </div>

        <Equation left={left()} right={right()} operator={Operator.Multiplication} answer={answer => {
          History.push(answer.left, answer.right, answer.value, answer.isCorrect);
          if(answer.isCorrect) ask();
        }} />

        <Show when={mode() === Mode.Card} fallback={(
          <ScoreBoard total={History.total()} consecutive={History.consecutive()} />
        )}>
          <ScoreBoard total={History.total()} consecutive={History.consecutive()} wip={{value: History.total(), total: cardList().count}} />
        </Show>
        
      </div>
    </div>
  );
};

export default App;

import type { Component } from 'solid-js';
import { createSignal, For } from 'solid-js';
import { shuffleArray } from '../utils/shuffle';

import { NumInput, Operator } from '../component/WorkbookInput';

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const [left, setLeft] = createSignal(0);
const [right, setRight] = createSignal(0);


const targets = numbers.map( number => {
  const [enable, setEnable] = createSignal(true);
  return {
    number,
    enable,
    setEnable
  }
});

const history = ( () => {
  const list =[] as { left: number, right: number, answer: number, correct: boolean }[]
  const [total, setTotal] = createSignal(0);
  const [consecutive, setConsecutive ] = createSignal(0);
  return {
    push: (left: number, right: number, answer: number, correct: boolean) => {
      list.push({left, right, answer, correct});
      if (correct === false) {
        setConsecutive(0);
        return;
      }
      
      setTotal(total() + 1);
      setConsecutive(consecutive() + 1);
      return;
    },
    isConsecutive() {
      if(list.length === 0) return true;
      return list.at(-1)?.correct
    },
    total,
    consecutive
  }
})();

const input = (target: HTMLInputElement, isTrusted: boolean): boolean => {
  const criteria = (left() * right()) === Number(target.value);
  
  history.push(left(), right(), Number(target.value), criteria);
  target.value ='';
  
  if (criteria) {
    next();
  } 
  
  return criteria
}

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
  next();
  return (
    <div style={{display: 'flex'}}>
      <div style={{height: '100vh', width: '250px', display: 'flex', "flex-direction": 'column'}}>
        <For each={targets}>{(target) =>           
            <label>
              <input type='checkbox' checked={target.enable()} on:change={ e => target.setEnable(e.target.checked) }></input>
              {target.number} のだん
            </label>
          }
        </For>
      </div>
      <div style={{flex: 1}}>
        <div style={{"background-color": 'blue'}}>button area</div>
        <div>
          <NumInput value={left()} />
          <Operator sign='×' />
          <NumInput value={right()} />
          <Operator sign='=' />
          <NumInput readOnly={false} input={e => input(e.target, e.isTrusted)} />
        </div>
        <div>
          <label>せいかいしたかず： {history.total()}</label>
          <label>れんぞくせいかい： {history.consecutive()}</label>
        </div>
      </div>
    </div>
  );
};

export default App;

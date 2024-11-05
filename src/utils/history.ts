import { createSignal } from 'solid-js';

export const History = (() => {
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
    consecutive,
    init() {
      list.length = 0;
      setTotal(0);
      setConsecutive(0);
    }
  }
})();
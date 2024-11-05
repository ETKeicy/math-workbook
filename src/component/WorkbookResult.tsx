import type { Component, ParentProps } from 'solid-js';
import { createSignal, Show } from 'solid-js';

import './WorkbookResult.component.css'

const Ribbon: Component<ParentProps<{label: string, value: number}>> = (props) => {
  return (
    <div class='score_board_item'>
    <span class='ribbon'>★</span>
      {props.label}：{props.value}
    </div>
  );
}

export const ScoreBoard: Component<ParentProps<{total?: number, consecutive?: number}>> = (props) => {
  const value = 21;

  return (
    <div class='score_board'>
      <Show when={props.total !== undefined}>
        <Ribbon label={'せいかいしたかず'} value={props.total ?? 0} />
      </Show>
      <Show when={props.consecutive !== undefined}>
        <Ribbon label={'れんぞくせいかい'} value={props.consecutive ?? 0} />
      </Show>
    </div>
  );
};
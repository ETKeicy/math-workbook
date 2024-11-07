import type { Component, ParentProps } from 'solid-js';
import { Show } from 'solid-js';

import './WorkbookResult.component.css'

const Ribbon: Component<ParentProps<{label: string, value: number}>> = (props) => {
  return (
    <div class='score_board_item'>
    <span class='ribbon'>★</span>
      {props.label}：{props.value}
    </div>
  );
}

const Wip: Component<ParentProps<{value: number, total: number}>> = (props) => {
  return (
    <div class='score_board_item_long'>
      もくひょう たっせい まで あと {props.total - props.value} もん ( {props.value} / {props.total} )
    </div>
  );
}

export const ScoreBoard: Component<ParentProps<{
  total?: number,
  consecutive?: number,
  wip?: { value: number, total: number }}>> = (props) => {

  return (
    <div class='score_board'>
      <div class='rope'></div>
      <div class='pin'></div>
      <Show when={props.wip !== undefined}>
        <Wip value={props.wip?.value ?? 0} total={props.wip?.total ?? 0}></Wip>
      </Show>
      <Show when={props.total !== undefined}>
        <Ribbon label='せいかいしたかず' value={props.total ?? 0} />
      </Show>
      <Show when={props.consecutive !== undefined}>
        <Ribbon label='れんぞくせいかい' value={props.consecutive ?? 0} />
      </Show>
    </div>
  );
};
import type { Component, ParentProps } from 'solid-js';
import { A } from "@solidjs/router";


import logo from './logo.svg';
import styles from './App.module.css';

const App: Component<ParentProps> = (props) => {
  return (
    <>
    <nav>
      <A href="/math-workbook">かけざん</A>
    </nav>
    {props.children}
  </>
  );
};

export default App;

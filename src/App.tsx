import type { Component, ParentProps } from 'solid-js';

import logo from './logo.svg';
import styles from './App.module.css';

const App: Component<ParentProps> = (props) => {
  return (
    <>
    <nav class={styles.nav}>
      <a class={styles.nav_item} href='/'>かけざん</a>
      {/* <a class={styles.nav_item} href='/divide'>わりざん</a> */}
      <label class={styles.nav_static_item}>の れんしゅう</label>
    </nav>
    {props.children}
  </>
  );
};

export default App;

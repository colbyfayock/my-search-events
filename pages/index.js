import { useState, useRef, useEffect } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home({ people }) {
  const [query, setQuery] = useState();

  const results = people.filter(({ name }) => query && name.toLowerCase().includes(query.toLowerCase()) );
  const hasResults = results && results.length > 0;

  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    if ( hasResults ) {
      document.body.addEventListener('keydown', onKeyDown);
    } else {
      document.body.removeEventListener('keydown', onKeyDown);
    }
    return () => {
      document.body.removeEventListener('keydown', onKeyDown);
    }
  }, [hasResults]);

  function onKeyDown(event) {
    const isUp = event.key === 'ArrowUp';
    const isDown = event.key === 'ArrowDown';

    if ( isUp ) {
      console.log('Going up!')
    }

    if ( isDown ) {
      console.log('Going down!')
    }
  }

  /**
   * handleOnChange
   */

  function handleOnChange(event) {
    setQuery(event.currentTarget.value);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          SWAPI People Search
        </h1>
        <form className={styles.form} method="post" autoComplete="off">
          <input ref={inputRef} type="search" name="query" onChange={handleOnChange} />
          {hasResults && (
            <div className={styles.autocomplete}>
              <ul className={styles.people}>
                {results.map(result => {
                  return (
                    <li key={result.url}>
                      <a href={result.url}>
                        { result.name }
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </form>
        <p>
          Data from <a href="https://swapi.dev/">The Star Wars API</a>.
        </p>
      </main>
    </div>
  )
}

export async function getStaticProps() {
  const pageCount = 3;
  let people = [];

  for ( let i = 0; i < pageCount; i++ ) {
    const response = await fetch(`https://swapi.dev/api/people?page=${i + 1}`);
    const data = await response.json();
    people = people.concat(data.results);
  }

  return {
    props: {
      people
    }
  }
}
import Head from 'next/head';
import { useState } from 'react';
import axios from 'axios';

interface Question {
  id: string;
  question: string;
  answer: string;
}

interface Props {
  initialData: Question[]; // Ajout d'une annotation de type explicite
}

export default function Home({ initialData }: Props) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [data, setData] = useState<Question[]>(initialData); // Ajout d'une annotation de type explicite

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const response = await axios.post('/api/openai', { question });
      setAnswer(response.data.answer);
      setQuestion('');
    } catch (error) {
      console.error(error);
      setAnswer('Sorry, something went wrong. Please try again later.');
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Q&A App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>OpenAI Q&A App</h1>

        <form onSubmit={handleSubmit}>
          <label htmlFor="question">Ask a question:</label>
          <input id="question" type="text" value={question} onChange={(event) => setQuestion(event.target.value)} />
          <button type="submit">Get Answer</button>
        </form>

        {answer && (
          <div>
            <h2>Answer:</h2>
            <p>{answer}</p>
          </div>
        )}

        {data && (
          <div>
            <h2>Questions &amp; Answers:</h2>
            <ul>
              {data.map((item) => (
                <li key={item.id}>
                  <strong>{item.question}</strong>
                  <p>{item.answer}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/airtable`);
  const initialData = await response.json();
  return {
    props: {
      initialData,
    },
    revalidate: 60, // Régénérer la page toutes les 60 secondes
  };
}

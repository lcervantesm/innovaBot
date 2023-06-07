import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages]);

  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: messageInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setMessages([...messages, {role: 'user', content: messageInput }, {role: 'Asistente Innova', content: data.result}]);
      setMessageInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Head>
        <title>AI Assistant - Centro Innova</title>
      </Head>

      <main className={styles.main}>
        <h3>AI Assistant - Centro Innova</h3>
        <div className={styles.chat}>
          {messages.map((message, i) => (
            <div key={i} className={message.role === 'user' ? styles.user : styles.assistant}>
              <strong>{message.role}:</strong>{message.content}</div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="message"
            placeholder="¿Cómo puedo ayudarte hoy?"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            disabled={loading}
          />
          <input type="submit" value="Send" disabled={loading}/>
        </form>
        {loading && <div classname={styles.loader}>Escribiendo...</div>}
      </main>
    </div>
  );
}

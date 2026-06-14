import Head from 'next/head'
import Header from '@components/Header'
html,
body {
  padding: 0;
  margin: 0;
  font-family: 'Rye', serif;
  background-color: #104E8B;
  color: #FFFFFF;
}
import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Prehistooio</title>
      </Head>
      </Head>

      <main>
        <Header title="Prehistooio" />
        <link rel="icon" type="image/png" href="https://netlify.app" />
        <p>
          Made by Polentacze - Inspired by Deeeepio <code>pages/index.js</code>
        </p>
      </main>

      <Footer />
    </div>
  )
}

import React from "react";
import Header from "./Header";
import { Container } from "semantic-ui-react";
import Head from "next/head";

function Layout(props) {
  return (
    <Container>
      <Head>
        <link
          async
          rel="stylesheet"
          href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.1/dist/semantic.min.css"
        />
      </Head>
      <Header></Header>
      {props.children}
    </Container>
  );
}

export default Layout;

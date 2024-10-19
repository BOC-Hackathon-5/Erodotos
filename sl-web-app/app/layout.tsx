"use client";

import "@mantine/core/styles.css";
import React from "react";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { theme } from "../theme";
import { Navbar } from "../components/Navbar/Navbar";
import { Footer } from "../components/Footer/Footer";
import classes from "./style.module.css";

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <head>
        <title>SentiLens</title>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <Navbar />
          <div className={classes.root}>{children}</div>
          <Footer />
        </MantineProvider>
      </body>
    </html>
  );
}

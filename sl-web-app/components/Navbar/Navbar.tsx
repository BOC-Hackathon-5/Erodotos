import { Title, Group, Button, Container } from "@mantine/core";
import classes from "./Navbar.module.css";
import { ColorSchemeToggle } from "../ColorSchemeToggle/ColorSchemeToggle";
import Link from "next/link";

const links = [{ link: "/about", label: "About" }];

export function Navbar() {
  const items = links.map((link) => {
    return (
      <a key={link.label} href={link.link} className={classes.link}>
        {link.label}
      </a>
    );
  });

  return (
    <header className={classes.header}>
      <Container size="lg">
        <div className={classes.inner}>
          <Title order={2}>
            <Link color="blue" href="/">
              SentiLens
            </Link>
          </Title>
          <Group gap={5}>{items}</Group>
        </div>
      </Container>
    </header>
  );
}

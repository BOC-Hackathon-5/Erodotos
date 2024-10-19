import { Title, Text, Button, Container, Group } from "@mantine/core";
import classes from "./style.module.css";
import Link from "next/link";

export default function NotFoundTitle() {
  return (
    <Container className={classes.notfound}>
      <div className={classes.label}>404</div>
      <Title className={classes.title}>You have found a secret place.</Title>
      <Text c="dimmed" size="lg" ta="center" className={classes.description}>
        Unfortunately, this is only a 404 page. You may have mistyped the
        address, or the page has been moved to another URL.
      </Text>
      <Group justify="center">
        <Button component={Link} variant="subtle" size="md" href="/">
          Take me back to home page
        </Button>
      </Group>
    </Container>
  );
}

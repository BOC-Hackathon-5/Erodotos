import { Container, Title, Text, Autocomplete } from "@mantine/core";
import classes from "./Head.module.css";

export default function Welcome() {
  return (
    <div className={classes.root}>
      <Container size="lg">
        <div className={classes.inner}>
          <div className={classes.content}>
            <Title className={classes.title}>
              Welcome to{" "}
              <Text
                component="span"
                inherit
                variant="gradient"
                gradient={{ from: "yellow", to: "blue" }}
              >
                SentiLens
              </Text>
            </Title>

            <Text className={classes.description} size="xl" mt={30}>
              A realtime <strong>Financial News</strong> sentiment{" "}
              <strong>analysis tool</strong>
            </Text>
          </div>
        </div>
      </Container>
    </div>
  );
}

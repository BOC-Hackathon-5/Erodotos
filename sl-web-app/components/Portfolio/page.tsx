"use client";

import { Container, SimpleGrid, Title } from "@mantine/core";
import { TableSort } from "./stocks-list";

export default function Portfolio() {
  return (
    <Container size="lg" mt="xl">
      <Title mb={50} order={1}>
        List of Tracked Companies
      </Title>
      <TableSort />
    </Container>
  );
}

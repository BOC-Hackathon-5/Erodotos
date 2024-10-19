"use client";

import {
  Container,
  Title,
  Paper,
  Group,
  Button,
  Textarea,
  TextInput,
  SimpleGrid,
  Text,
  Grid,
  Blockquote,
} from "@mantine/core";
import classes from "./style.module.css";
import { ContactIconsList } from "../../components/ContactIcons/Component";
import bg from "../../public/bg.svg";
import { IconBulbFilled } from "@tabler/icons-react";

export default function Page() {
  return (
    <Container size="lg" mt={30}>
      <div className={classes.content}>
        <Title order={2} mt={30}>
          What is SentiLens?
        </Title>

        <Blockquote color="blue" icon={<IconBulbFilled />} radius="lg" mt="xl">
          {
            "Introducing Equilibrium, a comprehensive trend analysis tool for the cryptocurrency long-term investor. The application combines cutting-edge technology with a well-known trading indicator (let's call it 'Golden Line' ... read the full story here) to provide valuable insights on buy and sell opportunities in the ever-evolving cryptocurrency market."
          }
        </Blockquote>

        <Title order={2} mt={30}>
          Project Tech Stack
        </Title>

        <Blockquote color="blue" icon={<IconBulbFilled />} radius="lg" mt="xl">
          {
            "Introducing Equilibrium, a comprehensive trend analysis tool for the cryptocurrency long-term investor. The application combines cutting-edge technology with a well-known trading indicator (let's call it 'Golden Line' ... read the full story here) to provide valuable insights on buy and sell opportunities in the ever-evolving cryptocurrency market."
          }
        </Blockquote>

        <Title order={2} mt={30}>
          Developed by Erodotos Demetriou on ... within the context of ....
        </Title>
      </div>
    </Container>
  );
}

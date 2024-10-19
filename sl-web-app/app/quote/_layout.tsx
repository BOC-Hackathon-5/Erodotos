"use client";

import {
  Container,
  Title,
  Tabs,
  rem,
  Group,
  Text,
  Badge,
  SimpleGrid,
  Flex,
  Card,
} from "@mantine/core";

import {
  IconMapPin,
  IconBuilding,
  IconBriefcase2,
  IconWorld,
  IconChartLine,
  IconInfoCircle,
  IconCoins,
  IconNews,
  IconBulb,
} from "@tabler/icons-react";
import classes from "./style.module.css";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Layout({
  children,
  IndicatorTitle,
}: {
  children: React.ReactNode;
  IndicatorTitle: string;
}) {
  const [companyInfo, setcompanyInfo] = useState({});
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const symbol = params.symbol;

  useEffect(() => {
    async function fetchCompanyInfo() {
      try {
        const res = await fetch(`http://localhost:2080/api/info/${symbol}`);
        if (!res.ok) {
          throw new Error("Failed to fetch Info");
        }
        const data = await res.json();
        setcompanyInfo(data);
        console.log(companyInfo);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCompanyInfo();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <>
      <Container size="lg">
        <div className={classes.content}>
          <Card mb={30} shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between">
              <div>
                <Title className="text-2xl font-bold">
                  {companyInfo?.data?.longName}
                </Title>
                <Text c="dimmed" size="md">
                  {companyInfo?.data?.symbol} • {companyInfo?.data?.exchange}
                </Text>
              </div>
              <Badge color="dark" variant="default" size="xl">
                <Text size="lg" fw={700}>
                  {companyInfo?.data?.currency}{" "}
                  {companyInfo?.data?.currentPrice.toFixed(2)}
                </Text>
              </Badge>
            </Group>
            <SimpleGrid cols={{ base: 1, sm: 2 }} verticalSpacing="sm" mt={30}>
              <Flex gap="sm" justify="flex-start" align="flex-start">
                <IconMapPin size={20} />
                <Text size="md">Country: {companyInfo?.data?.country}</Text>
              </Flex>
              <Flex gap="sm" justify="flex-start" align="flex-start">
                <IconBuilding size={20} />
                <Text size="md">Sector: {companyInfo?.data?.sector}</Text>
              </Flex>
              <Flex gap="sm" justify="flex-start" align="flex-start">
                <IconBriefcase2 size={20} />
                <Text size="md">Industry: {companyInfo?.data?.industry}</Text>
              </Flex>
              <Flex gap="sm" justify="flex-start" align="flex-start">
                <IconCoins size={20} />
                <Text size="md">
                  MarketCap: $ {companyInfo?.data?.marketCap}
                </Text>
              </Flex>
              <Flex gap="sm" justify="flex-start" align="flex-start">
                <IconWorld size={20} />
                Website:
                <a
                  href={companyInfo?.data?.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  {companyInfo?.data?.website}
                </a>
              </Flex>
              <Flex gap="sm" justify="flex-start" align="flex-start">
                <IconBulb size={20} />
                <Text size="md">
                  Analyst Recommendation: {companyInfo?.data?.recommendationKey}
                </Text>
              </Flex>
            </SimpleGrid>
          </Card>
          <Tabs variant="pills" radius="xl" defaultValue="summary" my={50}>
            <Tabs.List my={30}>
              <Tabs.Tab
                value="summary"
                leftSection={
                  <IconInfoCircle style={{ width: rem(20), height: rem(20) }} />
                }
              >
                Summary
              </Tabs.Tab>

              <Tabs.Tab
                value="articles"
                leftSection={
                  <IconNews style={{ width: rem(20), height: rem(20) }} />
                }
              >
                Articles
              </Tabs.Tab>

              <Tabs.Tab
                value="sentiment"
                leftSection={
                  <IconChartLine style={{ width: rem(20), height: rem(20) }} />
                }
              >
                Sentiment
              </Tabs.Tab>
            </Tabs.List>
            {children}
          </Tabs>
        </div>
      </Container>
    </>
  );
}

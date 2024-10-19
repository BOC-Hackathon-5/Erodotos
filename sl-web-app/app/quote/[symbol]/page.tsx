"use client";

import {
  Card,
  Tabs,
  Title,
  Badge,
  Group,
  Text,
  Image,
  Button,
  Grid,
  Flex,
  SimpleGrid,
  Progress,
  Stack,
  Space,
} from "@mantine/core";
import Plot from "react-plotly.js";
import { IconUser, IconCalendar, IconNews } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import Layout from "../_layout";

var positiveTrace = {
  x: [
    "2024-08-26T00:00:00Z",
    "2024-09-02T00:00:00Z",
    "2024-09-09T00:00:00Z",
    "2024-09-16T00:00:00Z",
    "2024-09-23T00:00:00Z",
    "2024-09-30T00:00:00Z",
  ],
  y: [
    0.3506783247515657, 0.3793968048677699, 0.36809690104408044,
    0.36724131759011513, 0.5042965743769129, 0.5833065091798705,
  ],
  name: "Positive",
  type: "bar",
  marker: {
    color: "#40c057",
  },
};

var neutralTrace = {
  x: [
    "2024-08-26T00:00:00Z",
    "2024-09-02T00:00:00Z",
    "2024-09-09T00:00:00Z",
    "2024-09-16T00:00:00Z",
    "2024-09-23T00:00:00Z",
    "2024-09-30T00:00:00Z",
  ],
  y: [
    0.5980824137011105, 0.5650376171796533, 0.4767447186773232,
    0.42296330895774065, 0.3376159145454959, 0.23091179819920712,
  ],
  name: "Neutral",
  type: "bar",
  marker: {
    color: "#5c7cfa",
  },
};

var negativeTrace = {
  x: [
    "2024-08-26T00:00:00Z",
    "2024-09-02T00:00:00Z",
    "2024-09-09T00:00:00Z",
    "2024-09-16T00:00:00Z",
    "2024-09-23T00:00:00Z",
    "2024-09-30T00:00:00Z",
  ],
  y: [
    0.05123926641256804, 0.0555655748676776, 0.15515837737021462,
    0.20979537400537535, 0.15808751648820354, 0.18578169860197508,
  ],
  name: "Negative",
  type: "bar",
  marker: {
    color: "#f03e3e",
  },
};

var layout1 = {
  title: {
    text: "Weekly Average Sentiment Analysis - Stacked Bar Chart",
    font: {
      size: 24,
    },
    x: 0.05,
  },
  xaxis: {
    title: {
      text: "Week Start Date",
      font: {
        size: 18,
        color: "#7f7f7f",
      },
    },
  },
  yaxis: {
    title: {
      text: "Average Sentiment Score",
      font: {
        size: 18,
        color: "#7f7f7f",
      },
    },
  },
  barmode: "stack",
};

var dataa = [positiveTrace, neutralTrace, negativeTrace];

const sentiment = {
  data: [
    {
      date: "2024-08-26T00:00:00Z",
      sentiment: {
        articlesCount: 4,
        negative: 0.05123926641256804,
        neutral: 0.5980824137011105,
        positive: 0.3506783247515657,
      },
    },
    {
      date: "2024-09-02T00:00:00Z",
      sentiment: {
        articlesCount: 14,
        negative: 0.0555655748676776,
        neutral: 0.5650376171796533,
        positive: 0.3793968048677699,
      },
    },
    {
      date: "2024-09-09T00:00:00Z",
      sentiment: {
        articlesCount: 22,
        negative: 0.15515837737021462,
        neutral: 0.4767447186773232,
        positive: 0.36809690104408044,
      },
    },
    {
      date: "2024-09-16T00:00:00Z",
      sentiment: {
        articlesCount: 23,
        negative: 0.20979537400537535,
        neutral: 0.42296330895774065,
        positive: 0.36724131759011513,
      },
    },
    {
      date: "2024-09-23T00:00:00Z",
      sentiment: {
        articlesCount: 26,
        negative: 0.15808751648820354,
        neutral: 0.3376159145454959,
        positive: 0.5042965743769129,
      },
    },
    {
      date: "2024-09-30T00:00:00Z",
      sentiment: {
        articlesCount: 4,
        negative: 0.18578169860197508,
        neutral: 0.23091179819920712,
        positive: 0.5833065091798705,
      },
    },
  ],
  error: null,
};

export default function Page({ params }: { params: { symbol: string } }) {
  const [articles, setArticles] = useState({});
  const [sentiment, setSentiment] = useState({});
  const [companyInfo, setcompanyInfo] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch(
          `http://localhost:1080/api/articles/${params.symbol}`,
        );
        if (!res.ok) {
          throw new Error("Failed to fetch Articles");
        }
        const data = await res.json();
        setArticles(data);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    }

    async function fetchSentiment() {
      try {
        const res = await fetch(
          `http://localhost:1080/api/sentiment/${params.symbol}`,
        );
        if (!res.ok) {
          throw new Error("Failed to fetch Sentiment");
        }
        const data = await res.json();
        setSentiment(data);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    }

    async function fetchCompanyInfo() {
      try {
        const res = await fetch(
          `http://localhost:2080/api/info/${params.symbol}`,
        );
        if (!res.ok) {
          throw new Error("Failed to fetch Info");
        }
        const data = await res.json();
        setcompanyInfo(data);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
    fetchSentiment();
    fetchCompanyInfo();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const positiveTrace = {
    x: sentiment?.data?.map((item) => item.date),
    y: sentiment?.data?.map((item) => item.sentiment.positive),
    name: "Positive",
    type: "bar",
    marker: {
      color: "#40c057",
    },
  };

  const neutralTrace = {
    x: sentiment?.data?.map((item) => item.date),
    y: sentiment?.data?.map((item) => item.sentiment.neutral),
    name: "Neutral",
    type: "bar",
    marker: {
      color: "#5c7cfa",
    },
  };

  const negativeTrace = {
    x: sentiment?.data?.map((item) => item.date),
    y: sentiment?.data?.map((item) => item.sentiment.negative),
    name: "Negative",
    type: "bar",
    marker: {
      color: "#f03e3e",
    },
  };

  var chartData = [positiveTrace, neutralTrace, negativeTrace];

  console.log(chartData);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Layout IndicatorTitle={params.symbol}>
      <Tabs.Panel value="summary">
        <Card mb={30} shadow="sm" padding="lg" radius="md" withBorder>
          <Title>Business Summary</Title>
          <Text mt={30}>{companyInfo?.data?.longBusinessSummary}</Text>
        </Card>
      </Tabs.Panel>
      <Tabs.Panel value="articles">
        {articles?.data?.map((article) => (
          <Card mb={20} shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between">
              <Title order={4}>{article.title}</Title>
              <Badge variant="outline" color="dark" size="lg">
                {article.source}
              </Badge>
            </Group>

            <Space h="md" />

            <Flex gap="sm" justify="flex-start" align="flex-start">
              <IconUser size={20} />
              <Text size="md">{article.author}</Text>
            </Flex>
            <Flex gap="sm" justify="flex-start" align="flex-start">
              <IconCalendar size={20} />
              <Text size="md">{formatDate(article.date)}</Text>
            </Flex>
            <Flex gap="sm" justify="flex-start" align="flex-start">
              <IconNews size={20} />
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                Read the full article
              </a>
            </Flex>

            <Space h="md" />

            <Stack bg="var(--mantine-color-body)" justify="center" gap="md">
              <Title order={4}>Sentiment Analysis</Title>
              <Progress.Root size="xl">
                <Progress.Section value={article.positive * 100} color="green">
                  <Progress.Label>
                    Positive: {(article.positive * 100).toFixed(2)} %
                  </Progress.Label>
                </Progress.Section>
                <Progress.Section value={article.neutral * 100} color="gray">
                  <Progress.Label>
                    Neutral: {(article.neutral * 100).toFixed(2)} %
                  </Progress.Label>
                </Progress.Section>
                <Progress.Section value={article.negative * 100} color="red">
                  <Progress.Label>
                    Negative: {(article.negative * 100).toFixed(2)} %
                  </Progress.Label>
                </Progress.Section>
              </Progress.Root>
            </Stack>
          </Card>
        ))}
      </Tabs.Panel>
      <Tabs.Panel value="sentiment">
        <Plot
          data={chartData}
          layout={layout1}
          useResizeHandler={true}
          style={{ width: "100%", height: "100%" }}
        />
      </Tabs.Panel>
    </Layout>
  );
}

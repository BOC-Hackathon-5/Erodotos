import { useState } from "react";
import {
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
  rem,
  keys,
  Button,
} from "@mantine/core";
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconReportSearch,
} from "@tabler/icons-react";
import classes from "./TableSort.module.css";

interface RowData {
  Symbol: string;
  Name: string;
  Price: string;
  MarketCap: string;
  ViewReport: string;
}

interface ThProps {
  hideOnSmallScreen: boolean;
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}

function Th({
  hideOnSmallScreen,
  children,
  reversed,
  sorted,
  onSort,
}: ThProps) {
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
  const classNames = [classes.th];

  if (hideOnSmallScreen) {
    classNames.push(classes.hideOnSmallScreen);
  }

  return (
    <Table.Th className={classNames.join(" ")}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

function filterData(data: RowData[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) => item[key].toLowerCase().includes(query)),
  );
}

function sortData(
  data: RowData[],
  payload: { sortBy: keyof RowData | null; reversed: boolean; search: string },
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[sortBy].localeCompare(a[sortBy]);
      }

      return a[sortBy].localeCompare(b[sortBy]);
    }),
    payload.search,
  );
}

const data = [
  {
    Symbol: "ASML",
    Name: "ASML Holding N.V.",
    Price: "723.26",
    MarketCap: "284385837056",
    ViewReport: "null",
  },
  {
    Symbol: "SOFI",
    Name: "SoFi Technologies, Inc.",
    Price: "10.18",
    MarketCap: "10851269632",
    ViewReport: "null",
  },
  {
    Symbol: "TSLA",
    Name: "Tesla, Inc.",
    Price: "220.70",
    MarketCap: "705056997376",
    ViewReport: "null",
  },
  {
    Symbol: "AAPL",
    Name: "Apple Inc.",
    Price: "235.00",
    MarketCap: "3572963475456",
    ViewReport: "null",
  },
  {
    Symbol: "RIO",
    Name: "Rio Tinto",
    Price: "71.16",
    MarketCap: "115597295616",
    ViewReport: "null",
  },
];

export function TableSort() {
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(data, { sortBy, reversed: reverseSortDirection, search: value }),
    );
  };

  return (
    <>
      <TextInput
        placeholder="Search by any field"
        mb="md"
        leftSection={
          <IconSearch
            style={{ width: rem(16), height: rem(16) }}
            stroke={1.5}
          />
        }
        value={search}
        onChange={handleSearchChange}
      />
      <Table
        stickyHeader={true}
        horizontalSpacing="md"
        verticalSpacing="xs"
        layout="fixed"
      >
        <Table.Thead>
          <Table.Tr>
            <Th
              hideOnSmallScreen={false}
              sorted={sortBy === "Symbol"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("Symbol")}
            >
              Symbol
            </Th>
            <Th
              hideOnSmallScreen={false}
              sorted={sortBy === "Name"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("Name")}
            >
              Name
            </Th>
            <Th
              hideOnSmallScreen={false}
              sorted={sortBy === "Price"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("Price")}
            >
              Price
            </Th>
            <Th
              hideOnSmallScreen={true}
              sorted={sortBy === "MarketCap"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("MarketCap")}
            >
              MarketCap
            </Th>
            <Th
              hideOnSmallScreen={false}
              sorted={sortBy === "ViewReport"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("ViewReport")}
            >
              View Report
            </Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {sortedData.length > 0 ? (
            sortedData.map((row) => (
              <Table.Tr key={row.Symbol}>
                <Table.Td>{row.Symbol}</Table.Td>
                <Table.Td className={classes.hideOnSmallScreen}>
                  {row.Name}
                </Table.Td>
                <Table.Td>{`$ ${row.Price}`}</Table.Td>
                <Table.Td className={classes.hideOnSmallScreen}>
                  {`$ ${row.MarketCap}`}
                </Table.Td>
                <Table.Td>
                  <Button
                    component="a"
                    variant="light"
                    color="blue"
                    rightSection={<IconReportSearch size={14} />}
                    href={`/quote/${row.Symbol}`}
                  >
                    Show Report
                  </Button>
                </Table.Td>
              </Table.Tr>
            ))
          ) : (
            <Table.Tr>
              <Table.Td colSpan={Object.keys(data[0]).length}>
                <Text fw={500} ta="center">
                  Nothing found
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </>
  );
}

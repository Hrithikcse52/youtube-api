import React, { useEffect, useState } from 'react';
import { useTable, usePagination } from 'react-table';
import axios from 'axios';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Flex,
    IconButton,
    Tooltip,
} from '@chakra-ui/react';
import { ChevronRightIcon, ChevronLeftIcon } from '@chakra-ui/icons';
const api_key1 = 'AIzaSyBu1GioihCwqN5cTzhh5d3eQZdd1EVqlhY';
const api_key = 'AIzaSyAF3LpvtShumxNUW_xDMONrh2Yz0tcZJvk';
const apiUrl = 'https://www.googleapis.com/youtube/v3';
function CustomTable({ columns, data, prevToken, nextToken, getData }) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        nextPage,
        previousPage,
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0 },
        },
        usePagination
    );

    return (
        <>
            <Table {...getTableProps()}>
                <Thead>
                    {headerGroups.map((headerGroup) => (
                        <Tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <Th {...column.getHeaderProps()}>
                                    {column.render('Header')}
                                </Th>
                            ))}
                        </Tr>
                    ))}
                </Thead>
                <Tbody {...getTableBodyProps()}>
                    {page.map((row, i) => {
                        prepareRow(row);
                        return (
                            <Tr {...row.getRowProps()}>
                                {row.cells.map((cell) => {
                                    // console.log(cell.column.Header);
                                    if (cell.column.Header === 'Thumbnail') {
                                        return (
                                            <Td {...cell.getCellProps()}>
                                                <img
                                                    src={cell.value}
                                                    alt={cell.value}
                                                />
                                            </Td>
                                        );
                                    }
                                    return (
                                        <Td {...cell.getCellProps()}>
                                            {cell.render('Cell')}
                                        </Td>
                                    );
                                })}
                            </Tr>
                        );
                    })}
                </Tbody>
            </Table>

            <Flex justifyContent="space-between" m={4} alignItems="center">
                <Flex>
                    <Tooltip label="Previous Page">
                        <IconButton
                            onClick={() => {
                                getData(prevToken);
                                if (canPreviousPage) {
                                    previousPage();
                                }
                            }}
                            isDisabled={prevToken?.length > 0 ? false : true}
                            icon={<ChevronLeftIcon h={6} w={6} />}
                        />
                    </Tooltip>
                </Flex>

                <Flex alignItems="center" justify={'space-between'}></Flex>

                <Flex>
                    <Tooltip label="Next Page">
                        <IconButton
                            onClick={() => {
                                getData(nextToken);
                                if (canNextPage) {
                                    nextPage();
                                }
                            }}
                            icon={<ChevronRightIcon h={6} w={6} />}
                        />
                    </Tooltip>
                </Flex>
            </Flex>
        </>
    );
}

function App() {
    const columns = React.useMemo(
        () => [
            {
                Header: 'Videos',
                columns: [
                    {
                        Header: 'Thumbnail',
                        accessor: 'thumbnail',
                    },
                    {
                        Header: 'Title',
                        accessor: 'title',
                    },
                    {
                        Header: 'Description',
                        accessor: 'desc',
                    },
                    {
                        Header: 'Published Time',
                        accessor: 'publishingTime',
                    },
                ],
            },
        ],
        []
    );
    // const api_key = 'AIzaSyDCqNd67Pnlhuw_ERSj0oScLh3QyCO_Krs';

    const [pageData, setPageData] = useState([]);
    const [nextPageToken, setNextToken] = useState('');
    const [prevPageToken, setPrevToken] = useState('');

    const getData = async (prev) => {
        try {
            let url = `${apiUrl}/search?key=${api_key}&type=video&maxResults=10&order=date&part=snippet&q=cricket`;
            if (prev && prev.length > 1) {
                url = `${apiUrl}/search?key=${api_key}&type=video&maxResults=10&pageToken=${prev}&order=date&part=snippet&q=cricket`;
            }
            const { data } = await axios.get(url);
            console.log(data);
            setNextToken(data.nextPageToken);
            if (data.prevPageToken) {
                setPrevToken(data.prevPageToken);
            }
            let dataArray = data.items.map(({ snippet }) => ({
                title: snippet.title,
                desc: snippet.description,
                publishingTime: snippet.publishTime,
                thumbnail: snippet.thumbnails.default.url,
            }));
            console.log('adara', dataArray);
            let dataFinal = pageData;
            dataFinal.push(dataArray);
            setPageData(dataArray);
        } catch (error) {
            console.log('Trying another Key');
            try {
                let url = `${apiUrl}/search?key=${api_key1}&type=video&maxResults=10&order=date&part=snippet&q=cricket`;
                if (prev && prev.length > 1) {
                    url = `${apiUrl}/search?key=${api_key1}&type=video&maxResults=10&pageToken=${prev}&order=date&part=snippet&q=cricket`;
                }
                const { data } = await axios.get(url);
                console.log(data);
                setNextToken(data.nextPageToken);
                if (data.prevPageToken) {
                    setPrevToken(data.prevPageToken);
                }
                let dataArray = data.items.map(({ snippet }) => ({
                    title: snippet.title,
                    desc: snippet.description,
                    publishingTime: snippet.publishTime,
                    thumbnail: snippet.thumbnails.default.url,
                }));
                console.log('adara', dataArray);
                let dataFinal = pageData;
                dataFinal.push(dataArray);
                setPageData(dataArray);
            } catch (error) {
                console.error(error);
            }
        }
    };
    useEffect(() => {
        getData();
        //eslint-disable-next-line
    }, []);
    const MINUTE_MS = 10000;
    useEffect(() => {
        setInterval(() => {
            console.log('Logs every minute');
            getData();
        }, MINUTE_MS);
        //eslint-disable-next-line
    }, []);

    return (
        <CustomTable
            columns={columns}
            data={pageData}
            prevToken={prevPageToken}
            nextToken={nextPageToken}
            getData={getData}
        />
    );
}

export default App;

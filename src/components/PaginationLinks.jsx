import React from 'react';
import {Pagination} from 'react-bootstrap';

const PaginationLinks = ({links = null, controller = 'clients', handleFilter, params}) => {
    const current_page = parseInt(params.page);

    const {
        first,
        last,
        previous,
        next,
        first_page,
        previous_page,
        next_page,
        last_page,
    } = links;

    return (
        <Pagination>
            {previous && previous_page !== first && (
                <Pagination.Item
                    href={`${controller}?page=${previous_page || first}`}
                    disabled={!previous_page}
                    onClick={handleFilter}>
                    Previous
                </Pagination.Item>
            )}

            {first && first_page !== current_page && first_page !== previous_page && (
                <Pagination.Item
                    href={`${controller}?page=${first_page}`}
                    onClick={handleFilter}>
                    {first_page}
                </Pagination.Item>
            )}

            {previous_page && (
                <Pagination.Item
                    href={`${controller}?page=${current_page - 1}`}
                    onClick={handleFilter}>
                    {current_page - 1}
                </Pagination.Item>
            )}

            <Pagination.Item active>{current_page}</Pagination.Item>

            {next_page && next_page !== last_page && (
                <Pagination.Item
                    href={`${controller}?page=${next_page}`}
                    onClick={handleFilter}>
                    {next_page}
                </Pagination.Item>
            )}

            {last && last_page !== current_page && (
                <Pagination.Item
                    href={`${controller}?page=${last_page}`}
                    onClick={handleFilter}>
                    {last_page}
                </Pagination.Item>
            )}

            {next && (
                <Pagination.Item
                    href={`${controller}?page=${next_page}`}
                    disabled={!next_page}
                    onClick={handleFilter}>
                    Next
                </Pagination.Item>
            )}
        </Pagination>
    );
};

export default PaginationLinks;

import AdvanceTable from "../advance-table/AdvanceTable";
import AdvanceTableFooter from "../advance-table/AdvanceTableFooter";
import AdvanceTableWrapper from "../advance-table/AdvanceTableWrapper";
import React from 'react'

const UsersTable = ({ columns, data }) => {
    return (
        <AdvanceTableWrapper
            columns={columns}
            data={data}
            sortable
            pagination
            perPage={10}
        >
            <AdvanceTable
                table
                headerClassName="bg-primary text-white text-nowrap align-middle border-light"
                rowClassName="align-middle text-black"
                rowBackground='#dee2e6'
                tableProps={{
                    bordered: true,
                    striped: true,
                    className: 'fs--1 mb-0 overflow-hidden border-light',
                }}
            />
            <div className="mt-3">
                <AdvanceTableFooter
                    rowCount={data.length}
                    table
                    rowInfo
                    navButtons
                    rowsPerPageSelection
                />
            </div>
        </AdvanceTableWrapper>
    )
}

export default UsersTable
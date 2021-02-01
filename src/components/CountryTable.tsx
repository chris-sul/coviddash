import React from 'react'

import { DataGrid, ColDef } from '@material-ui/data-grid'

interface Props {
    countries: any[]
  }

function CountryTable({ countries, ...props }: Props) {
    const cols: ColDef[] = [
        { field: 'name', headerName: 'Name', width: 130 },
        { field: 'cases', headerName: 'Cases', width: 130 },
    ]
 
    const rows: any[] = []

    // Turn countries to row, col
    var counter: number = 0;
    countries.forEach( (e: any) => {
        rows.push({
            id: counter,
            name: e.country,
            cases: e.cases
        })
        counter = counter + 1
    })

    return (
        <div style={{ height: '500px', width: '100%' }}>
            <DataGrid rows={rows} columns={cols} pageSize={7} autoHeight />
        </div>
    )
}

export default CountryTable
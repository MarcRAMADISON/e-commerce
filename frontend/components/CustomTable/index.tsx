import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { theme } from "../../utils/utils";
import { Box } from "@mui/material";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", align: "center",headerAlign:'center', width: 70 },
  {
    field: "articleName",
    headerName: "Nom de l'article",
    align: "center",
    headerAlign:'center',
    width: 130,
  },
  { field: "nombre", headerName: "Nombre", align: "center", headerAlign:'center', width: 130 },
  { field: "montant", headerName: "Montant", align: "center", headerAlign:'center', width: 130 },

  {
    field: "dateCommande",
    headerName: "Date du commande",
    align: "center",
    width: 200,
    headerAlign:'center',
  },
  {
    field: "heureCommande",
    headerName: "Heure du commande",
    width: 200,
    align: "center",
    headerAlign:'center',
  },
  {
    field: "status",
    headerName: "Statut",
    width: 130,
    sortable: false,
    align: "center",
    headerAlign:'center',
  },
  /*{
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  },*/
];

const columnsFacture: GridColDef[] = [
  { field: "id", headerName: "ID", align: "center",headerAlign:'center', width: 70 },
  {
    field: "articleName",
    headerName: "Identifiant de l'article",
    align: "center",
    headerAlign:'center',
    width: 130,
  },
  { field: "nombre", headerName: "Nombre", align: "center", headerAlign:'center', width: 130 },
  { field: "montant", headerName: "Montant", align: "center", headerAlign:'center', width: 130 },

  {
    field: "dateCommande",
    headerName: "Date du commande",
    align: "center",
    width: 200,
    headerAlign:'center',
  },
  {
    field: "heureCommande",
    headerName: "Heure du commande",
    width: 200,
    align: "center",
    headerAlign:'center',
  },
  {
    field: "status",
    headerName: "Statut",
    width: 130,
    sortable: false,
    align: "center",
    headerAlign:'center',
  },
  
];

export default function CustomTable({ commandes,type }) {
  return (
    <Box style={{ height: type === 'facturation'? "auto" : "70vh", width: type === 'facturation'? "100%" : '80%', marginTop: "30px" }}>
      <DataGrid
        rows={commandes}
        columns={type === 'facturation'? columnsFacture : columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10,15,20]}
        //checkboxSelection
        sx={{ overflow: "clip"}}
      />
    </Box>
  );
}

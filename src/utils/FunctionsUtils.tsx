import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { Toast } from 'primereact/toast';
import { getAllVehicles } from '../apicalls/apicallsVehicle';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

export const ExportButtons = ({ 
    table, 
    toast, 
    columns, 
    fetchfunction, 
    exportLoading 
}: {
    table: any;
    toast: Toast | null;
    columns: any;
    fetchfunction: () => Promise<any>;
    exportLoading: boolean;
}) => {
    const state = useSelector((state: RootState) => state.companiereducer);

    
const exportAllToExcel = async (toast: Toast | null, table: any, columns: any, fetchfunction: () => Promise<any>, dataPath: string = 'data') => {
    try {
        const response = await fetchfunction();
        // The response might be in response.data.data, response.data, or directly in response
        let vehicleData;
        if (response?.data?.data) {
            vehicleData = response.data.data;
        } else if (Array.isArray(response?.data)) {
            vehicleData = response.data;
        } else if (Array.isArray(response)) {
            vehicleData = response;
        } else {
            toast?.show({ severity: 'warn', summary: 'Info', detail: 'Aucun véhicule trouvé' });
            return;
        }

        if (vehicleData.length === 0) {
            toast?.show({ severity: 'warn', summary: 'Info', detail: 'Aucun véhicule trouvé' });
            return;
        }

        const headers = ['Modèle', 'Plaque d\'immatriculation', 'Type de véhicule', 'Entreprise'].join('\t');

        const rows = vehicleData.map((item: any) => {
            // Map the data based on the API response structure
            const modelValue = formatValue(item.marque);
            const plateValue = formatValue(item.licenseplate);
            const typeValue = formatValue(item.vtypename); // Using vtypename from API
            const companyValue = formatValue(item.company); // Using company from API
            
            return [modelValue, plateValue, typeValue, companyValue].join('\t');
        }).join('\n');

        const csvContent = `${headers}\n${rows}`;

        await navigator.clipboard.writeText(csvContent);
        toast?.show({
            severity: 'success',
            summary: 'Succès',
            detail: `${response.data.data.length} enregistrements copiés`
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue lors de la copie';
        toast?.show({
            severity: 'error',
            summary: 'Erreur',
            detail: errorMessage
        });
    }
}
    return (
        <>
            <Button 
                icon="pi pi-copy"
                tooltip="Copier la page actuelle"
                tooltipOptions={{ position: 'bottom' }}
                severity="info"
                onClick={() => exportToExcel(toast, table)}
                className="mr-2"
            />

            <Button
                icon={exportLoading ? 'pi pi-spinner pi-spin' : 'pi pi-table'}
                tooltip="Copier toutes les pages"
                tooltipOptions={{ position: 'bottom' }}
                severity="info"
                onClick={() => exportAllToExcel(
                     toast,
                     table,
                     columns,
                     fetchfunction,
                     'data'
                )}
                disabled={exportLoading}
            />
        </>
    );
};

const formatValue = (value: any): string => {
    if (value === null || value === undefined) return '';
    if (value instanceof Date) return value.toLocaleDateString('fr-FR');
    return String(value);
};

// export const exportAllToExcel = async <Type extends Record<string, any>>(
//     toast: Toast | null,
//     table: any,
//     columns: any,
//     fetchData: () => Promise<any>,
//     dataPath: string = 'data'
// ) => {
//     try {
//         console.log('Starting export...');
//         const response = await fetchData();
//         console.log('Response:', response);
        
//         if (!response?.data) {
//             throw new Error('No data received from server');
//         }

//         // Get data from response
//         const dataKeys = dataPath.split('.');
//         let allData = response;
//         for (const key of dataKeys) {
//             if (!allData || !allData[key]) {
//                 throw new Error(`Invalid data path: ${dataPath}`);
//             }
//             allData = allData[key];
//         }

//         if (!Array.isArray(allData)) {
//             throw new Error('Data is not in expected format');
//         }

//         console.log(`Total records fetched: ${allData.length}`);

//         const headers = table.getHeaderGroups()[0].headers
//             .map((header: any) => header.column.columnDef.header)
//             .join('\t');

//         const rows = allData.map((item: Type) => {
//             return columns.map((col: any) => {
//                 const key = (col as { accessorKey: keyof Type }).accessorKey;
//                 let value: any = item;
//                 const keys = String(key).split('.');
//                 for (const k of keys) {
//                     value = value?.[k];
//                 }
//                 return formatValue(value);
//             }).join('\t');
//         }).join('\n');

//         const csvContent = `${headers}\n${rows}`;
//         await navigator.clipboard.writeText(csvContent);
//         toast?.show({
//             severity: 'success',
//             summary: 'Succès',
//             detail: `${allData.length} enregistrements copiés`
//         });
//     } catch (error) {
//         console.error('Export error:', error);
//         const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue lors de la copie';
//         toast?.show({
//             severity: 'error',
//             summary: 'Erreur',
//             detail: errorMessage
//         });
//     }
// };


export const exportToExcel = (toast: any, table: any) => {
    // Define fixed headers to match the required format
    const headers = ['Modèle', 'Plaque d\'immatriculation', 'Type de véhicule', 'Entreprise'].join('\t');

    const rows = table.getRowModel().rows
        .map((row: { getVisibleCells: () => any[]; }) => {
            const cells = row.getVisibleCells();
            return cells
                .map((cell: { getValue: () => any; }) => formatValue(cell.getValue()))
                .join('\t');
        })
        .join('\n');

    const csvContent = `${headers}\n${rows}`;

    navigator.clipboard.writeText(csvContent)
        .then(() => {
            toast?.show({
                severity: 'success',
                summary: 'Succès',
                detail: 'Données copiées'
            });
        })
        .catch(error => {
            const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue lors de la copie';
            toast?.show({
                severity: 'error',
                summary: 'Erreur',
                detail: errorMessage
            });
        });
};

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Skeleton } from "primereact/skeleton";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";

const BORDER_RADIUS = "8px";
type AdonisJSObject = {
    id: number
}

type BaseScrollTableProps<T extends AdonisJSObject> = {
    value: T[];
    headers: string[];
    fields: string[];
    loading?: boolean;
    page: number;
    hasMore: boolean;
    setPage: (page: number) => void;
    setHasMore: (hasMore: boolean) => void;
    fetchFunction: (params?: any) => any;
    // deleteHandler: (id: number) => void;
    editableRows?: boolean
    style?: any;
    onRowClick?: (item: T) => void;

};
type WithFilter<T extends AdonisJSObject> = BaseScrollTableProps<T> & {
    filter: true;
    filterFields: string[];
    filterValues: string[];
    filterHandlers: Array<(filter: string) => void>
};


type WithoutFilter<T extends AdonisJSObject> = BaseScrollTableProps<T> & {
    filter?: false;
    filterFields?: never;
    filterValues?: never
    filterHandlers?: never
};


// Delete-related types
type WithDelete<T extends AdonisJSObject> = {
    deletableRows: true;
    deleteHandler: (id: number) => void;
};

type WithoutDelete = {
    deletableRows?: false;
    deleteHandler?: never;
};

type WithEdit<T extends AdonisJSObject> = {
    editableRows: true;
    editHandler: (id: number) => void;
};

type WithoutEdit = {
    editableRows?: false;
    editHandler?: never;
};

type WithAddDocument<T extends AdonisJSObject> = {
    addDocumentEnabled: true;
    addDocumentHandler: (id: number) => void;
};

type WithoutAddDocument = {
    addDocumentEnabled?: false;
    addDocumentHandler?: never;
};

type ScrollTableProps<T extends AdonisJSObject> = BaseScrollTableProps<T> &
    (WithFilter<T> | WithoutFilter<T>) &
    (WithDelete<T> | WithoutDelete) &
    (WithEdit<T> | WithoutEdit) &
    (WithAddDocument<T> | WithoutAddDocument);
function ScrollTable<T extends AdonisJSObject>({
    value,
    headers,
    fields,
    loading,
    page,
    hasMore,
    setPage,
    setHasMore,
    fetchFunction,
    style,
    filter,
    filterFields,
    filterValues,
    filterHandlers,
    deletableRows,
    editableRows,
    deleteHandler,
    editHandler,
    addDocumentEnabled,
    addDocumentHandler,
    onRowClick
}: ScrollTableProps<T>) {
    const observer = useRef<IntersectionObserver | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isIntersecting, setIsIntersecting] = useState(false);
    const [hasActionFields, setHasActionFields] = useState<boolean>(false);
    const [sortedValue, setSortedValue] = useState<T[]>([]);
    const [sortField, setSortField] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    useEffect(() => {
        // Sort the data by expiry date
        const sorted = [...value].sort((a, b) => {
            if ('expiry_date' in a && 'expiry_date' in b) {
                return new Date(a.expiry_date as string).getTime() - new Date(b.expiry_date as string).getTime();
            }
            return 0;
        });
        setSortedValue(sorted);
    }, [value]);

    const handleSort = (field: string) => {
        const newSortOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortOrder(newSortOrder);
    };

    const getNestedValue = (obj: any, path: string) => {
        if (!obj) return null;
        const parts = path.split('.');
        let result = obj;
        
        for (const part of parts) {
            if (result === null || result === undefined) return null;
            result = result[part];
        }
        
        return result;
    };

    const sortedData = [...value].sort((a, b) => {
        const aValue = getNestedValue(a, sortField || '');
        const bValue = getNestedValue(b, sortField || '');

        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return '-';
            return date.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch {
            return '-';
        }
    };

    const formatValue = (value: any, field: string) => {
        if (value === null || value === undefined) return '-';
        
        // Handle both date fields
        if (field.includes('date') || field === 'issued_at') {
            return formatDate(value);
        }

        // Handle nested objects
        if (typeof value === 'object') {
            if (field.includes('chauffeur')) {
                return value.first_name && value.last_name 
                    ? `${value.first_name} ${value.last_name}`
                    : '-';
            }
            if (field.includes('vehicle')) {
                return value.licenseplate || '-';
            }
            if (field.includes('type')) {
                return value.name || '-';
            }
            // Generic object handling
            return value.name || value.label || value.first_name || '-';
        }

        return value || '-';
    };

    // Improved intersection observer callback
    const lastElementRef = useCallback((node: any) => {
        if (loading) return;

        if (observer.current) observer.current.disconnect();

        const newObserver = new IntersectionObserver(
            (entries) => {
                const firstEntry = entries[0];
                setIsIntersecting(firstEntry.isIntersecting);

                if (firstEntry.isIntersecting && hasMore && !loading) {
                    // Add a small delay to prevent rapid consecutive calls
                    setTimeout(() => {
                        setPage(page + 1);
                    }, 100);
                }
            },
            {
                root: scrollRef.current,
                rootMargin: '100px', // Load slightly before reaching the bottom
                threshold: 0.5
            }
        );

        if (node && newObserver) {
            observer.current = newObserver;
            newObserver.observe(node);
        }
    }, [loading, hasMore, page]);

    // Fetch data when page changes
    useEffect(() => {
        if (page > 0) {
            fetchFunction();
        }
    }, [page]);

    useEffect(() => {
        if (editableRows || deletableRows || addDocumentEnabled) {
            setHasActionFields(true);
        }
        else {
            setHasActionFields(false);
        }
    }, [editableRows, deletableRows, addDocumentEnabled]);

    // Maintain scroll position after new data is loaded
    useEffect(() => {
        if (scrollRef.current && !loading && page > 1) {
            const scrollContainer = scrollRef.current;
            const currentScrollTop = scrollContainer.scrollTop;
            const newScrollTop = scrollContainer.scrollHeight * 0.8;

            if (newScrollTop > currentScrollTop) {
                scrollContainer.scrollTop = currentScrollTop;
            }
        }
    }, [value, loading]);

    const handleFilter = (event: ChangeEvent<HTMLInputElement>) => {

        const index = parseInt(event.target.id)
        if (filterHandlers) {
            filterHandlers[index](event.target.value)
        }


    }

    const getRowStyle = (item: T) => {
        if ('expiry_date' in item && item.expiry_date) {
            const expiryDate = new Date(item.expiry_date as string);
            if (isNaN(expiryDate.getTime())) return {}; // Return white for invalid dates
            
            const today = new Date(); // Use current date
            expiryDate.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);
            
            const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            
            if (daysUntilExpiry <= 0) {
                // Make expired documents more noticeable with a stronger red and text color
                return { 
                    backgroundColor: '#ffcdd2', // Light red background
                    color: '#d32f2f',          // Dark red text
                    fontWeight: 'bold'          // Bold text for emphasis
                };
            } else if (daysUntilExpiry <= 15) {
                return { backgroundColor: '#fff3cd' }; // Yellow for expiring soon
            }
        }
        return {}; // Return default style for no expiry date or valid future dates
    };

    const cellStyle = {
        flex: 1,
        display: "flex",
        alignItems: "center",
        padding: "0.75rem 1rem",
        borderBottom: "1px solid #f0f0f0",
        minWidth: 0,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap" as const,
        fontSize: "0.95rem",
        color: "#495057"
    };

    const headerCellStyle = {
        ...cellStyle,
        fontWeight: "600",
        color: "#1a237e",
        backgroundColor: "#f8f9fa",
        borderBottom: "2px solid #e0e0e0",
        fontSize: "1rem"
    };

    return (
        <div style={{ ...style, position: 'relative', overflowY: "scroll" }} ref={scrollRef}>
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                {filter && (
                    <div style={{ display: "flex", flexDirection: "row", padding: "0.5rem" }}>
                        {filterFields?.map((field, index) => (
                            <div key={field} style={cellStyle}>
                                <InputText
                                    id={index.toString()}
                                    value={filterValues[index]}
                                    onChange={handleFilter}
                                    placeholder={`Recherche par ${filterFields[0]}`}
                                    style={{ width: '100%', padding: '0.5rem' }}
                                />
                            </div>
                        ))}
                        {hasActionFields && <div style={{ ...cellStyle, flex: 0.5 }}></div>}
                    </div>
                )}
                <div style={{ display: "flex", flexDirection: "row" }}>
                    {headers.map((header, index) => (
                        <div key={header} style={headerCellStyle} onClick={() => handleSort(fields[index])}>
                            {header} {sortField === fields[index] ? (sortOrder === 'asc' ? '🔼' : '🔽') : ''}
                        </div>
                    ))}
                    {hasActionFields && (
                        <div style={{ ...headerCellStyle, flex: 0.5 }}>Actions</div>
                    )}
                </div>
                {loading && page === 1 ? (
                    Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} style={{ display: "flex", flexDirection: "row" }}>
                            {fields.map((_, cellIndex) => (
                                <div key={cellIndex} style={cellStyle}>
                                    <Skeleton />
                                </div>
                            ))}
                            {hasActionFields && (
                                <div style={{ ...cellStyle, flex: 0.5 }}>
                                    <Skeleton />
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    sortedData.map((item, index) => {
                        const isLastElement = index === sortedData.length - 1;
                        const rowRef = isLastElement ? lastElementRef : null;

                        return (
                            <div
                                key={item.id}
                                style={{ 
                                    ...getRowStyle(item), 
                                    display: "flex", 
                                    flexDirection: "row",
                                    transition: "background-color 0.2s",
                                    backgroundColor: getRowStyle(item).backgroundColor || 'transparent',
                                    cursor: onRowClick ? 'pointer' : 'default'
                                }}
                                className="table-row"
                                ref={rowRef}
                                onClick={() => onRowClick && onRowClick(item)}
                            >
                                {fields.map((field) => {
                                    const value = getNestedValue(item, field);
                                    return (
                                        <div key={field} style={cellStyle}>
                                            {formatValue(value, field)}
                                        </div>
                                    );
                                })}
                                {hasActionFields && (
                                    <div style={{ 
                                        ...cellStyle, 
                                        flex: 0.5, 
                                        gap: '0.5rem',
                                        display: 'flex',
                                        justifyContent: 'center' 
                                    }}>
                                        {editableRows && (
                                            <Button
                                                icon="pi pi-pencil"
                                                onClick={() => editHandler?.(item.id)}
                                                severity="warning"
                                                size="small"
                                                style={{ padding: '0.25rem' }}
                                            />
                                        )}
                                        {addDocumentEnabled && (
                                            <Button
                                                icon="pi pi-plus"
                                                onClick={() => addDocumentHandler?.(item.id)}
                                                severity="success"
                                                size="small"
                                                style={{ padding: '0.25rem' }}
                                                tooltip="Ajouter un document"
                                                tooltipOptions={{ position: 'top' }}
                                            />
                                        )}
                                        {deletableRows && (
                                            <Button
                                                icon="pi pi-trash"
                                                onClick={() => deleteHandler?.(item.id)}
                                                severity="danger"
                                                size="small"
                                                style={{ padding: '0.25rem' }}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
                {loading && page > 1 && (
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        {fields.map((_, index) => (
                            <div key={index} style={cellStyle}>
                                <Skeleton />
                            </div>
                        ))}
                        {hasActionFields && (
                            <div style={{ ...cellStyle, flex: 0.5 }}>
                                <Skeleton />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

const tableStyle = {
    display: "flex",
    flexDirection: "column" as const,
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    margin: "0"
};

const rowStyle = {
    display: "flex",
    margin: "0",
    flexDirection: "row" as const,
    borderBottom: "1px solid #e0e0e0",
    gap: "1em",
    transition: "background-color 0.3s, transform 0.2s",
};

const inputStyle = {
    border: "1px solid #ccc",
    padding: "0.5em",
    width: "100%",
    transition: "border-color 0.2s",
    '&:focus': {
        borderColor: "#1976d2",
        outline: "none",
    }
};

const tableStyles = `
    .table-row:hover {
        background-color: #f5f5f5 !important;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = tableStyles;
document.head.appendChild(styleSheet);

export default ScrollTable;
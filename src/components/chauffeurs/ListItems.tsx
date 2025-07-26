import { useEffect, useState } from "react"

function ListItems({
    getItems
}
    :
    {
        getItems: () => number[]
    }) {

    
    const [items, setItems] = useState<number[]>([])

    useEffect(() =>{
        console.log('hello')
        setItems(getItems())
    },[getItems])

    return (<>
        {
            items.map(item => <div key={item}>{item}</div>)
        }</>
    )
}

export default ListItems

export default async function updatePrice(data: FormData, id: number){
    const price = data.get("price");

    let res = await fetch("https://api.alexaz.dev/update_price", {
        method: "PUT", 
        body: JSON.stringify({price: price, id: id}),
        headers: {
            "Content-Type": "application/json"
        }
        }
    );

    console.log(res.status);

    return res
};
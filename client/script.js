
async function adduser(event) {
    event.preventDefault();
    console.log('reached add user');

    let title = document.getElementById('title').value;
    let price = document.getElementById('price').value;
    let description = document.getElementById('description').value;
    let category = document.getElementById('category').value;
    let image = document.getElementById('image').value;

    let datas = { title, price, description, category, image };
    let json_data = JSON.stringify(datas);

    try {
        let response = await fetch('/addproduct', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: json_data,
        });
        if(response){
            alert("product Added successfully.")
        }else{
            alert("Somthing went worng !")
        }
        window.location=`Getproducts.html`
        console.log('response', response);
    } catch (error) {
        console.error('Error adding product:', error);
    }
}

async function fetchData(event) {
    event.preventDefault();
    try {
        const response = await fetch('/product', {
            method: 'GET',
        });

        const data = await response.json(); // Fixed: Using await response.json()

        let getData = document.getElementById('getproduct');
        let row = '';

        for (let i = 0; i < data.length; i++) {
            row += `
            <div class="container pt-5">
                <div class=" text-center border border-1 p-3 background">
                    <div><img src="${data[i].image}" class="" style="width:380px;" onClick="singleproduct('${data[i]._id}')"></div>
                    <div onClick="singleproduct('${data[i]._id}')">${data[i].title}</div>
                    <div onClick="singleproduct('${data[i]._id}')">${data[i].description.slice(0,50)+" "}</div>
                    <div onClick="singleproduct('${data[i]._id}')">${data[i].category}</div>
                    <div onClick="singleproduct('${data[i]._id}')"> Rs. ${data[i].price}</div>
                    <div class="d-flex justify-content-between ">
                    <div class="w-100"><button class="w-100" onClick="singleproduct('${data[i]._id}')" style=:"width:100%";>Add to Cart</button></div>
                    <span class="px-3"><i class="fa fa-trash-o" style="font-size:28px;color:red" onClick="deleteProduct('${data[i]._id}')" ></i></span>
                    </div>
                </div>
            </div>
            `; // Fixed: Used backticks for HTML template literals
        }
        getData.innerHTML = row;

    } catch (error) {
        console.error('Error fetching products:', error);
    }
}





function singleproduct(id){
    console.log("Reached.......");
    window.location=`singleview.html?id=${id}`;
}

async function loadSingle() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        console.log("No product ID found in the URL");
        return;
    }

    try {
        const response = await fetch(`/user/${id}`, { method: 'GET' });

        if (response.ok && response.headers.get("content-type").includes("application/json")) {
            let productData = await response.json();
            console.log("productData", productData);

            let container = document.getElementById('Singlecontainer');
            
            let productHTML = `
                <div class="text-center shadow bg-body p-5 ">
                    <div class="">
                        <img src="${productData.image}" style="width:600px; height:600px;">
                    </div>
                    <div class=" ">
                        <h2 class="fs-1 fw-bolder pt-2">${productData.title}</h2>
                        <p class="fs-5  pt-2"> ${productData.description}</p>
                        <p class="fs-3 link-danger  fw-bolder pt-2"> $${productData.price}</p>
                        <p> ${productData.category}</p>

                    </div>
                    <button   class="w-100">UPDATE</button>
                </div>
            `;

            container.innerHTML = productHTML;
        } else {
            console.error("Failed to fetch product data. Status:", response.status);
        }
    } catch (error) {
        console.error("Error fetching product:", error);
    }
}



//  async function deleteProduct(id){
//     console.log("clicked....")
//      try {
//         const response = await fetch(`/submits?id=${id}`, {
//             method: 'DELETE',
//         });

//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
        

//         await response.json();

//     } catch (error) {
//         console.error('Delete error:', error);
//     }
// }


//chat gpt

async function deleteProduct(id) {
    console.log("Clicked to delete product with ID:", id);
    try {
        const response = await fetch(`/deluser/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorText = await response.text();  // Get error response text
            throw new Error(`Network response was not ok: ${errorText}`);
        }

        const result = await response.json();
        console.log('Delete successful:', result.message);

        window.location="Getproducts.html";

        if(result.status===200){
            alert("product deleted successfully")
        }else{
            alert("somthing went wrong")
        }

    } catch (error) {
        console.error('Delete error:', error);
    }
}




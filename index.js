let isOrderAccepted = false;
let isValetFound = false;
let hasRestaurantSeenYourOrder = false;
let restaurantTimer = null;
let valetTimer = null;
let valetDeliveryTimer = null;
let isOrderDelivered = false;

//Zomato App- Boot up/Power up/ Start
window.addEventListener('load', function(){     
    document.getElementById('acceptOrder').addEventListener('click', function(){
        askRestaurantToAcceptOrReject();
        
    });
    
    document.getElementById('findValet').addEventListener('click', function(){
        startSearchigForValets();
    });

    document.getElementById('deliverOrder').addEventListener('click', function(){
        setTimeout(()=>{
            isOrderDelivered = true;
        }, 2000);
    });

    checkIfOrderAcceptedFromRestaurant()
        .then(isOrderAccepted =>{
            console.log("Update from Restaurant - ",isOrderAccepted);

            //Step 4 - Start Preparing 
            if(isOrderAccepted){
                startPreparingOrder();
            }
            //Step 3 - Order Rejected 
            else{
                this.alert("Sorry, restaurant could not accept your order! Returning your amount with Zomato Shares");
            }
        })
        .catch(res=>{
            console.error(error);
            console.log("Something went wrong. Please try again later.");
        })
})

//Step 1 - Check whether restaurant accepted order or not
function askRestaurantToAcceptOrReject(){
    //callback
    setTimeout(() =>{
        isOrderAccepted = confirm("Should Restaurant accept the order?");
        hasRestaurantSeenYourOrder= true;
        
    }, 1000);   //1000 is a delay of 1s 
}

//Step 2 - Check if Restaurant has accepted order
function checkIfOrderAcceptedFromRestaurant(){
    //promise is a in-built function/instance in javascript with two arguments as resolve & reject
    return new Promise((resolve, reject) =>{     
        restaurantTimer = setInterval(() =>{
            console.log("Checking if order accepted or not");
        if(!hasRestaurantSeenYourOrder){
            return;
        }
        if(isOrderAccepted){
            resolve(true);
        } else{
            resolve(false);     //resolve with false otherwise the control went with the catch where it may found some error
        }

        clearInterval(restaurantTimer);
    }, 2000);           //wait for 5s
  });
  return promise;
}

//Step -: Start Preparing
function startPreparingOrder(){
    Promise.allSettled([
        updateOrderStatus(),
        updateMapView(),
        checkIfValetAssigned(),
        checkIfOrdereDelivered()
    ])
    .then(res=>{
        console.log(res);
        setTimeout(()=>{
            alert("How was your food? Rate your Food & Delivery Partner?");
        },2000);
    })
    .catch(err=>{
        console.error(err);
    })
}

//Helper functions - Pure Functions
function updateOrderStatus() {
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            document.getElementById("currentStatus").innerText = isOrderDelivered ? "Order Delivered Successfully" : "Preparing your order";
            resolve("Status Updated");
        }, 1500);
    });
}

function updateMapView() {
    //Fake Delay to get Data
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            document.getElementById("mapview").style.opacity = "1";
            resolve('Map Initialized');
        }, 1000);
    });
}

function startSearchigForValets() {
    //BED
    /*
    * 1. Get locations of all nearby valets
    * 2. Sort the valets based on shortest path of reastaurant + customer home
    * 3. Select the valet with shortest distance & minimum orders
    */

    //Step 1 - Get Valets nearby
    const valetsPromises = [];
    for (let i = 0; i<5; i++) {
        valetsPromises.push(getRandomDriver());
    }
    console.log(valetsPromises);

    Promise.any(valetsPromises)
    .then(selectedValet =>{
        console.log('Selected a valet => ',selectedValet);
        isValetFound = true;
    })
    .catch(err=>{
        console.error(err);
    })
}

function getRandomDriver () {
    //Fake delay to get data from riders
    return new Promise((resolve, reject)=>{
        const timeout = Math.random()*1000;
        setTimeout(() => {
            resolve("Valet-" +timeout);
        }, 1000);
    })
}

function checkIfValetAssigned () {
    return new Promise((resolve, reject)=>{
        valetTimer = setInterval(()=>{
            console.log("Searching for valet");
            if(isValetFound) {
                updateValetDetails();
                resolve("Updated Valet Details")
                clearTimeout(valetTimer);
            }
        }, 1000);
    })
}

function checkIfOrdereDelivered () {
    return new Promise((resolve, reject)=>{
        valetDeliveryTimer = setInterval(()=>{
            console.log("Is order delivered by valet");
            if(isOrderDelivered) {
                resolve("Order Delivered");
                updateOrderStatus();
                clearTimeout(valetDeliveryTimer);
            }
        }, 1000);
    })
}

function updateValetDetails () {
    if(isValetFound) {
        document.getElementById('finding-driver').classList.add('none');

        document.getElementById('found-driver').classList.remove('none');
        document.getElementById('call').classList.remove('none');

    }
}

//Promise - then, catch Callback - resolve, reject
//Types of Promise - 
//1. Promise.all - call all operations/promises parallely; if one fails, Promise.all fails
//2. Promise.allsettled - call all operations/promises parallely; if one fails-don't give a damn, doesn't effect on others, Promise.allsettles passes
//3. Promise.race - first promise to complete - whether it is resolved/rejected
//4. Promise.any - fisrt promise to fulfill that is resolved/fulfilled
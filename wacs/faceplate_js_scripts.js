
// set datetime to date picker element later 48 hours
function(VARS, element, context) {
    element.set({value: +new Date() - 48 * 3600000});
    context.setInterval(()=>{
        element.set({value: +new Date() - 48 * 3600000});
    },5000);
}


// read from catalog object


// read catalog objects

